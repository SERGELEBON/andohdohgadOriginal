-- Create enum for space types
CREATE TYPE space_type AS ENUM ('individual_office', 'open_space', 'meeting_room');

-- Create enum for space status
CREATE TYPE space_status AS ENUM ('available', 'occupied', 'maintenance', 'reserved');

-- Create enum for subscription plan
CREATE TYPE subscription_plan AS ENUM ('nomade', 'resident', 'domiciliation');

-- Create enum for subscription status
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'pending');

-- Create enum for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create coworking_spaces table
CREATE TABLE coworking_spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type space_type NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    amenities TEXT[] DEFAULT '{}',
    status space_status DEFAULT 'available',
    hourly_rate DECIMAL(10, 2),
    daily_rate DECIMAL(10, 2),
    floor_number INTEGER,
    room_number TEXT,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coworking_subscriptions table
CREATE TABLE coworking_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_type subscription_plan NOT NULL,
    space_id UUID REFERENCES coworking_spaces(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_price DECIMAL(10, 2) NOT NULL,
    status subscription_status DEFAULT 'pending',
    payment_method payment_method,
    stripe_subscription_id TEXT,
    auto_renew BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coworking_bookings table
CREATE TABLE coworking_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    space_id UUID NOT NULL REFERENCES coworking_spaces(id) ON DELETE RESTRICT,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    purpose TEXT,
    status booking_status DEFAULT 'pending',
    participants_count INTEGER DEFAULT 1,
    equipment_needed TEXT[] DEFAULT '{}',
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create indexes
CREATE INDEX idx_coworking_spaces_type ON coworking_spaces(type);
CREATE INDEX idx_coworking_spaces_status ON coworking_spaces(status);
CREATE INDEX idx_coworking_subscriptions_user_id ON coworking_subscriptions(user_id);
CREATE INDEX idx_coworking_subscriptions_status ON coworking_subscriptions(status);
CREATE INDEX idx_coworking_subscriptions_dates ON coworking_subscriptions(start_date, end_date);
CREATE INDEX idx_coworking_bookings_user_id ON coworking_bookings(user_id);
CREATE INDEX idx_coworking_bookings_space_id ON coworking_bookings(space_id);
CREATE INDEX idx_coworking_bookings_date ON coworking_bookings(booking_date);
CREATE INDEX idx_coworking_bookings_status ON coworking_bookings(status);

-- Enable RLS
ALTER TABLE coworking_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE coworking_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coworking_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coworking_spaces
CREATE POLICY "Anyone can view available spaces"
    ON coworking_spaces FOR SELECT
    USING (status != 'maintenance');

CREATE POLICY "Admins can manage all spaces"
    ON coworking_spaces FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- RLS Policies for coworking_subscriptions
CREATE POLICY "Users can view own subscriptions"
    ON coworking_subscriptions FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can create subscription requests"
    ON coworking_subscriptions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions"
    ON coworking_subscriptions FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- RLS Policies for coworking_bookings
CREATE POLICY "Coworking clients can view bookings"
    ON coworking_bookings FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coworking_client'))
    );

CREATE POLICY "Coworking clients can create bookings"
    ON coworking_bookings FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coworking_client')
        )
    );

CREATE POLICY "Users can update own pending bookings"
    ON coworking_bookings FOR UPDATE
    USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all bookings"
    ON coworking_bookings FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Function to check space availability
CREATE OR REPLACE FUNCTION check_space_availability(
    space_uuid UUID,
    check_date DATE,
    start_time_param TIME,
    end_time_param TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflict_count
    FROM coworking_bookings
    WHERE space_id = space_uuid
    AND booking_date = check_date
    AND status IN ('confirmed', 'pending')
    AND (
        (start_time_param, end_time_param) OVERLAPS (start_time, end_time)
    );

    RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get available spaces for date/time range
CREATE OR REPLACE FUNCTION get_available_spaces(
    check_date DATE,
    start_time_param TIME,
    end_time_param TIME,
    space_type_param space_type DEFAULT NULL
)
RETURNS TABLE(
    space_id UUID,
    space_name TEXT,
    space_type space_type,
    capacity INTEGER,
    hourly_rate DECIMAL,
    daily_rate DECIMAL,
    amenities TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.name,
        s.type,
        s.capacity,
        s.hourly_rate,
        s.daily_rate,
        s.amenities
    FROM coworking_spaces s
    WHERE s.status = 'available'
    AND (space_type_param IS NULL OR s.type = space_type_param)
    AND NOT EXISTS (
        SELECT 1
        FROM coworking_bookings b
        WHERE b.space_id = s.id
        AND b.booking_date = check_date
        AND b.status IN ('confirmed', 'pending')
        AND (start_time_param, end_time_param) OVERLAPS (b.start_time, b.end_time)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve subscription
CREATE OR REPLACE FUNCTION approve_subscription(
    subscription_uuid UUID,
    approved BOOLEAN DEFAULT TRUE
)
RETURNS void AS $$
BEGIN
    IF approved THEN
        UPDATE coworking_subscriptions
        SET
            status = 'active',
            approved_by = auth.uid(),
            approved_at = NOW(),
            updated_at = NOW()
        WHERE id = subscription_uuid
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');

        -- Update user role to coworking_client
        UPDATE profiles
        SET role = 'coworking_client'
        WHERE id = (SELECT user_id FROM coworking_subscriptions WHERE id = subscription_uuid)
        AND role = 'visitor';
    ELSE
        UPDATE coworking_subscriptions
        SET
            status = 'cancelled',
            updated_at = NOW()
        WHERE id = subscription_uuid
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER update_coworking_spaces_updated_at
    BEFORE UPDATE ON coworking_spaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coworking_subscriptions_updated_at
    BEFORE UPDATE ON coworking_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coworking_bookings_updated_at
    BEFORE UPDATE ON coworking_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE coworking_spaces IS 'Physical coworking spaces available for booking';
COMMENT ON TABLE coworking_subscriptions IS 'User subscriptions to coworking plans';
COMMENT ON TABLE coworking_bookings IS 'Individual space bookings by coworking clients';
COMMENT ON FUNCTION check_space_availability IS 'Checks if a space is available for given date/time';
COMMENT ON FUNCTION get_available_spaces IS 'Returns available spaces for a date/time range';
COMMENT ON FUNCTION approve_subscription IS 'Admin function to approve/reject subscription and upgrade user role';

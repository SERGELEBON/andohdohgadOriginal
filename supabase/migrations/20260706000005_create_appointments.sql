-- Create enum for appointment status
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');

-- Create enum for time slots
CREATE TYPE time_slot AS ENUM ('morning', 'afternoon', 'specific');

-- Create appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_name TEXT,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    preferred_date DATE NOT NULL,
    time_slot time_slot NOT NULL,
    specific_time TIME,
    message TEXT,
    status appointment_status DEFAULT 'pending',
    confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    confirmed_date DATE,
    confirmed_time TIME,
    meeting_link TEXT,
    cancellation_reason TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_email ON appointments(email);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_preferred_date ON appointments(preferred_date);
CREATE INDEX idx_appointments_service_id ON appointments(service_id);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create appointments"
    ON appointments FOR INSERT
    WITH CHECK (true); -- Anyone can create

CREATE POLICY "Users can view own appointments"
    ON appointments FOR SELECT
    USING (
        user_id = auth.uid()
        OR email = (SELECT email FROM profiles WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can update own pending appointments"
    ON appointments FOR UPDATE
    USING (
        (user_id = auth.uid() OR email = (SELECT email FROM profiles WHERE id = auth.uid()))
        AND status = 'pending'
    );

CREATE POLICY "Admins can manage all appointments"
    ON appointments FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Function to get available time slots for a given date
CREATE OR REPLACE FUNCTION get_available_slots(
    check_date DATE,
    service_uuid UUID DEFAULT NULL
)
RETURNS TABLE(
    time_slot TEXT,
    available BOOLEAN,
    booked_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH slots AS (
        SELECT 'morning' AS slot
        UNION ALL
        SELECT 'afternoon'
    ),
    bookings AS (
        SELECT
            CASE
                WHEN a.time_slot = 'morning' THEN 'morning'
                WHEN a.time_slot = 'afternoon' THEN 'afternoon'
                WHEN EXTRACT(HOUR FROM a.specific_time) < 12 THEN 'morning'
                ELSE 'afternoon'
            END AS slot,
            COUNT(*) AS count
        FROM appointments a
        WHERE a.preferred_date = check_date
        AND a.status IN ('pending', 'confirmed')
        AND (service_uuid IS NULL OR a.service_id = service_uuid)
        GROUP BY slot
    )
    SELECT
        s.slot::TEXT,
        COALESCE(b.count, 0) < 5 AS available, -- Max 5 appointments per slot
        COALESCE(b.count, 0)::INTEGER
    FROM slots s
    LEFT JOIN bookings b ON s.slot = b.slot;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to confirm appointment
CREATE OR REPLACE FUNCTION confirm_appointment(
    appointment_uuid UUID,
    confirmed_date_param DATE,
    confirmed_time_param TIME,
    meeting_link_param TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    UPDATE appointments
    SET
        status = 'confirmed',
        confirmed_at = NOW(),
        confirmed_by = auth.uid(),
        confirmed_date = confirmed_date_param,
        confirmed_time = confirmed_time_param,
        meeting_link = meeting_link_param,
        updated_at = NOW()
    WHERE id = appointment_uuid
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cancel appointment
CREATE OR REPLACE FUNCTION cancel_appointment(
    appointment_uuid UUID,
    reason TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    UPDATE appointments
    SET
        status = 'cancelled',
        cancellation_reason = reason,
        updated_at = NOW()
    WHERE id = appointment_uuid
    AND (
        user_id = auth.uid()
        OR email = (SELECT email FROM profiles WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE appointments IS 'Appointment requests from clients';
COMMENT ON FUNCTION get_available_slots IS 'Returns available time slots for a date (max 5 per slot)';
COMMENT ON FUNCTION confirm_appointment IS 'Admin function to confirm an appointment';
COMMENT ON FUNCTION cancel_appointment IS 'Allows users or admins to cancel appointments';

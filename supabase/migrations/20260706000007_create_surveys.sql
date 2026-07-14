-- Create enum for survey types
CREATE TYPE survey_type AS ENUM ('creation', 'service', 'rh', 'domiciliation', 'coworking');

-- Create enum for survey status
CREATE TYPE survey_status AS ENUM ('new', 'in_progress', 'completed', 'archived');

-- Create surveys table
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_type survey_type NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    respondent_name TEXT NOT NULL,
    respondent_email TEXT NOT NULL,
    respondent_phone TEXT NOT NULL,
    responses JSONB NOT NULL DEFAULT '{}',
    status survey_status DEFAULT 'new',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    priority INTEGER DEFAULT 0 CHECK (priority >= 0 AND priority <= 5),
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_surveys_type ON surveys(survey_type);
CREATE INDEX idx_surveys_status ON surveys(status);
CREATE INDEX idx_surveys_user_id ON surveys(user_id);
CREATE INDEX idx_surveys_email ON surveys(respondent_email);
CREATE INDEX idx_surveys_assigned_to ON surveys(assigned_to);
CREATE INDEX idx_surveys_created_at ON surveys(created_at DESC);
CREATE INDEX idx_surveys_responses ON surveys USING GIN(responses);

-- Enable RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can create surveys"
    ON surveys FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view own surveys"
    ON surveys FOR SELECT
    USING (
        user_id = auth.uid()
        OR respondent_email = (SELECT email FROM profiles WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage all surveys"
    ON surveys FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Function to export surveys as JSON (for CSV generation)
CREATE OR REPLACE FUNCTION export_surveys(
    survey_type_param survey_type DEFAULT NULL,
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    status_param survey_status DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    survey_type TEXT,
    respondent_name TEXT,
    respondent_email TEXT,
    respondent_phone TEXT,
    responses JSONB,
    status TEXT,
    assigned_to_email TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.survey_type::TEXT,
        s.respondent_name,
        s.respondent_email,
        s.respondent_phone,
        s.responses,
        s.status::TEXT,
        p.email AS assigned_to_email,
        s.notes,
        s.created_at
    FROM surveys s
    LEFT JOIN profiles p ON p.id = s.assigned_to
    WHERE
        (survey_type_param IS NULL OR s.survey_type = survey_type_param)
        AND (start_date IS NULL OR s.created_at::DATE >= start_date)
        AND (end_date IS NULL OR s.created_at::DATE <= end_date)
        AND (status_param IS NULL OR s.status = status_param)
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign survey to admin
CREATE OR REPLACE FUNCTION assign_survey(
    survey_uuid UUID,
    admin_uuid UUID
)
RETURNS void AS $$
BEGIN
    UPDATE surveys
    SET
        assigned_to = admin_uuid,
        status = CASE WHEN status = 'new' THEN 'in_progress' ELSE status END,
        updated_at = NOW()
    WHERE id = survey_uuid
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update survey status
CREATE OR REPLACE FUNCTION update_survey_status(
    survey_uuid UUID,
    new_status survey_status,
    admin_notes TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    UPDATE surveys
    SET
        status = new_status,
        notes = COALESCE(admin_notes, notes),
        updated_at = NOW()
    WHERE id = survey_uuid
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER update_surveys_updated_at
    BEFORE UPDATE ON surveys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE surveys IS 'Survey responses from website forms (creation, service, rh, domiciliation, coworking)';
COMMENT ON COLUMN surveys.responses IS 'JSONB storage for flexible survey responses';
COMMENT ON COLUMN surveys.priority IS 'Priority level 0-5 (0=lowest, 5=highest)';
COMMENT ON FUNCTION export_surveys IS 'Admin function to export survey data with filters';
COMMENT ON FUNCTION assign_survey IS 'Assigns survey to admin and updates status to in_progress';

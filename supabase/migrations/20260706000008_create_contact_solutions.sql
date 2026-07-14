-- Create enum for message status
CREATE TYPE message_status AS ENUM ('new', 'read', 'replied', 'archived');

-- Create contact_messages table
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status message_status DEFAULT 'new',
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reply_message TEXT,
    priority INTEGER DEFAULT 0 CHECK (priority >= 0 AND priority <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create solutions table
CREATE TABLE solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icon_name TEXT NOT NULL,
    status content_status DEFAULT 'active',
    demo_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create solution_translations table
CREATE TABLE solution_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solution_id UUID NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'es')),
    title TEXT NOT NULL,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    UNIQUE(solution_id, language)
);

-- Create indexes
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_solutions_status ON solutions(status);
CREATE INDEX idx_solutions_order ON solutions(order_index);
CREATE INDEX idx_solution_translations_solution_id ON solution_translations(solution_id);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can create contact messages"
    ON contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view own messages"
    ON contact_messages FOR SELECT
    USING (
        user_id = auth.uid()
        OR email = (SELECT email FROM profiles WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can manage all messages"
    ON contact_messages FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- RLS Policies for solutions
CREATE POLICY "Anyone can view active solutions"
    ON solutions FOR SELECT
    USING (status = 'active');

CREATE POLICY "Admins can manage all solutions"
    ON solutions FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- RLS Policies for solution_translations
CREATE POLICY "Anyone can view active solution translations"
    ON solution_translations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM solutions WHERE id = solution_id AND status = 'active'
    ));

CREATE POLICY "Admins can manage all solution translations"
    ON solution_translations FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Function to mark message as read
CREATE OR REPLACE FUNCTION mark_message_read(message_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE contact_messages
    SET
        status = 'read',
        updated_at = NOW()
    WHERE id = message_uuid
    AND status = 'new'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reply to message
CREATE OR REPLACE FUNCTION reply_to_message(
    message_uuid UUID,
    reply_text TEXT
)
RETURNS void AS $$
BEGIN
    UPDATE contact_messages
    SET
        status = 'replied',
        replied_at = NOW(),
        replied_by = auth.uid(),
        reply_message = reply_text,
        updated_at = NOW()
    WHERE id = message_uuid
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_solutions_updated_at
    BEFORE UPDATE ON solutions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE contact_messages IS 'Contact form submissions from website';
COMMENT ON TABLE solutions IS 'Digital solutions offered by the company';
COMMENT ON TABLE solution_translations IS 'Multilingual content for solutions';
COMMENT ON FUNCTION mark_message_read IS 'Admin function to mark message as read';
COMMENT ON FUNCTION reply_to_message IS 'Admin function to reply to contact message';

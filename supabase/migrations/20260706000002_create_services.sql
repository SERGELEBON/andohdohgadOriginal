-- Create enum for service status
CREATE TYPE content_status AS ENUM ('active', 'draft', 'archived');

-- Create services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    icon_name TEXT NOT NULL,
    status content_status DEFAULT 'active',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Create service_translations table
CREATE TABLE service_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'es')),
    title TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    problematics TEXT[] DEFAULT '{}',
    value_proposition TEXT,
    process_steps JSONB DEFAULT '[]', -- Array of {step, title, description}
    features TEXT[] DEFAULT '{}',
    UNIQUE(service_id, language)
);

-- Create indexes
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_service_translations_service_id ON service_translations(service_id);
CREATE INDEX idx_service_translations_language ON service_translations(language);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services
CREATE POLICY "Anyone can view active services"
    ON services FOR SELECT
    USING (status = 'active');

CREATE POLICY "Admins can manage all services"
    ON services FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- RLS Policies for service_translations
CREATE POLICY "Anyone can view active service translations"
    ON service_translations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM services WHERE id = service_id AND status = 'active'
    ));

CREATE POLICY "Admins can manage all service translations"
    ON service_translations FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Trigger for services updated_at
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE services IS 'Services offered by the company (multilingual)';
COMMENT ON TABLE service_translations IS 'Translations for services in FR, EN, ES';
COMMENT ON COLUMN service_translations.process_steps IS 'JSON array of process steps: [{step: "01", title: "...", description: "..."}]';
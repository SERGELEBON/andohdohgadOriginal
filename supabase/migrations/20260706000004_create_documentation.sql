-- Create enum for document types
CREATE TYPE document_type AS ENUM ('guides', 'fiscaux', 'modeles', 'notes');

-- Create enum for payment status
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create enum for payment method
CREATE TYPE payment_method AS ENUM ('stripe', 'orange_money', 'mtn_mobile_money');

-- Create documentation table
CREATE TABLE documentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type document_type NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    file_url TEXT NOT NULL,
    file_size INTEGER, -- in bytes
    download_count INTEGER DEFAULT 0,
    status content_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documentation_translations table
CREATE TABLE documentation_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_id UUID NOT NULL REFERENCES documentation(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'es')),
    title TEXT NOT NULL,
    description TEXT,
    UNIQUE(doc_id, language)
);

-- Create documentation_purchases table
CREATE TABLE documentation_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_id UUID NOT NULL REFERENCES documentation(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    buyer_email TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    stripe_payment_id TEXT,
    orange_money_transaction_id TEXT,
    mtn_momo_transaction_id TEXT,
    download_url TEXT, -- Signed URL generated after payment
    downloaded_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE, -- Download link expiration (7 days)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_documentation_type ON documentation(type);
CREATE INDEX idx_documentation_status ON documentation(status);
CREATE INDEX idx_doc_translations_doc_id ON documentation_translations(doc_id);
CREATE INDEX idx_doc_purchases_doc_id ON documentation_purchases(doc_id);
CREATE INDEX idx_doc_purchases_user_id ON documentation_purchases(user_id);
CREATE INDEX idx_doc_purchases_buyer_email ON documentation_purchases(buyer_email);
CREATE INDEX idx_doc_purchases_payment_status ON documentation_purchases(payment_status);
CREATE INDEX idx_doc_purchases_expires_at ON documentation_purchases(expires_at);

-- Enable RLS
ALTER TABLE documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documentation
CREATE POLICY "Anyone can view active documentation"
    ON documentation FOR SELECT
    USING (status = 'active');

CREATE POLICY "Admins can manage all documentation"
    ON documentation FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- RLS Policies for documentation_translations
CREATE POLICY "Anyone can view active doc translations"
    ON documentation_translations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM documentation WHERE id = doc_id AND status = 'active'
    ));

CREATE POLICY "Admins can manage all doc translations"
    ON documentation_translations FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- RLS Policies for documentation_purchases
CREATE POLICY "Users can view own purchases"
    ON documentation_purchases FOR SELECT
    USING (
        user_id = auth.uid()
        OR buyer_email = (SELECT email FROM profiles WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can view all purchases"
    ON documentation_purchases FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "System can insert purchases"
    ON documentation_purchases FOR INSERT
    WITH CHECK (true); -- Will be handled by Edge Functions with service role

CREATE POLICY "System can update purchases"
    ON documentation_purchases FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Function to generate signed download URL (called from Edge Function)
CREATE OR REPLACE FUNCTION generate_download_link(purchase_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    doc_file_url TEXT;
    expires TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT d.file_url, NOW() + INTERVAL '7 days'
    INTO doc_file_url, expires
    FROM documentation_purchases dp
    JOIN documentation d ON d.id = dp.doc_id
    WHERE dp.id = purchase_uuid
    AND dp.payment_status = 'completed';

    IF doc_file_url IS NULL THEN
        RETURN NULL;
    END IF;

    UPDATE documentation_purchases
    SET expires_at = expires
    WHERE id = purchase_uuid;

    RETURN doc_file_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(purchase_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE documentation_purchases
    SET
        download_count = download_count + 1,
        downloaded_at = CASE WHEN downloaded_at IS NULL THEN NOW() ELSE downloaded_at END
    WHERE id = purchase_uuid;

    UPDATE documentation
    SET download_count = download_count + 1
    WHERE id = (SELECT doc_id FROM documentation_purchases WHERE id = purchase_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER update_documentation_updated_at
    BEFORE UPDATE ON documentation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doc_purchases_updated_at
    BEFORE UPDATE ON documentation_purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE documentation IS 'Paid documents available for purchase';
COMMENT ON TABLE documentation_purchases IS 'Purchase records with payment tracking and download links';
COMMENT ON COLUMN documentation_purchases.expires_at IS 'Download link expires 7 days after payment';
COMMENT ON FUNCTION generate_download_link IS 'Generates signed download URL valid for 7 days';
-- Create storage buckets for file uploads

-- Bucket for documentation files (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentation', 'documentation', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket for blog images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for service images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for user avatars (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for coworking space images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('coworking-images', 'coworking-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documentation bucket
CREATE POLICY "Admins can upload documentation"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'documentation'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update documentation"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'documentation'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete documentation"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'documentation'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Buyers can download purchased documentation"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documentation'
    AND (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        OR EXISTS (
            SELECT 1 FROM documentation_purchases dp
            WHERE dp.download_url LIKE '%' || name || '%'
            AND dp.user_id = auth.uid()
            AND dp.payment_status = 'completed'
            AND dp.expires_at > NOW()
        )
    )
);

-- Storage policies for blog-images bucket
CREATE POLICY "Admins can manage blog images"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'blog-images'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Storage policies for service-images bucket
CREATE POLICY "Admins can manage service images"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'service-images'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone can view service images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'service-images');

-- Storage policies for avatars bucket
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Storage policies for coworking-images bucket
CREATE POLICY "Admins can manage coworking images"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'coworking-images'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone can view coworking images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'coworking-images');

-- Comments
COMMENT ON TABLE storage.buckets IS 'Storage buckets for file uploads (documentation, images, avatars)';

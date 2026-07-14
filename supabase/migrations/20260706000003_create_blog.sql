-- Create enum for blog categories
CREATE TYPE blog_category AS ENUM ('fiscalite', 'rh', 'strategie', 'comptabilite', 'entrepreneuriat', 'reglementation');

-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    category blog_category NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    cover_image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    status content_status DEFAULT 'draft',
    views_count INTEGER DEFAULT 0,
    reading_time INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_post_translations table
CREATE TABLE blog_post_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'es')),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT, -- Markdown content
    meta_title TEXT,
    meta_description TEXT,
    tags TEXT[] DEFAULT '{}',
    UNIQUE(post_id, language)
);

-- Create indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_post_translations_post_id ON blog_post_translations(post_id);
CREATE INDEX idx_blog_post_translations_language ON blog_post_translations(language);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published posts"
    ON blog_posts FOR SELECT
    USING (status = 'active' AND published_at IS NOT NULL AND published_at <= NOW());

CREATE POLICY "Authors can view own drafts"
    ON blog_posts FOR SELECT
    USING (author_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can manage all posts"
    ON blog_posts FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- RLS Policies for blog_post_translations
CREATE POLICY "Anyone can view published post translations"
    ON blog_post_translations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM blog_posts
        WHERE id = post_id
        AND status = 'active'
        AND published_at IS NOT NULL
        AND published_at <= NOW()
    ));

CREATE POLICY "Admins can manage all post translations"
    ON blog_post_translations FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Function to increment views
CREATE OR REPLACE FUNCTION increment_blog_views(post_slug TEXT)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts
    SET views_count = views_count + 1
    WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for blog_posts updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE blog_posts IS 'Blog articles with metadata';
COMMENT ON TABLE blog_post_translations IS 'Multilingual content for blog posts (Markdown format)';
COMMENT ON COLUMN blog_posts.reading_time IS 'Estimated reading time in minutes';
COMMENT ON FUNCTION increment_blog_views IS 'Increments view count for a blog post by slug';

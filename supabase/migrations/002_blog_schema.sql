-- Blog Schema for Rio Porto P2P
-- This migration creates all tables needed for the blog system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  icon_url TEXT,
  color VARCHAR(7), -- Hex color for UI
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  thumbnail_image TEXT,
  author_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  reading_time INTEGER, -- in minutes
  is_featured BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for posts and tags (many-to-many)
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog post likes table (to track who liked what)
CREATE TABLE IF NOT EXISTS blog_post_likes (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Blog comment likes table
CREATE TABLE IF NOT EXISTS blog_comment_likes (
  comment_id UUID NOT NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_user ON blog_comments(user_id);
CREATE INDEX idx_blog_comments_status ON blog_comments(status);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);

-- Views
-- Published posts with author info
CREATE OR REPLACE VIEW blog_posts_published AS
SELECT 
  p.*,
  u.full_name as author_name,
  u.avatar_url as author_avatar,
  u.role as author_role,
  c.name as category_name,
  c.slug as category_slug,
  c.color as category_color,
  COUNT(DISTINCT com.id) as comment_count,
  COUNT(DISTINCT pl.user_id) as like_count
FROM blog_posts p
LEFT JOIN users_profile u ON p.author_id = u.id
LEFT JOIN blog_categories c ON p.category_id = c.id
LEFT JOIN blog_comments com ON p.id = com.post_id AND com.status = 'approved'
LEFT JOIN blog_post_likes pl ON p.id = pl.post_id
WHERE p.status = 'published' 
  AND p.published_at <= NOW()
GROUP BY p.id, u.id, c.id;

-- Popular posts (last 30 days)
CREATE OR REPLACE VIEW blog_posts_popular AS
SELECT * FROM blog_posts_published
WHERE published_at >= NOW() - INTERVAL '30 days'
ORDER BY views DESC, like_count DESC
LIMIT 10;

-- Functions
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET views = views + 1 
  WHERE id = post_id AND status = 'published';
END;
$$ LANGUAGE plpgsql;

-- Calculate reading time based on content
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  reading_speed INTEGER := 200; -- words per minute
BEGIN
  word_count := array_length(string_to_array(content, ' '), 1);
  RETURN GREATEST(1, CEIL(word_count::FLOAT / reading_speed));
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

-- Auto-calculate reading time on insert/update
CREATE OR REPLACE FUNCTION auto_calculate_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reading_time := calculate_reading_time(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_post_reading_time
  BEFORE INSERT OR UPDATE OF content ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_calculate_reading_time();

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_likes ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT USING (status = 'published' AND published_at <= NOW());

-- Authors can CRUD their own posts
CREATE POLICY "Authors can manage own posts" ON blog_posts
  FOR ALL USING (auth.uid() = author_id);

-- Admins can manage all posts
CREATE POLICY "Admins can manage all posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Public read for categories and tags
CREATE POLICY "Public can view categories" ON blog_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view tags" ON blog_tags
  FOR SELECT USING (true);

-- Authenticated users can comment
CREATE POLICY "Users can create comments" ON blog_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON blog_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public can view approved comments" ON blog_comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Comment authors can view own comments" ON blog_comments
  FOR SELECT USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can like posts" ON blog_post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts" ON blog_post_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view post likes" ON blog_post_likes
  FOR SELECT USING (true);

-- Initial data
INSERT INTO blog_categories (name, slug, description, color, display_order) VALUES
  ('Novidades', 'novidades', 'Últimas notícias e atualizações da plataforma', '#3B82F6', 1),
  ('Educação', 'educacao', 'Artigos educacionais sobre criptomoedas e P2P', '#10B981', 2),
  ('Segurança', 'seguranca', 'Dicas de segurança e boas práticas', '#EF4444', 3),
  ('Tutoriais', 'tutoriais', 'Guias passo a passo', '#8B5CF6', 4),
  ('Mercado', 'mercado', 'Análises e tendências do mercado', '#F59E0B', 5);

INSERT INTO blog_tags (name, slug) VALUES
  ('Bitcoin', 'bitcoin'),
  ('Ethereum', 'ethereum'),
  ('P2P', 'p2p'),
  ('Segurança', 'seguranca'),
  ('Tutorial', 'tutorial'),
  ('Iniciantes', 'iniciantes'),
  ('Trading', 'trading'),
  ('PIX', 'pix'),
  ('KYC', 'kyc'),
  ('DeFi', 'defi');
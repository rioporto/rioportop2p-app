-- Courses Schema for Rio Porto P2P (VERSÃO CORRIGIDA)
-- Remove CREATE TYPE course_level pois já existe

-- Course status e enrollment status enums
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled', 'expired');

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT NOT NULL,
  instructor_id UUID NOT NULL REFERENCES users_profile(id),
  category VARCHAR(100) NOT NULL,
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  duration_hours DECIMAL(5,2),
  price DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'BRL',
  thumbnail_url TEXT,
  preview_video_url TEXT,
  status course_status DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT false,
  max_students INTEGER,
  prerequisites TEXT[],
  learning_outcomes TEXT[],
  target_audience TEXT,
  language VARCHAR(5) DEFAULT 'pt-BR',
  certificate_available BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  completion_time_days INTEGER,
  tags TEXT[],
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[],
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course modules/sections
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, display_order)
);

-- Course lessons
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('video', 'text', 'quiz', 'assignment', 'live')),
  content_url TEXT,
  content_text TEXT,
  duration_minutes INTEGER,
  display_order INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false,
  resources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, display_order)
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  status enrollment_status DEFAULT 'active',
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  certificate_issued_at TIMESTAMPTZ,
  certificate_url TEXT,
  last_accessed_at TIMESTAMPTZ,
  total_time_spent_minutes INTEGER DEFAULT 0,
  UNIQUE(course_id, user_id)
);

-- Lesson progress tracking
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0, -- For video lessons
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, lesson_id)
);

-- Course reviews
CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Course announcements
CREATE TABLE IF NOT EXISTS course_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES users_profile(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Q&A
CREATE TABLE IF NOT EXISTS course_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Q&A answers
CREATE TABLE IF NOT EXISTS course_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES course_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id),
  content TEXT NOT NULL,
  is_instructor_answer BOOLEAN DEFAULT false,
  is_accepted BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions (for quiz lessons)
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB, -- For multiple choice
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, display_order)
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  passed BOOLEAN DEFAULT false,
  answers JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER
);

-- Course categories
CREATE TABLE IF NOT EXISTS course_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  parent_id UUID REFERENCES course_categories(id),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course instructors (additional info)
CREATE TABLE IF NOT EXISTS course_instructors (
  user_id UUID PRIMARY KEY REFERENCES users_profile(id),
  bio TEXT,
  headline VARCHAR(255),
  website_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  total_students INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  expertise_areas TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_featured ON courses(is_featured) WHERE is_featured = true;
CREATE INDEX idx_course_modules_course ON course_modules(course_id);
CREATE INDEX idx_course_lessons_module ON course_lessons(module_id);
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
CREATE INDEX idx_reviews_course ON course_reviews(course_id);
CREATE INDEX idx_questions_course ON course_questions(course_id);
CREATE INDEX idx_questions_lesson ON course_questions(lesson_id);

-- Functions
-- Update course statistics
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'course_enrollments' THEN
    UPDATE courses
    SET total_students = (
      SELECT COUNT(DISTINCT user_id) 
      FROM course_enrollments 
      WHERE course_id = NEW.course_id AND status != 'cancelled'
    )
    WHERE id = NEW.course_id;
  ELSIF TG_TABLE_NAME = 'course_reviews' THEN
    UPDATE courses
    SET 
      total_reviews = (SELECT COUNT(*) FROM course_reviews WHERE course_id = NEW.course_id),
      rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM course_reviews WHERE course_id = NEW.course_id)
    WHERE id = NEW.course_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate lesson count
CREATE OR REPLACE FUNCTION update_course_lesson_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET total_lessons = (
    SELECT COUNT(*)
    FROM course_lessons cl
    JOIN course_modules cm ON cl.module_id = cm.id
    WHERE cm.course_id = NEW.course_id
  )
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress DECIMAL(5,2);
BEGIN
  -- Get total lessons in the course
  SELECT COUNT(DISTINCT cl.id) INTO total_lessons
  FROM course_lessons cl
  JOIN course_modules cm ON cl.module_id = cm.id
  JOIN course_enrollments ce ON cm.course_id = ce.course_id
  WHERE ce.id = NEW.enrollment_id;
  
  -- Get completed lessons
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress
  WHERE enrollment_id = NEW.enrollment_id AND is_completed = true;
  
  -- Calculate progress
  IF total_lessons > 0 THEN
    progress := (completed_lessons::DECIMAL / total_lessons) * 100;
  ELSE
    progress := 0;
  END IF;
  
  -- Update enrollment
  UPDATE course_enrollments
  SET 
    progress_percentage = progress,
    completed_at = CASE WHEN progress = 100 THEN NOW() ELSE NULL END,
    status = CASE WHEN progress = 100 THEN 'completed'::enrollment_status ELSE status END
  WHERE id = NEW.enrollment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON course_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at
  BEFORE UPDATE ON course_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_reviews_updated_at
  BEFORE UPDATE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_instructors_updated_at
  BEFORE UPDATE ON course_instructors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_stats_on_enrollment
  AFTER INSERT OR UPDATE OR DELETE ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_course_stats();

CREATE TRIGGER update_course_stats_on_review
  AFTER INSERT OR UPDATE OR DELETE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_stats();

CREATE TRIGGER update_course_lesson_count_on_module_change
  AFTER INSERT OR UPDATE OR DELETE ON course_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_course_lesson_count();

CREATE TRIGGER update_enrollment_progress_on_lesson_progress
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_enrollment_progress();

-- RLS Policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_instructors ENABLE ROW LEVEL SECURITY;

-- Course policies
CREATE POLICY "Public can view published courses" ON courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can manage own courses" ON courses
  FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can manage all courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Module policies
CREATE POLICY "Enrolled users can view modules" ON course_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_id = course_modules.course_id
      AND user_id = auth.uid()
    ) OR is_preview = true
  );

CREATE POLICY "Instructors can manage modules" ON course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_modules.course_id
      AND instructor_id = auth.uid()
    )
  );

-- Lesson policies
CREATE POLICY "Enrolled users can view lessons" ON course_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN course_modules cm ON ce.course_id = cm.course_id
      WHERE cm.id = course_lessons.module_id
      AND ce.user_id = auth.uid()
    ) OR is_preview = true
  );

CREATE POLICY "Instructors can manage lessons" ON course_lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses c
      JOIN course_modules cm ON c.id = cm.course_id
      WHERE cm.id = course_lessons.module_id
      AND c.instructor_id = auth.uid()
    )
  );

-- Enrollment policies
CREATE POLICY "Users can view own enrollments" ON course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON course_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Progress policies
CREATE POLICY "Users can view own progress" ON lesson_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE id = lesson_progress.enrollment_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own progress" ON lesson_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE id = lesson_progress.enrollment_id
      AND user_id = auth.uid()
    )
  );

-- Review policies
CREATE POLICY "Public can view course reviews" ON course_reviews
  FOR SELECT USING (true);

CREATE POLICY "Enrolled users can create reviews" ON course_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_id = course_reviews.course_id
      AND user_id = auth.uid()
      AND status = 'completed'
    )
  );

CREATE POLICY "Users can update own reviews" ON course_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Initial data
INSERT INTO course_categories (name, slug, description, display_order) VALUES
  ('Blockchain', 'blockchain', 'Fundamentos e aplicações de blockchain', 1),
  ('Criptomoedas', 'criptomoedas', 'Bitcoin, Ethereum e outras criptomoedas', 2),
  ('Trading', 'trading', 'Estratégias e análise técnica', 3),
  ('DeFi', 'defi', 'Finanças descentralizadas', 4),
  ('Segurança', 'seguranca', 'Segurança em crypto e boas práticas', 5),
  ('P2P', 'p2p', 'Trading P2P e estratégias', 6),
  ('Iniciantes', 'iniciantes', 'Conteúdo para quem está começando', 7);
-- Courses Schema for Rio Porto P2P
-- This migration creates all tables needed for the courses/education platform

-- Course categories enum
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
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
  level course_level NOT NULL DEFAULT 'beginner',
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
  certificate_available BOOLEAN DEFAULT true,
  rating_average DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  enrolled_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course modules (sections)
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, order_index)
);

-- Course lessons
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT,
  video_duration_seconds INTEGER,
  content TEXT, -- Rich text content
  attachments JSONB, -- Array of {name, url, size, type}
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  order_index INTEGER NOT NULL,
  is_free BOOLEAN DEFAULT false,
  quiz_id UUID, -- Future: link to quiz system
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, order_index)
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id),
  user_id UUID NOT NULL REFERENCES users_profile(id),
  status enrollment_status DEFAULT 'active',
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  certificate_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Course progress tracking
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  video_progress_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, lesson_id)
);

-- Course certificates
CREATE TABLE IF NOT EXISTS course_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id),
  certificate_number VARCHAR(50) UNIQUE NOT NULL,
  certificate_url TEXT,
  verification_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  metadata JSONB
);

-- Course reviews
CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id),
  user_id UUID NOT NULL REFERENCES users_profile(id),
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
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES users_profile(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_featured ON courses(is_featured) WHERE is_featured = true;
CREATE INDEX idx_course_modules_course ON course_modules(course_id);
CREATE INDEX idx_course_lessons_module ON course_lessons(module_id);
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_status ON course_enrollments(status);
CREATE INDEX idx_progress_enrollment ON course_progress(enrollment_id);
CREATE INDEX idx_reviews_course ON course_reviews(course_id);
CREATE INDEX idx_reviews_user ON course_reviews(user_id);

-- Views
-- Course with stats
CREATE OR REPLACE VIEW courses_with_stats AS
SELECT 
  c.*,
  i.full_name as instructor_name,
  i.avatar_url as instructor_avatar,
  COUNT(DISTINCT m.id) as module_count,
  COUNT(DISTINCT l.id) as lesson_count,
  SUM(l.duration_minutes) as total_duration_minutes
FROM courses c
LEFT JOIN users_profile i ON c.instructor_id = i.id
LEFT JOIN course_modules m ON c.id = m.course_id
LEFT JOIN course_lessons l ON m.id = l.module_id
GROUP BY c.id, i.id;

-- User course progress
CREATE OR REPLACE VIEW user_course_progress AS
SELECT 
  e.*,
  c.title as course_title,
  c.thumbnail_url as course_thumbnail,
  COUNT(DISTINCT p.lesson_id) FILTER (WHERE p.is_completed) as completed_lessons,
  COUNT(DISTINCT l.id) as total_lessons,
  MAX(p.updated_at) as last_activity
FROM course_enrollments e
JOIN courses c ON e.course_id = c.id
LEFT JOIN course_modules m ON c.id = m.course_id
LEFT JOIN course_lessons l ON m.id = l.module_id
LEFT JOIN course_progress p ON e.id = p.enrollment_id AND p.lesson_id = l.id
GROUP BY e.id, c.id;

-- Functions
-- Calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress(p_enrollment_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_completed_lessons INTEGER;
  v_total_lessons INTEGER;
  v_progress DECIMAL;
BEGIN
  SELECT 
    COUNT(DISTINCT l.id) FILTER (WHERE p.is_completed = true),
    COUNT(DISTINCT l.id)
  INTO v_completed_lessons, v_total_lessons
  FROM course_enrollments e
  JOIN courses c ON e.course_id = c.id
  JOIN course_modules m ON c.id = m.course_id
  JOIN course_lessons l ON m.id = l.module_id
  LEFT JOIN course_progress p ON e.id = p.enrollment_id AND l.id = p.lesson_id
  WHERE e.id = p_enrollment_id;
  
  IF v_total_lessons = 0 THEN
    RETURN 0;
  END IF;
  
  v_progress := (v_completed_lessons::DECIMAL / v_total_lessons) * 100;
  
  -- Update enrollment progress
  UPDATE course_enrollments 
  SET 
    progress_percentage = v_progress,
    completed_at = CASE 
      WHEN v_progress = 100 THEN NOW() 
      ELSE NULL 
    END
  WHERE id = p_enrollment_id;
  
  RETURN v_progress;
END;
$$ LANGUAGE plpgsql;

-- Mark lesson as completed
CREATE OR REPLACE FUNCTION complete_lesson(p_enrollment_id UUID, p_lesson_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO course_progress (enrollment_id, lesson_id, is_completed, completed_at)
  VALUES (p_enrollment_id, p_lesson_id, true, NOW())
  ON CONFLICT (enrollment_id, lesson_id) 
  DO UPDATE SET 
    is_completed = true,
    completed_at = NOW(),
    updated_at = NOW();
    
  -- Update enrollment last accessed
  UPDATE course_enrollments 
  SET last_accessed_at = NOW() 
  WHERE id = p_enrollment_id;
  
  -- Recalculate progress
  PERFORM calculate_course_progress(p_enrollment_id);
END;
$$ LANGUAGE plpgsql;

-- Update course rating
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses 
  SET 
    rating_average = (
      SELECT AVG(rating)::DECIMAL(2,1) 
      FROM course_reviews 
      WHERE course_id = NEW.course_id
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM course_reviews 
      WHERE course_id = NEW.course_id
    )
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS VARCHAR AS $$
DECLARE
  v_year VARCHAR(4);
  v_random VARCHAR(6);
  v_number VARCHAR(50);
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');
  v_random := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  v_number := 'RPP-' || v_year || '-' || v_random;
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON course_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_lessons_updated_at
  BEFORE UPDATE ON course_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_enrollments_updated_at
  BEFORE UPDATE ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_rating_on_review
  AFTER INSERT OR UPDATE OR DELETE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating();

-- RLS Policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_announcements ENABLE ROW LEVEL SECURITY;

-- Public can view published courses
CREATE POLICY "Public can view published courses" ON courses
  FOR SELECT USING (status = 'published');

-- Instructors can manage their courses
CREATE POLICY "Instructors can manage own courses" ON courses
  FOR ALL USING (auth.uid() = instructor_id);

-- Students can view enrolled courses
CREATE POLICY "Students can view enrolled courses" ON courses
  FOR SELECT USING (
    status = 'published' OR
    auth.uid() = instructor_id OR
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_id = courses.id AND user_id = auth.uid()
    )
  );

-- Module policies
CREATE POLICY "View modules of accessible courses" ON course_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_modules.course_id
      AND (
        status = 'published' OR
        instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM course_enrollments
          WHERE course_id = courses.id AND user_id = auth.uid()
        )
      )
    )
  );

-- Lesson policies
CREATE POLICY "View free lessons" ON course_lessons
  FOR SELECT USING (is_free = true);

CREATE POLICY "View enrolled course lessons" ON course_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_modules m
      JOIN courses c ON m.course_id = c.id
      LEFT JOIN course_enrollments e ON c.id = e.course_id
      WHERE m.id = course_lessons.module_id
      AND (c.instructor_id = auth.uid() OR e.user_id = auth.uid())
    )
  );

-- Enrollment policies
CREATE POLICY "Users can view own enrollments" ON course_enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can enroll in courses" ON course_enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Progress policies
CREATE POLICY "Users can manage own progress" ON course_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE id = course_progress.enrollment_id
      AND user_id = auth.uid()
    )
  );

-- Certificate policies
CREATE POLICY "Users can view own certificates" ON course_certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE id = course_certificates.enrollment_id
      AND user_id = auth.uid()
    )
  );

-- Review policies
CREATE POLICY "Public can view reviews" ON course_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own reviews" ON course_reviews
  FOR ALL USING (user_id = auth.uid());

-- Initial data
INSERT INTO courses (
  slug, title, subtitle, description, instructor_id, category, level, 
  duration_hours, price, is_free, status, is_featured
) VALUES (
  'introducao-criptomoedas',
  'Introdução às Criptomoedas',
  'Aprenda os conceitos básicos do mundo crypto',
  'Curso completo para iniciantes no mundo das criptomoedas. Aprenda sobre Bitcoin, Ethereum, blockchain e como começar a investir com segurança.',
  '00000000-0000-0000-0000-000000000001',
  'Criptomoedas',
  'beginner',
  4.5,
  0,
  true,
  'published',
  true
);
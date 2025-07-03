-- KYC (Know Your Customer) Schema for Rio Porto P2P
-- Advanced verification system with automated checks

-- Verification status enum
CREATE TYPE kyc_verification_status AS ENUM ('pending', 'processing', 'approved', 'rejected', 'expired', 'manual_review');
CREATE TYPE kyc_document_type AS ENUM ('rg', 'cnh', 'passport', 'proof_of_address', 'selfie');
CREATE TYPE kyc_risk_level AS ENUM ('low', 'medium', 'high', 'very_high');

-- Main KYC verifications table
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  verification_type VARCHAR(50) NOT NULL, -- cpf, phone, address, document, facial
  status kyc_verification_status DEFAULT 'pending',
  provider VARCHAR(50), -- serpro, truora, idwall, etc
  provider_request_id VARCHAR(255),
  provider_response JSONB,
  score DECIMAL(5,2),
  verified_data JSONB, -- Encrypted sensitive data
  expires_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users_profile(id),
  rejection_reason TEXT,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, verification_type)
);

-- Document analysis results
CREATE TABLE IF NOT EXISTS kyc_document_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES kyc_documents(id) ON DELETE CASCADE,
  analysis_type VARCHAR(50) NOT NULL, -- ocr, authenticity, face_match
  provider VARCHAR(50),
  provider_request_id VARCHAR(255),
  results JSONB,
  confidence_score DECIMAL(5,2),
  extracted_data JSONB, -- OCR results
  warnings TEXT[],
  errors TEXT[],
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phone verification
CREATE TABLE IF NOT EXISTS kyc_phone_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  country_code VARCHAR(5) DEFAULT '+55',
  verification_code VARCHAR(6),
  verification_method VARCHAR(20) DEFAULT 'sms', -- sms, whatsapp, call
  status kyc_verification_status DEFAULT 'pending',
  code_sent_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Address verification
CREATE TABLE IF NOT EXISTS kyc_address_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  document_id UUID REFERENCES kyc_documents(id),
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  country VARCHAR(2) DEFAULT 'BR',
  verification_method VARCHAR(50), -- document, api, manual
  verification_data JSONB,
  coordinates POINT,
  status kyc_verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facial verification (liveness + document match)
CREATE TABLE IF NOT EXISTS kyc_facial_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  selfie_url TEXT NOT NULL,
  selfie_document_id UUID REFERENCES kyc_documents(id),
  document_photo_url TEXT,
  document_id UUID REFERENCES kyc_documents(id),
  liveness_score DECIMAL(5,2),
  face_match_score DECIMAL(5,2),
  provider VARCHAR(50),
  provider_session_id VARCHAR(255),
  provider_response JSONB,
  status kyc_verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk assessment
CREATE TABLE IF NOT EXISTS kyc_risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  risk_score DECIMAL(5,2) NOT NULL,
  risk_level kyc_risk_level NOT NULL,
  risk_factors JSONB, -- Array of {factor, score, description}
  pep_check BOOLEAN DEFAULT false, -- Politically Exposed Person
  sanctions_check BOOLEAN DEFAULT false,
  adverse_media_check BOOLEAN DEFAULT false,
  assessment_provider VARCHAR(50),
  provider_response JSONB,
  valid_until TIMESTAMPTZ,
  assessed_by VARCHAR(50) DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CPF verification (Brazil specific)
CREATE TABLE IF NOT EXISTS kyc_cpf_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  cpf VARCHAR(14) NOT NULL, -- Format: 000.000.000-00
  cpf_normalized VARCHAR(11) NOT NULL, -- Only numbers
  full_name VARCHAR(255),
  birth_date DATE,
  mother_name VARCHAR(255),
  status kyc_verification_status DEFAULT 'pending',
  situation VARCHAR(50), -- regular, irregular, suspended, etc
  provider VARCHAR(50), -- serpro, receita_federal
  provider_response JSONB,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(cpf_normalized)
);

-- Audit log for all KYC actions
CREATE TABLE IF NOT EXISTS kyc_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  performed_by UUID REFERENCES users_profile(id),
  ip_address INET,
  user_agent TEXT,
  old_data JSONB,
  new_data JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC limits by level
CREATE TABLE IF NOT EXISTS kyc_level_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kyc_level kyc_level NOT NULL UNIQUE,
  daily_limit DECIMAL(15,2) NOT NULL,
  monthly_limit DECIMAL(15,2) NOT NULL,
  per_transaction_limit DECIMAL(15,2) NOT NULL,
  required_verifications TEXT[] NOT NULL,
  features_enabled TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_kyc_verifications_user ON kyc_verifications(user_id);
CREATE INDEX idx_kyc_verifications_status ON kyc_verifications(status);
CREATE INDEX idx_kyc_verifications_type ON kyc_verifications(verification_type);
CREATE INDEX idx_kyc_document_analysis_document ON kyc_document_analysis(document_id);
CREATE INDEX idx_kyc_phone_verifications_user ON kyc_phone_verifications(user_id);
CREATE INDEX idx_kyc_phone_verifications_phone ON kyc_phone_verifications(phone_number);
CREATE INDEX idx_kyc_cpf_verifications_cpf ON kyc_cpf_verifications(cpf_normalized);
CREATE INDEX idx_kyc_risk_assessments_user ON kyc_risk_assessments(user_id);
CREATE INDEX idx_kyc_audit_log_user ON kyc_audit_log(user_id);
CREATE INDEX idx_kyc_audit_log_entity ON kyc_audit_log(entity_type, entity_id);

-- Functions
-- Validate CPF format and checksum
CREATE OR REPLACE FUNCTION validate_cpf(cpf_input VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  cpf_clean VARCHAR;
  sum1 INTEGER := 0;
  sum2 INTEGER := 0;
  digit1 INTEGER;
  digit2 INTEGER;
  i INTEGER;
BEGIN
  -- Remove non-numeric characters
  cpf_clean := regexp_replace(cpf_input, '[^0-9]', '', 'g');
  
  -- Check length
  IF length(cpf_clean) != 11 THEN
    RETURN false;
  END IF;
  
  -- Check for known invalid patterns
  IF cpf_clean IN ('00000000000', '11111111111', '22222222222', '33333333333', 
                   '44444444444', '55555555555', '66666666666', '77777777777', 
                   '88888888888', '99999999999') THEN
    RETURN false;
  END IF;
  
  -- Calculate first digit
  FOR i IN 1..9 LOOP
    sum1 := sum1 + (substring(cpf_clean, i, 1)::INTEGER * (11 - i));
  END LOOP;
  
  digit1 := 11 - (sum1 % 11);
  IF digit1 > 9 THEN
    digit1 := 0;
  END IF;
  
  -- Calculate second digit
  FOR i IN 1..10 LOOP
    sum2 := sum2 + (substring(cpf_clean, i, 1)::INTEGER * (12 - i));
  END LOOP;
  
  digit2 := 11 - (sum2 % 11);
  IF digit2 > 9 THEN
    digit2 := 0;
  END IF;
  
  -- Verify digits
  RETURN substring(cpf_clean, 10, 1)::INTEGER = digit1 
     AND substring(cpf_clean, 11, 1)::INTEGER = digit2;
END;
$$ LANGUAGE plpgsql;

-- Check if user meets KYC requirements for a level
CREATE OR REPLACE FUNCTION check_kyc_requirements(p_user_id UUID, p_level kyc_level)
RETURNS BOOLEAN AS $$
DECLARE
  v_required_verifications TEXT[];
  v_verification TEXT;
  v_has_verification BOOLEAN;
BEGIN
  -- Get required verifications for the level
  SELECT required_verifications INTO v_required_verifications
  FROM kyc_level_limits
  WHERE kyc_level = p_level;
  
  -- Check each required verification
  FOREACH v_verification IN ARRAY v_required_verifications LOOP
    SELECT EXISTS(
      SELECT 1 FROM kyc_verifications
      WHERE user_id = p_user_id
      AND verification_type = v_verification
      AND status = 'approved'
      AND (expires_at IS NULL OR expires_at > NOW())
    ) INTO v_has_verification;
    
    IF NOT v_has_verification THEN
      RETURN false;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Update user KYC level based on verifications
CREATE OR REPLACE FUNCTION update_user_kyc_level(p_user_id UUID)
RETURNS kyc_level AS $$
DECLARE
  v_new_level kyc_level;
BEGIN
  -- Check from highest to lowest level
  IF check_kyc_requirements(p_user_id, 'complete') THEN
    v_new_level := 'complete';
  ELSIF check_kyc_requirements(p_user_id, 'intermediate') THEN
    v_new_level := 'intermediate';
  ELSE
    v_new_level := 'basic';
  END IF;
  
  -- Update user profile
  UPDATE users_profile
  SET 
    kyc_level = v_new_level,
    kyc_verified_at = CASE 
      WHEN v_new_level != 'basic' THEN NOW() 
      ELSE kyc_verified_at 
    END
  WHERE id = p_user_id;
  
  RETURN v_new_level;
END;
$$ LANGUAGE plpgsql;

-- Generate phone verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS VARCHAR AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Log KYC action
CREATE OR REPLACE FUNCTION log_kyc_action(
  p_user_id UUID,
  p_action VARCHAR,
  p_entity_type VARCHAR,
  p_entity_id UUID,
  p_performed_by UUID,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO kyc_audit_log (
    user_id, action, entity_type, entity_id, 
    performed_by, old_data, new_data, metadata
  ) VALUES (
    p_user_id, p_action, p_entity_type, p_entity_id,
    p_performed_by, p_old_data, p_new_data, p_metadata
  );
END;
$$ LANGUAGE plpgsql;

-- Triggers
-- Auto-update KYC level when verification status changes
CREATE OR REPLACE FUNCTION trigger_update_kyc_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    PERFORM update_user_kyc_level(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kyc_level_on_verification
  AFTER UPDATE OF status ON kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_kyc_level();

-- RLS Policies
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_document_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_phone_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_address_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_facial_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_cpf_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_level_limits ENABLE ROW LEVEL SECURITY;

-- Users can view their own KYC data
CREATE POLICY "Users can view own KYC verifications" ON kyc_verifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create KYC verifications" ON kyc_verifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins can manage all KYC data
CREATE POLICY "Admins can manage KYC verifications" ON kyc_verifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Similar policies for other tables
CREATE POLICY "Users can view own phone verifications" ON kyc_phone_verifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create phone verifications" ON kyc_phone_verifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own CPF verifications" ON kyc_cpf_verifications
  FOR SELECT USING (user_id = auth.uid());

-- Public can view KYC level limits
CREATE POLICY "Public can view KYC limits" ON kyc_level_limits
  FOR SELECT USING (true);

-- Initial data - KYC level limits
INSERT INTO kyc_level_limits (kyc_level, daily_limit, monthly_limit, per_transaction_limit, required_verifications, features_enabled) VALUES
  ('basic', 1000.00, 5000.00, 1000.00, ARRAY['email'], ARRAY['buy_crypto', 'sell_crypto']),
  ('intermediate', 10000.00, 50000.00, 5000.00, ARRAY['email', 'cpf', 'phone'], ARRAY['buy_crypto', 'sell_crypto', 'withdraw']),
  ('complete', 100000.00, 500000.00, 50000.00, ARRAY['email', 'cpf', 'phone', 'document', 'address', 'facial'], ARRAY['buy_crypto', 'sell_crypto', 'withdraw', 'otc', 'merchant']);
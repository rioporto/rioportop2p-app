-- ============================================
-- SCRIPT PARA CRIAR USUÁRIO ADMIN (CORRIGIDO)
-- ============================================

-- 1. Liste todos os usuários existentes:
SELECT id, email, full_name, is_admin, created_at 
FROM users_profile 
ORDER BY created_at DESC;

-- 2. Para tornar o usuário Ivan Mendes admin:
UPDATE users_profile 
SET 
    is_admin = true,
    updated_at = now()
WHERE email = 'ivansfm@gmail.com';

-- 3. Confirme que funcionou:
SELECT id, email, full_name, is_admin, kyc_status 
FROM users_profile 
WHERE email = 'ivansfm@gmail.com';

-- ============================================
-- OU SE QUISER ADICIONAR OUTRO USUÁRIO COMO ADMIN
-- ============================================
-- Substitua 'SEU-EMAIL-AQUI' pelo email do usuário:
-- UPDATE users_profile 
-- SET 
--     is_admin = true,
--     updated_at = now()
-- WHERE email = 'SEU-EMAIL-AQUI';
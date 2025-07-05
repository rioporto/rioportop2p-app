-- ============================================
-- SCRIPT PARA CRIAR USUÁRIO ADMIN
-- ============================================

-- 1. Primeiro, liste todos os usuários existentes:
SELECT id, email, username, is_admin, created_at 
FROM users_profile 
ORDER BY created_at DESC;

-- 2. Para tornar um usuário admin, substitua 'SEU-EMAIL-AQUI' pelo email correto:
UPDATE users_profile 
SET 
    is_admin = true,
    role = 'admin',
    updated_at = now()
WHERE email = 'SEU-EMAIL-AQUI';

-- 3. Confirme que funcionou:
SELECT id, email, username, is_admin, role 
FROM users_profile 
WHERE email = 'SEU-EMAIL-AQUI';
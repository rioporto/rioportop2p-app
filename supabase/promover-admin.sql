-- Promover usuário para admin
-- Substitua 'seu-email@exemplo.com' pelo email que você usou no cadastro

UPDATE users_profile 
SET 
    is_admin = true,
    updated_at = now()
WHERE email = 'seu-email@exemplo.com';

-- Verificar se funcionou
SELECT id, email, full_name, is_admin 
FROM users_profile 
WHERE email = 'seu-email@exemplo.com';
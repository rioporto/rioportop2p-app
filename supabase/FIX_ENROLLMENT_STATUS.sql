-- CORREÇÃO RÁPIDA PARA O ERRO enrollment_status
-- Execute este script ANTES do SCRIPT_COMPLETO_FINAL.sql

-- Criar os tipos que estão faltando
CREATE TYPE IF NOT EXISTS course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE IF NOT EXISTS enrollment_status AS ENUM ('active', 'completed', 'cancelled', 'expired');

-- Agora você pode executar o SCRIPT_COMPLETO_FINAL.sql novamente!
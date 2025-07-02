#!/bin/bash

# Script para fazer commit, push e verificar o deploy no Vercel

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir mensagens coloridas
print_status() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} ✅ $1"
}

print_error() {
    echo -e "${RED}[$(date '+%H:%M:%S')]${NC} ❌ $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')]${NC} ⚠️  $1"
}

# Verificar se há mudanças para commitar
if [[ -z $(git status -s) ]]; then
    print_warning "Nenhuma mudança para commitar"
    exit 0
fi

# Mensagem de commit (usar o primeiro argumento ou mensagem padrão)
COMMIT_MSG="${1:-"chore: automatic commit"}"

print_status "Iniciando processo de deploy..."

# 1. Adicionar arquivos
print_status "Adicionando arquivos..."
git add -A

# 2. Fazer commit
print_status "Criando commit: $COMMIT_MSG"
git commit -m "$COMMIT_MSG

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

if [ $? -ne 0 ]; then
    print_error "Falha ao criar commit"
    exit 1
fi

# 3. Fazer push
print_status "Enviando para GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    print_error "Falha ao fazer push"
    exit 1
fi

print_success "Push realizado com sucesso!"

# 4. Aguardar um pouco para o Vercel detectar o push
print_status "Aguardando Vercel detectar o push..."
sleep 5

# 5. Verificar o deploy
print_status "Verificando status do deploy no Vercel..."

# Verificar se VERCEL_TOKEN está configurado
if [ -z "$VERCEL_TOKEN" ]; then
    print_warning "VERCEL_TOKEN não configurado. Não é possível verificar o status do deploy."
    print_warning "Configure com: export VERCEL_TOKEN='seu-token-aqui'"
    exit 0
fi

# Executar script de verificação
node scripts/check-deploy.js

if [ $? -eq 0 ]; then
    print_success "Deploy concluído com sucesso! 🎉"
else
    print_error "Deploy falhou ou foi cancelado"
    print_status "Verifique os logs em: https://vercel.com/rioporto/rioportop2p-app"
    exit 1
fi
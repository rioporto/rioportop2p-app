#!/bin/bash
# deploy.sh - Script de deploy automático

# Adicionar mudanças
git add .

# Mensagem de commit
if [ -z "$1" ]; then
  MESSAGE="chore: update $(date +'%Y-%m-%d %H:%M:%S')"
else
  MESSAGE="$1"
fi

# Commit
git commit -m "$MESSAGE

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push
git push

echo "✅ Deploy enviado para GitHub/Vercel!"
#!/bin/bash
# Carrega variáveis do .env.local
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
  echo "✅ Variáveis de ambiente carregadas"
else
  echo "❌ Arquivo .env.local não encontrado"
fi
#!/bin/bash

echo "🔍 Verificando status do último deploy..."
echo ""

if [ -f "vercel-status.txt" ]; then
    echo "📄 Status atual:"
    cat vercel-status.txt
    echo ""
fi

if [ -f ".vercel-deploy-status" ]; then
    STATUS=$(cat .vercel-deploy-status)
    if [ "$STATUS" = "SUCCESS" ]; then
        echo "✅ Último deploy: SUCESSO"
    else
        echo "❌ Último deploy: FALHOU"
    fi
else
    echo "⏳ Aguardando primeiro deploy monitorado..."
fi

echo ""
echo "📜 Histórico recente:"
if [ -f ".vercel-deploy-history.log" ]; then
    tail -n 5 .vercel-deploy-history.log
else
    echo "Nenhum histórico disponível ainda."
fi
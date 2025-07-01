# Configuração Git - Autenticação Automática

## 🔐 Opções para Commit Automático sem Senha

### Opção 1: Personal Access Token (Recomendado)

1. **Criar Token no GitHub:**
   - Acesse: https://github.com/settings/tokens/new
   - Nome: "Rio Porto P2P Deploy"
   - Expiração: 90 dias (ou "No expiration")
   - Permissões necessárias:
     - ✅ repo (acesso completo)
     - ✅ workflow (se usar GitHub Actions)
   - Clique em "Generate token"
   - **COPIE O TOKEN** (só aparece uma vez!)

2. **Configurar no Git:**
   ```bash
   git remote set-url origin https://SEU_USUARIO:SEU_TOKEN@github.com/SEU_USUARIO/rioportop2p-app.git
   ```

### Opção 2: SSH Key

1. **Gerar chave SSH:**
   ```bash
   ssh-keygen -t ed25519 -C "rioportop2p@example.com"
   # Pressione Enter para aceitar o caminho padrão
   # Deixe a senha em branco para não pedir senha
   ```

2. **Adicionar ao SSH agent:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Copiar chave pública:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. **Adicionar no GitHub:**
   - Acesse: https://github.com/settings/keys
   - Clique em "New SSH key"
   - Cole a chave pública
   - Salve

5. **Mudar remote para SSH:**
   ```bash
   git remote set-url origin git@github.com:SEU_USUARIO/rioportop2p-app.git
   ```

### Opção 3: GitHub CLI (se disponível)

```bash
# Instalar GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Autenticar
gh auth login

# Criar repositório
gh repo create rioportop2p-app --private --source=. --remote=origin --push
```

## 🚀 Workflow Recomendado

Após configurar, use este comando para commit e push automático:

```bash
# Função helper (adicione ao seu .bashrc ou .zshrc)
gitpush() {
  git add .
  git commit -m "$1"
  git push
}

# Uso:
gitpush "feat: adicionar nova funcionalidade"
```

## 📝 Script de Deploy Completo

Crie um arquivo `deploy.sh`:

```bash
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
```

Torne executável:
```bash
chmod +x deploy.sh
```

Use:
```bash
./deploy.sh "sua mensagem de commit"
```
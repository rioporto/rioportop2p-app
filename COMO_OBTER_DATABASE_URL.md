# Como Obter a DATABASE_URL do Supabase

## Passo a Passo com Imagens

### 1. Acesse o Painel do Supabase
- Entre no [dashboard.supabase.com](https://dashboard.supabase.com)
- Selecione seu projeto `rioportop2p`

### 2. Navegue até as Configurações do Banco
- No menu lateral esquerdo, clique em **Settings** (ícone de engrenagem)
- Em seguida, clique em **Database** no submenu

### 3. Localize a Connection String

Na página de Database, você verá várias seções:

#### Opção A: Connection Pooling (RECOMENDADO)
1. Role até encontrar a seção **Connection Pooling**
2. Procure por **Connection string**
3. Você verá algo como:
```
postgresql://postgres.wqrbyxgmpjvhmzgchjbb:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

#### Opção B: Direct Connection
1. Na seção **Connection string** (sem pooling)
2. Você verá algo como:
```
postgresql://postgres.wqrbyxgmpjvhmzgchjbb:[YOUR-PASSWORD]@db.wqrbyxgmpjvhmzgchjbb.supabase.co:5432/postgres
```

### 4. Substitua a Senha

**IMPORTANTE**: Onde você vê `[YOUR-PASSWORD]`, substitua pela senha que você criou quando criou o projeto Supabase.

### 5. Adicione o Parâmetro pgbouncer

Para a Connection Pooling (recomendada), adicione `?pgbouncer=true` no final:

```
postgresql://postgres.wqrbyxgmpjvhmzgchjbb:SUA_SENHA_AQUI@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Exemplo Completo

Com base no seu projeto ID `wqrbyxgmpjvhmzgchjbb`, sua DATABASE_URL será:

```
DATABASE_URL=postgresql://postgres.wqrbyxgmpjvhmzgchjbb:SUA_SENHA_DO_BANCO_AQUI@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Onde Encontrar a Senha?

- A senha é aquela que você definiu quando criou o projeto
- Se você esqueceu, pode resetar em **Settings** → **Database** → **Database Password** → **Reset Database Password**
- **ATENÇÃO**: Resetar a senha quebrará todas as conexões existentes

## Troubleshooting

### Não consigo encontrar a Connection String
1. Certifique-se de estar em **Settings** → **Database**
2. Role a página para baixo
3. Procure pelas seções mencionadas

### Erro de conexão após configurar
1. Verifique se a senha está correta
2. Confirme que não há espaços extras
3. Certifique-se de usar aspas se houver caracteres especiais na senha

## Formato Final no .env.local

```env
DATABASE_URL=postgresql://postgres.wqrbyxgmpjvhmzgchjbb:MinhaS3nh@Forte@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Nota**: Se sua senha contém caracteres especiais como `@`, `#`, `$`, etc., você pode precisar fazer URL encoding. Por exemplo:
- `@` vira `%40`
- `#` vira `%23`
- `$` vira `%24`
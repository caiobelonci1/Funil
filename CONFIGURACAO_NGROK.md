# 🔗 Configuração Ngrok para Facebook Messenger

O ngrok é necessário para que o Facebook possa acessar seu webhook local durante o desenvolvimento.

## 🚀 Passo 1: Criar Conta no Ngrok

1. Acesse: https://dashboard.ngrok.com/signup
2. Crie uma conta gratuita
3. Faça login no dashboard

## 🔑 Passo 2: Obter Token de Autenticação

1. No dashboard do ngrok, vá em: https://dashboard.ngrok.com/get-started/your-authtoken
2. Copie seu token de autenticação (authtoken)

## ⚙️ Passo 3: Configurar o Ngrok

Abra um terminal e execute:

```powershell
# Configurar o token (substitua YOUR_AUTHTOKEN pelo seu token)
ngrok config add-authtoken YOUR_AUTHTOKEN
```

## 🌐 Passo 4: Executar o Ngrok

```powershell
# Certifique-se que o servidor está rodando na porta 3001
cd server
node index.js

# Em outro terminal, execute o ngrok
ngrok http 3001
```

## 📋 Passo 5: Obter URL do Webhook

Após executar `ngrok http 3001`, você verá algo assim:

```
Session Status                online
Version                       3.23.3
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3001

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Copie a URL HTTPS** (ex: `https://abc123.ngrok-free.app`)

## 🔧 Passo 6: Configurar no Facebook

1. No Facebook Developers, vá na seção Webhooks do Messenger
2. **URL de Retorno de Chamada**: `https://abc123.ngrok-free.app/webhook`
3. **Token de Verificação**: O mesmo que está no seu arquivo `.env`
4. Salve e teste

## ✅ Verificar se Funcionou

1. No dashboard do ngrok (http://127.0.0.1:4040), você pode ver as requisições
2. Teste enviando uma mensagem para sua página do Facebook
3. Deve aparecer no dashboard do ngrok e no seu CRM

## 🚨 Importante

- ⚠️ A URL do ngrok muda toda vez que você reinicia
- ⚠️ Atualize a URL no Facebook sempre que reiniciar o ngrok
- ✅ Para desenvolvimento, deixe o ngrok rodando continuamente

## 🔄 Script Automatizado

Aqui está um script para facilitar:

```powershell
# arquivo: start-with-ngrok.ps1

# Iniciar servidor backend
Start-Process powershell -ArgumentList "-Command", "cd 'server'; node index.js"

# Aguardar servidor iniciar
Start-Sleep 3

# Iniciar ngrok
Start-Process powershell -ArgumentList "-Command", "ngrok http 3001"

Write-Host "✅ Servidor e ngrok iniciados!"
Write-Host "🌐 Acesse http://127.0.0.1:4040 para ver a URL do ngrok"
Write-Host "📱 Use a URL HTTPS no Facebook Webhook"
```

## 📞 Alternativas ao Ngrok

Se preferir, pode usar outras ferramentas:

### 1. Localtunnel
```powershell
npm install -g localtunnel
lt --port 3001
```

### 2. Serveo
```powershell
ssh -R 80:localhost:3001 serveo.net
```

### 3. Cloudflare Tunnel
```powershell
npm install -g @cloudflare/wrangler
wrangler tunnel
```

---

💡 **Dica**: O ngrok gratuito tem algumas limitações, mas é perfeito para desenvolvimento. Para produção, considere fazer deploy em um servidor com HTTPS público.

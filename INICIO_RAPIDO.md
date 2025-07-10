# ⚡ Início Rápido - Funil de Vendas Facebook Messenger

## 🏃‍♂️ Para começar rapidamente:

### 1️⃣ Instalar e Configurar
```powershell
# Execute o script de configuração
npm run setup
```

### 2️⃣ Configurar Facebook (OBRIGATÓRIO)
1. Abra `server/.env`
2. Configure suas credenciais do Facebook:
   ```env
   FACEBOOK_PAGE_ACCESS_TOKEN=seu_token_aqui
   FACEBOOK_VERIFY_TOKEN=seu_token_verificacao
   FACEBOOK_APP_SECRET=seu_app_secret
   ```
3. Veja `CONFIGURACAO_FACEBOOK.md` para instruções detalhadas

### 3️⃣ Iniciar o Sistema
```powershell
# Inicia frontend e backend juntos
npm run start:all
```

**OU manualmente:**
```powershell
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend  
npm run server
```

### 4️⃣ Acessar
- 🎨 **Frontend**: http://localhost:5173
- ⚙️ **Backend**: http://localhost:3001  
- 🔗 **Webhook**: http://localhost:3001/webhook

## 🧪 Testar
1. Acesse http://localhost:5173
2. Vá na seção "Chats" 
3. Envie uma mensagem para sua página do Facebook
4. A conversa aparecerá automaticamente no CRM!

## 📁 Estrutura do Projeto
```
📦 funil-facebook-messenger/
├── 🎨 src/                  # Frontend React
├── ⚙️ server/               # Backend Node.js
├── 📝 CONFIGURACAO_FACEBOOK.md  # Guia detalhado
├── 🚀 setup.ps1            # Script de configuração
└── 🏃 start.ps1            # Script para iniciar tudo
```

## 🆘 Problemas Comuns

❌ **"Webhook validation failed"**
→ Verifique se o `FACEBOOK_VERIFY_TOKEN` está correto

❌ **"Invalid access token"**  
→ Verifique se o `FACEBOOK_PAGE_ACCESS_TOKEN` está correto

❌ **"Server not running"**
→ Execute `npm run server` e verifique se a porta 3001 está livre

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run setup` | Configuração inicial |
| `npm run start:all` | Inicia frontend + backend |
| `npm run dev` | Só o frontend |
| `npm run server` | Só o backend |
| `npm run server:dev` | Backend com auto-reload |

---

💡 **Dica**: Para desenvolvimento, use `npm run server:dev` que reinicia automaticamente quando você faz mudanças no código!

🔗 **Ajuda completa**: Veja `CONFIGURACAO_FACEBOOK.md` para configuração detalhada do Facebook.

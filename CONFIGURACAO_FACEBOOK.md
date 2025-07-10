# 🔧 Guia de Configuração Facebook Messenger

Este guia vai te ajudar a configurar a integração com o Facebook Messenger passo a passo.

## 📋 Pré-requisitos

1. **Conta no Facebook Developers**
   - Acesse: https://developers.facebook.com/
   - Faça login com sua conta Facebook

2. **Página do Facebook**
   - Você precisa ter uma página do Facebook para seu negócio
   - A página será usada para receber e enviar mensagens

## 🚀 Passo 1: Criar App no Facebook Developers

1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Clique em "Meus Apps" e depois "Criar App"
3. Escolha "Negócios" como tipo de app
4. Preencha:
   - **Nome do App**: Ex: "CRM Messenger Bot"
   - **Email de Contato**: Seu email
   - **Categoria**: "Negócios"
5. Clique em "Criar App"

## 📱 Passo 2: Adicionar Produto Messenger

1. No painel do seu app, encontre "Messenger" na lista de produtos
2. Clique em "Configurar" no card do Messenger
3. O Messenger será adicionado ao seu app

## 🔑 Passo 3: Gerar Token de Acesso da Página

1. Na seção "Tokens de Acesso", você verá "Tokens de Acesso da Página"
2. Clique em "Adicionar ou Remover Páginas"
3. Selecione a página do Facebook que você quer conectar
4. Aceite as permissões necessárias
5. **Copie o Token de Acesso da Página** (importante!)

## 🔗 Passo 4: Configurar Webhook

### 4.1 Configurar URL do Webhook

1. Na seção "Webhooks", clique em "Adicionar URL de Retorno de Chamada"
2. Preencha:
   - **URL de Retorno de Chamada**: 
     - Para desenvolvimento: `http://localhost:3001/webhook` (apenas se usando localhost)
     - **Recomendado**: Use ngrok - `https://abc123.ngrok-free.app/webhook`
     - Para produção: `https://seudominio.com/webhook`
   - **Token de Verificação**: Crie um token personalizado (ex: "meu_token_123")
3. **Importante**: Anote o token de verificação que você criou!

> 💡 **Para desenvolvimento local**: O Facebook exige HTTPS para webhooks. Use ngrok para expor seu localhost com HTTPS. Veja `CONFIGURACAO_NGROK.md` para instruções detalhadas.

### 4.2 Subscrever Eventos

1. Após salvar a URL, clique em "Adicionar Assinaturas"
2. Selecione os seguintes eventos:
   - ✅ `messages`
   - ✅ `messaging_postbacks`
   - ✅ `messaging_optins`
   - ✅ `messaging_deliveries`
   - ✅ `messaging_reads`

## 🔐 Passo 5: Obter App Secret

1. No menu lateral, vá em "Configurações" > "Básico"
2. Copie o valor do **"Chave Secreta do App"**
3. **Mantenha isso seguro** - nunca compartilhe publicamente!

## ⚙️ Passo 6: Configurar Variáveis de Ambiente

1. No seu projeto, navegue até `server/.env`
2. Edite o arquivo com os valores que você coletou:

```env
# Cole o token da página que você copiou no Passo 3
FACEBOOK_PAGE_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxx

# Cole o token de verificação que você criou no Passo 4.1
FACEBOOK_VERIFY_TOKEN=meu_token_123

# Cole a chave secreta do app do Passo 5
FACEBOOK_APP_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Configurações do servidor (pode manter assim)
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🧪 Passo 7: Testar a Configuração

### 7.1 Iniciar os Servidores

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend  
npm run dev
```

### 7.2 Verificar Webhook

1. No Facebook Developers, vá até a seção Webhooks do Messenger
2. Clique em "Testar" na sua URL de webhook
3. Deve aparecer uma mensagem de sucesso ✅

### 7.3 Testar Mensagens

1. Acesse sua página do Facebook
2. Envie uma mensagem através do Messenger da página
3. A mensagem deve aparecer no seu CRM em http://localhost:5173

## 🔧 Solução de Problemas

### ❌ Erro: "URL couldn't be validated"
- Verifique se o servidor está rodando na porta 3001
- Certifique-se que o FACEBOOK_VERIFY_TOKEN no .env é igual ao token configurado no Facebook
- Para desenvolvimento local, considere usar ngrok para expor localhost

### ❌ Erro: "Invalid signature"  
- Verifique se o FACEBOOK_APP_SECRET está correto no arquivo .env
- Certifique-se que não há espaços extras no valor

### ❌ Erro: "Invalid access token"
- Verifique se o FACEBOOK_PAGE_ACCESS_TOKEN está correto
- Certifique-se que o token não expirou
- Gere um novo token se necessário

## 🌐 Produção com Ngrok (Para Desenvolvimento)

Se você quiser testar localmente com o Facebook, use ngrok:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 3001
ngrok http 3001

# Use a URL HTTPS fornecida pelo ngrok como webhook URL
```

## 📞 Funcionalidades Suportadas

✅ **Receber mensagens de texto**  
✅ **Enviar mensagens de texto**  
✅ **Quick Replies (botões de resposta rápida)**  
✅ **Button Templates (mensagens com botões)**  
✅ **Perfis de usuário com fotos**  
✅ **Status de leitura**  
✅ **Armazenamento de conversas**  
✅ **Interface de chat em tempo real**

## 🔄 Próximos Passos

Depois de configurar e testar:

1. **Integre com banco de dados** para persistir mensagens
2. **Configure automações** para respostas inteligentes  
3. **Adicione templates** personalizados para seu negócio
4. **Configure notificações** em tempo real
5. **Implante em produção** com HTTPS

## 📚 Recursos Úteis

- [Documentação Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform/)
- [Guia de Webhooks](https://developers.facebook.com/docs/messenger-platform/webhook/)
- [Referência da API](https://developers.facebook.com/docs/messenger-platform/reference/)

---

💡 **Dica**: Mantenha suas credenciais seguras e nunca as compartilhe em repositórios públicos!

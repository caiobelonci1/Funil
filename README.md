# WhatsApp CRM - Sistema de Funil de Vendas com Integração Facebook Messenger

Um sistema CRM completo com funil de vendas Kanban e integração com Facebook Messenger para gerenciamento de conversas e leads.

## 🚀 Funcionalidades

### Frontend (React + TypeScript)
- ✅ Dashboard Kanban com drag-and-drop
- ✅ Gestão de contatos e leads
- ✅ Interface de chat integrada em tempo real
- ✅ Sistema de operadores
- ✅ Sidebar com navegação completa
- ✅ Design responsivo e profissional
- ✅ Quick Replies e templates de mensagem
- ✅ Indicadores de status de conexão

### Backend (Node.js + Express)
- ✅ API REST para integração com Messenger
- ✅ Webhook para receber mensagens em tempo real
- ✅ Sistema de autenticação com Facebook
- ✅ Processamento automático de mensagens
- ✅ Respostas automáticas inteligentes
- ✅ Gerenciamento de perfis de usuário
- ✅ Armazenamento em memória (dev) / Database ready
- ✅ Templates de botões e quick replies

## ⚡ Início Rápido

### Opção 1: Script Automático (Recomendado)
```powershell
# 1. Configure tudo automaticamente
npm run setup

# 2. Edite server/.env com suas credenciais do Facebook
# (Veja CONFIGURACAO_FACEBOOK.md para instruções)

# 3. Inicie ambos os servidores
npm run start:all
```

### Opção 2: Manual
```bash
# 1. Instalar dependências do frontend
npm install

# 2. Instalar dependências do servidor
cd server
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais do Facebook

# 4. Iniciar servidores
# Terminal 1
npm run dev

# Terminal 2  
cd server && npm start
```

## 📚 Documentação

- 📖 **[Guia de Configuração Facebook](CONFIGURACAO_FACEBOOK.md)** - Passo a passo completo
- ⚡ **[Início Rápido](INICIO_RAPIDO.md)** - Para começar rapidamente
- 🔧 **Scripts de automação** incluídos para Windows

## 🛠️ Configuração

### 3. Configuração do Facebook Messenger

#### Passo 1: Criar App no Facebook Developers
1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Crie um novo app
3. Adicione o produto "Messenger"

#### Passo 2: Configurar Página do Facebook
1. Crie uma página no Facebook para seu negócio
2. Conecte a página ao seu app
3. Gere um token de acesso da página

#### Passo 3: Configurar Webhook
1. No painel do Messenger, configure o webhook:
   - URL: `https://seu-dominio.com/webhook` (ou `http://localhost:3001/webhook` para desenvolvimento)
   - Token de verificação: defina um token personalizado
   - Eventos: `messages`, `messaging_postbacks`

#### Passo 4: Variáveis de Ambiente
Edite o arquivo `.env` na pasta `server`:

```env
FACEBOOK_PAGE_ACCESS_TOKEN=seu_token_de_acesso_da_pagina
FACEBOOK_VERIFY_TOKEN=seu_token_de_verificacao_personalizado
FACEBOOK_APP_SECRET=seu_app_secret
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## � Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run setup` | Configuração inicial automática |
| `npm run start:all` | Inicia frontend e backend simultaneamente |
| `npm run dev` | Inicia apenas o frontend (desenvolvimento) |
| `npm run server` | Inicia apenas o backend |
| `npm run server:dev` | Backend com auto-reload (desenvolvimento) |
| `npm run build` | Build de produção do frontend |
| `npm run lint` | Verificação de código |

## �📱 Como Usar

### 1. Iniciar o Sistema
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server && npm start
```

### 2. Acessar a Interface
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 3. Testar a Integração
1. Acesse a seção "Chats" no menu lateral
2. Verifique o status da conexão
3. Envie uma mensagem para sua página do Facebook
4. A mensagem aparecerá automaticamente no CRM

## 🔧 API Endpoints

### Messenger API
- `POST /api/messenger/send-message` - Enviar mensagem
- `GET /api/messenger/user-profile/:psid` - Obter perfil do usuário
- `GET /api/messenger/conversations` - Listar conversas
- `POST /api/messenger/mark-read` - Marcar como lida

### Webhook
- `GET /webhook` - Verificação do webhook
- `POST /webhook` - Receber eventos do Messenger

## 🎨 Funcionalidades do Chat

### Respostas Automáticas
- Saudações automáticas
- Respostas baseadas em palavras-chave
- Quick replies para interações rápidas

### Gestão de Conversas
- Interface de chat em tempo real
- Histórico de mensagens
- Status de leitura
- Perfis de usuário com fotos

### Integração com CRM
- Conversão automática de contatos do Messenger para leads
- Atribuição de operadores
- Movimentação no funil de vendas
- Rastreamento de valor de negócios

## 🔒 Segurança

- Verificação de assinatura do webhook
- Validação de tokens de acesso
- CORS configurado
- Sanitização de dados de entrada

## 📊 Próximas Funcionalidades

- [ ] Integração com WhatsApp Business API
- [ ] Sistema de automação avançado
- [ ] Relatórios e analytics
- [ ] Integração com banco de dados
- [ ] Sistema de notificações push
- [ ] Templates de mensagens
- [ ] Agendamento de mensagens
- [ ] Chatbot com IA

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
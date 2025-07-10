# Facebook Messenger Sales Funnel CRM

A complete CRM system for managing Facebook Messenger sales conversations with Kanban board interface.

## 🚀 Features

### Frontend (React + TypeScript)
- ✅ Kanban Dashboard with drag-and-drop
- ✅ Contact and lead management
- ✅ Real-time integrated chat interface
- ✅ Operator system
- ✅ Complete navigation sidebar
- ✅ Responsive and professional design
- ✅ Quick Replies and message templates
- ✅ Connection status indicators

### Backend (Node.js + Express + Prisma + PostgreSQL)
- ✅ REST API for Messenger integration
- ✅ Webhook for real-time message receiving
- ✅ Facebook authentication system
- ✅ Automatic message processing
- ✅ Intelligent automatic responses
- ✅ User profile management
- ✅ PostgreSQL database with Prisma ORM
- ✅ Ad referral tracking (adTitle field)
- ✅ Status tracking with enum validation
- ✅ CORS enabled for frontend communication

## ⚡ Quick Start

### Prerequisites
- Node.js 16+ 
- PostgreSQL database
- Facebook App with Messenger integration

### Setup Instructions

1. **Clone and Install**
```bash
git clone <your-repo-url>
cd "funil facebook messenger"
npm install
cd server
npm install
```

2. **Database Configuration**
Create `server/.env` with your credentials:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
FACEBOOK_PAGE_ACCESS_TOKEN="your_page_access_token"
FACEBOOK_VERIFY_TOKEN="your_verify_token"
PORT=3001
```

3. **Run Database Migrations**
```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

4. **Start Development**
```bash
# Backend (terminal 1)
cd server
npm run dev

# Frontend (terminal 2) 
npm run dev
```
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
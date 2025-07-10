# 📡 Exemplos de Uso da API

Este arquivo contém exemplos práticos de como usar a API do Facebook Messenger integrada ao CRM.

## 🔧 Endpoints Disponíveis

### Base URL
```
http://localhost:3001/api/messenger
```

## 📨 Enviar Mensagens

### 1. Mensagem de Texto Simples
```javascript
POST /api/messenger/send-message
Content-Type: application/json

{
  "recipientId": "1234567890123456",
  "message": "Olá! Como posso ajudá-lo hoje?",
  "messageType": "text"
}
```

### 2. Quick Reply (Respostas Rápidas)
```javascript
POST /api/messenger/send-quick-reply
Content-Type: application/json

{
  "recipientId": "1234567890123456",
  "text": "Qual tipo de produto você está procurando?",
  "quickReplies": [
    {
      "title": "Smartphones",
      "payload": "PRODUCT_SMARTPHONE"
    },
    {
      "title": "Notebooks", 
      "payload": "PRODUCT_NOTEBOOK"
    },
    {
      "title": "Acessórios",
      "payload": "PRODUCT_ACCESSORIES"
    }
  ]
}
```

### 3. Button Template (Mensagem com Botões)
```javascript
POST /api/messenger/send-button-template
Content-Type: application/json

{
  "recipientId": "1234567890123456",
  "text": "Precisa de ajuda? Escolha uma opção:",
  "buttons": [
    {
      "type": "postback",
      "title": "Falar com Vendedor",
      "payload": "TALK_TO_SALES"
    },
    {
      "type": "postback", 
      "title": "Suporte Técnico",
      "payload": "TECH_SUPPORT"
    },
    {
      "type": "web_url",
      "title": "Ver Catálogo",
      "url": "https://exemplo.com/catalogo"
    }
  ]
}
```

## 👤 Gerenciar Usuários

### Obter Perfil do Usuário
```javascript
GET /api/messenger/user-profile/1234567890123456

// Resposta:
{
  "success": true,
  "profile": {
    "first_name": "João",
    "last_name": "Silva", 
    "profile_pic": "https://graph.facebook.com/v18.0/1234567890123456/picture"
  }
}
```

## 💬 Gerenciar Conversas

### Listar Todas as Conversas
```javascript
GET /api/messenger/conversations

// Resposta:
{
  "success": true,
  "conversations": [
    {
      "psid": "1234567890123456",
      "firstName": "João",
      "lastName": "Silva",
      "profilePic": "https://...",
      "lastMessage": "Obrigado pela ajuda!",
      "timestamp": "14:30",
      "unreadCount": 0
    }
  ]
}
```

### Histórico de Conversa
```javascript
GET /api/messenger/conversation/1234567890123456?limit=20&offset=0

// Resposta:
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_001",
        "text": "Olá, preciso de ajuda",
        "timestamp": "2024-01-15T14:30:00Z",
        "direction": "incoming",
        "psid": "1234567890123456"
      }
    ],
    "total": 5,
    "hasMore": false
  }
}
```

### Marcar como Lida
```javascript
POST /api/messenger/mark-read
Content-Type: application/json

{
  "psid": "1234567890123456"
}
```

## 🔍 Informações da Página

```javascript
GET /api/messenger/page-info

// Resposta:
{
  "success": true,
  "data": {
    "name": "Minha Empresa",
    "id": "123456789",
    "about": "Empresa de tecnologia",
    "category": "Loja de Eletrônicos",
    "picture": {
      "data": {
        "url": "https://..."
      }
    }
  }
}
```

## 🎯 Exemplos de Uso no Frontend

### React/TypeScript

```typescript
import { messengerAPI } from './services/messengerApi';

// Enviar mensagem simples
const enviarMensagem = async (psid: string, texto: string) => {
  try {
    await messengerAPI.sendMessage(psid, texto);
    console.log('Mensagem enviada!');
  } catch (error) {
    console.error('Erro ao enviar:', error);
  }
};

// Enviar quick reply
const enviarQuickReply = async (psid: string) => {
  const replies = [
    { title: 'Sim', payload: 'YES' },
    { title: 'Não', payload: 'NO' }
  ];
  
  await messengerAPI.sendQuickReply(
    psid, 
    'Posso ajudá-lo com mais alguma coisa?', 
    replies
  );
};

// Carregar conversas
const carregarConversas = async () => {
  const conversas = await messengerAPI.getConversations();
  setContacts(conversas);
};
```

## 🤖 Automações Sugeridas

### 1. Resposta de Boas-vindas
```javascript
// No MessengerService.js - processTextMessage()
if (lowerText.includes('olá') || lowerText.includes('oi')) {
  return {
    text: `Olá ${userProfile?.first_name}! 👋 Como posso ajudá-lo?`,
    quick_replies: [
      { title: 'Ver Produtos', payload: 'PRODUCTS' },
      { title: 'Falar com Vendedor', payload: 'SALES' },
      { title: 'Suporte', payload: 'SUPPORT' }
    ]
  };
}
```

### 2. Horário de Funcionamento
```javascript
const agora = new Date();
const hora = agora.getHours();

if (hora < 8 || hora > 18) {
  return "🕐 Nosso horário de atendimento é das 8h às 18h. Deixe sua mensagem que responderemos em breve!";
}
```

### 3. Integração com CRM
```javascript
// Criar lead automaticamente
const criarLead = async (userProfile, message) => {
  const lead = {
    nome: `${userProfile.first_name} ${userProfile.last_name}`,
    origem: 'Facebook Messenger',
    status: 'Novo',
    observacoes: message.text,
    dataCriacao: new Date()
  };
  
  // Salvar no banco de dados ou CRM
  await salvarLead(lead);
};
```

## 🔗 Webhooks - Eventos Recebidos

### Estrutura de Mensagem Recebida
```javascript
{
  "object": "page",
  "entry": [
    {
      "messaging": [
        {
          "sender": {
            "id": "1234567890123456"
          },
          "recipient": {
            "id": "PAGE_ID"
          },
          "timestamp": 1234567890123,
          "message": {
            "mid": "MESSAGE_ID",
            "text": "Olá, preciso de ajuda"
          }
        }
      ]
    }
  ]
}
```

### Postback Recebido
```javascript
{
  "sender": {
    "id": "1234567890123456"
  },
  "postback": {
    "title": "Falar com Vendedor",
    "payload": "TALK_TO_SALES"
  }
}
```

## 🚨 Tratamento de Erros

```javascript
// Exemplo de tratamento robusto
const enviarComTentativas = async (psid, message, maxTentativas = 3) => {
  for (let i = 0; i < maxTentativas; i++) {
    try {
      await messengerAPI.sendMessage(psid, message);
      return; // Sucesso
    } catch (error) {
      console.log(`Tentativa ${i + 1} falhou:`, error.message);
      
      if (i === maxTentativas - 1) {
        throw new Error(`Falha após ${maxTentativas} tentativas`);
      }
      
      // Aguardar antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## 📊 Métricas e Analytics

```javascript
// Exemplo de coleta de métricas
const registrarMetrica = async (tipo, dados) => {
  const metrica = {
    tipo, // 'mensagem_enviada', 'mensagem_recebida', 'conversa_iniciada'
    dados,
    timestamp: new Date(),
    psid: dados.psid
  };
  
  // Salvar para analytics
  await salvarMetrica(metrica);
};
```

---

💡 **Dica**: Todos esses exemplos estão implementados no projeto. Consulte os arquivos `MessengerService.js` e `messengerApi.ts` para ver a implementação completa!

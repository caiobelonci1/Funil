const express = require('express');
require('dotenv').config();           // dotenv para variáveis de ambiente

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

// 2. INICIALIZAÇÃO DO SERVIDOR
app.use(express.json());             // interpretar JSON

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});

// 3. ROTA DE VERIFICAÇÃO DO WEBHOOK (GET)
app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ Webhook verificado com sucesso');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Falha na verificação do webhook');
    res.sendStatus(403);
  }
});

// 4. ROTA PARA RECEBER EVENTOS E MENSAGENS (POST)
app.post('/webhook', async (req, res) => {
  console.log('🔔 Recebido body:', JSON.stringify(req.body, null, 2));

  if (req.body.object === 'page') {
    for (const entry of req.body.entry) {
      for (const event of entry.messaging) {
        if (event.message && event.message.text) {
          try {
            const senderId = event.sender.id;
            const messageText = event.message.text;

            // 1. Procura o usuário ou cria um novo se não existir
            const user = await prisma.user.upsert({
              where: { messengerId: senderId },
              update: {},
              create: { messengerId: senderId },
            });

            // 2. Salva a nova mensagem no banco
            await prisma.message.create({
              data: {
                text: messageText,
                senderId: senderId,
                userId: user.id,
              },
            });

            console.log(`✅ Mensagem de ${senderId} salva no banco.`);

          } catch (error) {
            console.error('❌ Erro ao salvar no banco de dados:', error);
          }
        }
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// =================================================================
// 5. FUNÇÃO PARA ENVIAR MENSAGENS DE VOLTA PARA O USUÁRIO
// =================================================================

// Lembre-se de instalar a biblioteca axios para fazer requisições HTTP:
// No terminal, na pasta 'server', execute: npm install axios
const axios = require('axios');

async function sendMessage(recipientId, messageText) {
  try {
    await axios.post(
      'https://graph.facebook.com/v20.0/me/messages',
      {
        messaging_type: 'RESPONSE',
        recipient: { id: recipientId },
        message: { text: messageText }
      },
      {
        params: { access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN }
      }
    );
    console.log('✅ Mensagem enviada para', recipientId);
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error.response ? error.response.data : error.message);
  }
}

// =================================================================
// 6. FUNÇÃO PARA TRATAR OS EVENTOS DE MENSAGEM
// =================================================================

async function handleMessage(event) {
  const senderId = event.sender.id;
  const messageText = event.message.text;
  const replyText = `Recebi sua mensagem: '${messageText}'`;
  await sendMessage(senderId, replyText);
}

// =================================================================
// API PARA O FRONTEND DO CRM
// =================================================================

// ROTA DA API: Listar todos os contatos do banco de dados
// O frontend vai chamar esta rota para exibir a lista de conversas.
app.get('/api/contacts', async (req, res) => {
  console.log('API: Recebida requisição para listar contatos.');
  try {
    // Busca todos os usuários no banco, ordenados pelo mais recente
    const contacts = await prisma.user.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    // Envia a lista de contatos como resposta em formato JSON
    res.json(contacts);
  } catch (error) {
    console.error('❌ Erro ao buscar contatos:', error);
    res.status(500).json({ error: 'Erro ao buscar contatos do banco de dados.' });
  }
});
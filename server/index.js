const express = require('express');
require('dotenv').config();           // dotenv para variáveis de ambiente

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
app.post('/webhook', (req, res) => {
  console.log('🔔 Recebido body:', JSON.stringify(req.body, null, 2));

  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        console.log('📨 Evento:', event);
        // Aqui você pode chamar sua lógica de tratamento:
        // if (event.message) handleMessage(event);
        // else if (event.postback) handlePostback(event);
      });
    });

    // Envia uma resposta 200 OK para o Facebook para confirmar o recebimento
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Se não for um evento da página, retorna 404
    res.sendStatus(404);
  }
});
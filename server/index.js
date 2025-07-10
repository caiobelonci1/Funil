const express = require('express');
const cors = require('cors');
require('dotenv').config();           // dotenv para variáveis de ambiente

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

// 2. INICIALIZAÇÃO DO SERVIDOR
app.use(cors());                     // Habilita CORS para todas as origens
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
        const senderId = event.sender.id;

        // Se for uma mensagem de texto normal
        if (event.message && event.message.text) {
          try {
            const messageText = event.message.text;

            // 1. Verifica se o usuário já existe no nosso banco de dados
            let user = await prisma.user.findUnique({
              where: { messengerId: senderId },
            });

            // 2. Se o usuário NÃO existir, busca os dados no Facebook e o cria
            if (!user) {
              console.log(`🔍 Novo usuário detectado: ${senderId}. Buscando dados no Facebook...`);
              
              const fbApiUrl = `https://graph.facebook.com/${senderId}?fields=first_name,last_name&access_token=${process.env.FACEBOOK_PAGE_ACCESS_TOKEN}`;

              try {
                const response = await fetch(fbApiUrl);
                const userData = await response.json();

                user = await prisma.user.create({
                  data: {
                    messengerId: senderId,
                    firstName: userData.first_name || 'Usuário',
                    lastName: userData.last_name || 'Desconhecido',
                    name: `${userData.first_name || 'Usuário'} ${userData.last_name || 'Desconhecido'}`.trim(),
                  },
                });
                
                console.log(`✅ Novo usuário criado: ${user.firstName} ${user.lastName}`);

              } catch (error) {
                console.error("❌ Erro ao buscar dados do usuário no Facebook:", error);
                // Se der erro, cria usuário com nome padrão
                user = await prisma.user.create({
                  data: {
                    messengerId: senderId,
                    firstName: 'Usuário',
                    lastName: 'sem nome',
                    name: 'Usuário sem nome',
                  },
                });
                console.log(`⚠️ Usuário criado com nome padrão devido a erro na API do Facebook`);
              }
            }

            // 3. Salva a mensagem associada ao usuário (existente ou recém-criado)
            await prisma.message.create({
              data: {
                text: messageText,
                senderId: senderId,
                userId: user.id,
              },
            });

            console.log(`✅ Mensagem de ${user.firstName} ${user.lastName} salva no banco.`);

          } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
          }
        }

        // Se for um clique em anúncio (referral)
        if (event.referral) {
          try {
            // Verifica se o usuário já existe
            let user = await prisma.user.findUnique({
              where: { messengerId: senderId }
            });

            if (!user) {
              // Usuário novo vindo de anúncio - busca dados no Facebook
              console.log(`🎯 Novo usuário via anúncio: ${senderId}. Buscando dados no Facebook...`);
              
              const fbApiUrl = `https://graph.facebook.com/${senderId}?fields=first_name,last_name&access_token=${process.env.FACEBOOK_PAGE_ACCESS_TOKEN}`;

              try {
                const response = await fetch(fbApiUrl);
                const userData = await response.json();

                user = await prisma.user.create({
                  data: {
                    messengerId: senderId,
                    firstName: userData.first_name || 'Usuário',
                    lastName: userData.last_name || 'Desconhecido',
                    name: `${userData.first_name || 'Usuário'} ${userData.last_name || 'Desconhecido'}`.trim(),
                    adTitle: event.referral.ref
                  }
                });
                
                console.log(`✅ Usuário criado via anúncio: ${user.firstName} ${user.lastName} (${event.referral.ref})`);

              } catch (error) {
                console.error("❌ Erro ao buscar dados do usuário no Facebook:", error);
                // Se der erro, cria usuário com nome padrão
                user = await prisma.user.create({
                  data: {
                    messengerId: senderId,
                    firstName: 'Usuário',
                    lastName: 'sem nome',
                    name: 'Usuário sem nome',
                    adTitle: event.referral.ref
                  },
                });
                console.log(`⚠️ Usuário criado via anúncio com nome padrão devido a erro na API`);
              }
            } else {
              // Usuário já existe - apenas atualiza o adTitle
              user = await prisma.user.update({
                where: { messengerId: senderId },
                data: { adTitle: event.referral.ref }
              });
              console.log(`✅ AdTitle atualizado para usuário existente: ${user.firstName} ${user.lastName}`);
            }
            
          } catch (error) {
            console.error('❌ Erro ao processar referral:', error);
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

// ROTA DA API: Listar todos os contatos com histórico completo de mensagens
app.get('/api/contacts', async (req, res) => {
  console.log('API: Recebida requisição para listar contatos com histórico completo de mensagens.');
  try {
    const contacts = await prisma.user.findMany({
      orderBy: { updatedAt: 'desc' },
      // A mágica acontece aqui:
      include: {
        // Inclui TODAS as mensagens da relação 'messages'
        messages: {
          orderBy: { createdAt: 'asc' }, // Ordena da mais antiga para a mais nova (como um chat)
        },
      },
    });
    res.json(contacts);
  } catch (error) {
    console.error('❌ Erro ao buscar contatos:', error);
    res.status(500).json({ error: 'Erro ao buscar contatos do banco de dados.' });
  }
});

// =================================================================
// ROTA DA API: Listar todos os contatos com apenas a última mensagem (para performance)
// =================================================================
app.get('/api/contacts/summary', async (req, res) => {
  console.log('API: Recebida requisição para listar contatos com resumo (última mensagem apenas).');
  try {
    const contacts = await prisma.user.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' }, // Ordena para pegar a mais recente
          take: 1, // Pega apenas a última mensagem
        },
      },
    });
    res.json(contacts);
  } catch (error) {
    console.error('❌ Erro ao buscar resumo de contatos:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo de contatos do banco de dados.' });
  }
});

// =================================================================
// ROTA DA API: Buscar um contato específico e seu histórico de mensagens
// =================================================================
app.get('/api/contacts/:contactId', async (req, res) => {
  // Pega o ID do contato que foi passado na URL
  const { contactId } = req.params;
  console.log(`API: Recebida requisição para as mensagens do contato ${contactId}`);

  try {
    // Busca no banco de dados todas as mensagens que pertencem a este ID de contato
    const messages = await prisma.message.findMany({
      where: {
        userId: contactId, // O filtro principal
      },
      orderBy: {
        createdAt: 'asc', // Ordena da mais antiga para a mais nova, como um chat
      },
    });

    // Se o contato existir mas não tiver mensagens, isso retornará uma lista vazia [], o que é correto.

    // Envia a lista de mensagens como resposta em formato JSON
    res.json(messages);

  } catch (error) {
    console.error(`❌ Erro ao buscar mensagens para o contato ${contactId}:`, error);
    res.status(500).json({ error: 'Erro ao buscar mensagens.' });
  }
});

// =================================================================
// ROTA DA API: Atualizar o status de um contato
// =================================================================
app.put('/api/contacts/:contactId/status', async (req, res) => {
  const { contactId } = req.params;
  const { newStatus } = req.body; // O frontend enviará o novo status no corpo da requisição

  console.log(`API: Recebida requisição para mudar status do contato ${contactId} para ${newStatus}`);

  // Uma pequena validação para garantir que o status é um dos permitidos
  const allowedStatuses = ["INTERESSADO", "AGUARDANDO_PAGAMENTO", "PAGO", "FINALIZADO", "PERDIDO"];
  if (!allowedStatuses.includes(newStatus)) {
    return res.status(400).json({ error: "Status inválido." });
  }

  try {
    const updatedContact = await prisma.user.update({
      where: { id: contactId },
      data: { status: newStatus },
    });
    res.json(updatedContact); // Retorna o contato atualizado
  } catch (error) {
    console.error(`❌ Erro ao atualizar status para o contato ${contactId}:`, error);
    res.status(500).json({ error: 'Erro ao atualizar status.' });
  }
});

// =================================================================
// ROTA DA API: Enviar uma nova mensagem para um usuário
// =================================================================
app.post('/api/send-message', async (req, res) => {
  // O frontend enviará o ID do nosso banco e o texto da mensagem
  const { contactId, messageText } = req.body;

  console.log(`API: Recebida requisição para enviar '${messageText}' para o contato ${contactId}`);

  try {
    // 1. Buscar o contato no nosso banco para encontrar seu ID do Messenger
    const contact = await prisma.user.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contato não encontrado.' });
    }

    const recipientId = contact.messengerId; // ID do Messenger para quem vamos enviar

    // 2. Chamar a função que envia a mensagem para a API do Facebook
    await sendMessage(recipientId, messageText);
    console.log(`✅ Mensagem enviada para ${recipientId} via Facebook.`);

    // 3. (MUITO IMPORTANTE) Salvar a mensagem que VOCÊ enviou no nosso banco de dados
    // Assim ela aparecerá no histórico do chat.
    await prisma.message.create({
      data: {
        text: messageText,
        senderId: 'MEU_ID_DA_PAGINA', // Marcador para indicar que nós enviamos
        userId: contact.id,
      }
    });

    res.status(200).json({ success: true, message: 'Mensagem enviada e salva com sucesso.' });

  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem para o contato ${contactId}:`, error);
    res.status(500).json({ error: 'Erro no servidor ao tentar enviar mensagem.' });
  }
});

// =================================================================
// ROTA DA API: Atualizar dados do contato (firstName, lastName, etc.)
// =================================================================
app.put('/api/contacts/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const { firstName, lastName, name } = req.body;

  console.log(`API: Recebida requisição para atualizar dados do contato ${contactId}`);

  try {
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (name !== undefined) updateData.name = name;

    const updatedContact = await prisma.user.update({
      where: { id: contactId },
      data: updateData,
    });
    
    res.json(updatedContact);
  } catch (error) {
    console.error(`❌ Erro ao atualizar dados do contato ${contactId}:`, error);
    res.status(500).json({ error: 'Erro ao atualizar dados do contato.' });
  }
});

// =================================================================
// FUNÇÃO PARA BUSCAR INFORMAÇÕES DO PERFIL DO FACEBOOK (BACKUP)
// =================================================================
async function getUserProfile(userId) {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v20.0/${userId}`,
      {
        params: {
          fields: 'first_name,last_name,profile_pic',
          access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar perfil do usuário:', error.response ? error.response.data : error.message);
    return null;
  }
}

// =================================================================
// FUNÇÃO ALTERNATIVA USANDO FETCH (MAIS LEVE)
// =================================================================
async function getUserProfileWithFetch(userId) {
  try {
    const fbApiUrl = `https://graph.facebook.com/${userId}?fields=first_name,last_name,profile_pic&access_token=${process.env.FACEBOOK_PAGE_ACCESS_TOKEN}`;
    const response = await fetch(fbApiUrl);
    
    if (!response.ok) {
      throw new Error(`Facebook API returned ${response.status}: ${response.statusText}`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('❌ Erro ao buscar perfil do usuário com fetch:', error.message);
    return null;
  }
}
// Teste para a nova rota de envio de mensagens via API
// Execute com: node test-reply-message.cjs

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3001';

async function testReplyMessage() {
  console.log('🧪 Testando nova rota de envio de mensagens...\n');
  console.log(`📍 URL Base: ${BASE_URL}\n`);

  try {
    // 1. Primeiro, buscar um contato para testar
    console.log('1️⃣ Buscando contatos para teste...');
    const contactsResponse = await axios.get(`${BASE_URL}/api/contacts`);
    
    if (contactsResponse.data.length === 0) {
      console.log('❌ Nenhum contato encontrado para teste');
      return;
    }

    const testContact = contactsResponse.data[0];
    console.log(`✅ Contato de teste: ${testContact.firstName} ${testContact.lastName} (ID: ${testContact.id})`);

    // 2. Testar envio de mensagem
    console.log('\n2️⃣ Testando envio de mensagem de resposta...');
    
    const testMessage = `Teste de mensagem automática - ${new Date().toLocaleTimeString()}`;
    
    const replyResponse = await axios.post(`${BASE_URL}/api/contacts/${testContact.id}/reply`, {
      message: testMessage
    });

    console.log(`✅ Status: ${replyResponse.status}`);
    console.log(`✅ Resposta: ${JSON.stringify(replyResponse.data, null, 2)}`);

    // 3. Verificar se a mensagem foi salva no banco
    console.log('\n3️⃣ Verificando se a mensagem foi salva...');
    const messagesResponse = await axios.get(`${BASE_URL}/api/contacts/${testContact.id}`);
    const messages = messagesResponse.data;
    
    const sentMessage = messages.find(msg => 
      msg.text === testMessage && msg.senderId === 'MEU_ID_DA_PAGINA'
    );

    if (sentMessage) {
      console.log('✅ Mensagem encontrada no banco de dados');
      console.log(`📝 Texto: "${sentMessage.text}"`);
      console.log(`👤 Sender: ${sentMessage.senderId}`);
      console.log(`🕐 Data: ${sentMessage.createdAt}`);
    } else {
      console.log('❌ Mensagem não encontrada no banco de dados');
    }

    console.log('\n🎉 Teste da nova rota concluído com sucesso!');

  } catch (error) {
    console.error('\n❌ Erro durante o teste:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Dados: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`Erro: ${error.message}`);
    }
    
    console.log('\n💡 Notas importantes:');
    console.log('- Esta rota envia mensagens reais via Facebook API');
    console.log('- Certifique-se de que FACEBOOK_PAGE_ACCESS_TOKEN está configurado');
    console.log('- O teste pode falhar se o token estiver inválido ou expirado');
  }
}

// Executar o teste
if (require.main === module) {
  testReplyMessage();
}

module.exports = testReplyMessage;

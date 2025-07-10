// Script de teste para verificar as APIs do backend
// Execute com: node test-apis.js

const axios = require('axios');

// Configure a URL do seu servidor (local ou Render)
const BASE_URL = process.env.API_URL || 'http://localhost:3001';

async function testAPIs() {
  console.log('🧪 Testando APIs do backend...\n');
  console.log(`📍 URL Base: ${BASE_URL}\n`);

  try {
    // 1. Teste da API de contatos
    console.log('1️⃣ Testando GET /api/contacts');
    const contactsResponse = await axios.get(`${BASE_URL}/api/contacts`);
    console.log(`✅ Status: ${contactsResponse.status}`);
    console.log(`📊 Contatos encontrados: ${contactsResponse.data.length}`);
    
    if (contactsResponse.data.length > 0) {
      const firstContact = contactsResponse.data[0];
      console.log(`👤 Primeiro contato: ID=${firstContact.id}, Status=${firstContact.status}`);
      
      // 2. Teste da API de mensagens de um contato específico
      console.log('\n2️⃣ Testando GET /api/contacts/:contactId');
      const messagesResponse = await axios.get(`${BASE_URL}/api/contacts/${firstContact.id}`);
      console.log(`✅ Status: ${messagesResponse.status}`);
      console.log(`💬 Mensagens encontradas: ${messagesResponse.data.length}`);
      
      // 3. Teste da API de atualização de status
      console.log('\n3️⃣ Testando PUT /api/contacts/:contactId/status');
      const statusResponse = await axios.put(`${BASE_URL}/api/contacts/${firstContact.id}/status`, {
        newStatus: 'INTERESSADO'
      });
      console.log(`✅ Status: ${statusResponse.status}`);
      console.log(`📋 Status atualizado para: ${statusResponse.data.status}`);
    } else {
      console.log('ℹ️ Nenhum contato encontrado para testes adicionais');
    }

    console.log('\n🎉 Todos os testes de API passaram com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro durante os testes:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Dados: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`Erro: ${error.message}`);
    }
    console.log('\n💡 Dicas:');
    console.log('- Verifique se o servidor está rodando');
    console.log('- Verifique se a URL base está correta');
    console.log('- Verifique se o banco de dados está acessível');
  }
}

// Executar os testes
if (require.main === module) {
  testAPIs();
}

module.exports = testAPIs;

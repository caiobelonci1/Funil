// Script de teste para verificar a integração com a API do Facebook
// Execute com: node test-facebook-api.js

require('dotenv').config();

async function testFacebookAPI() {
  console.log('🧪 Testando integração com API do Facebook...\n');

  // Verificar variáveis de ambiente
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;

  console.log('📋 Verificando variáveis de ambiente:');
  console.log(`✅ FACEBOOK_PAGE_ACCESS_TOKEN: ${pageAccessToken ? 'Configurado' : '❌ Não encontrado'}`);
  console.log(`✅ FACEBOOK_VERIFY_TOKEN: ${verifyToken ? 'Configurado' : '❌ Não encontrado'}`);

  if (!pageAccessToken) {
    console.log('\n❌ FACEBOOK_PAGE_ACCESS_TOKEN não está configurado!');
    console.log('💡 Configure essa variável no arquivo .env do servidor');
    return;
  }

  // Teste com ID de usuário fictício (será substituído por ID real quando houver)
  const testUserId = '1234567890'; // ID fictício para teste
  
  console.log(`\n🔍 Testando busca de perfil para usuário fictício: ${testUserId}`);
  
  try {
    const fbApiUrl = `https://graph.facebook.com/${testUserId}?fields=first_name,last_name&access_token=${pageAccessToken}`;
    console.log(`📍 URL da API: ${fbApiUrl.replace(pageAccessToken, 'TOKEN_OCULTO')}`);
    
    const response = await fetch(fbApiUrl);
    const responseText = await response.text();
    
    console.log(`📊 Status da resposta: ${response.status} ${response.statusText}`);
    console.log(`📄 Resposta: ${responseText}`);
    
    if (response.ok) {
      const userData = JSON.parse(responseText);
      console.log('✅ API do Facebook respondeu com sucesso!');
      console.log('👤 Dados do usuário:', userData);
    } else {
      console.log('⚠️ API do Facebook retornou erro (esperado para ID fictício)');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API do Facebook:', error.message);
  }

  console.log('\n🎯 RESUMO DO TESTE:');
  console.log('- Configure um ID de usuário real para teste completo');
  console.log('- Webhook está pronto para buscar nomes automaticamente');
  console.log('- Verifique se o PAGE_ACCESS_TOKEN tem permissões adequadas');
}

// Função para testar com ID real (caso seja fornecido)
async function testWithRealUserId(userId) {
  console.log(`\n🔍 Testando com ID real: ${userId}`);
  
  try {
    const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const fbApiUrl = `https://graph.facebook.com/${userId}?fields=first_name,last_name&access_token=${pageAccessToken}`;
    
    const response = await fetch(fbApiUrl);
    const userData = await response.json();
    
    if (response.ok) {
      console.log('✅ Sucesso! Dados obtidos:');
      console.log(`👤 Nome: ${userData.first_name} ${userData.last_name}`);
      return userData;
    } else {
      console.log('❌ Erro:', userData);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return null;
  }
}

// Executar teste
if (require.main === module) {
  testFacebookAPI();
}

module.exports = { testFacebookAPI, testWithRealUserId };

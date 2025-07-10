#!/bin/bash

# Script de configuração para o Funil de Vendas Facebook Messenger
echo "🚀 Configurando Funil de Vendas Facebook Messenger..."

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
npm install

# Instalar dependências do servidor
echo "📦 Instalando dependências do servidor..."
cd server
npm install

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edite o arquivo server/.env com suas credenciais do Facebook!"
    echo ""
    echo "Você precisará configurar:"
    echo "- FACEBOOK_PAGE_ACCESS_TOKEN"
    echo "- FACEBOOK_VERIFY_TOKEN"
    echo "- FACEBOOK_APP_SECRET"
    echo ""
    echo "Veja o README.md para instruções detalhadas."
else
    echo "✅ Arquivo .env já existe"
fi

# Voltar ao diretório raiz
cd ..

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "Para iniciar o projeto:"
echo "1. Configure suas credenciais do Facebook no arquivo server/.env"
echo "2. Execute: npm run dev (para o frontend)"
echo "3. Execute: cd server && npm start (para o backend)"
echo ""
echo "URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:3001"
echo "- Webhook: http://localhost:3001/webhook"

# Script de configuração para o Funil de Vendas Facebook Messenger
Write-Host "🚀 Configurando Funil de Vendas Facebook Messenger..." -ForegroundColor Green

# Instalar dependências do frontend
Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
npm install

# Instalar dependências do servidor
Write-Host "📦 Instalando dependências do servidor..." -ForegroundColor Yellow
Set-Location server
npm install

# Criar arquivo .env se não existir
if (-not (Test-Path .env)) {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  IMPORTANTE: Edite o arquivo server\.env com suas credenciais do Facebook!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Você precisará configurar:" -ForegroundColor Cyan
    Write-Host "- FACEBOOK_PAGE_ACCESS_TOKEN" -ForegroundColor White
    Write-Host "- FACEBOOK_VERIFY_TOKEN" -ForegroundColor White
    Write-Host "- FACEBOOK_APP_SECRET" -ForegroundColor White
    Write-Host ""
    Write-Host "Veja o README.md para instruções detalhadas." -ForegroundColor Cyan
} else {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
}

# Voltar ao diretório raiz
Set-Location ..

Write-Host ""
Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o projeto:" -ForegroundColor Cyan
Write-Host "1. Configure suas credenciais do Facebook no arquivo server\.env" -ForegroundColor White
Write-Host "2. Execute: npm run dev (para o frontend)" -ForegroundColor White
Write-Host "3. Execute: cd server && npm start (para o backend)" -ForegroundColor White
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "- Backend: http://localhost:3001" -ForegroundColor White
Write-Host "- Webhook: http://localhost:3001/webhook" -ForegroundColor White

# Pausar para o usuário ler
Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

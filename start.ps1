# Script para iniciar frontend e backend simultaneamente
Write-Host "🚀 Iniciando Funil de Vendas Facebook Messenger..." -ForegroundColor Green

# Verificar se as dependências estão instaladas
if (-not (Test-Path node_modules)) {
    Write-Host "❌ Dependências do frontend não encontradas. Execute: npm install" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path server/node_modules)) {
    Write-Host "❌ Dependências do servidor não encontradas. Execute: cd server && npm install" -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo .env existe
if (-not (Test-Path server/.env)) {
    Write-Host "❌ Arquivo server/.env não encontrado. Configure suas credenciais do Facebook!" -ForegroundColor Red
    Write-Host "📝 Copie server/.env.example para server/.env e edite com suas credenciais" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Verificações passaram. Iniciando servidores..." -ForegroundColor Green

# Criar jobs para executar em paralelo
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Write-Host "🎨 Iniciando Frontend (React)..." -ForegroundColor Cyan
    npm run dev
}

$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD/server
    Write-Host "⚙️ Iniciando Backend (Node.js)..." -ForegroundColor Cyan
    npm start
}

Write-Host ""
Write-Host "🌐 Servidores iniciados!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:3001" -ForegroundColor White
Write-Host "🔗 Webhook: http://localhost:3001/webhook" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para parar os servidores, pressione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Aguardar que os jobs terminem (ou o usuário pressione Ctrl+C)
try {
    Wait-Job $frontendJob, $backendJob
} finally {
    # Limpar jobs quando o script for interrompido
    Stop-Job $frontendJob, $backendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob, $backendJob -ErrorAction SilentlyContinue
    Write-Host "🛑 Servidores parados." -ForegroundColor Red
}

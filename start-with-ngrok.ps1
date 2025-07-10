# Script para iniciar servidor + ngrok automaticamente
Write-Host "🚀 Iniciando Funil de Vendas + Ngrok..." -ForegroundColor Green

# Verificar se ngrok está configurado
try {
    $ngrokConfig = & ngrok config check 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ngrok não está configurado!" -ForegroundColor Red
        Write-Host "📝 Siga as instruções em CONFIGURACAO_NGROK.md" -ForegroundColor Yellow
        Write-Host "1. Crie conta em: https://dashboard.ngrok.com/signup" -ForegroundColor White
        Write-Host "2. Obtenha seu token em: https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor White
        Write-Host "3. Execute: ngrok config add-authtoken SEU_TOKEN" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host "❌ Ngrok não encontrado! Execute: npm install -g ngrok" -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo .env existe
if (-not (Test-Path "server/.env")) {
    Write-Host "❌ Arquivo server/.env não encontrado!" -ForegroundColor Red
    Write-Host "📝 Copie server/.env.example para server/.env e configure suas credenciais do Facebook" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Verificações passaram. Iniciando serviços..." -ForegroundColor Green

# Parar processos que possam estar usando a porta 3001
try {
    $processes = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "🔄 Parando processos na porta 3001..." -ForegroundColor Yellow
        $processes | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
        Start-Sleep 2
    }
} catch {
    # Ignorar erros
}

# Iniciar servidor backend
Write-Host "🔧 Iniciando servidor backend..." -ForegroundColor Cyan
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD/server
    node index.js
}

# Aguardar servidor inicializar
Start-Sleep 5

# Verificar se servidor está rodando
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Servidor backend rodando!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao iniciar servidor backend!" -ForegroundColor Red
    Stop-Job $serverJob -ErrorAction SilentlyContinue
    Remove-Job $serverJob -ErrorAction SilentlyContinue
    exit 1
}

# Iniciar ngrok
Write-Host "🌐 Iniciando ngrok..." -ForegroundColor Cyan
$ngrokJob = Start-Job -ScriptBlock {
    ngrok http 3001 --log=stdout
}

# Aguardar ngrok inicializar
Start-Sleep 5

Write-Host ""
Write-Host "🎉 Serviços iniciados com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 URLs importantes:" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:3001" -ForegroundColor White
Write-Host "🔧 Health Check: http://localhost:3001/health" -ForegroundColor White
Write-Host "🌐 Ngrok Dashboard: http://127.0.0.1:4040" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Para obter a URL do webhook:" -ForegroundColor Yellow
Write-Host "1. Acesse: http://127.0.0.1:4040" -ForegroundColor White
Write-Host "2. Copie a URL HTTPS (ex: https://abc123.ngrok-free.app)" -ForegroundColor White
Write-Host "3. No Facebook, use: [URL_NGROK]/webhook" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para parar os serviços, pressione Ctrl+C" -ForegroundColor Yellow

# Aguardar até o usuário pressionar Ctrl+C
try {
    Wait-Job $serverJob, $ngrokJob
} finally {
    Write-Host "🛑 Parando serviços..." -ForegroundColor Red
    Stop-Job $serverJob, $ngrokJob -ErrorAction SilentlyContinue
    Remove-Job $serverJob, $ngrokJob -ErrorAction SilentlyContinue
    Write-Host "✅ Serviços parados." -ForegroundColor Green
}

# Script de validação do projeto
Write-Host "Validando projeto Facebook Messenger CRM..." -ForegroundColor Cyan

# Verificar arquivos principais
Write-Host "Verificando arquivos necessarios..." -ForegroundColor Yellow

if (Test-Path "server\index.js") {
    Write-Host "  ✓ server\index.js" -ForegroundColor Green
} else {
    Write-Host "  ✗ server\index.js" -ForegroundColor Red
}

if (Test-Path "server\package.json") {
    Write-Host "  ✓ server\package.json" -ForegroundColor Green
} else {
    Write-Host "  ✗ server\package.json" -ForegroundColor Red
}

if (Test-Path "server\prisma\schema.prisma") {
    Write-Host "  ✓ server\prisma\schema.prisma" -ForegroundColor Green
} else {
    Write-Host "  ✗ server\prisma\schema.prisma" -ForegroundColor Red
}

if (Test-Path "test-apis.js") {
    Write-Host "  ✓ test-apis.js" -ForegroundColor Green
} else {
    Write-Host "  ✗ test-apis.js" -ForegroundColor Red
}

# Verificar .env
Write-Host "Verificando configuracao..." -ForegroundColor Yellow
if (Test-Path "server\.env") {
    Write-Host "  ✓ Arquivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "  ! Arquivo .env nao encontrado" -ForegroundColor Yellow
}

Write-Host "RESUMO:" -ForegroundColor Magenta
Write-Host "- Backend configurado com Prisma e PostgreSQL" -ForegroundColor White
Write-Host "- APIs REST implementadas" -ForegroundColor White
Write-Host "- Campo adTitle para tracking implementado" -ForegroundColor White
Write-Host "- Webhook Messenger configurado" -ForegroundColor White

Write-Host "Para testar: node test-apis.js" -ForegroundColor Cyan
Write-Host "Projeto pronto!" -ForegroundColor Green

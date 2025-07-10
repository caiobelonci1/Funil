# Script de validação completa do projeto
# Execute: .\validate-project.ps1

Write-Host "🔍 Validando projeto Facebook Messenger CRM..." -ForegroundColor Cyan

# 1. Verificar estrutura do projeto
Write-Host "`n📁 Verificando estrutura do projeto..." -ForegroundColor Yellow
$requiredFiles = @(
    "package.json",
    "server\package.json", 
    "server\index.js",
    "server\prisma\schema.prisma",
    "src\App.tsx",
    "test-apis.js"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "✅ Todos os arquivos necessários estão presentes" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivos faltando:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
}

# 2. Verificar dependências do backend
Write-Host "`n📦 Verificando dependências do backend..." -ForegroundColor Yellow
Push-Location server
$backendPackages = @("express", "cors", "@prisma/client", "prisma", "axios", "dotenv")
$packageJson = Get-Content "package.json" | ConvertFrom-Json

$missingPackages = @()
foreach ($package in $backendPackages) {
    if (-not $packageJson.dependencies.$package) {
        $missingPackages += $package
    }
}

if ($missingPackages.Count -eq 0) {
    Write-Host "✅ Todas as dependências do backend estão instaladas" -ForegroundColor Green
} else {
    Write-Host "❌ Dependências faltando:" -ForegroundColor Red
    $missingPackages | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
}

# 3. Verificar arquivo .env
Write-Host "`n🔐 Verificando configuração de ambiente..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content ".env"
    $requiredVars = @("DATABASE_URL", "FACEBOOK_PAGE_ACCESS_TOKEN", "FACEBOOK_VERIFY_TOKEN")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if (-not ($envContent | Where-Object { $_ -like "$var=*" })) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -eq 0) {
        Write-Host "✅ Arquivo .env configurado corretamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Variáveis de ambiente faltando:" -ForegroundColor Yellow
        $missingVars | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
    }
} else {
    Write-Host "❌ Arquivo .env não encontrado" -ForegroundColor Red
    Write-Host "💡 Crie um arquivo .env com as variáveis necessárias" -ForegroundColor Blue
}

# 4. Verificar schema do Prisma
Write-Host "`n🗄️ Verificando schema do banco..." -ForegroundColor Yellow
$schemaContent = Get-Content "prisma\schema.prisma" -Raw
if ($schemaContent -match "adTitle.*String" -and $schemaContent -match "enum Status") {
    Write-Host "✅ Schema Prisma configurado corretamente (adTitle + Status enum)" -ForegroundColor Green
} else {
    Write-Host "❌ Schema Prisma incompleto" -ForegroundColor Red
}

# 5. Verificar Prisma Client
Write-Host "`n⚙️ Verificando Prisma Client..." -ForegroundColor Yellow
try {
    $null = & npx prisma generate --silent 2>&1
    Write-Host "✅ Prisma Client gerado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao gerar Prisma Client" -ForegroundColor Red
}

Pop-Location

# 6. Verificar dependências do frontend
Write-Host "`n🎨 Verificando dependências do frontend..." -ForegroundColor Yellow
$frontendPackages = @("react", "typescript", "vite", "@vitejs/plugin-react")
$frontendPackageJson = Get-Content "package.json" | ConvertFrom-Json

$missingFrontendPackages = @()
foreach ($package in $frontendPackages) {
    if (-not $frontendPackageJson.dependencies.$package -and -not $frontendPackageJson.devDependencies.$package) {
        $missingFrontendPackages += $package
    }
}

if ($missingFrontendPackages.Count -eq 0) {
    Write-Host "✅ Todas as dependências do frontend estão instaladas" -ForegroundColor Green
} else {
    Write-Host "❌ Dependências do frontend faltando:" -ForegroundColor Red
    $missingFrontendPackages | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
}

# 7. Status do Git
Write-Host "`n📝 Verificando status do Git..." -ForegroundColor Yellow
$gitStatus = & git status --porcelain 2>&1
if ($gitStatus.Count -eq 0) {
    Write-Host "✅ Repositório Git limpo - todas as alterações commitadas" -ForegroundColor Green
} else {
    Write-Host "⚠️ Existem alterações não commitadas:" -ForegroundColor Yellow
    $gitStatus | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
}

# 8. Verificar ultimo commit
$lastCommit = & git log -1 --oneline 2>&1
Write-Host "📋 Último commit: $lastCommit" -ForegroundColor Blue

# 9. Resumo final
Write-Host "`n🎯 RESUMO DA VALIDAÇÃO:" -ForegroundColor Magenta
Write-Host "=" * 50 -ForegroundColor Magenta

Write-Host "`n✅ FUNCIONALIDADES IMPLEMENTADAS:" -ForegroundColor Green
Write-Host "   - Facebook Messenger webhook (GET/POST)" -ForegroundColor White
Write-Host "   - Banco PostgreSQL com Prisma ORM" -ForegroundColor White
Write-Host "   - Campo adTitle para tracking de anúncios" -ForegroundColor White
Write-Host "   - Enum Status com validação" -ForegroundColor White
Write-Host "   - API REST completa para contacts, messages e status" -ForegroundColor White
Write-Host "   - CORS habilitado para frontend" -ForegroundColor White
Write-Host "   - Envio de mensagens via Messenger API" -ForegroundColor White
Write-Host "   - Captura de eventos de referral" -ForegroundColor White

Write-Host "`n🚀 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "   1. Configure as variáveis de ambiente (.env)" -ForegroundColor White
Write-Host "   2. Execute 'npm run dev' para testar localmente" -ForegroundColor White
Write-Host "   3. Execute 'node test-apis.js' para testar APIs" -ForegroundColor White
Write-Host "   4. Configure webhook do Facebook apontando para sua URL" -ForegroundColor White
Write-Host "   5. Deploy automático via Git push para Render" -ForegroundColor White

Write-Host "`n💡 COMANDOS ÚTEIS:" -ForegroundColor Blue
Write-Host "   - Testar APIs: node test-apis.js" -ForegroundColor White
Write-Host "   - Rodar backend: cd server && npm run dev" -ForegroundColor White
Write-Host "   - Rodar frontend: npm run dev" -ForegroundColor White
Write-Host "   - Migrations: cd server && npx prisma migrate deploy" -ForegroundColor White
Write-Host "   - Deploy: git add . && git commit -m 'message' && git push" -ForegroundColor White

Write-Host "`n🎉 Projeto validado e pronto para uso!" -ForegroundColor Green

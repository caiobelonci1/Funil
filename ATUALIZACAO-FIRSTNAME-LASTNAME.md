# Atualização: Campos firstName e lastName - Facebook Messenger CRM

## ✅ Mudanças Implementadas

### 1. **Atualização do Schema Prisma**
- ✅ Adicionado campo `firstName String?` ao modelo User
- ✅ Adicionado campo `lastName String?` ao modelo User  
- ✅ Mantido campo `name String?` existente para compatibilidade
- ✅ Schema sincronizado com banco PostgreSQL usando `npx prisma db push`

### 2. **Nova API para Atualização de Dados do Usuário**
```javascript
PUT /api/contacts/:contactId
Body: { 
  firstName: "João", 
  lastName: "Silva",
  name: "João Silva" 
}
```
- ✅ Permite atualizar firstName, lastName e name individualmente
- ✅ Validação de entrada e tratamento de erros
- ✅ Retorna dados atualizados do contato

### 3. **Integração Automática com Facebook Profile API**
- ✅ Nova função `getUserProfile(userId)` para buscar dados do Facebook
- ✅ Busca automática de `first_name` e `last_name` na API do Facebook
- ✅ Preenchimento automático dos campos quando novo usuário interage
- ✅ Funciona tanto para mensagens normais quanto para cliques em anúncios

### 4. **Webhook Aprimorado**
- ✅ Detecção inteligente de novos usuários
- ✅ Busca automática do perfil no Facebook para novos usuários
- ✅ Criação de usuário com dados completos (firstName, lastName, name)
- ✅ Tratamento aprimorado de eventos de referral (anúncios)

### 5. **Testes Atualizados**
- ✅ Script de teste `test-apis.cjs` atualizado
- ✅ Novos testes para API de atualização de dados do usuário
- ✅ Validação de firstName e lastName nas respostas

## 📋 Schema Atualizado

```prisma
model User {
  id            String    @id @default(cuid())
  messengerId   String    @unique
  name          String?   // Nome completo (mantido para compatibilidade)
  firstName     String?   // Nome do usuário (novo)
  lastName      String?   // Sobrenome do usuário (novo)
  adTitle       String?   // Título do anúncio do Marketplace
  status        Status    @default(INTERESSADO)
  messages      Message[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## 🔄 Fluxo de Criação de Usuário

### Cenário 1: Usuário envia mensagem
1. Webhook recebe mensagem de novo usuário
2. Sistema busca perfil na API do Facebook
3. Cria usuário com firstName, lastName e name preenchidos
4. Salva mensagem no banco

### Cenário 2: Usuário clica em anúncio
1. Webhook recebe evento de referral
2. Sistema busca perfil na API do Facebook  
3. Cria usuário com dados completos + adTitle
4. Log detalhado da origem do lead

## 🔧 APIs Disponíveis

### Contatos
- `GET /api/contacts` - Lista contatos com última mensagem
- `GET /api/contacts/:id` - Histórico de mensagens
- `PUT /api/contacts/:id/status` - Atualiza status  
- `PUT /api/contacts/:id` - **NOVO**: Atualiza dados pessoais

### Mensagens
- `POST /api/send-message` - Envia mensagem

### Webhook
- `GET /webhook` - Verificação Facebook
- `POST /webhook` - Recebe eventos (com busca automática de perfil)

## 🚀 Deploy

- ✅ Todas as mudanças commitadas e enviadas para GitHub
- ✅ Deploy automático no Render ativado
- ✅ Banco de dados PostgreSQL sincronizado
- ✅ Prisma Client regenerado com novos campos

## 🧪 Como Testar

1. **Teste Local**:
```bash
cd server
npm run dev
# Em outro terminal:
node ../test-apis.cjs
```

2. **Teste de Produção**:
```bash
API_URL=https://your-render-url.com node test-apis.cjs
```

3. **Teste Manual via Messenger**:
   - Envie mensagem para sua página Facebook
   - Verifique se firstName/lastName foram preenchidos automaticamente
   - Teste click em anúncio com parâmetro ref

## 💡 Próximos Passos Sugeridos

1. **Interface do Frontend**: Atualizar componentes para mostrar firstName/lastName
2. **Validação**: Adicionar validação de nomes no frontend
3. **Edição**: Permitir edição manual dos nomes na interface
4. **Avatar**: Buscar e salvar profile_pic do Facebook
5. **Sync**: Implementar sincronização periódica de dados do perfil

## ✨ Benefícios da Atualização

- 🎯 **Melhor Personalização**: Nomes separados permitem saudações mais pessoais
- 📊 **Analytics Melhorados**: Dados estruturados para relatórios
- 🔄 **Automação**: Preenchimento automático reduz trabalho manual
- 🎨 **UX Aprimorada**: Interface mais profissional com nomes estruturados
- 📱 **Integração Facebook**: Aproveitamento máximo da API do Facebook

---

**Status**: ✅ **Implementação Concluída e Deploy Realizado**

# 🚀 Instruções de Deploy e Configuração em Produção

Este documento descreve como configurar o seu ambiente de produção após o deploy bem-sucedido em uma plataforma como o Render.

##  URL de Produção

Sua URL de webhook de produção é:
`https://funil.onrender.com/webhook`

## 🔧 Configuração do Webhook no Facebook

Com a sua URL de produção, você deve atualizar a configuração do webhook no painel do seu aplicativo do Facebook.

1.  Acesse o painel de desenvolvedores do Facebook: [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/)
2.  Selecione o seu aplicativo.
3.  No menu lateral, vá para **"Messenger"** > **"Configurações"**.
4.  Na seção **"Webhooks"**, clique em **"Editar URL de retorno de chamada"**.
5.  **URL de Retorno de Chamada**: Cole a sua URL de produção: `https://funil.onrender.com/webhook`
6.  **Token de Verificação**: Insira o mesmo `VERIFY_TOKEN` que você configurou nas variáveis de ambiente do seu servidor no Render.
7.  Clique em **"Verificar e salvar"**.

O Facebook enviará uma requisição de verificação para a sua URL. Se tudo estiver configurado corretamente no seu servidor (rota `GET /webhook`), a verificação será bem-sucedida.

## ✅ Verificação Pós-Configuração

1.  **Assinar a Página**: Na mesma seção de Webhooks, certifique-se de que seu webhook está assinado para os eventos da sua página (como `messages`, `messaging_postbacks`, etc.).
2.  **Enviar uma Mensagem de Teste**: Envie uma mensagem para a sua Página do Facebook.
3.  **Verificar Logs**: Verifique os logs da sua aplicação no Render para confirmar que a mensagem foi recebida e processada pelo seu webhook.

## 🚨 Lembretes Importantes

*   **Variáveis de Ambiente**: Certifique-se de que todas as variáveis de ambiente necessárias (`PAGE_ACCESS_TOKEN`, `VERIFY_TOKEN`, `PORT`, etc.) estão corretamente configuradas no seu serviço de hospedagem (Render).
*   **HTTPS é Obrigatório**: O Facebook exige que a URL do webhook seja HTTPS, o que plataformas como o Render já fornecem por padrão.
*   **Não é mais necessário usar o Ngrok**: Uma vez que você tem uma URL de produção pública e estável, o `ngrok` não é mais necessário para o funcionamento do webhook. O `ngrok` é apenas para o desenvolvimento local.

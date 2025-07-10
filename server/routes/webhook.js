const express = require('express');
const router = express.Router();
const MessengerService = require('../services/MessengerService');

// Webhook verification (GET)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook events (POST)
router.post('/', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    // Process each entry
    body.entry.forEach(async (entry) => {
      // Get the webhook event
      const webhookEvent = entry.messaging[0];
      console.log('📨 Received webhook event:', JSON.stringify(webhookEvent, null, 2));

      // Get the sender PSID
      const senderPsid = webhookEvent.sender.id;

      // Check if this is a message or postback
      if (webhookEvent.message) {
        await MessengerService.handleMessage(senderPsid, webhookEvent.message);
      } else if (webhookEvent.postback) {
        await MessengerService.handlePostback(senderPsid, webhookEvent.postback);
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const messengerRoutes = require('./routes/messenger');
const webhookRoutes = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ verify: verifyRequestSignature }));
app.use(express.urlencoded({ extended: true }));

// Verify Facebook webhook signature
function verifyRequestSignature(req, res, next) {
  const signature = req.get('X-Hub-Signature-256');
  
  if (!signature) {
    console.warn('Missing X-Hub-Signature-256 header');
    return next();
  }

  const elements = signature.split('=');
  const signatureHash = elements[1];
  const expectedHash = crypto
    .createHmac('sha256', process.env.FACEBOOK_APP_SECRET)
    .update(req.body)
    .digest('hex');

  if (signatureHash !== expectedHash) {
    console.error('Invalid signature');
    return res.status(403).send('Invalid signature');
  }

  next();
}

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api/messenger', messengerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Messenger Integration Server running on port ${PORT}`);
  console.log(`📱 Webhook URL: http://localhost:${PORT}/webhook`);
});
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

admin.initializeApp();
const db = admin.firestore();

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
const MERCADO_PAGO_WEBHOOK_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET || '';
const FRONTEND_ALLOWED_ORIGIN = process.env.FRONTEND_ALLOWED_ORIGIN || '';
const TOKEN_VALIDITY_HOURS = Number(process.env.TOKEN_VALIDITY_HOURS || 24);

const mpClient = MERCADO_PAGO_ACCESS_TOKEN
  ? new MercadoPagoConfig({ accessToken: MERCADO_PAGO_ACCESS_TOKEN })
  : null;
const mpPreference = mpClient ? new Preference(mpClient) : null;
const mpPayment = mpClient ? new Payment(mpClient) : null;

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: FRONTEND_ALLOWED_ORIGIN ? [FRONTEND_ALLOWED_ORIGIN] : true,
  })
);

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function nowMs() {
  return Date.now();
}

// Token seguro gerado exclusivamente no backend.
async function generateUniqueToken(prefix = 'EMP') {
  for (let i = 0; i < 5; i += 1) {
    const raw = crypto.randomBytes(9).toString('base64url').toUpperCase();
    const chunkA = raw.slice(0, 6);
    const chunkB = raw.slice(6, 12);
    const token = `${prefix}-${chunkA}-${chunkB}`;
    const ref = db.collection('creation_tokens').doc(token);
    const snap = await ref.get();
    if (!snap.exists) return token;
  }
  throw new Error('Falha ao gerar token único.');
}

function parseSignatureHeader(value) {
  const raw = String(value || '');
  const parts = raw.split(',').map((p) => p.trim());
  const result = {};
  for (const part of parts) {
    const [key, val] = part.split('=');
    if (!key || !val) continue;
    result[key] = val;
  }
  return result;
}

// Validação da assinatura do webhook do Mercado Pago.
// Manifest oficial: id:{data.id};request-id:{x-request-id};ts:{ts};
function validateMercadoPagoWebhook(req) {
  if (!MERCADO_PAGO_WEBHOOK_SECRET) return true;

  const signature = parseSignatureHeader(req.headers['x-signature']);
  const requestId = String(req.headers['x-request-id'] || '');
  const ts = signature.ts || '';
  const v1 = signature.v1 || '';
  const dataId = String(req.body?.data?.id || req.query['data.id'] || '');

  if (!ts || !v1 || !requestId || !dataId) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto
    .createHmac('sha256', MERCADO_PAGO_WEBHOOK_SECRET)
    .update(manifest)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

async function createPaymentIntent(payload) {
  const email = normalizeEmail(payload.email);
  const name = String(payload.name || '').trim() || email.split('@')[0] || 'Operador';
  const amount = Number(payload.amount || 29.9);

  if (!email) {
    throw new Error('E-mail é obrigatório para criar pagamento.');
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Valor de pagamento inválido.');
  }
  if (!mpPreference) {
    throw new Error('Mercado Pago não configurado no backend.');
  }

  const intentId = `pay_${nowMs()}_${crypto.randomBytes(4).toString('hex')}`;
  const intentRef = db.collection('payment_intents').doc(intentId);

  await intentRef.set({
    intentId,
    email,
    buyerName: name,
    amount,
    status: 'pending',
    provider: 'mercado_pago',
    createdAtMs: nowMs(),
    approvedAtMs: null,
    token: null,
    tokenId: null,
    paymentId: null,
  });

  const notificationUrl = APP_BASE_URL ? `${APP_BASE_URL}/webhook` : undefined;
  const backUrls = APP_BASE_URL
    ? {
        success: `${APP_BASE_URL}/payment-return?status=approved`,
        failure: `${APP_BASE_URL}/payment-return?status=failure`,
        pending: `${APP_BASE_URL}/payment-return?status=pending`,
      }
    : undefined;

  const response = await mpPreference.create({
    body: {
      items: [
        {
          id: 'tropa-do-garfo-acesso',
          title: 'Acesso ao Tropa do Garfo',
          quantity: 1,
          unit_price: amount,
          currency_id: 'BRL',
        },
      ],
      payer: {
        email,
        name,
      },
      external_reference: intentId,
      notification_url: notificationUrl,
      auto_return: 'approved',
      back_urls: backUrls,
      metadata: {
        intentId,
        email,
      },
    },
  });

  await intentRef.update({
    preferenceId: response.id || null,
    initPoint: response.init_point || null,
    sandboxInitPoint: response.sandbox_init_point || null,
  });

  return {
    intentId,
    checkoutUrl: response.init_point,
    sandboxCheckoutUrl: response.sandbox_init_point,
  };
}

async function ensureTokenForApprovedPayment(paymentId) {
  if (!mpPayment) {
    throw new Error('Mercado Pago não configurado no backend.');
  }

  const payment = await mpPayment.get({ id: paymentId });
  const paymentData = payment || {};
  const status = String(paymentData.status || '');
  if (status !== 'approved') {
    return { approved: false, status };
  }

  const intentId = String(paymentData.external_reference || '');
  if (!intentId) {
    throw new Error('Pagamento aprovado sem external_reference.');
  }

  const intentRef = db.collection('payment_intents').doc(intentId);
  const intentSnap = await intentRef.get();
  if (!intentSnap.exists) {
    throw new Error('Intent de pagamento não encontrada.');
  }

  const intent = intentSnap.data();
  if (intent.token) {
    return { approved: true, status, token: intent.token, intentId };
  }

  const emailFromIntent = normalizeEmail(intent.email);
  const emailFromPayment = normalizeEmail(paymentData.payer?.email);
  const purchaserEmail = emailFromIntent || emailFromPayment;

  const token = await generateUniqueToken('PAY');
  const expiresAt = nowMs() + TOKEN_VALIDITY_HOURS * 60 * 60 * 1000;

  await db.runTransaction(async (tx) => {
    const freshIntent = await tx.get(intentRef);
    const freshIntentData = freshIntent.data();
    if (freshIntentData?.token) return;

    const tokenRef = db.collection('creation_tokens').doc(token);
    tx.set(tokenRef, {
      token,
      source: 'mercado_pago',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAtMs: nowMs(),
      expiresAt,
      used: false,
      usedAt: null,
      usedByUid: null,
      usedByEmail: null,
      purchaserEmail,
      createdByUid: 'payment-system',
      createdByEmail: purchaserEmail || 'payment-system@internal',
      paymentId: String(paymentId),
      paymentIntentId: intentId,
      paymentStatus: status,
    });

    tx.update(intentRef, {
      status: 'approved',
      approvedAtMs: nowMs(),
      paymentId: String(paymentId),
      paymentStatus: status,
      token,
      tokenId: token,
    });
  });

  return { approved: true, status, token, intentId };
}

async function validateTokenForSignup(token, email) {
  const normalizedToken = String(token || '').trim().toUpperCase();
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedToken) {
    throw new Error('Token não informado.');
  }

  const ref = db.collection('creation_tokens').doc(normalizedToken);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new Error('Token inválido.');
  }

  const data = snap.data();
  if (data.used) {
    throw new Error('Token já utilizado.');
  }
  if (!data.expiresAt || data.expiresAt < nowMs()) {
    throw new Error('Token expirado.');
  }

  if (data.purchaserEmail) {
    const owner = normalizeEmail(data.purchaserEmail);
    if (owner && normalizedEmail && owner !== normalizedEmail) {
      throw new Error('Token pertence a outro e-mail.');
    }
  }

  return {
    valid: true,
    token: normalizedToken,
    expiresAt: data.expiresAt,
    purchaserEmail: data.purchaserEmail || null,
  };
}

async function consumeTokenForSignup(token, userUid, userEmail) {
  const normalizedToken = String(token || '').trim().toUpperCase();
  const normalizedEmail = normalizeEmail(userEmail);
  if (!normalizedToken || !userUid || !normalizedEmail) {
    throw new Error('Dados insuficientes para consumir token.');
  }

  const ref = db.collection('creation_tokens').doc(normalizedToken);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error('Token inválido.');
    const data = snap.data();

    if (data.used) throw new Error('Token já utilizado.');
    if (!data.expiresAt || data.expiresAt < nowMs()) throw new Error('Token expirado.');

    if (data.purchaserEmail) {
      const owner = normalizeEmail(data.purchaserEmail);
      if (owner && owner !== normalizedEmail) {
        throw new Error('Token pertence a outro e-mail.');
      }
    }

    tx.update(ref, {
      used: true,
      usedAt: admin.firestore.FieldValue.serverTimestamp(),
      usedByUid: userUid,
      usedByEmail: normalizedEmail,
    });
  });
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'payments-api' });
});

app.post('/create-payment', async (req, res) => {
  try {
    const result = await createPaymentIntent(req.body || {});
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Falha ao criar pagamento.' });
  }
});

app.post('/webhook', async (req, res) => {
  try {
    if (!validateMercadoPagoWebhook(req)) {
      res.status(401).json({ success: false, error: 'Assinatura de webhook inválida.' });
      return;
    }

    const type = String(req.body?.type || req.query.type || req.body?.topic || '').toLowerCase();
    const paymentId = String(req.body?.data?.id || req.query['data.id'] || '');

    if (type !== 'payment' || !paymentId) {
      res.status(200).json({ success: true, ignored: true });
      return;
    }

    await ensureTokenForApprovedPayment(paymentId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Falha no webhook.' });
  }
});

app.post('/payment-token', async (req, res) => {
  try {
    const paymentId = String(req.body?.paymentId || '').trim();
    const email = normalizeEmail(req.body?.email);
    if (!paymentId || !email) {
      throw new Error('Informe paymentId e email.');
    }

    const result = await ensureTokenForApprovedPayment(paymentId);
    if (!result.approved) {
      throw new Error('Pagamento ainda não aprovado.');
    }

    const tokenRef = db.collection('creation_tokens').doc(result.token);
    const tokenSnap = await tokenRef.get();
    const tokenData = tokenSnap.data();
    const owner = normalizeEmail(tokenData?.purchaserEmail);
    if (owner && owner !== email) {
      throw new Error('Pagamento não corresponde ao e-mail informado.');
    }

    res.status(200).json({
      success: true,
      token: result.token,
      intentId: result.intentId,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Falha ao recuperar token.' });
  }
});

app.post('/validate-token', async (req, res) => {
  try {
    const result = await validateTokenForSignup(req.body?.token, req.body?.email);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Token inválido.' });
  }
});

app.post('/consume-token', async (req, res) => {
  try {
    await consumeTokenForSignup(req.body?.token, req.body?.userUid, req.body?.userEmail);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Falha ao consumir token.' });
  }
});

exports.api = onRequest(
  {
    region: 'southamerica-east1',
    cors: true,
  },
  app
);

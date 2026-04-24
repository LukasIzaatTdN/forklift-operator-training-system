import crypto from 'crypto';
import Stripe from 'stripe';
import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from './firebaseAdmin.js';

const TOKEN_VALIDITY_HOURS = Number(process.env.TOKEN_VALIDITY_HOURS || 24);
const DEFAULT_AMOUNT_BRL = Number(process.env.STRIPE_PRICE_BRL || 29.9);

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function nowMs() {
  return Date.now();
}

function stripeClient() {
  const secretKey = String(process.env.STRIPE_SECRET_KEY || '').trim();
  if (!secretKey) {
    throw new Error('Stripe não configurado. Defina STRIPE_SECRET_KEY.');
  }

  return new Stripe(secretKey);
}

function resolvePublicAppUrl(req) {
  const explicit = String(process.env.PUBLIC_APP_URL || '').trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  if (!host) {
    throw new Error('Não foi possível determinar URL pública da aplicação. Defina PUBLIC_APP_URL.');
  }

  return `${proto}://${host}`;
}

async function generateUniqueToken(prefix = 'PAY') {
  const db = getDb();

  for (let i = 0; i < 5; i += 1) {
    const raw = crypto.randomBytes(9).toString('base64url').toUpperCase();
    const token = `${prefix}-${raw.slice(0, 6)}-${raw.slice(6, 12)}`;
    const ref = db.collection('creation_tokens').doc(token);
    const snap = await ref.get();
    if (!snap.exists) return token;
  }

  throw new Error('Falha ao gerar token único.');
}

export async function createPaymentIntent(payload, req) {
  const db = getDb();
  const stripe = stripeClient();

  const email = normalizeEmail(payload.email);
  const name = String(payload.name || '').trim() || email.split('@')[0] || 'Operador';
  const amount = Number(payload.amount || DEFAULT_AMOUNT_BRL);

  if (!email) {
    throw new Error('E-mail é obrigatório para criar pagamento.');
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Valor de pagamento inválido.');
  }

  const appUrl = resolvePublicAppUrl(req);
  const intentId = `pay_${nowMs()}_${crypto.randomBytes(4).toString('hex')}`;
  const intentRef = db.collection('payment_intents').doc(intentId);

  await intentRef.set({
    intentId,
    email,
    buyerName: name,
    amount,
    status: 'pending',
    provider: 'stripe',
    createdAtMs: nowMs(),
    approvedAtMs: null,
    token: null,
    tokenId: null,
    paymentId: null,
    paymentStatus: null,
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Acesso ao EmpilhaPro',
          },
          unit_amount: Math.round(amount * 100),
        },
      },
    ],
    success_url: `${appUrl}/?status=approved&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/?status=failure`,
    metadata: {
      intentId,
      email,
    },
  });

  await intentRef.update({
    checkoutSessionId: session.id,
    checkoutUrl: session.url || null,
  });

  return {
    intentId,
    checkoutUrl: session.url,
    sessionId: session.id,
  };
}

async function ensureTokenForApprovedSessionId(sessionId) {
  const db = getDb();
  const stripe = stripeClient();

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const paymentStatus = String(session.payment_status || '');
  if (paymentStatus !== 'paid') {
    return { approved: false, status: paymentStatus };
  }

  const intentId = String(session.metadata?.intentId || '');
  if (!intentId) {
    throw new Error('Sessão aprovada sem intentId no metadata.');
  }

  const intentRef = db.collection('payment_intents').doc(intentId);
  const intentSnap = await intentRef.get();
  if (!intentSnap.exists) {
    throw new Error('Intent de pagamento não encontrada.');
  }

  const intent = intentSnap.data() || {};
  if (intent.token) {
    return { approved: true, status: paymentStatus, token: intent.token, intentId };
  }

  const purchaserEmail = normalizeEmail(intent.email || session.customer_details?.email || session.customer_email);
  const token = await generateUniqueToken('PAY');
  const expiresAt = nowMs() + TOKEN_VALIDITY_HOURS * 60 * 60 * 1000;

  await db.runTransaction(async (tx) => {
    const freshIntentSnap = await tx.get(intentRef);
    const freshIntentData = freshIntentSnap.data() || {};

    if (freshIntentData.token) return;

    const tokenRef = db.collection('creation_tokens').doc(token);
    tx.set(tokenRef, {
      token,
      source: 'stripe',
      createdAt: FieldValue.serverTimestamp(),
      createdAtMs: nowMs(),
      expiresAt,
      used: false,
      usedAt: null,
      usedByUid: null,
      usedByEmail: null,
      purchaserEmail: purchaserEmail || null,
      createdByUid: 'payment-system',
      createdByEmail: purchaserEmail || 'payment-system@internal',
      paymentId: session.id,
      paymentIntentId: String(session.payment_intent || ''),
      paymentStatus,
    });

    tx.update(intentRef, {
      status: 'approved',
      approvedAtMs: nowMs(),
      paymentId: session.id,
      paymentStatus,
      token,
      tokenId: token,
    });
  });

  return { approved: true, status: paymentStatus, token, intentId, purchaserEmail };
}

export async function getTokenByPayment(sessionId, email) {
  const normalizedSessionId = String(sessionId || '').trim();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedSessionId) {
    throw new Error('Informe paymentId/session_id.');
  }

  const result = await ensureTokenForApprovedSessionId(normalizedSessionId);
  if (!result.approved) {
    throw new Error('Pagamento ainda não aprovado.');
  }

  if (normalizedEmail && result.purchaserEmail && normalizeEmail(result.purchaserEmail) !== normalizedEmail) {
    throw new Error('Pagamento não corresponde ao e-mail informado.');
  }

  return result;
}

export async function validateTokenForSignup(token, email) {
  const db = getDb();

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

  const data = snap.data() || {};
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

export async function consumeTokenForSignup(token, userUid, userEmail) {
  const db = getDb();

  const normalizedToken = String(token || '').trim().toUpperCase();
  const normalizedEmail = normalizeEmail(userEmail);
  if (!normalizedToken || !userUid || !normalizedEmail) {
    throw new Error('Dados insuficientes para consumir token.');
  }

  const ref = db.collection('creation_tokens').doc(normalizedToken);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error('Token inválido.');
    const data = snap.data() || {};

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
      usedAt: FieldValue.serverTimestamp(),
      usedByUid: userUid,
      usedByEmail: normalizedEmail,
    });
  });
}

async function readRawBody(req) {
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');

  if (req.body && typeof req.body === 'object') {
    return JSON.stringify(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function handleStripeWebhook(req) {
  const stripe = stripeClient();
  const webhookSecret = String(process.env.STRIPE_WEBHOOK_SECRET || '').trim();

  const rawBody = await readRawBody(req);
  const signature = String(req.headers['stripe-signature'] || '');

  let event;
  if (webhookSecret) {
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (error) {
      throw new Error(`Assinatura de webhook inválida: ${error.message}`);
    }
  } else {
    event = JSON.parse(rawBody || '{}');
  }

  const type = String(event.type || '');
  if (type === 'checkout.session.completed' || type === 'checkout.session.async_payment_succeeded') {
    const sessionId = String(event.data?.object?.id || '');
    if (sessionId) {
      await ensureTokenForApprovedSessionId(sessionId);
    }
  }

  return { received: true };
}

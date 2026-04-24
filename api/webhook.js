import { handleStripeWebhook } from './_lib/paymentService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    await handleStripeWebhook(req);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Falha no webhook.' });
  }
}

import { parseJsonBody } from './_lib/http.js';
import { getTokenByPayment } from './_lib/paymentService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const paymentId = String(body?.paymentId || body?.sessionId || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();

    const result = await getTokenByPayment(paymentId, email);
    res.status(200).json({
      success: true,
      token: result.token,
      intentId: result.intentId,
      status: result.status,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Falha ao recuperar token.' });
  }
}

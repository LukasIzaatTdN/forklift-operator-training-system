import { parseJsonBody } from './_lib/http.js';
import { validateTokenForSignup } from './_lib/paymentService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const result = await validateTokenForSignup(body?.token, body?.email);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Token inválido.' });
  }
}

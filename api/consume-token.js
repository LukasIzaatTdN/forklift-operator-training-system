import { parseJsonBody } from './_lib/http.js';
import { consumeTokenForAuthenticatedUser } from './_lib/paymentService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const authorization = String(req.headers.authorization || '');
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    await consumeTokenForAuthenticatedUser(body?.token, match?.[1]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Falha ao consumir token.' });
  }
}

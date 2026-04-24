interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreatePaymentPayload {
  email: string;
  name: string;
  amount?: number;
}

export interface CreatePaymentResponse {
  intentId: string;
  checkoutUrl?: string;
  sessionId?: string;
}

function getApiBaseUrl(): string {
  const raw = String(import.meta.env.VITE_PAYMENT_API_BASE_URL || '').trim();
  return raw || '/api';
}

async function postJson<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  const baseUrl = getApiBaseUrl();
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  try {
    const response = await fetch(`${normalizedBaseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };
    if (!response.ok || data.success === false) {
      return { success: false, error: data.error || 'Falha na requisição.' };
    }

    return { success: true, data: data as T };
  } catch {
    return { success: false, error: 'Falha de rede ao comunicar com backend de pagamentos.' };
  }
}

export async function createCheckoutPayment(
  payload: CreatePaymentPayload
): Promise<ApiResult<CreatePaymentResponse>> {
  return postJson<CreatePaymentResponse>('/create-payment', payload);
}

export async function validateSignupToken(token: string, email: string): Promise<ApiResult<{ valid: boolean }>> {
  return postJson<{ valid: boolean }>('/validate-token', { token, email });
}

export async function consumeSignupToken(
  token: string,
  userUid: string,
  userEmail: string
): Promise<ApiResult<{ success: boolean }>> {
  return postJson<{ success: boolean }>('/consume-token', { token, userUid, userEmail });
}

export async function getTokenByPayment(
  paymentId: string,
  email?: string
): Promise<ApiResult<{ token: string }>> {
  return postJson<{ token: string }>('/payment-token', { paymentId, email: email || '' });
}

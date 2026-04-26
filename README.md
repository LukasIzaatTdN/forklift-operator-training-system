# Tropa do Garfo - Forklift Operator Training System

Sistema web de treinamento para operadores de empilhadeira com trilhas, quiz, progresso e área administrativa.

## Requisitos

- Node.js 20+
- npm 10+
- Projeto Firebase (Authentication + Firestore)
- Conta Stripe (Checkout + Webhook)
- Deploy no Vercel (frontend + `api/*`)

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

2. Preencha no `.env`:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_ADMIN_EMAILS` (lista de e-mails, separados por vírgula)

## Scripts

- `npm run dev` - ambiente local
- `npm run build` - build de produção
- `npm run preview` - preview da build
- `npm run typecheck` - validação TypeScript

## Pagamento + Token de Cadastro (Stripe + Vercel)

### Visão Geral do Fluxo

1. Usuário clica em **Comprar acesso** no frontend.
2. Frontend chama backend `POST /api/create-payment`.
3. Backend cria sessão de checkout no Stripe.
4. Usuário paga no checkout do Stripe.
5. Stripe envia webhook para `POST /api/webhook`.
6. Backend valida evento e consulta sessão no Stripe.
7. Se pagamento confirmado (`paid`), backend gera token seguro.
8. Backend salva token em `creation_tokens` com `used=false`.
9. Frontend captura retorno com `session_id` e busca token via `POST /api/payment-token`.
10. No cadastro, o token é validado/consumido pelo backend:
   - `POST /api/validate-token`
   - `POST /api/consume-token`
11. Com token válido, conta é criada e token é marcado como utilizado.

### Estrutura do Backend

Diretório: `api/`

- `api/create-payment.js`
- `api/webhook.js`
- `api/payment-token.js`
- `api/validate-token.js`
- `api/consume-token.js`
- `api/health.js`
- `api/_lib/firebaseAdmin.js`
- `api/_lib/paymentService.js`

Rotas implementadas:

- `POST /api/create-payment`
- `POST /api/webhook`
- `POST /api/payment-token`
- `POST /api/validate-token`
- `POST /api/consume-token`
- `GET /api/health`

### Estrutura do Banco (Firestore)

Coleção: `creation_tokens/{token}`

- `token: string`
- `source: "stripe" | ...`
- `createdAt: serverTimestamp`
- `createdAtMs: number`
- `expiresAt: number`
- `used: boolean`
- `usedAt: serverTimestamp | null`
- `usedByUid: string | null`
- `usedByEmail: string | null`
- `purchaserEmail: string | null`
- `paymentId: string | null`
- `paymentIntentId: string | null`
- `paymentStatus: string | null`

Coleção: `payment_intents/{intentId}`

- `intentId: string`
- `email: string`
- `buyerName: string`
- `amount: number`
- `status: "pending" | "approved"`
- `provider: "stripe"`
- `createdAtMs: number`
- `approvedAtMs: number | null`
- `paymentId: string | null`
- `paymentStatus: string | null`
- `token: string | null`
- `tokenId: string | null`

### Frontend Integrado

Arquivos principais:

- `src/lib/paymentApi.ts`
- `src/components/LoginPage.tsx`
- `src/context/AuthContext.tsx`

Funcionalidades:

- Botão **Comprar acesso**
- Redirecionamento para checkout Stripe
- Leitura de retorno de pagamento
- Campo de token no cadastro
- Validação/consumo de token via backend

### Variáveis de Ambiente

Frontend (`.env`):

- `VITE_PAYMENT_API_BASE_URL` (opcional, padrão `/api`)

Backend (Vercel Environment Variables):

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (obrigatório em produção)
- `STRIPE_PRICE_BRL` (opcional, padrão `29.9`)
- `PUBLIC_APP_URL` (opcional; se ausente, usa host da requisição)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `TOKEN_VALIDITY_HOURS`



### Segurança Implementada

- Token gerado apenas no backend com `crypto.randomBytes`.
- Validação e consumo de token no backend.
- Transação no Firestore para bloquear reutilização.
- Expiração de token.
- Associação opcional token ↔ e-mail comprador.
- Webhook Stripe com validação de assinatura (exigido em produção).
- Frontend não decide aprovação de pagamento/token.

## Fluxo de usuários no Firebase

- Usuário criado no Firebase Auth faz login.
- No primeiro login, o app cria o documento em `users/{uid}` no Firestore.
- Se houver bloqueio para criar como `admin`, o app faz fallback para `operator` para não impedir acesso.
- Permissão administrativa efetiva depende do campo `role` no documento `users/{uid}` e das regras do Firestore.

## Primeira conta admin (bootstrap)

Se você precisa liberar admin imediatamente:

1. Faça login com o usuário.
2. No Firestore, edite `users/{uid}` desse usuário e defina:
- `role: "admin"`
- `deleted: false`

Depois disso o usuário terá acesso administrativo conforme as regras.

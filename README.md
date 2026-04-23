# EmpilhaPro - Forklift Operator Training System

Sistema web de treinamento para operadores de empilhadeira com trilhas, quiz, progresso e área administrativa.

## Requisitos

- Node.js 20+
- npm 10+
- Projeto Firebase (Authentication + Firestore)

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

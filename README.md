# Project-One Auth Skeleton

Minimal React + Vite app with Firebase auth wiring and protected-route skeleton.

## Included structure

- `src/contexts/AuthContext.ts`
- `src/contexts/AuthProvider.tsx`
- `src/hooks/useAuth.ts`
- `src/firebase/firebase.config.ts`
- `src/layout/Root.tsx`
- `src/routes/MainRouter.tsx`
- `src/routes/PrivateRoute.tsx`
- `src/pages/Home.tsx`
- `src/pages/Login.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/ErrorPage.tsx`

## Environment

Create `.env` in project root:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

App still runs without these values, but auth actions will be disabled.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

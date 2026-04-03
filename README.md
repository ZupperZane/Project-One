# Globo Life

A shared calendar, chat, and task management app built for two people: **Olivia** (85, primary user) and **Emma** (her granddaughter). Olivia lives independently in Thousand Oaks, CA; Emma lives in Sarasota, FL. The app gives them a simple, colorful shared space to stay connected and organized — without the complexity of tools like Google Calendar.

## Features

- **Chat** — Persistent messaging between Olivia and Emma. Messages are saved in Firestore so neither user misses anything when offline.
- **Shared Calendar** — View and manage calendar events. Emma can manage Olivia's events on her behalf using the account toggle.
- **To-Do List** — Day-based task list with done/undo/delete, linked to calendar events.
- **Saved Sites** — A personal bookmark grid (NYT, WWD, etc.) so Olivia doesn't need to remember URLs.
- **Weather** — Live weather for both Sarasota, FL and Thousand Oaks, CA shown on the home screen.
- **Role system** — Olivia sees a clean, simple UI. Emma sees the same UI plus a toggle to switch into Olivia's account and manage her data on her behalf.

## Architecture

```
src/
├── main.tsx                      # Entry point — AuthProvider > ActiveProfileProvider
├── App.tsx                       # Mounts the router
├── routes/
│   ├── MainRouter.tsx            # Route definitions
│   └── PrivateRoute.tsx          # Auth guard for protected routes
├── layout/
│   └── Root.tsx                  # Shell: nav, header, Emma's account-toggle banner
├── pages/
│   ├── Landing.tsx               # Public landing page
│   ├── Login.tsx                 # Email/password + Google sign-in
│   ├── Signup.tsx                # Account creation
│   ├── ResetPassword.tsx         # Password reset flow
│   ├── Dashboard.tsx             # Account details
│   ├── Home.tsx                  # Main menu: weather, recent events, quick links
│   ├── Chat.tsx                  # Messaging between Olivia and Emma
│   ├── Tasks.tsx                 # Day-based to-do list + calendar events + PDF export
│   ├── Calendar.tsx              # 7-day week grid with events and tasks
│   ├── SavedSites.tsx            # Shared website bookmarks
│   └── ErrorPage.tsx             # 404 / route error fallback
├── Components/
│   └── Weather.tsx               # Live weather for Sarasota and Thousand Oaks
├── contexts/
│   ├── AuthContext.ts            # Firebase auth state shape
│   ├── AuthProvider.tsx          # Provides auth state + sign-in/out methods
│   ├── ActiveProfileContext.ts   # Tracks whose data is active (own vs. linked)
│   └── ActiveProfileProvider.tsx
├── hooks/
│   ├── useAuth.ts                # Consumes AuthContext
│   ├── useActiveProfile.ts       # activeUserId, isViewingLinked, toggle, canToggle
│   ├── useUserProfile.ts         # Fetches and caches own Firestore profile
│   └── useWeather.ts             # OpenWeather API fetch
├── firebase/
│   └── firebase.config.ts        # Firebase app initialization
├── backend/
│   ├── storage.ts                # Firestore types, collection names, shared utilities
│   ├── userHandler.ts            # Signup, Login, EnsureUser, ConnectUsers, ListUsers
│   ├── chatHandler.ts            # SendMessage, DisplayMessages, DeleteMessage
│   ├── eventHandler.ts           # CreateEvent, DisplayCalender, ShareEvent, DeleteEvent
│   ├── todoHandler.ts            # addToList, DisplayList, ShareTask, deleteFromList
│   ├── savedSitesHandler.ts      # addSavedSite, DisplaySavedSites, deleteSavedSite
│   └── services.ts               # Re-exports all backend functions
└── utils/
    └── constants.ts              # ROUTES, ROLES, COLLECTIONS
```

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + DaisyUI
- Firebase Authentication (email/password + Google OAuth)
- Firestore database
- Netlify hosting with CI/CD from GitHub

## Roles

- `primary` — Olivia. Clean UI, no management controls.
- `supportive` — Emma. Full UI plus a toggle to act on Olivia's behalf.

Role and account linking are configured on first login via an in-app setup prompt.

## Environment

https://globochat.netlify.app/login

Create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_WEATHER_API_KEY=...
```

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Team

- Zane — Product Manager
- Jason — Software Architect
- Brandon — Frontend Developer
- Chris — Backend Developer
- Yasir — Backend Developer

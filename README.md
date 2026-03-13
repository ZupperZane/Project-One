# MovieMango (Firebase Auth + Protected Routes)

https://moviemangos.netlify.app/

MovieMango is a React + Vite movie dashboard where users can browse films, filter/sort lists, manage wishlist/watched states, and export wishlist data to PDF.

This project now includes Firebase Authentication, route protection, guest/auth-aware UI, a creative landing page, and error pages.

## Stack

- React 19
- Vite
- React Router
- Firebase Authentication
- Tailwind CSS + DaisyUI
- React Toastify
- jsPDF

## Requirements

- UI/UX guest vs authenticated:
  - Header badge shows `Guest` or `Authenticated`.
  - Guests see Login/Signup links.
  - Authenticated users see Dashboard/Logout links.
- Navigation links between pages:
  - Shared top navigation includes Home, Login/Signup or Dashboard/Logout.
  - Back button is included in shared navigation and auth forms.
- Home/Landing page:
  - Creative hero section with CTA and feature cards.
- Error pages:
  - Router `errorElement` renders a custom error page for invalid routes and route failures.
- Authentication:
  - Login, Signup, Logout implemented.
- Two signup methods:
  - Username + password signup.
  - Google social signup.
- Validation:
  - Username: 3-20 characters, letters/numbers/underscore (`^[a-zA-Z0-9_]{3,20}$`).
  - Password: minimum 8 chars with uppercase, lowercase, and number.
- MainRoute + PrivateRoute:
  - Central route config in `src/routes/mainRoutes.jsx`.
  - `PrivateRoute` protects `/dashboard` and redirects unauthenticated users to `/login`.

## Project Routes

- `/` Public landing page
- `/login` Public login page
- `/signup` Public signup page
- `/dashboard` Private dashboard (movie app)
- Invalid routes are handled by the router error page

## Firebase Setup

1. Create a Firebase project and Web App.
2. Enable Authentication providers:
   - Email/Password
   - Google
3. Create a local `.env` file in project root:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

4. Start the app:

```bash
npm install
npm run dev
```

## Auth Notes

- Signup updates Firebase `displayName` from the username field.
- Login and social auth redirect to the originally requested private route (or dashboard).
- Logout is available in the shared top navigation.

## Scripts

- `npm run dev` Start dev server
- `npm run build` Production build
- `npm run preview` Preview production build
- `npm run lint` Run ESLint

Built by Jason Gentile & Christopher Ritter
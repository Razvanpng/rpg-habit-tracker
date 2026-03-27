# RPG Habit Tracker

A full-stack habit tracker that applies RPG mechanics to daily routines. Built to solve the problem of habit inconsistency by tying real-world tasks to virtual XP and level progression. 

The architecture strictly separates a Next.js frontend from a Node/Express API, using PostgreSQL as the single source of truth.

## Live URLs
- **Client (Vercel):** https://rpg-habit-tracker-seven.vercel.app
- **API Health Check (Render):** https://rpg-habit-tracker.onrender.com/health

## Architecture & Tech Stack

**Frontend:**
- **Core:** Next.js (React)
- **State:** Zustand. Configured with `localStorage` persistence and hydration checks to maintain session state across reloads.
- **Styling:** Tailwind CSS + Framer Motion.
- **Network:** Axios, explicitly configured with `withCredentials: true` to handle secure cross-origin sessions.

**Backend:**
- **Core:** Node.js / Express.
- **Database:** PostgreSQL (Supabase), managed via Prisma ORM.
- **Auth:** JWT + bcryptjs. Sessions rely on `httpOnly`, `Secure`, and `SameSite=None` cookies to support the cross-domain infrastructure (Vercel hitting Render).
- **Validation:** Zod is used at the controller level to strictly validate and sanitize incoming payloads before they hit the database layer.

## Local Environment Setup

Requires Node.js and a running PostgreSQL instance.

### 1. Clone & Install
git clone https://github.com/Razvanpng/rpg-habit-tracker.git
cd rpg-habit-tracker

### 2. Bootstrapping the API
cd backend
npm install

Create a `backend/.env` file:
NODE_ENV="development"
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/rpgdb"
JWT_SECRET="generate_a_random_32_char_string"
JWT_EXPIRES_IN="7d"
COOKIE_SECRET="generate_another_32_char_string"
ALLOWED_ORIGINS="http://localhost:3000,https://rpg-habit-tracker-seven.vercel.app"

Push the schema and start the server:
npx prisma generate
npx prisma db push
npm run dev

### 3. Bootstrapping the Client
Open a separate terminal instance:
cd frontend
npm install

Create a `frontend/.env.local` file:
NEXT_PUBLIC_API_URL="http://localhost:4000/api"

Start the development server:
npm run dev

## Security & Edge Cases Handled
- **CORS Configuration:** Strictly whitelisted to the frontend URL to reject unauthorized API requests.
- **Cross-Site Tracking Workarounds:** The client forces a session background fetch (`fetchMe`) upon Zustand rehydration. This bypasses aggressive mobile browser cookie blocking (e.g., Safari iOS) by ensuring the app knows the user is authenticated even if third-party cookies face strict domain policies.
- **Rate Limiting & Headers:** Implemented Express Rate Limit to prevent brute force attacks, alongside Helmet for secure HTTP headers.

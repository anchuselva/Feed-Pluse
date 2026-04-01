
# Build FeedPulse Web App

FeedPulse is a full-stack feedback collection and admin dashboard app. Users can submit bug reports, feature requests, and general product feedback through the public site. Admins can log in to review feedback, update status, and see AI-powered analysis and sentiment insights.

## Features

- Public feedback form with category, title, description, and email capture
- Secure admin login for feedback review and dashboard access
- Admin dashboard with pagination, sorting, search, and feedback status updates
- Gemini AI analysis for sentiment, priority, and technical category suggestions
- MongoDB backend with Express, JWT auth, and rate-limited feedback submissions
- Full frontend built with Vite, React, Tailwind, Radix UI, Recharts, and Sonner notifications

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Radix UI, Recharts, Sonner
- Backend: Node.js, Express, Mongoose, JSON Web Tokens
- AI: Google Gemini API integration for feedback analysis
- Database: MongoDB

## Getting started

1. Clone the repo:

   ```bash
   git clone <repo-url>
   cd "Build FeedPulse Web App"
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file from the example:

   ```bash
   copy .env.example .env
   ```

4. Update environment variables in `.env`:

   - `MONGODB_URI` — MongoDB connection string
   - `GEMINI_API_KEY` — Gemini API key for AI analysis
   - `GEMINI_MODEL` — Gemini model name (default: `gemini-1.5-flash`)
   - `JWT_SECRET` — secret used to sign admin tokens
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin login credentials
   - `PORT` — backend server port (default: `4000`)

5. Start the backend server:

   ```bash
   npm run serve:backend
   ```

6. Start the frontend development server:

   ```bash
   npm run dev
   ```

7. Open the app in your browser:

   ```text
   http://localhost:5173
   ```

## Backend API

- `GET /api/health` — health check endpoint
- `POST /api/auth/login` — admin login, returns JWT
- `POST /api/feedback` — submit feedback publicly
- `GET /api/feedback` — fetch paginated feedback list (admin only)
- `GET /api/feedback/weekly-summary` — dashboard stats
- `PATCH /api/feedback/:id/status` — update feedback status (admin only)
- `POST /api/feedback/:id/reanalyze` — re-run Gemini analysis for existing feedback (admin only)

## Admin login

Use the credentials from your `.env` file to sign in. The admin login screen is accessible from the public site.

Default credentials in `.env.example`:

- `ADMIN_EMAIL=admin@feedpulse.com`
- `ADMIN_PASSWORD=admin123`

## Notes

- The frontend uses `VITE_API_BASE_URL` if provided in the environment; otherwise it calls the backend on the same host.
- The backend requires MongoDB to be available at `MONGODB_URI`.
- Gemini analysis is optional but recommended for AI feedback insights.

## Screenshots

> Add screenshots after running the app. Example placeholders:
>
> - `screenshots/frontend-feedback-form.png`
> - `screenshots/admin-dashboard.png`
>
> Replace these placeholders with actual images if you want to document the UI.
  
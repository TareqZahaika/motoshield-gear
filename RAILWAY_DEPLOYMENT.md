# Railway Deployment

Project: `MotoShield Gear`

Services:
- `FRONTEND`: start command `npm run frontend`
- `BACKEND`: start command `npm run backend`

Environments:
- `STAGING`: connected to GitHub branch `dev`
- `PRODUCTION`: connected to GitHub branch `main`

The frontend is a static HTML/CSS/JavaScript site served by `frontend-server.js`.
The backend is a small Node HTTP service in `backend/server.js` with `/health` and `/api/store-info`.

Environment variables:
- Copy `.env.example` for local development.
- In Railway, add real values under each environment/service variables.
- Keep `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `AI_API_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` only on the backend service.

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

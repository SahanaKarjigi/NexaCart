# NexaCheckout

OTP-based user recognition and checkout application built for the assignment.

## Architecture

- **Frontend:** React + Vite
- **API:** Node.js + Express
- **Database:** MongoDB + Mongoose

```text
React Frontend → Express API → MongoDB
```

## Features

1. Registration with first name, last name, and email.
2. Random 6-digit login code generated after registration and displayed to the user as required by the assignment.
3. Real-time email validation and background user recognition during checkout.
4. OTP login modal with incorrect-code handling and a skip-login option.
5. Logged-in user's name displayed during checkout.
6. Checkout data persisted to MongoDB; no real payment processing.

## Local setup

### Backend

```bash
cd backend
npm install
copy .env.example .env
# Edit .env and set MONGODB_URI
npm start
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

Never commit `.env`. Use the supplied `.env.example` files.

### Backend
- `MONGODB_URI` – MongoDB Atlas connection string
- `PORT` – API port
- `FRONTEND_URL` – frontend origin(s), comma-separated for multiple origins

### Frontend
- `VITE_API_URL` – public/local API base URL

## Deployment

Deployment configuration is included for a typical free-tier setup:

- `vercel.json` for the Vite frontend
- `render.yaml` for the Express API

See `DEPLOYMENT.md` for the required environment variables and final public URL steps.

## Assignment artifacts

- `database/schema.sql` – required SQL schema artifact
- `database/README.md` – explains the MongoDB runtime schema
- `prompts.md` – LLM prompt log available from the project history

# ClaraDesk

> Every customer message, handled with intelligence.

ClaraDesk is an AI-powered business communication assistant for small and medium
businesses. Six modules share one React frontend, one FastAPI backend, and one
Anthropic Claude connection.

- **Live URL:** https://claradesk.vercel.app
- **GitHub:** https://github.com/PratibhaRepos1/claradesk

## Modules

| Module          | Route        | Feature                                 | Status         |
| --------------- | ------------ | --------------------------------------- | -------------- |
| Clara Inbox     | `/inbox`     | Contact form classifier + Slack router  | ✅ Built       |
| Clara Leads     | `/leads`     | New lead follow-up email writer         | Week 2         |
| Clara Welcome   | `/welcome`   | New customer onboarding message         | Week 3         |
| Clara Billing   | `/billing`   | Overdue invoice nudger                  | Week 4         |
| Clara Bookings  | `/bookings`  | Cancelled booking win-back drafter      | Week 5         |
| Clara Reviews   | `/reviews`   | Negative review response drafter        | Week 6         |

Clara Inbox is ported from
[contact-form-router](https://github.com/PratibhaRepos1/contact-form-router) and
kept compatible with the original API contract.

## Tech stack

- **Frontend** — React 18 + Vite + Tailwind CSS + React Router v6
- **Backend** — Python 3.11 + FastAPI + Uvicorn
- **AI** — Anthropic Claude (`claude-sonnet-4-20250514`)
- **Notifications** — Slack incoming webhooks
- **Hosting** — Vercel (frontend) + Railway/Render (backend)

## Project layout

```
claradesk/
├── backend/                     # FastAPI app
│   ├── main.py                  # App factory + CORS + router registration
│   ├── routers/                 # One file per module — inbox.py is implemented
│   ├── services/                # Shared Claude + Slack clients
│   ├── models/                  # Pydantic request/response models per module
│   └── requirements.txt
├── frontend/                    # Vite + React + Tailwind
│   ├── src/
│   │   ├── App.jsx              # React Router with all 6 routes
│   │   ├── components/          # Layout, Sidebar, ResultPanel, SlackBadge
│   │   └── modules/             # One folder per module
│   └── package.json
├── .github/workflows/deploy.yml # CI: backend import smoke test + frontend build
└── CLAUDE.md                    # Full spec — read this first
```

## Running locally

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env            # then fill in your keys
uvicorn main:app --reload --port 8000
```

The API is now at `http://localhost:8000` and Swagger docs are at
`http://localhost:8000/docs`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173
```

Vite proxies `/api/*` to `http://localhost:8000`, so the frontend works against
the local backend with no extra config.

## Mock mode (no API key required)

Set `MOCK_CLASSIFIER=1` in `backend/.env` to skip the Anthropic API and use a
keyword-based classifier instead. Useful for offline demos or when API credits
are unavailable.

## Slack webhooks are optional

If a Slack webhook env var is missing, the API still returns the AI result and
just sets `slack_posted: false`. Drop the webhooks in when you're ready.

## Deployment

- **Frontend** → Vercel, root directory `frontend/`, auto-deploys on push to
  `main`. Live at `claradesk.vercel.app`.
- **Backend** → Railway or Render, root directory `backend/`. Add every key
  from `.env.example` as an environment variable in the dashboard. Update
  `CORS_ORIGINS` if your frontend URL changes.

## Build order

One module per week. Add a new router in `backend/routers/`, replace the stub
page in `frontend/src/modules/<module>/`, and ship.

See `CLAUDE.md` for the full specification of every module.

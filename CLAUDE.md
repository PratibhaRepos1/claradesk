# ClaraDesk — Claude Code Context

## Project Vision

ClaraDesk is an AI-powered business communication assistant that helps small and
medium businesses handle every customer-facing message with intelligence and speed.
Clara handles enquiries, leads, onboarding, invoices, bookings, and reviews — so
teams can focus on what matters.

**Tagline:** "Every customer message, handled with intelligence."

**Live URL:** https://claradesk.vercel.app
**GitHub:** https://github.com/PratibhaRepos1/claradesk
**Portfolio:** https://pratibharepos1.github.io/crafted-by-pratibha/

---

## The 6 Modules

| Module | Route | Feature | Status |
|--------|-------|---------|--------|
| Clara Inbox | /inbox | Contact form classifier + Slack router | Build first |
| Clara Leads | /leads | New lead follow-up email writer | Build second |
| Clara Welcome | /welcome | New customer onboarding message | Build third |
| Clara Billing | /billing | Overdue invoice nudger | Build fourth |
| Clara Bookings | /bookings | Cancelled booking win-back drafter | Build fifth |
| Clara Reviews | /reviews | Negative review response drafter | Build sixth |

All 6 modules share:
- One React frontend (Vite + React 18 + Tailwind CSS)
- One Python FastAPI backend
- One Anthropic Claude API connection
- One set of Slack webhooks
- One Vercel deployment (frontend)
- One Railway or Render deployment (backend)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + React Router v6 |
| Backend | Python 3.11+ · FastAPI · Uvicorn |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| HTTP client | Axios (frontend) · requests (backend) |
| Routing | React Router v6 — one page per module |
| Env vars | python-dotenv |
| Deployment (FE) | Vercel — auto deploy from GitHub main branch |
| Deployment (BE) | Railway or Render — free tier |
| CI/CD | GitHub Actions |
| Version control | GitHub — github.com/PratibhaRepos1/claradesk |

---

## Folder Structure

```
claradesk/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                   # Router setup — all 6 routes
│   │   ├── main.jsx                  # Entry point
│   │   ├── index.css                 # Tailwind imports
│   │   ├── components/
│   │   │   ├── Layout.jsx            # Shared sidebar + header
│   │   │   ├── Sidebar.jsx           # Navigation between modules
│   │   │   ├── ResultPanel.jsx       # Shared AI result display
│   │   │   └── SlackBadge.jsx        # Slack posted indicator
│   │   └── modules/
│   │       ├── inbox/
│   │       │   ├── InboxPage.jsx     # Clara Inbox — contact form router
│   │       │   └── InboxForm.jsx
│   │       ├── leads/
│   │       │   ├── LeadsPage.jsx     # Clara Leads — lead follow-up writer
│   │       │   └── LeadsForm.jsx
│   │       ├── welcome/
│   │       │   ├── WelcomePage.jsx   # Clara Welcome — onboarding message
│   │       │   └── WelcomeForm.jsx
│   │       ├── billing/
│   │       │   ├── BillingPage.jsx   # Clara Billing — invoice nudger
│   │       │   └── BillingForm.jsx
│   │       ├── bookings/
│   │       │   ├── BookingsPage.jsx  # Clara Bookings — win-back drafter
│   │       │   └── BookingsForm.jsx
│   │       └── reviews/
│   │           ├── ReviewsPage.jsx   # Clara Reviews — review responder
│   │           └── ReviewsForm.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                # Proxy /api → localhost:8000
├── backend/
│   ├── main.py                       # FastAPI app + CORS + all routes
│   ├── routers/
│   │   ├── inbox.py                  # POST /api/inbox/classify
│   │   ├── leads.py                  # POST /api/leads/draft
│   │   ├── welcome.py                # POST /api/welcome/draft
│   │   ├── billing.py                # POST /api/billing/nudge
│   │   ├── bookings.py               # POST /api/bookings/winback
│   │   └── reviews.py                # POST /api/reviews/draft
│   ├── services/
│   │   ├── claude.py                 # Shared Anthropic client + call wrapper
│   │   └── slack.py                  # Shared Slack webhook sender
│   ├── models/
│   │   ├── inbox.py                  # Pydantic models for inbox
│   │   ├── leads.py                  # Pydantic models for leads
│   │   ├── welcome.py                # Pydantic models for welcome
│   │   ├── billing.py                # Pydantic models for billing
│   │   ├── bookings.py               # Pydantic models for bookings
│   │   └── reviews.py                # Pydantic models for reviews
│   ├── requirements.txt
│   └── .env                          # All API keys — never commit
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions CI/CD
├── CLAUDE.md                         # This file
└── README.md
```

---

## Environment Variables

File: `backend/.env`

```
# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx

# Slack — Clara Inbox (contact form router)
SLACK_SALES_WEBHOOK=https://hooks.slack.com/services/xxx
SLACK_SUPPORT_WEBHOOK=https://hooks.slack.com/services/xxx
SLACK_PARTNERSHIP_WEBHOOK=https://hooks.slack.com/services/xxx
SLACK_SPAM_WEBHOOK=https://hooks.slack.com/services/xxx

# Slack — Clara Leads
SLACK_LEADS_WEBHOOK=https://hooks.slack.com/services/xxx

# Slack — Clara Welcome
SLACK_ONBOARDING_WEBHOOK=https://hooks.slack.com/services/xxx

# Slack — Clara Billing
SLACK_BILLING_WEBHOOK=https://hooks.slack.com/services/xxx

# Slack — Clara Bookings
SLACK_BOOKINGS_WEBHOOK=https://hooks.slack.com/services/xxx

# Slack — Clara Reviews
SLACK_REVIEWS_WEBHOOK=https://hooks.slack.com/services/xxx
```

**Rules:**
- Never hardcode any key in any Python file
- Always load with load_dotenv() at the top of every file that needs keys
- .env is in .gitignore — never commit it
- On Railway/Render — add all keys as environment variables in the dashboard

---

## Backend Architecture

### main.py — app setup with all routers

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import inbox, leads, welcome, billing, bookings, reviews
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ClaraDesk API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",       # Vite dev server
        "https://claradesk.vercel.app" # Production frontend
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

# Register all module routers
app.include_router(inbox.router,    prefix="/api/inbox")
app.include_router(leads.router,    prefix="/api/leads")
app.include_router(welcome.router,  prefix="/api/welcome")
app.include_router(billing.router,  prefix="/api/billing")
app.include_router(bookings.router, prefix="/api/bookings")
app.include_router(reviews.router,  prefix="/api/reviews")

@app.get("/")
def health_check():
    return {"status": "ClaraDesk API running", "modules": 6}
```

### services/claude.py — shared Claude client

```python
import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def call_claude(system_prompt: str, user_message: str, max_tokens: int = 512) -> dict:
    """
    Shared Claude API caller used by all 6 modules.
    Always returns a parsed dict — Claude must respond with JSON only.
    """
    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )
        return json.loads(response.content[0].text)
    except json.JSONDecodeError:
        return {"error": "Claude response was not valid JSON", "raw": response.content[0].text}
    except Exception as e:
        return {"error": str(e)}
```

### services/slack.py — shared Slack sender

```python
import requests
import os
from dotenv import load_dotenv

load_dotenv()

def post_to_slack(webhook_env_key: str, title: str, fields: dict, context: str = "") -> bool:
    """
    Shared Slack poster used by all 6 modules.
    webhook_env_key: the .env key name e.g. "SLACK_LEADS_WEBHOOK"
    fields: dict of label -> value to display in Slack message
    """
    webhook_url = os.getenv(webhook_env_key)
    if not webhook_url:
        return False

    field_blocks = [
        {"type": "mrkdwn", "text": f"*{k}:*\n{v}"}
        for k, v in fields.items()
    ]

    payload = {
        "blocks": [
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": f"*{title}*"}
            },
            {
                "type": "section",
                "fields": field_blocks
            }
        ]
    }

    if context:
        payload["blocks"].append({
            "type": "context",
            "elements": [{"type": "mrkdwn", "text": context}]
        })

    try:
        response = requests.post(webhook_url, json=payload, timeout=5)
        return response.status_code == 200
    except requests.exceptions.RequestException:
        return False
```

---

## Module Specs — Build One at a Time

### Module 1 — Clara Inbox (/api/inbox/classify)

**Trigger:** Contact form submitted
**Input:** name, email, message
**Claude does:** Classifies intent → sales / support / partnership / spam
**Output:** category, confidence, reasoning, routed Slack channel

```python
# System prompt
SYSTEM_PROMPT = """You are a contact form classifier for a business.
Classify the message into exactly ONE category:
- sales: pricing, demo requests, buying interest
- support: problems, bugs, help needed
- partnership: collaboration, B2B, affiliate
- spam: irrelevant, promotional, bot

Respond ONLY with JSON:
{"category": "sales|support|partnership|spam", "confidence": "high|medium|low", "reasoning": "one sentence"}"""
```

**Slack:** Routes to #sales, #support, #partnerships, or #spam-archive

---

### Module 2 — Clara Leads (/api/leads/draft)

**Trigger:** New lead form submitted
**Input:** name, email, inquiry_details, company (optional)
**Claude does:** Reads inquiry → identifies need → writes personalised follow-up email
**Output:** subject, email_body (under 150 words), tone

```python
SYSTEM_PROMPT = """You are a sales assistant that writes personalised follow-up emails.
Read the lead inquiry and write a warm, professional follow-up email.
Keep it under 150 words. Use the person's name. Address their specific need.

Respond ONLY with JSON:
{"subject": "email subject line", "email_body": "full email text", "tone": "friendly|professional|urgent"}"""
```

**Slack:** Posts draft to #sales-leads

---

### Module 3 — Clara Welcome (/api/welcome/draft)

**Trigger:** New subscription / signup
**Input:** customer_name, email, product_plan, company (optional)
**Claude does:** Personalises welcome based on plan → writes onboarding email + next steps
**Output:** subject, email_body (under 200 words), checklist items (list)

```python
SYSTEM_PROMPT = """You are an onboarding specialist that writes personalised welcome emails.
Match the welcome message and next steps to the specific product plan.
Keep email under 200 words. Include 3-5 actionable next steps as a checklist.

Respond ONLY with JSON:
{"subject": "subject line", "email_body": "welcome email", "checklist": ["step 1", "step 2", "step 3"]}"""
```

**Slack:** Posts to #onboarding

---

### Module 4 — Clara Billing (/api/billing/nudge)

**Trigger:** Invoice flagged overdue
**Input:** invoice_number, amount, days_overdue, customer_name, customer_email
**Claude does:** Calibrates tone by days overdue → drafts payment reminder
**Output:** subject, email_body (under 100 words), tone (friendly/direct/firm)

**Tone rules:**
- 1–7 days overdue → friendly
- 8–21 days overdue → direct
- 22+ days overdue → firm

```python
SYSTEM_PROMPT = """You are a billing assistant that writes payment reminder emails.
Calibrate the tone based on days overdue:
- 1-7 days: friendly reminder
- 8-21 days: direct and clear
- 22+ days: firm and urgent

Keep under 100 words. Always include the invoice number and amount.

Respond ONLY with JSON:
{"subject": "subject line", "email_body": "reminder email", "tone": "friendly|direct|firm"}"""
```

**Slack:** Posts to #billing with invoice link

---

### Module 5 — Clara Bookings (/api/bookings/winback)

**Trigger:** Appointment / booking cancelled
**Input:** customer_name, service_type, cancellation_reason, original_date, booking_history
**Claude does:** Reads reason → checks history → drafts win-back with reschedule offer
**Output:** message_body (under 120 words), suggested_times (list), tone

```python
SYSTEM_PROMPT = """You are a customer retention assistant for a booking business.
Read the cancellation reason and booking history.
Write a warm win-back message that offers to reschedule.
Suggest 2-3 alternative time slots generically (e.g. "early next week", "this Friday afternoon").

Respond ONLY with JSON:
{"message_body": "win-back message", "suggested_times": ["time 1", "time 2", "time 3"], "tone": "warm|professional"}"""
```

**Slack:** Posts to #bookings

---

### Module 6 — Clara Reviews (/api/reviews/draft)

**Trigger:** Negative review detected (1-2 stars)
**Input:** reviewer_name, rating, review_text, platform (google/yelp/tripadvisor)
**Claude does:** Analyses review → identifies complaints → drafts public response + internal flag
**Output:** public_response (under 100 words), internal_note, root_issues (list)

```python
SYSTEM_PROMPT = """You are a reputation management assistant.
Analyse the negative review, identify core complaints, and:
1. Write a professional, empathetic public response (under 100 words)
2. Write an internal note flagging root issues for the team

Respond ONLY with JSON:
{"public_response": "response to post publicly", "internal_note": "note for team", "root_issues": ["issue 1", "issue 2"]}"""
```

**Slack:** Posts public_response draft + internal_note to #reviews

---

## Frontend Architecture

### App.jsx — React Router setup

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import InboxPage from './modules/inbox/InboxPage'
import LeadsPage from './modules/leads/LeadsPage'
import WelcomePage from './modules/welcome/WelcomePage'
import BillingPage from './modules/billing/BillingPage'
import BookingsPage from './modules/bookings/BookingsPage'
import ReviewsPage from './modules/reviews/ReviewsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<InboxPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="welcome" element={<WelcomePage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### Layout.jsx — shared sidebar navigation

```jsx
// Sidebar shows all 6 Clara modules
const modules = [
  { path: '/inbox',    label: 'Clara Inbox',    icon: '📬', desc: 'Route enquiries' },
  { path: '/leads',    label: 'Clara Leads',    icon: '🎯', desc: 'Follow-up emails' },
  { path: '/welcome',  label: 'Clara Welcome',  icon: '👋', desc: 'Onboarding' },
  { path: '/billing',  label: 'Clara Billing',  icon: '💳', desc: 'Invoice nudger' },
  { path: '/bookings', label: 'Clara Bookings', icon: '📅', desc: 'Win-back drafts' },
  { path: '/reviews',  label: 'Clara Reviews',  icon: '⭐', desc: 'Review replies' },
]
```

### Vite proxy config — vite.config.js

```js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
}
```

---

## Coding Conventions

- **Python:** snake_case for all variables and functions, PascalCase for classes
- **React:** PascalCase for components and files, camelCase for variables and functions
- **TypeScript:** Not used — plain JavaScript for speed of development
- **Tailwind:** Utility classes only — no inline styles, no CSS files per component
- **Error handling:** All API calls wrapped in try/except (Python) and try/catch (JS)
- **Loading states:** Always show spinner or disabled button during API calls
- **No hardcoded strings:** API URLs come from vite proxy, secrets from .env
- **Each module is independent:** A module's form, API call, and result display are self-contained

---

## Build Order — One Module Per Week

| Week | Module | New concepts learned |
|------|--------|---------------------|
| Week 1 | Clara Inbox | React Router, Layout, Sidebar, shared backend structure |
| Week 2 | Clara Leads | Multi-field forms, email preview component |
| Week 3 | Clara Welcome | Checklist rendering, plan-based personalisation |
| Week 4 | Clara Billing | Days calculation, conditional tone display |
| Week 5 | Clara Bookings | Booking history mock data, suggested times display |
| Week 6 | Clara Reviews | Dual output panel (public + internal) |

---

## Running Locally

```bash
# Terminal 1 — Backend
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## Deployment Plan

### Frontend — Vercel (free)
1. Push code to GitHub main branch
2. Connect `claradesk` repo to Vercel
3. Set root directory to `frontend/`
4. Vercel auto-deploys on every push to main
5. Live at `claradesk.vercel.app`

### Backend — Railway (free tier)
1. Connect `claradesk` repo to Railway
2. Set root directory to `backend/`
3. Add all .env variables in Railway dashboard
4. Update CORS in main.py to allow claradesk.vercel.app
5. Railway gives a public URL — update frontend API calls to use it in production

### Environment variables on Railway
Add every key from .env file into Railway dashboard under Variables.
Never put secrets in code or in GitHub.

---

## Testing Without Slack Webhooks

All modules gracefully handle missing webhooks.
If a webhook URL is not set in .env, post_to_slack() returns False.
The API response includes slack_posted: false — the UI shows the result anyway.
This means you can test all Claude AI output without setting up Slack first.

---

## Previous Project Reference

Contact Form Router (the original standalone version):
- GitHub: https://github.com/PratibhaRepos1/contact-form-router
- This repo stays live as a standalone portfolio piece
- Clara Inbox is a rebuilt, improved version of the same feature
- Both can be shown to recruiters — they demonstrate natural progression

---

## Portfolio Context

ClaraDesk is the centrepiece portfolio project for a career transition from
Senior Frontend Developer to AI Developer / Full-Stack AI Engineer.

Developer: Pratibha Jadhav
Experience: 16 years IT, 2+ years hands-on generative AI at Allianz Technology
Stack expertise: React, Angular, Python FastAPI, Anthropic Claude API, MCP servers
Portfolio: https://pratibharepos1.github.io/crafted-by-pratibha/

This project will be shown to hiring managers as a live demo during interviews.
Write clean, well-commented, production-quality code throughout.
Every module should be fully functional and visually polished before moving to the next.

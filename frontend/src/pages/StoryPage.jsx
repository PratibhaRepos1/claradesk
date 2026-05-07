import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ───────────────────────────── tiny helpers ───────────────────────────── */

function Typewriter({ text, speed = 35, startDelay = 0, className = '', onDone }) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    setShown('')
    let i = 0
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1
        setShown(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(id)
          if (onDone) onDone()
        }
      }, speed)
      // store id on the ref so we can clear on unmount
      Typewriter._id = id
    }, startDelay)
    return () => {
      clearTimeout(start)
      if (Typewriter._id) clearInterval(Typewriter._id)
    }
  }, [text, speed, startDelay, onDone])
  const isDone = shown.length >= text.length
  return (
    <span className={className}>
      {shown}
      {!isDone && <span className="ml-0.5 inline-block w-[2px] h-[1em] align-middle bg-current opacity-70 animate-pulse" />}
    </span>
  )
}

function Cascade({ items, delay = 200, className = '' }) {
  return (
    <>
      {items.map((it, i) => (
        <div
          key={i}
          className={`opacity-0 animate-fade-in-up ${className}`}
          style={{ animationDelay: `${i * delay}ms` }}
        >
          {it}
        </div>
      ))}
    </>
  )
}

/* ──────────────────────────── scene components ──────────────────────────── */

function SceneHeader({ day, time, label }) {
  return (
    <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-xs">
      <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-white/90 font-bold uppercase tracking-widest">
        {day} · {time}
      </span>
      <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-white/90 font-semibold">
        {label}
      </span>
    </div>
  )
}

/* Scene 1 — Marcus types into the contact form */
function Scene1() {
  const [step, setStep] = useState(0) // 0=name, 1=email, 2=message, 3=send
  return (
    <div className="absolute inset-0 bg-clara-cream flex items-center justify-center p-8">
      <SceneHeader day="Day 1" time="09:42" label="📨 Contact form" />
      <div className="w-[min(560px,90%)] rounded-3xl bg-white p-8 shadow-clara-sm border border-clara-purple/15 animate-fade-in-up">
        <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">claradesk.com / contact</div>
        <h3 className="mt-2 font-display text-2xl font-extrabold text-clara-deep">Get in touch</h3>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-clara-deep mb-1">Name</label>
            <div className="rounded-xl border border-clara-purple/20 bg-white px-3 py-2.5 text-sm min-h-[42px]">
              {step >= 0 && <Typewriter text="Marcus Hill" speed={70} onDone={() => setStep(1)} />}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-clara-deep mb-1">Email</label>
            <div className="rounded-xl border border-clara-purple/20 bg-white px-3 py-2.5 text-sm min-h-[42px]">
              {step >= 1 && <Typewriter text="marcus@stripe.com" speed={45} onDone={() => setStep(2)} />}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-clara-deep mb-1">Message</label>
            <div className="rounded-xl border border-clara-purple/20 bg-white px-3 py-2.5 text-sm min-h-[80px] leading-relaxed">
              {step >= 2 && (
                <Typewriter
                  text="Looking at pricing for 75 seats, budget approved. Need a vendor in place by end of quarter."
                  speed={22}
                  onDone={() => setStep(3)}
                />
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={step < 3}
            className={[
              'w-full rounded-full px-4 py-3 text-sm font-bold text-white transition-all',
              step >= 3
                ? 'bg-clara-gradient shadow-clara animate-ring-pulse scale-105'
                : 'bg-clara-purple/30',
            ].join(' ')}
          >
            {step >= 3 ? 'Send →' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Scene 2 — Inbox Agent classifies + Slack lights up */
function Scene2() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-clara-pink/20 via-clara-cream to-clara-magenta/20 flex items-center justify-center gap-6 p-8">
      <SceneHeader day="Day 1" time="09:42 · 3 sec later" label="📬 Inbox Agent" />

      {/* Original message */}
      <div className="w-[min(380px,40%)] rounded-2xl bg-white p-6 shadow-clara-sm border border-clara-purple/15 animate-fade-in-up">
        <div className="text-xs font-semibold text-clara-magenta">Marcus Hill · marcus@stripe.com</div>
        <p className="mt-2 text-sm text-clara-ink/80 leading-relaxed">
          Looking at pricing for 75 seats, budget approved. Need a vendor in place by end of quarter.
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-clara-ink/50">
          <span className="inline-block h-2 w-2 rounded-full bg-clara-pink animate-pulse" />
          Classifying with Claude…
        </div>
      </div>

      {/* Result + Slack */}
      <div className="w-[min(380px,45%)] space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-clara border border-clara-purple/20 opacity-0 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
          <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Classification</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="opacity-0 animate-stamp inline-block rounded-full bg-clara-pink text-white px-3 py-1 text-sm font-extrabold uppercase" style={{ animationDelay: '1500ms' }}>
              💼 Sales · high
            </span>
          </div>
          <p className="mt-3 text-sm text-clara-ink/75 italic opacity-0 animate-fade-in" style={{ animationDelay: '2200ms' }}>
            "Clear buying intent — budget approved, named timeline, specific seat count."
          </p>
        </div>

        <div className="rounded-2xl bg-clara-deep p-5 text-white shadow-clara opacity-0 animate-fade-in-left" style={{ animationDelay: '2700ms' }}>
          <div className="flex items-center gap-2 text-xs font-semibold text-clara-sky">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            #sales · routed
          </div>
          <div className="mt-2 text-sm font-semibold">New SALES message → routed to #sales</div>
          <div className="mt-1 text-xs text-white/65">Marcus Hill · stripe.com · just now</div>
        </div>
      </div>
    </div>
  )
}

/* Scene 3 — Lead Agent scores + tags + variants */
function Scene3() {
  const tags = ['budget_approved', 'demo_request', 'team_size:75', 'timeline:this_quarter', 'pricing']
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-clara-purple/20 via-clara-cream to-clara-pink/20 p-8">
      <SceneHeader day="Day 1" time="09:42 · same minute" label="🎯 Lead Agent" />

      <div className="h-full flex items-center justify-center">
        <div className="w-[min(720px,95%)] grid grid-cols-2 gap-5">
          {/* Score + reasoning */}
          <div className="rounded-3xl bg-white p-6 shadow-clara border-2 border-clara-pink animate-fade-in-up">
            <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Lead score</div>
            <div className="mt-2 opacity-0 animate-stamp" style={{ animationDelay: '400ms' }}>
              <span className="font-display text-4xl font-extrabold text-clara-deep">🔥 Hot</span>
            </div>
            <p className="mt-3 text-sm text-clara-ink/75 opacity-0 animate-fade-in" style={{ animationDelay: '900ms' }}>
              Budget approved, specific timeline, concrete seat count, and urgent demo request indicate immediate buying intent.
            </p>
          </div>

          {/* Next action */}
          <div className="rounded-3xl bg-clara-gradient-2 p-6 text-white shadow-clara opacity-0 animate-fade-in-up" style={{ animationDelay: '1300ms' }}>
            <div className="text-xs font-bold uppercase tracking-widest text-white/80">Next action</div>
            <div className="mt-3 font-display text-xl font-extrabold leading-snug">
              Schedule demo within 48 hours and prepare enterprise quote
            </div>
          </div>

          {/* Intent tags */}
          <div className="col-span-2 rounded-3xl bg-white p-6 shadow-clara-sm border border-clara-purple/15">
            <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta mb-3">Intent tags</div>
            <div className="flex flex-wrap gap-2">
              <Cascade
                delay={250}
                items={tags.map((t) => (
                  <span className="inline-block rounded-full bg-clara-pink/10 text-clara-magenta px-3 py-1 text-sm font-bold">#{t}</span>
                ))}
              />
            </div>
          </div>

          {/* Variant preview */}
          <div className="col-span-2 rounded-3xl bg-clara-cream p-6 border border-clara-purple/15 opacity-0 animate-fade-in-up" style={{ animationDelay: '2700ms' }}>
            <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Friendly variant · 87 words</div>
            <div className="mt-2 text-sm font-semibold text-clara-deep">Quick demo for Stripe this week — 75 seats</div>
            <div className="mt-1 text-xs text-clara-ink/65 italic line-clamp-2">
              "Hi Marcus — great to hear from Stripe! I love that you have budget approved and a clear timeline. I have demo slots open tomorrow and Thursday…"
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Scene 4 — Day 4 · Onboarding */
function Scene4() {
  const checklist = [
    'Connect your Slack workspace',
    'Set up first payment workflow',
    'Configure SSO with your IdP',
    'Schedule architecture review',
  ]
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-clara-purple/20 via-clara-cream to-clara-sky/20 p-8">
      <SceneHeader day="Day 4" time="14:20 · signed up" label="👋 Onboarding Agent" />

      <div className="h-full flex items-center justify-center gap-6">
        {/* Welcome card */}
        <div className="w-[min(420px,45%)] rounded-3xl bg-white p-6 shadow-clara border border-clara-purple/15 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Welcome email</div>
            <span className="rounded-full bg-emerald-50 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold uppercase">🟢 Green</span>
          </div>
          <div className="mt-3 text-sm font-semibold text-clara-deep">
            Welcome to Bundle Annual, Marcus 🚀
          </div>
          <p className="mt-2 text-xs text-clara-ink/70 leading-relaxed line-clamp-5">
            Hi Marcus, congrats on joining Bundle Annual! You've made an excellent choice for scaling Stripe's customer ops. Over the next week, we'll get you up and running with Slack automations, custom workflows, and SSO…
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-clara-ink/55">
            <span>123 words</span> · <span>Ready to send</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="w-[min(380px,40%)] rounded-3xl bg-white p-6 shadow-clara-sm border border-clara-purple/15 opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta mb-3">Activation checklist</div>
          <ul className="space-y-3">
            {checklist.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${1000 + i * 600}ms` }}
              >
                <span className="grid place-items-center w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex-shrink-0">
                  ✓
                </span>
                <span className="text-sm text-clara-ink/85 pt-0.5">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-4 border-t border-clara-purple/10 opacity-0 animate-fade-in" style={{ animationDelay: '4200ms' }}>
            <div className="text-[11px] font-bold uppercase tracking-widest text-clara-magenta">Day-7 follow-up · queued</div>
            <div className="mt-1 text-xs font-semibold text-clara-deep">"Marcus, how are your first Bundle automations performing?"</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Scene 5 — Day 38 · Overdue invoice */
function Scene5() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-clara-pink/20 via-clara-cream to-clara-purple/20 p-8">
      <SceneHeader day="Day 38" time="11:15 · 8 days late" label="💳 Billing Agent" />

      <div className="h-full flex items-center justify-center gap-6">
        {/* Invoice card */}
        <div className="relative w-[min(380px,40%)] rounded-3xl bg-white p-7 shadow-clara border border-clara-purple/15 animate-fade-in-up">
          <div className="text-xs font-semibold text-clara-magenta">INV-7842</div>
          <div className="mt-3 text-4xl font-display font-extrabold text-clara-deep">$8,499.00</div>
          <div className="mt-2 text-sm text-clara-ink/60">Stripe · ClaraDesk Bundle Annual</div>

          <div className="absolute -top-3 -right-3 opacity-0 animate-stamp" style={{ animationDelay: '700ms' }}>
            <span className="inline-block rounded-2xl bg-rose-500 text-white px-4 py-2 text-sm font-extrabold uppercase tracking-widest border-4 border-rose-700 shadow-lg">
              8 DAYS OVERDUE
            </span>
          </div>
        </div>

        {/* Reminder draft */}
        <div className="w-[min(420px,45%)] rounded-3xl bg-white p-6 shadow-clara-sm border-2 border-amber-300 opacity-0 animate-fade-in-up" style={{ animationDelay: '1500ms' }}>
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-700">📌 Direct tone</div>
            <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[11px] font-bold uppercase">Medium recovery</span>
          </div>
          <div className="mt-3 text-sm font-semibold text-clara-deep">Payment overdue · invoice INV-7842</div>
          <p className="mt-2 text-xs text-clara-ink/70 leading-relaxed line-clamp-4">
            Hi Marcus, invoice INV-7842 for $8,499 is now 8 days past due. Please reply today with a payment date or complete payment via the link below — we want to avoid moving this to escalation…
          </p>

          <div className="mt-4 rounded-lg bg-clara-purple/5 border border-clara-purple/20 p-3 opacity-0 animate-fade-in" style={{ animationDelay: '3200ms' }}>
            <div className="text-[11px] font-bold uppercase tracking-widest text-clara-purple">💡 Suggested concession</div>
            <div className="mt-1 text-xs text-clara-deep">Happy to split this across two monthly payments if that helps cashflow.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Scene 6 — Day 92 · Cancelled booking + win-back */
function Scene6() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-clara-sky/20 via-clara-cream to-clara-magenta/20 p-8">
      <SceneHeader day="Day 92" time="16:30 · cancellation" label="📅 Booking Agent" />

      <div className="h-full flex items-center justify-center gap-6">
        {/* Booking with cancel */}
        <div className="relative w-[min(360px,38%)] rounded-3xl bg-white p-6 shadow-clara border border-clara-purple/15 animate-fade-in-up">
          <div className="text-xs font-semibold text-clara-magenta">📅 Q2 quarterly business review</div>
          <div className="mt-2 text-lg font-display font-extrabold text-clara-deep line-through decoration-rose-500 decoration-4">
            Wednesday 13 Aug · 3pm
          </div>
          <div className="mt-2 text-sm text-clara-ink/65 italic">"Schedule conflict — board meeting moved."</div>

          <div className="absolute -top-3 -right-3 opacity-0 animate-stamp" style={{ animationDelay: '600ms' }}>
            <span className="inline-block rounded-2xl bg-rose-500 text-white px-4 py-2 text-sm font-extrabold uppercase tracking-widest border-4 border-rose-700 shadow-lg">
              ✗ Cancelled
            </span>
          </div>
        </div>

        {/* Win-back stack */}
        <div className="w-[min(420px,46%)] space-y-3">
          <div className="rounded-3xl bg-white p-5 shadow-clara-sm border-2 border-emerald-300 opacity-0 animate-fade-in-up" style={{ animationDelay: '1300ms' }}>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-700">Email · warm tone</div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold uppercase">🟢 High win-back</span>
            </div>
            <p className="mt-2 text-xs text-clara-ink/70 leading-relaxed line-clamp-3">
              Hi Marcus, sorry to hear the Q2 review got bumped — boards happen. We have spots opening up early next week and on Friday afternoon. Just reply with what works…
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 opacity-0 animate-fade-in" style={{ animationDelay: '2200ms' }}>
              {['Early next week', 'Friday afternoon', 'Following Monday'].map((t) => (
                <span key={t} className="rounded-full bg-clara-pink/10 text-clara-magenta px-2.5 py-0.5 text-[11px] font-semibold">{t}</span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-clara-deep text-white p-5 shadow-clara-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '2700ms' }}>
            <div className="text-xs font-bold uppercase tracking-widest text-clara-sky">📱 SMS variant · 142 chars</div>
            <p className="mt-2 text-xs text-white/85 leading-relaxed">
              Hey Marcus — sorry the Q2 review got bumped. Want to rebook for early next week? Reply with a time that works.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Scene 7 — Day 184 · Negative review + owner assignments */
function Scene7() {
  const owners = [
    { tag: 'mgmt',      label: '👔 Management', issue: 'Support response time slipping' },
    { tag: 'support',   label: '🛠 Support',     issue: 'SLA breached on critical workflow' },
    { tag: 'frontdesk', label: '🛎 Frontdesk',   issue: 'Escalation routing needs review' },
  ]
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-clara-pink/20 via-clara-cream to-clara-purple/20 p-8">
      <SceneHeader day="Day 184" time="08:22 · 2-star review" label="⭐ Review Agent" />

      <div className="h-full flex items-center justify-center gap-5">
        {/* Review card */}
        <div className="w-[min(360px,40%)] rounded-3xl bg-white p-6 shadow-clara border border-clara-purple/15 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-clara-magenta">Google review</span>
            <span className="text-xs text-clara-ink/55">· Marcus Hill</span>
          </div>
          <div className="mt-2 text-2xl tracking-wider">
            <span className="text-amber-500">★★</span><span className="text-clara-ink/20">★★★</span>
          </div>
          <p className="mt-3 text-sm text-clara-ink/80 leading-relaxed">
            Great product when it works but support response times have slipped. Waited 3 days for a fix on a critical workflow that broke the night before our board meeting.
          </p>

          <div className="absolute opacity-0 animate-stamp" style={{ animationDelay: '700ms' }}>
            {/* spacer for stamp positioning */}
          </div>

          <div className="mt-4 inline-block opacity-0 animate-stamp" style={{ animationDelay: '900ms' }}>
            <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-extrabold uppercase tracking-widest">
              🟡 Moderate severity
            </span>
          </div>
        </div>

        {/* Owners + response */}
        <div className="w-[min(420px,46%)] space-y-3">
          <div className="rounded-2xl bg-white p-5 shadow-clara-sm border border-clara-purple/15">
            <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta mb-3">
              Root issues · assigned owners
            </div>
            <div className="space-y-2">
              {owners.map((o, i) => (
                <div
                  key={o.tag}
                  className="flex items-start gap-3 opacity-0 animate-fade-in-left"
                  style={{ animationDelay: `${1500 + i * 500}ms` }}
                >
                  <span className="rounded-full bg-clara-purple/10 text-clara-purple px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap">
                    {o.label}
                  </span>
                  <span className="text-xs text-clara-ink/80 pt-0.5">{o.issue}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-clara-cream p-4 border border-clara-purple/15 opacity-0 animate-fade-in-up" style={{ animationDelay: '3300ms' }}>
            <div className="text-[11px] font-bold uppercase tracking-widest text-clara-magenta">Public response · 87 words</div>
            <p className="mt-1 text-xs text-clara-ink/75 italic line-clamp-3">
              "Hi Marcus, thank you for raising this — and we're sorry our response time fell short during a critical moment for your team. We have shared this with support and management to address the SLA gap directly…"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Scene 8 — End card */
function Scene8() {
  const icons = ['📬', '🎯', '👋', '💳', '📅', '⭐']
  return (
    <div className="absolute inset-0 bg-clara-gradient flex flex-col items-center justify-center text-white p-8 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-clara-sky/30 blur-3xl animate-pulse" aria-hidden="true" />
      <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-clara-pink/30 blur-3xl animate-pulse" aria-hidden="true" />

      <div className="relative flex gap-4 mb-8">
        {icons.map((icon, i) => (
          <span
            key={i}
            className="grid place-items-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur text-4xl shadow-clara opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {icon}
          </span>
        ))}
      </div>

      <h2 className="relative font-display text-4xl lg:text-5xl font-extrabold text-center leading-tight opacity-0 animate-fade-in-up" style={{ animationDelay: '1100ms' }}>
        6 agents · 1 customer · 6 months<br />
        <span className="bg-gradient-to-r from-clara-sky to-white bg-clip-text text-transparent">
          in 90 seconds.
        </span>
      </h2>

      <p className="relative mt-5 text-white/85 text-center max-w-xl opacity-0 animate-fade-in" style={{ animationDelay: '1700ms' }}>
        Every scene above runs as a real Claude API call in the live demo.
      </p>

      <div className="relative mt-8 flex flex-wrap gap-3 justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '2200ms' }}>
        <Link
          to="/journey"
          className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-clara-purple hover:scale-[1.02] transition"
        >
          See the live API journey →
        </Link>
        <Link
          to="/pricing"
          className="rounded-full border-2 border-white/70 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition"
        >
          See pricing
        </Link>
      </div>
    </div>
  )
}

/* ─────────────────────────────── scene table ─────────────────────────────── */

const SCENES = [
  { id: 1, render: Scene1, duration: 9000 },
  { id: 2, render: Scene2, duration: 9000 },
  { id: 3, render: Scene3, duration: 11000 },
  { id: 4, render: Scene4, duration: 13000 },
  { id: 5, render: Scene5, duration: 11000 },
  { id: 6, render: Scene6, duration: 11000 },
  { id: 7, render: Scene7, duration: 11000 },
  { id: 8, render: Scene8, duration: 8000 },
]

const TOTAL_MS = SCENES.reduce((acc, s) => acc + s.duration, 0)

function fmtTime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/* ──────────────────────────────── page ──────────────────────────────── */

export default function StoryPage() {
  const [playing, setPlaying] = useState(false)
  const [sceneIdx, setSceneIdx] = useState(0)
  const [sceneElapsed, setSceneElapsed] = useState(0)  // ms within current scene
  const [speed, setSpeed] = useState(1)

  const tickRef = useRef(null)
  const lastTickRef = useRef(null)

  // Reset on first mount — start paused so user opts in
  const totalElapsed = useMemo(() => {
    let acc = 0
    for (let i = 0; i < sceneIdx; i++) acc += SCENES[i].duration
    return acc + sceneElapsed
  }, [sceneIdx, sceneElapsed])

  const isFinished = sceneIdx >= SCENES.length

  /* Tick loop */
  useEffect(() => {
    if (!playing || isFinished) {
      lastTickRef.current = null
      return
    }
    lastTickRef.current = performance.now()
    tickRef.current = setInterval(() => {
      const now = performance.now()
      const dt = (now - (lastTickRef.current || now)) * speed
      lastTickRef.current = now

      setSceneElapsed((prev) => {
        const next = prev + dt
        const currentDuration = SCENES[sceneIdx]?.duration ?? 0
        if (next >= currentDuration) {
          // advance scene
          if (sceneIdx + 1 >= SCENES.length) {
            setSceneIdx(SCENES.length)
            setPlaying(false)
            return 0
          }
          setSceneIdx((i) => i + 1)
          return 0
        }
        return next
      })
    }, 50)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [playing, sceneIdx, speed, isFinished])

  const togglePlay = () => {
    if (isFinished) {
      setSceneIdx(0)
      setSceneElapsed(0)
      setPlaying(true)
    } else {
      setPlaying((p) => !p)
    }
  }
  const restart = () => {
    setSceneIdx(0)
    setSceneElapsed(0)
    setPlaying(true)
  }
  const skip = () => {
    setSceneIdx(SCENES.length)
    setSceneElapsed(0)
    setPlaying(false)
  }

  const CurrentScene = SCENES[Math.min(sceneIdx, SCENES.length - 1)].render
  const progressPct = (totalElapsed / TOTAL_MS) * 100

  return (
    <div className="min-h-full bg-clara-cream text-clara-ink">
      {/* Promo strip */}
      <div className="bg-clara-gradient text-white text-sm">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center">
          <span className="font-medium">
            🎉 Launch week — 40% off the all-6 Bundle. Use code <span className="font-bold">CLARA40</span>
          </span>
        </div>
      </div>

      {/* Sticky nav */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-clara-purple/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-clara-gradient text-white font-bold">C</span>
            <span className="font-display text-xl font-extrabold text-clara-deep">ClaraDesk</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-clara-ink/80">
            <Link to="/#solutions" className="hover:text-clara-magenta">Solutions</Link>
            <Link to="/journey"    className="hover:text-clara-magenta">Journey</Link>
            <Link to="/story"      className="text-clara-magenta">Story</Link>
            <Link to="/pricing"    className="hover:text-clara-magenta">Pricing</Link>
            <Link to="/setup"      className="hover:text-clara-magenta">Setup</Link>
            <Link to="/#blog"      className="hover:text-clara-magenta">Blog</Link>
          </nav>

          <Link
            to="/inbox"
            className="rounded-full bg-clara-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-clara hover:shadow-lg hover:scale-[1.02] transition"
          >
            Try free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-12 pb-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white border border-clara-purple/20 px-4 py-1.5 text-xs font-semibold text-clara-purple shadow-clara-sm">
          🎬 The Story · 90-second cinematic
        </span>
        <h1 className="mt-5 font-display text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight text-clara-deep">
          Marcus Hill's 6-month customer journey,{' '}
          <span className="bg-clara-gradient bg-clip-text text-transparent">scene by scene.</span>
        </h1>
        <p className="mt-4 text-base text-clara-ink/70 max-w-2xl mx-auto">
          Hit Play and watch the lifecycle in 90 seconds. Pause any scene. Skip ahead. Or open{' '}
          <Link to="/journey" className="font-semibold text-clara-purple hover:text-clara-magenta">/journey</Link>{' '}
          to see the same story with the real API responses behind each scene.
        </p>
      </section>

      {/* Player */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="rounded-3xl bg-clara-deep shadow-clara overflow-hidden">
          {/* Video frame — 16:9 */}
          <div className="relative bg-black" style={{ aspectRatio: '16 / 9' }}>
            <div key={sceneIdx} className="absolute inset-0 animate-fade-in">
              <CurrentScene />
            </div>

            {/* Pause overlay */}
            {!playing && !isFinished && totalElapsed > 0 && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-sm transition-opacity"
              >
                <span className="grid place-items-center w-20 h-20 rounded-full bg-white/95 text-clara-purple text-3xl shadow-clara">
                  ▶
                </span>
              </button>
            )}

            {/* Initial play overlay */}
            {totalElapsed === 0 && !playing && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 grid place-items-center bg-clara-gradient-2 text-white"
              >
                <div className="text-center">
                  <span className="grid place-items-center w-24 h-24 rounded-full bg-white/95 text-clara-purple text-4xl mx-auto shadow-clara">
                    ▶
                  </span>
                  <div className="mt-5 text-2xl font-display font-extrabold">Press Play</div>
                  <div className="mt-1 text-sm text-white/80">90-second cinematic · 8 scenes</div>
                </div>
              </button>
            )}
          </div>

          {/* Controls bar */}
          <div className="bg-clara-deep px-5 py-4 text-white">
            {/* Progress bar */}
            <div className="relative h-1.5 rounded-full bg-white/15 overflow-hidden mb-3">
              <div
                className="absolute left-0 top-0 bottom-0 bg-clara-gradient transition-[width] duration-100"
                style={{ width: `${Math.min(100, progressPct)}%` }}
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={togglePlay}
                className="grid place-items-center w-10 h-10 rounded-full bg-clara-gradient text-white text-sm font-bold hover:scale-105 transition"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {isFinished ? '↻' : playing ? '❚❚' : '▶'}
              </button>

              <button
                type="button"
                onClick={restart}
                className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10 transition"
              >
                ↻ Restart
              </button>

              <button
                type="button"
                onClick={skip}
                className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10 transition"
              >
                ⏭ Skip
              </button>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-white/70 tabular-nums">
                  {fmtTime(totalElapsed)} / {fmtTime(TOTAL_MS)}
                </span>

                <div className="flex rounded-full bg-white/10 p-0.5 border border-white/15">
                  {[1, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeed(s)}
                      className={[
                        'px-2.5 py-1 text-[11px] font-bold rounded-full transition',
                        speed === s ? 'bg-clara-gradient text-white' : 'text-white/70 hover:text-white',
                      ].join(' ')}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scene chapters */}
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-8 gap-1">
              {SCENES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setSceneIdx(i); setSceneElapsed(0); setPlaying(true) }}
                  className={[
                    'h-1 rounded-full transition',
                    i < sceneIdx ? 'bg-clara-pink' :
                    i === sceneIdx ? 'bg-white' :
                    'bg-white/20 hover:bg-white/40',
                  ].join(' ')}
                  aria-label={`Jump to scene ${s.id}`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-clara-ink/55">
          Best viewed on a wider screen · animations are pure HTML/CSS, no video file
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-clara-deep text-white/80 mt-10">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-clara-gradient text-white font-bold">C</span>
            <span className="font-display text-xl font-extrabold text-white">ClaraDesk</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/journey" className="hover:text-clara-sky">Journey</Link>
            <Link to="/story"   className="hover:text-clara-sky">Story</Link>
            <Link to="/pricing" className="hover:text-clara-sky">Pricing</Link>
            <Link to="/setup"   className="hover:text-clara-sky">Setup</Link>
          </div>
          <span className="text-xs text-white/50">© {new Date().getFullYear()} ClaraDesk · Made by Pratibha Jadhav</span>
        </div>
      </footer>
    </div>
  )
}

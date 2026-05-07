import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const STAGE_GAP_MS = 1500

const STAGES = [
  {
    id: 'inbox',
    day: 'Day 1',
    time: '09:42',
    icon: '📬',
    agent: 'Inbox Agent',
    accent: 'from-clara-pink to-clara-magenta',
    headline: 'Marcus submits a contact form on claradesk.com',
    triggerSummary:
      'POST /api/inbox/classify · name, email, message',
    endpoint: '/api/inbox/classify',
    payload: {
      name: 'Marcus Hill',
      email: 'marcus@stripe.com',
      message:
        'Hi — looking at pricing for 75 seats with budget approved by end of quarter. Need a vendor in place by Q2.',
    },
  },
  {
    id: 'leads',
    day: 'Day 1',
    time: '09:42',
    icon: '🎯',
    agent: 'Lead Agent',
    accent: 'from-clara-purple to-clara-pink',
    headline: 'Lead Agent picks it up three seconds later',
    triggerSummary:
      'POST /api/leads/draft · scores the lead, drafts 2 follow-ups',
    endpoint: '/api/leads/draft',
    payload: {
      name: 'Marcus Hill',
      email: 'marcus@stripe.com',
      company: 'Stripe',
      inquiry_details:
        'We have budget approved and need a vendor in place by end of this quarter. Looking at 75 seats minimum, would like a demo ASAP and a quote.',
    },
  },
  {
    id: 'welcome',
    day: 'Day 4',
    time: '14:20',
    icon: '👋',
    agent: 'Onboarding Agent',
    accent: 'from-clara-purple to-clara-sky',
    headline: 'Marcus signs up for Bundle Annual',
    triggerSummary:
      'POST /api/welcome/draft · welcome email, checklist, health read',
    endpoint: '/api/welcome/draft',
    payload: {
      customer_name: 'Marcus Hill',
      email: 'marcus@stripe.com',
      company: 'Stripe',
      product_plan: 'Bundle Annual',
    },
  },
  {
    id: 'billing',
    day: 'Day 38',
    time: '11:15',
    icon: '💳',
    agent: 'Billing Agent',
    accent: 'from-clara-pink to-clara-purple',
    headline: 'First invoice goes 8 days overdue',
    triggerSummary:
      'POST /api/billing/nudge · tone calibrated by days overdue',
    endpoint: '/api/billing/nudge',
    payload: {
      invoice_number: 'INV-7842',
      amount: 8499.0,
      days_overdue: 8,
      customer_name: 'Marcus Hill',
      customer_email: 'marcus@stripe.com',
    },
  },
  {
    id: 'bookings',
    day: 'Day 92',
    time: '16:30',
    icon: '📅',
    agent: 'Booking Agent',
    accent: 'from-clara-sky to-clara-magenta',
    headline: 'Marcus cancels his Q2 quarterly review',
    triggerSummary:
      'POST /api/bookings/winback · win-back drafts + risk read',
    endpoint: '/api/bookings/winback',
    payload: {
      customer_name: 'Marcus Hill',
      service_type: 'Q2 quarterly business review',
      cancellation_reason: 'Schedule conflict — board meeting moved to the same slot.',
      original_date: 'Wednesday 13 August, 3pm',
      booking_history: 'Annual customer for 1 quarter, regular attendee until now.',
    },
  },
  {
    id: 'reviews',
    day: 'Day 184',
    time: '08:22',
    icon: '⭐',
    agent: 'Review Agent',
    accent: 'from-clara-purple to-clara-pink',
    headline: 'Three months later — a 2-star Google review',
    triggerSummary:
      'POST /api/reviews/draft · public reply, internal note, owner assignments',
    endpoint: '/api/reviews/draft',
    payload: {
      reviewer_name: 'Marcus Hill',
      rating: 2,
      platform: 'google',
      review_text:
        'Great product when it works but support response times have slipped. Waited 3 days for a fix on a critical workflow that broke the night before our board meeting.',
    },
  },
]

function StageSummary({ stage, data }) {
  if (!data) return null

  switch (stage.id) {
    case 'inbox':
      return (
        <div className="space-y-1 text-sm">
          <div><b>Category:</b> <span className="capitalize">{data.category}</span> · <b>Confidence:</b> {data.confidence}</div>
          <div className="text-clara-ink/65 italic">"{data.reasoning}"</div>
          <div><b>Routed to:</b> <code className="rounded bg-clara-pink/10 px-1.5 py-0.5 text-clara-magenta">{data.routed_to}</code></div>
        </div>
      )

    case 'leads': {
      const variant = (data.variants || [])[0] || {}
      return (
        <div className="space-y-2 text-sm">
          <div>
            <b>Lead score:</b>{' '}
            <span className="rounded-full bg-clara-pink/10 text-clara-magenta px-2 py-0.5 text-xs font-bold uppercase">
              {data.lead_score}
            </span>{' '}
            <span className="text-clara-ink/65 italic">"{data.score_reasoning}"</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(data.intent_tags || []).map((t) => (
              <span key={t} className="rounded-full bg-white border border-clara-purple/20 px-2 py-0.5 text-[11px] font-semibold text-clara-deep">
                #{t}
              </span>
            ))}
          </div>
          <div><b>Next action:</b> {data.next_action}</div>
          <div className="rounded-lg bg-clara-cream border border-clara-purple/15 p-3 mt-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-clara-magenta">
              Variant 1 · {variant.tone} · {variant.word_count} words
            </div>
            <div className="mt-1 text-sm font-semibold text-clara-deep">{variant.subject}</div>
            <div className="mt-1 text-xs text-clara-ink/70 line-clamp-3 whitespace-pre-line">{variant.email_body}</div>
          </div>
        </div>
      )
    }

    case 'welcome':
      return (
        <div className="space-y-2 text-sm">
          <div>
            <b>Health:</b>{' '}
            <span className="rounded-full bg-emerald-50 text-emerald-800 px-2 py-0.5 text-xs font-bold uppercase">
              {data.health_signal}
            </span>{' '}
            <span className="text-clara-ink/65 italic">"{data.health_reasoning}"</span>
          </div>
          <div><b>First win:</b> {data.first_win}</div>
          <div><b>Day-7 follow-up:</b> {data.day_7_followup_subject}</div>
          <div className="text-clara-ink/65">
            {data.checklist?.length || 0}-item activation checklist · {data.word_count} word welcome email
          </div>
        </div>
      )

    case 'billing':
      return (
        <div className="space-y-1 text-sm">
          <div><b>Tone:</b> {data.tone} · <b>Recovery probability:</b> {data.recovery_probability}</div>
          <div className="text-clara-ink/65 italic">"{data.recovery_reasoning}"</div>
          <div><b>Subject:</b> {data.subject}</div>
          {data.payment_plan_offer && (
            <div className="mt-1 rounded bg-clara-purple/5 border border-clara-purple/15 p-2 text-clara-deep">
              💡 <b>Suggested concession:</b> {data.payment_plan_offer}
            </div>
          )}
        </div>
      )

    case 'bookings':
      return (
        <div className="space-y-2 text-sm">
          <div>
            <b>Win-back chance:</b> {data.winback_probability} ·{' '}
            <b>Category:</b> {data.cancellation_category?.replace(/_/g, ' ')}
          </div>
          <div className="text-clara-ink/65 italic">"{data.winback_reasoning}"</div>
          {data.risk_factors?.length > 0 && (
            <div className="rounded bg-rose-50 border border-rose-200 p-2 text-rose-800">
              ⚠ Risk factors: {data.risk_factors.join(' · ')}
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {(data.suggested_times || []).map((t) => (
              <span key={t} className="rounded-full bg-clara-pink/10 text-clara-magenta px-2 py-0.5 text-[11px] font-semibold">
                {t}
              </span>
            ))}
          </div>
          <div className="text-clara-ink/55 text-xs">
            📱 SMS variant ready · {data.sms_variant?.length || 0} chars
          </div>
        </div>
      )

    case 'reviews':
      return (
        <div className="space-y-2 text-sm">
          <div>
            <b>Severity:</b>{' '}
            <span className="rounded-full bg-amber-50 text-amber-800 px-2 py-0.5 text-xs font-bold uppercase">
              {data.severity}
            </span>{' '}
            <span className="text-clara-ink/65 italic">"{data.severity_reasoning}"</span>
          </div>
          <div>
            <b>Root issues:</b>
            <ul className="mt-1 ml-2 space-y-1">
              {(data.root_issues || []).map((r, i) => (
                <li key={i} className="text-xs">
                  <span className="rounded-full bg-clara-purple/10 text-clara-purple px-2 py-0.5 font-semibold mr-2">
                    {r.suggested_owner}
                  </span>
                  {r.issue}
                </li>
              ))}
            </ul>
          </div>
          {data.suggested_compensation && (
            <div className="rounded bg-clara-pink/5 border border-clara-pink/20 p-2 text-clara-deep text-xs">
              🎁 <b>Compensation:</b> {data.suggested_compensation}
            </div>
          )}
        </div>
      )

    default:
      return null
  }
}

export default function JourneyPage() {
  const [results, setResults] = useState({})    // { stageId: data }
  const [statuses, setStatuses] = useState({})  // { stageId: 'pending'|'running'|'done'|'error' }
  const [errors, setErrors] = useState({})      // { stageId: errorMessage }
  const [expanded, setExpanded] = useState({})  // { stageId: bool }
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const cancelledRef = useRef(false)

  const reset = () => {
    setResults({})
    setStatuses({})
    setErrors({})
    setExpanded({})
    setDone(false)
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

  const playJourney = async () => {
    if (running) return
    reset()
    cancelledRef.current = false
    setRunning(true)

    for (const stage of STAGES) {
      if (cancelledRef.current) break

      setStatuses((s) => ({ ...s, [stage.id]: 'running' }))
      try {
        const { data } = await axios.post(stage.endpoint, stage.payload)
        if (cancelledRef.current) break
        setResults((r) => ({ ...r, [stage.id]: data }))
        setStatuses((s) => ({ ...s, [stage.id]: 'done' }))
        setExpanded((e) => ({ ...e, [stage.id]: true }))
      } catch (err) {
        const detail = err?.response?.data?.detail || err?.message || 'Unknown error'
        setErrors((e) => ({ ...e, [stage.id]: detail }))
        setStatuses((s) => ({ ...s, [stage.id]: 'error' }))
        cancelledRef.current = true
        break
      }

      if (cancelledRef.current) break
      await sleep(STAGE_GAP_MS)
    }

    setRunning(false)
    if (!cancelledRef.current) setDone(true)
  }

  // Stop in-flight loop if user navigates away
  useEffect(() => {
    return () => { cancelledRef.current = true }
  }, [])

  const allCount = STAGES.length
  const doneCount = STAGES.filter((s) => statuses[s.id] === 'done').length
  const errorCount = STAGES.filter((s) => statuses[s.id] === 'error').length

  return (
    <div className="min-h-full bg-clara-cream text-clara-ink">
      {/* Top promo strip */}
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

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-clara-ink/80">
            <Link to="/#solutions" className="hover:text-clara-magenta">Solutions</Link>
            <Link to="/journey"    className="text-clara-magenta">Journey</Link>
            <Link to="/story"      className="hover:text-clara-magenta">Story</Link>
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
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-clara-pink/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-clara-sky/30 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-clara-purple/20 px-4 py-1.5 text-xs font-semibold text-clara-purple shadow-clara-sm">
            Customer Journey · live demo
          </span>
          <h1 className="mt-5 font-display text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-clara-deep">
            Marcus Hill's 6-month journey through{' '}
            <span className="bg-clara-gradient bg-clip-text text-transparent">all 6 Clara agents.</span>
          </h1>
          <p className="mt-5 text-lg text-clara-ink/70 max-w-2xl mx-auto">
            One fictional customer. Six real API calls. Every response below comes from your live
            backend — same Claude, same prompts, same Slack hooks. Hit Play and watch the lifecycle.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={playJourney}
              disabled={running}
              className="rounded-full bg-clara-gradient px-7 py-3.5 text-sm font-bold text-white shadow-clara hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {running && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {running ? `Playing… ${doneCount}/${allCount}` : (done ? '↻ Replay journey' : '▶ Play journey')}
            </button>
            {(done || errorCount > 0) && !running && (
              <button
                type="button"
                onClick={reset}
                className="rounded-full border-2 border-clara-purple/30 px-5 py-3 text-sm font-semibold text-clara-purple hover:bg-clara-purple hover:text-white transition"
              >
                Reset
              </button>
            )}
          </div>

          <div className="mt-3 text-xs text-clara-ink/50">
            Each stage waits 1.5 seconds before the next so you can watch the story unfold.
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <ol className="relative space-y-5">
          {STAGES.map((stage, idx) => {
            const status = statuses[stage.id] || 'pending'
            const data = results[stage.id]
            const error = errors[stage.id]
            const isExpanded = expanded[stage.id] && status === 'done'

            const ringClass =
              status === 'running' ? 'ring-2 ring-clara-pink animate-pulse' :
              status === 'done'    ? 'ring-1 ring-emerald-300' :
              status === 'error'   ? 'ring-1 ring-rose-300' :
                                     'ring-1 ring-clara-purple/10'

            return (
              <li key={stage.id} className="relative">
                {idx < STAGES.length - 1 && (
                  <span
                    className="absolute left-7 top-16 bottom-[-1.25rem] w-0.5 bg-gradient-to-b from-clara-pink/30 via-clara-purple/30 to-clara-sky/30"
                    aria-hidden="true"
                  />
                )}

                <article className={`relative rounded-2xl bg-white shadow-clara-sm p-6 flex gap-5 ${ringClass}`}>
                  <div className="flex-shrink-0">
                    <div className={`grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stage.accent} text-white font-display font-extrabold text-xl shadow-clara-sm`}>
                      {idx + 1}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-clara-cream border border-clara-purple/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-clara-deep">
                        {stage.day} · {stage.time}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-clara-magenta">
                        <span aria-hidden="true">{stage.icon}</span> {stage.agent}
                      </span>
                      {status === 'pending' && (
                        <span className="text-[11px] font-semibold text-clara-ink/40 uppercase tracking-widest">Pending</span>
                      )}
                      {status === 'running' && (
                        <span className="text-[11px] font-semibold text-clara-magenta uppercase tracking-widest">Running…</span>
                      )}
                      {status === 'done' && (
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-widest">✓ Done</span>
                      )}
                      {status === 'error' && (
                        <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-widest">✗ Error</span>
                      )}
                    </div>

                    <h3 className="mt-2 font-display text-lg font-extrabold text-clara-deep leading-snug">
                      {stage.headline}
                    </h3>
                    <div className="mt-1 text-xs text-clara-ink/55 font-mono">{stage.triggerSummary}</div>

                    {status === 'error' && error && (
                      <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-800">
                        {error}
                      </div>
                    )}

                    {status === 'done' && data && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setExpanded((e) => ({ ...e, [stage.id]: !e[stage.id] }))}
                          className="text-xs font-semibold text-clara-purple hover:text-clara-magenta mb-2"
                        >
                          {isExpanded ? '▾ Hide details' : '▸ Show details'}
                        </button>

                        {isExpanded && (
                          <div className="rounded-xl bg-clara-cream border border-clara-purple/10 p-4">
                            <StageSummary stage={stage} data={data} />
                            <details className="mt-3">
                              <summary className="text-[11px] font-semibold text-clara-ink/50 uppercase tracking-widest cursor-pointer hover:text-clara-magenta">
                                Raw API response
                              </summary>
                              <pre className="mt-2 text-[11px] text-clara-ink/70 bg-white border border-clara-purple/10 rounded-lg p-3 overflow-x-auto max-h-64">
{JSON.stringify(data, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </li>
            )
          })}
        </ol>

        {done && (
          <div className="mt-10 rounded-3xl bg-clara-gradient-2 p-8 text-white shadow-clara text-center">
            <h2 className="font-display text-2xl lg:text-3xl font-extrabold">
              That's six agents, one customer, six months — in 12 seconds.
            </h2>
            <p className="mt-3 text-white/85 max-w-xl mx-auto text-sm">
              Every response above is a live Claude call. In production each stage triggers from a
              webhook (Stripe, Calendly, Google Reviews) — Clara just shows up at the right time.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <Link
                to="/pricing"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-clara-purple hover:scale-[1.02] transition"
              >
                See pricing →
              </Link>
              <Link
                to="/setup"
                className="rounded-full border-2 border-white/70 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                How setup works
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-clara-deep text-white/80">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-clara-gradient text-white font-bold">C</span>
            <span className="font-display text-xl font-extrabold text-white">ClaraDesk</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/journey" className="hover:text-clara-sky">Journey</Link>
            <Link to="/pricing" className="hover:text-clara-sky">Pricing</Link>
            <Link to="/setup"   className="hover:text-clara-sky">Setup</Link>
            <Link to="/#blog"   className="hover:text-clara-sky">Blog</Link>
          </div>
          <span className="text-xs text-white/50">© {new Date().getFullYear()} ClaraDesk · Made by Pratibha Jadhav</span>
        </div>
      </footer>
    </div>
  )
}

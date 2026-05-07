import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import WelcomeForm from './WelcomeForm.jsx'

const HEALTH_STYLES = {
  green:  { label: '🟢 Green',  ring: 'ring-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-800' },
  yellow: { label: '🟡 Yellow', ring: 'ring-amber-400',   bg: 'bg-amber-50',   text: 'text-amber-800'   },
  red:    { label: '🔴 Red',    ring: 'ring-rose-400',    bg: 'bg-rose-50',    text: 'text-rose-800'    },
}

const TARGET_WORDS = 200

function wordCount(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length
}

export default function WelcomePage() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const [editableSubject, setEditableSubject] = useState('')
  const [editableBody, setEditableBody] = useState('')
  const [copiedKey, setCopiedKey] = useState(null)

  const handleSubmit = async (formData) => {
    setStatus('loading')
    setErrorMessage('')
    setResult(null)
    try {
      const { data } = await axios.post('/api/welcome/draft', formData)
      setResult(data)
      setEditableSubject(data.subject || '')
      setEditableBody(data.email_body || '')
      setStatus('success')
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        'Could not draft a welcome. Please try again.'
      setErrorMessage(detail)
      setStatus('error')
    }
  }

  useEffect(() => {
    if (!copiedKey) return
    const t = setTimeout(() => setCopiedKey(null), 1500)
    return () => clearTimeout(t)
  }, [copiedKey])

  const liveWords = useMemo(() => wordCount(editableBody), [editableBody])
  const wordsOver = liveWords > TARGET_WORDS
  const healthStyle = result ? HEALTH_STYLES[result.health_signal] : null

  const copyText = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text || '')
      setCopiedKey(key)
    } catch {
      setCopiedKey(null)
    }
  }

  const copyEmail = () => {
    copyText('all', `Subject: ${editableSubject}\n\n${editableBody}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-clara-magenta">
          <span>👋</span> Onboarding Agent
        </div>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-clara-deep">
          First impressions, on autopilot.
        </h1>
        <p className="mt-3 text-clara-ink/70 max-w-2xl">
          Drop in a new signup. Onboarding Agent writes a plan-tuned welcome email, builds an
          activation checklist, picks the highest-ROI first win, and gives your CSM team a health
          read so they know who to watch.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-6 lg:p-7 shadow-clara-sm border border-clara-purple/10">
        <WelcomeForm onSubmit={handleSubmit} isLoading={status === 'loading'} />

        {status === 'error' && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}
      </section>

      {status === 'success' && result && (
        <section className="mt-8 space-y-6">
          {/* Health signal + first win */}
          <div className={`rounded-2xl border-2 ring-1 ${healthStyle.ring} ${healthStyle.bg} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className={`text-xs font-bold uppercase tracking-widest ${healthStyle.text}`}>
                  CSM health read
                </div>
                <div className="mt-1 font-display text-2xl font-extrabold text-clara-deep">
                  {healthStyle.label}
                </div>
                <p className="mt-2 text-sm text-clara-ink/75 max-w-xl">{result.health_reasoning}</p>
              </div>

              <div className="rounded-xl bg-white border border-clara-purple/10 px-4 py-3 max-w-sm">
                <div className="text-[11px] font-bold uppercase tracking-widest text-clara-magenta">
                  First win
                </div>
                <div className="mt-1 text-sm font-semibold text-clara-deep">
                  {result.first_win || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Welcome email card */}
          <div className="rounded-2xl bg-white border border-clara-purple/10 shadow-clara-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-clara-purple/10 bg-clara-cream flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">
                Welcome email
              </div>
              <span
                className={[
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                  result.slack_posted
                    ? 'bg-clara-sky/20 text-clara-deep'
                    : 'bg-white border border-clara-purple/15 text-clara-ink/60',
                ].join(' ')}
                title={result.slack_posted
                  ? 'Posted to #onboarding'
                  : 'Add SLACK_ONBOARDING_WEBHOOK to backend/.env to enable'}
              >
                {result.slack_posted ? '✓ Posted to #onboarding' : 'Slack post skipped (no webhook set)'}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-clara-magenta">
                    Subject
                  </label>
                  <button
                    type="button"
                    onClick={() => copyText('subject', editableSubject)}
                    className="text-xs font-semibold text-clara-purple hover:text-clara-magenta"
                  >
                    {copiedKey === 'subject' ? '✓ copied' : 'Copy'}
                  </button>
                </div>
                <input
                  type="text"
                  value={editableSubject}
                  onChange={(e) => setEditableSubject(e.target.value)}
                  className="w-full rounded-xl border border-clara-purple/20 px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-clara-magenta">
                    Email body
                  </label>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${wordsOver ? 'text-red-600' : 'text-clara-ink/50'}`}>
                      {liveWords} / {TARGET_WORDS} words {wordsOver && '· trim it'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyText('body', editableBody)}
                      className="text-xs font-semibold text-clara-purple hover:text-clara-magenta"
                    >
                      {copiedKey === 'body' ? '✓ copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <textarea
                  rows={10}
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  className="w-full rounded-xl border border-clara-purple/20 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink"
                />
              </div>

              <button
                type="button"
                onClick={copyEmail}
                className="rounded-full bg-clara-gradient px-5 py-2 text-sm font-semibold text-white shadow-clara-sm hover:shadow-clara transition"
              >
                {copiedKey === 'all' ? '✓ Copied subject + body' : 'Copy subject + body'}
              </button>
            </div>
          </div>

          {/* Activation checklist */}
          <div className="rounded-2xl bg-white border border-clara-purple/10 shadow-clara-sm p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta mb-4">
              Activation checklist
            </div>
            <ol className="space-y-3">
              {(result.checklist || []).map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 grid place-items-center w-9 h-9 rounded-xl bg-clara-gradient text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-clara-deep">{item.step}</div>
                    <div className="mt-0.5 text-sm text-clara-ink/65">{item.why}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Day-7 follow-up teaser */}
          {result.day_7_followup_subject && (
            <div className="rounded-2xl bg-clara-cream border border-clara-purple/10 p-5 flex items-start gap-4">
              <span className="text-2xl" aria-hidden="true">📅</span>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">
                  Day-7 follow-up · subject preview
                </div>
                <div className="mt-1 text-sm font-semibold text-clara-deep">
                  {result.day_7_followup_subject}
                </div>
                <div className="mt-1 text-xs text-clara-ink/55">
                  Onboarding Agent queues this for the day-7 nudge so first-week activation does not stall.
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import BillingForm from './BillingForm.jsx'

const TONE_STYLES = {
  friendly: { label: '🙂 Friendly', ring: 'ring-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-800' },
  direct:   { label: '📌 Direct',   ring: 'ring-amber-300',   bg: 'bg-amber-50',   text: 'text-amber-800'   },
  firm:     { label: '⚠️ Firm',     ring: 'ring-rose-400',    bg: 'bg-rose-50',    text: 'text-rose-800'    },
}

const RECOVERY_STYLES = {
  high:   { label: 'High recovery',   pill: 'bg-emerald-100 text-emerald-800' },
  medium: { label: 'Medium recovery', pill: 'bg-amber-100 text-amber-800'    },
  low:    { label: 'Low recovery',    pill: 'bg-rose-100 text-rose-800'      },
}

const TARGET_WORDS = 100

function wordCount(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length
}

export default function BillingPage() {
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
      const { data } = await axios.post('/api/billing/nudge', formData)
      setResult(data)
      setEditableSubject(data.subject || '')
      setEditableBody(data.email_body || '')
      setStatus('success')
    } catch (err) {
      setErrorMessage(err?.response?.data?.detail || err?.message || 'Could not draft a nudge.')
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
  const toneStyle = result ? TONE_STYLES[result.tone] : null
  const recoveryStyle = result ? RECOVERY_STYLES[result.recovery_probability] : null

  const copyText = async (key, text) => {
    try { await navigator.clipboard.writeText(text || ''); setCopiedKey(key) } catch { setCopiedKey(null) }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-clara-magenta">
          <span>💳</span> Billing Agent
        </div>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-clara-deep">
          Get paid without the awkward ping.
        </h1>
        <p className="mt-3 text-clara-ink/70 max-w-2xl">
          Drop in an overdue invoice. Billing Agent calibrates the tone by days overdue, scores
          the recovery odds, and suggests a payment plan when the amount is worth saving.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-6 lg:p-7 shadow-clara-sm border border-clara-purple/10">
        <BillingForm onSubmit={handleSubmit} isLoading={status === 'loading'} />
        {status === 'error' && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{errorMessage}</div>
        )}
      </section>

      {status === 'success' && result && (
        <section className="mt-8 space-y-6">
          {/* Tone + recovery banner */}
          <div className={`rounded-2xl border-2 ring-1 ${toneStyle.ring} ${toneStyle.bg} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className={`text-xs font-bold uppercase tracking-widest ${toneStyle.text}`}>Tone</div>
                <div className="mt-1 font-display text-2xl font-extrabold text-clara-deep">{toneStyle.label}</div>
                <p className="mt-2 text-sm text-clara-ink/75">{result.recovery_reasoning}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${recoveryStyle.pill}`}>
                  {recoveryStyle.label}
                </span>
                {result.payment_plan_offer && (
                  <span className="rounded-full bg-clara-purple/10 text-clara-purple px-3 py-1 text-xs font-semibold">
                    💡 Payment plan suggested
                  </span>
                )}
              </div>
            </div>

            {result.payment_plan_offer && (
              <div className="mt-4 rounded-xl bg-white border border-clara-purple/15 p-4">
                <div className="text-[11px] font-bold uppercase tracking-widest text-clara-magenta">
                  Suggested concession (optional)
                </div>
                <div className="mt-1 text-sm text-clara-deep">{result.payment_plan_offer}</div>
              </div>
            )}
          </div>

          {/* Email card */}
          <div className="rounded-2xl bg-white border border-clara-purple/10 shadow-clara-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-clara-purple/10 bg-clara-cream flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Reminder email</div>
              <span className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                result.slack_posted ? 'bg-clara-sky/20 text-clara-deep' : 'bg-white border border-clara-purple/15 text-clara-ink/60',
              ].join(' ')}
                title={result.slack_posted ? 'Posted to #billing' : 'Add SLACK_BILLING_WEBHOOK to backend/.env to enable'}>
                {result.slack_posted ? '✓ Posted to #billing' : 'Slack post skipped (no webhook set)'}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Subject</label>
                  <button type="button" onClick={() => copyText('subject', editableSubject)}
                    className="text-xs font-semibold text-clara-purple hover:text-clara-magenta">
                    {copiedKey === 'subject' ? '✓ copied' : 'Copy'}
                  </button>
                </div>
                <input type="text" value={editableSubject} onChange={(e) => setEditableSubject(e.target.value)}
                  className="w-full rounded-xl border border-clara-purple/20 px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Email body</label>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${wordsOver ? 'text-red-600' : 'text-clara-ink/50'}`}>
                      {liveWords} / {TARGET_WORDS} words {wordsOver && '· trim it'}
                    </span>
                    <button type="button" onClick={() => copyText('body', editableBody)}
                      className="text-xs font-semibold text-clara-purple hover:text-clara-magenta">
                      {copiedKey === 'body' ? '✓ copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <textarea rows={9} value={editableBody} onChange={(e) => setEditableBody(e.target.value)}
                  className="w-full rounded-xl border border-clara-purple/20 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink" />
              </div>

              <button type="button" onClick={() => copyText('all', `Subject: ${editableSubject}\n\n${editableBody}`)}
                className="rounded-full bg-clara-gradient px-5 py-2 text-sm font-semibold text-white shadow-clara-sm hover:shadow-clara transition">
                {copiedKey === 'all' ? '✓ Copied subject + body' : 'Copy subject + body'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

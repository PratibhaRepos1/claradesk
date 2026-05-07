import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import BookingsForm from './BookingsForm.jsx'

const WINBACK_STYLES = {
  high:   { label: '🟢 High win-back chance',   ring: 'ring-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-800' },
  medium: { label: '🟡 Medium win-back chance', ring: 'ring-amber-400',   bg: 'bg-amber-50',   text: 'text-amber-800'   },
  low:    { label: '🔴 Low win-back chance',    ring: 'ring-rose-400',    bg: 'bg-rose-50',    text: 'text-rose-800'    },
}

const CATEGORY_LABELS = {
  schedule_conflict: 'Schedule conflict',
  dissatisfaction:   'Dissatisfaction',
  financial:         'Financial',
  external:          'External',
  other:             'Other',
}

const TARGET_WORDS = 120
const SMS_LIMIT = 160

function wordCount(text) { return (text || '').trim().split(/\s+/).filter(Boolean).length }

export default function BookingsPage() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const [editableBody, setEditableBody] = useState('')
  const [editableSms, setEditableSms] = useState('')
  const [copiedKey, setCopiedKey] = useState(null)

  const handleSubmit = async (formData) => {
    setStatus('loading')
    setErrorMessage('')
    setResult(null)
    try {
      const { data } = await axios.post('/api/bookings/winback', formData)
      setResult(data)
      setEditableBody(data.message_body || '')
      setEditableSms(data.sms_variant || '')
      setStatus('success')
    } catch (err) {
      setErrorMessage(err?.response?.data?.detail || err?.message || 'Could not draft a win-back.')
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
  const smsLen = editableSms.length
  const smsOver = smsLen > SMS_LIMIT
  const wb = result ? WINBACK_STYLES[result.winback_probability] : null

  const copyText = async (key, text) => {
    try { await navigator.clipboard.writeText(text || ''); setCopiedKey(key) } catch { setCopiedKey(null) }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-clara-magenta">
          <span>📅</span> Booking Agent
        </div>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-clara-deep">
          Win back every cancelled slot.
        </h1>
        <p className="mt-3 text-clara-ink/70 max-w-2xl">
          Drop in a cancellation. Booking Agent reads the reason, scans the booking history,
          tags the cancellation category, flags risks, and drafts both an email and an SMS
          win-back with reschedule options.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-6 lg:p-7 shadow-clara-sm border border-clara-purple/10">
        <BookingsForm onSubmit={handleSubmit} isLoading={status === 'loading'} />
        {status === 'error' && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{errorMessage}</div>
        )}
      </section>

      {status === 'success' && result && (
        <section className="mt-8 space-y-6">
          {/* Win-back banner */}
          <div className={`rounded-2xl border-2 ring-1 ${wb.ring} ${wb.bg} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className={`text-xs font-bold uppercase tracking-widest ${wb.text}`}>Retention read</div>
                <div className="mt-1 font-display text-2xl font-extrabold text-clara-deep">{wb.label}</div>
                <p className="mt-2 text-sm text-clara-ink/75 max-w-xl">{result.winback_reasoning}</p>
              </div>
              <div className="rounded-xl bg-white border border-clara-purple/10 px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-widest text-clara-magenta">Category</div>
                <div className="mt-1 text-sm font-semibold text-clara-deep">
                  {CATEGORY_LABELS[result.cancellation_category] || result.cancellation_category}
                </div>
              </div>
            </div>

            {result.risk_factors?.length > 0 && (
              <div className="mt-4 rounded-xl bg-white border border-rose-200 p-4">
                <div className="text-[11px] font-bold uppercase tracking-widest text-rose-700">⚠ Risk factors</div>
                <ul className="mt-2 space-y-1 text-sm text-clara-ink/80">
                  {result.risk_factors.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Email message card */}
          <div className="rounded-2xl bg-white border border-clara-purple/10 shadow-clara-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-clara-purple/10 bg-clara-cream flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">
                Email message · {result.tone}
              </div>
              <span className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                result.slack_posted ? 'bg-clara-sky/20 text-clara-deep' : 'bg-white border border-clara-purple/15 text-clara-ink/60',
              ].join(' ')}
                title={result.slack_posted ? 'Posted to #bookings' : 'Add SLACK_BOOKINGS_WEBHOOK to backend/.env to enable'}>
                {result.slack_posted ? '✓ Posted to #bookings' : 'Slack post skipped (no webhook set)'}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Message body</label>
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
                <textarea rows={8} value={editableBody} onChange={(e) => setEditableBody(e.target.value)}
                  className="w-full rounded-xl border border-clara-purple/20 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink" />
              </div>

              {result.suggested_times?.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-clara-magenta mb-2">
                    Suggested time slots
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.suggested_times.map((t, i) => (
                      <span key={i} className="rounded-full bg-clara-pink/10 text-clara-magenta px-3 py-1 text-xs font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SMS variant card */}
          <div className="rounded-2xl bg-white border border-clara-purple/10 shadow-clara-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-clara-purple/10 bg-clara-cream flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">📱 SMS variant</div>
              <button type="button" onClick={() => copyText('sms', editableSms)}
                className="text-xs font-semibold text-clara-purple hover:text-clara-magenta">
                {copiedKey === 'sms' ? '✓ copied' : 'Copy'}
              </button>
            </div>
            <div className="p-6 space-y-3">
              <textarea rows={3} value={editableSms} onChange={(e) => setEditableSms(e.target.value)}
                className="w-full rounded-xl border border-clara-purple/20 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink" />
              <div className={`text-xs font-medium ${smsOver ? 'text-red-600' : 'text-clara-ink/50'}`}>
                {smsLen} / {SMS_LIMIT} chars {smsOver && '· over SMS limit'}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

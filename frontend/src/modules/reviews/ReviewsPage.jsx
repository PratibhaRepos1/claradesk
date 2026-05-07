import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import ReviewsForm from './ReviewsForm.jsx'

const SEVERITY_STYLES = {
  mild:     { label: '🟢 Mild',     ring: 'ring-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-800' },
  moderate: { label: '🟡 Moderate', ring: 'ring-amber-400',   bg: 'bg-amber-50',   text: 'text-amber-800'   },
  severe:   { label: '🔴 Severe',   ring: 'ring-rose-400',    bg: 'bg-rose-50',    text: 'text-rose-800'    },
}

const OWNER_LABELS = {
  frontdesk: '🛎 Frontdesk',
  kitchen:   '🍳 Kitchen',
  support:   '🛠 Support',
  billing:   '💳 Billing',
  mgmt:      '👔 Management',
  ops:       '⚙ Ops',
  other:     '👥 Other',
}

const TARGET_WORDS = 100

function wordCount(text) { return (text || '').trim().split(/\s+/).filter(Boolean).length }

export default function ReviewsPage() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const [editablePublic, setEditablePublic] = useState('')
  const [editableInternal, setEditableInternal] = useState('')
  const [copiedKey, setCopiedKey] = useState(null)

  const handleSubmit = async (formData) => {
    setStatus('loading')
    setErrorMessage('')
    setResult(null)
    try {
      const { data } = await axios.post('/api/reviews/draft', formData)
      setResult(data)
      setEditablePublic(data.public_response || '')
      setEditableInternal(data.internal_note || '')
      setStatus('success')
    } catch (err) {
      setErrorMessage(err?.response?.data?.detail || err?.message || 'Could not draft a response.')
      setStatus('error')
    }
  }

  useEffect(() => {
    if (!copiedKey) return
    const t = setTimeout(() => setCopiedKey(null), 1500)
    return () => clearTimeout(t)
  }, [copiedKey])

  const liveWords = useMemo(() => wordCount(editablePublic), [editablePublic])
  const wordsOver = liveWords > TARGET_WORDS
  const sev = result ? SEVERITY_STYLES[result.severity] : null

  const copyText = async (key, text) => {
    try { await navigator.clipboard.writeText(text || ''); setCopiedKey(key) } catch { setCopiedKey(null) }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-clara-magenta">
          <span>⭐</span> Review Agent
        </div>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-clara-deep">
          Protect your stars, every time.
        </h1>
        <p className="mt-3 text-clara-ink/70 max-w-2xl">
          Drop in a negative review. Review Agent grades severity, drafts an empathetic public
          reply, writes an internal note, and assigns root-cause owners by team — so the people
          who can fix it actually see it.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-6 lg:p-7 shadow-clara-sm border border-clara-purple/10">
        <ReviewsForm onSubmit={handleSubmit} isLoading={status === 'loading'} />
        {status === 'error' && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{errorMessage}</div>
        )}
      </section>

      {status === 'success' && result && (
        <section className="mt-8 space-y-6">
          {/* Severity banner */}
          <div className={`rounded-2xl border-2 ring-1 ${sev.ring} ${sev.bg} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className={`text-xs font-bold uppercase tracking-widest ${sev.text}`}>Severity</div>
                <div className="mt-1 font-display text-2xl font-extrabold text-clara-deep">{sev.label}</div>
                <p className="mt-2 text-sm text-clara-ink/75 max-w-xl">{result.severity_reasoning}</p>
              </div>
              {result.suggested_compensation && (
                <div className="rounded-xl bg-white border border-clara-purple/15 px-4 py-3 max-w-sm">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-clara-magenta">
                    Suggested compensation
                  </div>
                  <div className="mt-1 text-sm font-semibold text-clara-deep">{result.suggested_compensation}</div>
                </div>
              )}
            </div>
          </div>

          {/* Root issues with owners */}
          {result.root_issues?.length > 0 && (
            <div className="rounded-2xl bg-white border border-clara-purple/10 shadow-clara-sm p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta mb-4">
                Root issues · assigned owners
              </div>
              <ul className="space-y-3">
                {result.root_issues.map((r, i) => (
                  <li key={i} className="flex items-start gap-4 rounded-xl bg-clara-cream p-3 border border-clara-purple/10">
                    <span className="rounded-full bg-clara-pink/10 text-clara-magenta px-3 py-1 text-xs font-semibold whitespace-nowrap">
                      {OWNER_LABELS[r.suggested_owner] || r.suggested_owner}
                    </span>
                    <span className="text-sm text-clara-ink/85 pt-0.5">{r.issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Public response */}
          <div className="rounded-2xl bg-white border border-clara-purple/10 shadow-clara-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-clara-purple/10 bg-clara-cream flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta">
                Public response · post on platform
              </div>
              <span className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                result.slack_posted ? 'bg-clara-sky/20 text-clara-deep' : 'bg-white border border-clara-purple/15 text-clara-ink/60',
              ].join(' ')}
                title={result.slack_posted ? 'Posted to #reviews' : 'Add SLACK_REVIEWS_WEBHOOK to backend/.env to enable'}>
                {result.slack_posted ? '✓ Posted to #reviews' : 'Slack post skipped (no webhook set)'}
              </span>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${wordsOver ? 'text-red-600' : 'text-clara-ink/50'}`}>
                  {liveWords} / {TARGET_WORDS} words {wordsOver && '· trim it'}
                </span>
                <button type="button" onClick={() => copyText('public', editablePublic)}
                  className="text-xs font-semibold text-clara-purple hover:text-clara-magenta">
                  {copiedKey === 'public' ? '✓ copied' : 'Copy public reply'}
                </button>
              </div>
              <textarea rows={8} value={editablePublic} onChange={(e) => setEditablePublic(e.target.value)}
                className="w-full rounded-xl border border-clara-purple/20 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink" />
            </div>
          </div>

          {/* Internal note */}
          <div className="rounded-2xl bg-clara-deep text-white shadow-clara-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-clara-sky">
                🔒 Internal note · team only
              </div>
              <button type="button" onClick={() => copyText('internal', editableInternal)}
                className="text-xs font-semibold text-clara-sky hover:text-white">
                {copiedKey === 'internal' ? '✓ copied' : 'Copy'}
              </button>
            </div>
            <div className="p-6">
              <textarea rows={5} value={editableInternal} onChange={(e) => setEditableInternal(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-white/40 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-clara-sky focus:border-clara-sky" />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

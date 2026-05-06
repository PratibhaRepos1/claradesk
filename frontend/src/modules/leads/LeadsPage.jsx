import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import LeadsForm from './LeadsForm.jsx'

const SCORE_STYLES = {
  hot:  { label: '🔥 Hot lead',  ring: 'ring-clara-pink',    bg: 'bg-clara-pink/10',    text: 'text-clara-magenta' },
  warm: { label: '🌤 Warm lead', ring: 'ring-clara-purple',  bg: 'bg-clara-purple/10',  text: 'text-clara-purple'  },
  cold: { label: '❄️ Cold lead', ring: 'ring-clara-sky',     bg: 'bg-clara-sky/15',     text: 'text-clara-deep'    },
}

const TARGET_WORDS = 150

function wordCount(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length
}

export default function LeadsPage() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Editable variants — keyed by tone, seeded from API result
  const [activeTone, setActiveTone] = useState('friendly')
  const [drafts, setDrafts] = useState({})  // { friendly: {subject, body}, professional: {...} }
  const [copiedKey, setCopiedKey] = useState(null)

  const handleSubmit = async (formData) => {
    setStatus('loading')
    setErrorMessage('')
    setResult(null)
    try {
      const { data } = await axios.post('/api/leads/draft', formData)
      setResult(data)
      const seed = {}
      for (const v of data.variants || []) {
        seed[v.tone] = { subject: v.subject, body: v.email_body }
      }
      setDrafts(seed)
      setActiveTone(seed.friendly ? 'friendly' : Object.keys(seed)[0] || 'friendly')
      setStatus('success')
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        'Could not draft a follow-up. Please try again.'
      setErrorMessage(detail)
      setStatus('error')
    }
  }

  // clear "Copied!" indicator after 1.5s
  useEffect(() => {
    if (!copiedKey) return
    const t = setTimeout(() => setCopiedKey(null), 1500)
    return () => clearTimeout(t)
  }, [copiedKey])

  const score = result?.lead_score
  const scoreStyle = score ? SCORE_STYLES[score] : null

  const activeDraft = drafts[activeTone] || { subject: '', body: '' }
  const liveWords = useMemo(() => wordCount(activeDraft.body), [activeDraft.body])
  const wordsOver = liveWords > TARGET_WORDS

  const updateDraft = (field, value) => {
    setDrafts((d) => ({ ...d, [activeTone]: { ...d[activeTone], [field]: value } }))
  }

  const copyText = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text || '')
      setCopiedKey(key)
    } catch {
      setCopiedKey(null)
    }
  }

  const copyEmail = () => {
    const both = `Subject: ${activeDraft.subject}\n\n${activeDraft.body}`
    copyText('all', both)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-clara-magenta">
          <span>🎯</span> Lead Agent
        </div>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-clara-deep">
          Turn cold leads into warm replies.
        </h1>
        <p className="mt-3 text-clara-ink/70 max-w-2xl">
          Drop in an inquiry. Lead Agent scores the lead, tags intent, suggests the next move,
          and drafts two ready-to-send follow-ups — friendly and professional.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-6 lg:p-7 shadow-clara-sm border border-clara-purple/10">
        <LeadsForm onSubmit={handleSubmit} isLoading={status === 'loading'} />

        {status === 'error' && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}
      </section>

      {status === 'success' && result && (
        <section className="mt-8 space-y-6">
          {/* Score + reasoning + next action */}
          <div className={`rounded-2xl border-2 ring-1 ${scoreStyle.ring} ${scoreStyle.bg} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className={`text-xs font-bold uppercase tracking-widest ${scoreStyle.text}`}>
                  Lead score
                </div>
                <div className="mt-1 font-display text-2xl font-extrabold text-clara-deep">
                  {scoreStyle.label}
                </div>
                <p className="mt-2 text-sm text-clara-ink/75 max-w-xl">{result.score_reasoning}</p>
              </div>

              <div className="rounded-xl bg-white border border-clara-purple/10 px-4 py-3 max-w-sm">
                <div className="text-[11px] font-bold uppercase tracking-widest text-clara-magenta">
                  Next action
                </div>
                <div className="mt-1 text-sm font-semibold text-clara-deep">
                  {result.next_action || '—'}
                </div>
              </div>
            </div>

            {result.intent_tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {result.intent_tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full bg-white border border-clara-purple/20 px-3 py-1 text-xs font-semibold text-clara-deep"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Variant tabs */}
          <div className="rounded-2xl bg-white border border-clara-purple/10 shadow-clara-sm overflow-hidden">
            <div className="flex border-b border-clara-purple/10">
              {(result.variants || []).map((v) => {
                const isActive = activeTone === v.tone
                return (
                  <button
                    key={v.tone}
                    type="button"
                    onClick={() => setActiveTone(v.tone)}
                    className={[
                      'flex-1 px-4 py-3 text-sm font-semibold capitalize transition',
                      isActive
                        ? 'bg-clara-gradient text-white'
                        : 'text-clara-ink/70 hover:bg-clara-pink/10 hover:text-clara-magenta',
                    ].join(' ')}
                  >
                    {v.tone}
                    <span className={`ml-2 text-[11px] font-normal ${isActive ? 'text-white/80' : 'text-clara-ink/50'}`}>
                      · {v.word_count} words
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Editable subject */}
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-clara-magenta">
                    Subject
                  </label>
                  <button
                    type="button"
                    onClick={() => copyText('subject', activeDraft.subject)}
                    className="text-xs font-semibold text-clara-purple hover:text-clara-magenta"
                  >
                    {copiedKey === 'subject' ? '✓ copied' : 'Copy'}
                  </button>
                </div>
                <input
                  type="text"
                  value={activeDraft.subject}
                  onChange={(e) => updateDraft('subject', e.target.value)}
                  className="w-full rounded-xl border border-clara-purple/20 px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink"
                />
              </div>

              {/* Editable body */}
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
                      onClick={() => copyText('body', activeDraft.body)}
                      className="text-xs font-semibold text-clara-purple hover:text-clara-magenta"
                    >
                      {copiedKey === 'body' ? '✓ copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <textarea
                  rows={10}
                  value={activeDraft.body}
                  onChange={(e) => updateDraft('body', e.target.value)}
                  className="w-full rounded-xl border border-clara-purple/20 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="rounded-full bg-clara-gradient px-5 py-2 text-sm font-semibold text-white shadow-clara-sm hover:shadow-clara transition"
                >
                  {copiedKey === 'all' ? '✓ Copied subject + body' : 'Copy subject + body'}
                </button>

                <span
                  className={[
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                    result.slack_posted
                      ? 'bg-clara-sky/20 text-clara-deep'
                      : 'bg-clara-cream border border-clara-purple/15 text-clara-ink/60',
                  ].join(' ')}
                  title={result.slack_posted
                    ? 'Posted to #sales-leads'
                    : 'Add SLACK_LEADS_WEBHOOK to backend/.env to enable'}
                >
                  {result.slack_posted
                    ? '✓ Posted to #sales-leads'
                    : 'Slack post skipped (no webhook set)'}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

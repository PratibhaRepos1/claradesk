import { useState } from 'react'
import axios from 'axios'

import ResultPanel from '../../components/ResultPanel.jsx'
import InboxForm from './InboxForm.jsx'

const CATEGORY_STYLES = {
  sales:       { accent: 'bg-emerald-50 border-emerald-200 text-emerald-900', label: '💼 Sales' },
  support:     { accent: 'bg-sky-50 border-sky-200 text-sky-900',             label: '🛠 Support' },
  partnership: { accent: 'bg-amber-50 border-amber-200 text-amber-900',       label: '🤝 Partnership' },
  spam:        { accent: 'bg-rose-50 border-rose-200 text-rose-900',          label: '🚫 Spam' },
}

export default function InboxPage() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (formData) => {
    setStatus('loading')
    setErrorMessage('')
    setResult(null)
    try {
      const { data } = await axios.post('/api/inbox/classify', formData)
      setResult(data)
      setStatus('success')
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        'Something went wrong while classifying your message.'
      setErrorMessage(detail)
      setStatus('error')
    }
  }

  const style = result ? (CATEGORY_STYLES[result.category] ?? CATEGORY_STYLES.sales) : null

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Clara Inbox</h1>
        <p className="mt-2 text-slate-600">
          Send a contact-form message and Claude classifies it as sales, support,
          partnership, or spam — then routes it to the right Slack channel.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <InboxForm onSubmit={handleSubmit} isLoading={status === 'loading'} />

        {status === 'error' && (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        {status === 'success' && result && (
          <ResultPanel
            title={style.label}
            accent={style.accent}
            slackPosted={result.slack_posted}
            slackChannel={result.routed_to}
          >
            <div className="space-y-2">
              <div>
                <span className="text-xs uppercase tracking-wide font-medium opacity-70">
                  Confidence:
                </span>{' '}
                <span className="font-medium">{result.confidence}</span>
              </div>
              <p>
                <span className="font-medium">Reasoning: </span>
                {result.reasoning}
              </p>
              <div className="text-xs opacity-80 pt-2 border-t border-current/10">
                Routed to <span className="font-medium">{result.routed_to}</span>
              </div>
            </div>
          </ResultPanel>
        )}
      </section>
    </div>
  )
}

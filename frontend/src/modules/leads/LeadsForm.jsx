import { useState } from 'react'

const SAMPLE = {
  name: 'Marcus Hill',
  email: 'marcus@stripe.io',
  company: 'Stripe',
  inquiry_details:
    'We have budget approved and need a vendor in place by end of this quarter. Looking at 75 seats minimum, would like a demo ASAP and a quote.',
}

export default function LeadsForm({ onSubmit, isLoading }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [inquiry, setInquiry] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !inquiry.trim()) return
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || undefined,
      inquiry_details: inquiry.trim(),
    })
  }

  const fillSample = () => {
    setName(SAMPLE.name)
    setEmail(SAMPLE.email)
    setCompany(SAMPLE.company)
    setInquiry(SAMPLE.inquiry_details)
  }

  const inputClass =
    'w-full rounded-xl border border-clara-purple/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink disabled:bg-clara-cream disabled:opacity-60 transition'
  const labelClass = 'block text-sm font-semibold text-clara-deep mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lead-name" className={labelClass}>Name</label>
          <input
            id="lead-name" type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading} required
            className={inputClass} placeholder="Marcus Hill"
          />
        </div>
        <div>
          <label htmlFor="lead-email" className={labelClass}>Email</label>
          <input
            id="lead-email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading} required
            className={inputClass} placeholder="marcus@stripe.io"
          />
        </div>
      </div>

      <div>
        <label htmlFor="lead-company" className={labelClass}>
          Company <span className="text-clara-ink/40 font-normal">(optional)</span>
        </label>
        <input
          id="lead-company" type="text" value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={isLoading}
          className={inputClass} placeholder="Stripe"
        />
      </div>

      <div>
        <label htmlFor="lead-inquiry" className={labelClass}>Inquiry details</label>
        <textarea
          id="lead-inquiry" rows={6} value={inquiry}
          onChange={(e) => setInquiry(e.target.value)}
          disabled={isLoading} required
          className={inputClass}
          placeholder="What are they looking for? Volume, timeline, budget, decision criteria…"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit" disabled={isLoading}
          className="rounded-full bg-clara-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-clara-sm hover:shadow-clara hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {isLoading ? 'Drafting…' : 'Draft follow-up'}
        </button>

        <button
          type="button" onClick={fillSample} disabled={isLoading}
          className="rounded-full border border-clara-purple/30 px-5 py-2.5 text-sm font-semibold text-clara-purple hover:bg-clara-purple hover:text-white transition disabled:opacity-50"
        >
          Try a hot lead sample
        </button>
      </div>
    </form>
  )
}

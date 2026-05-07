import { useState } from 'react'

const SAMPLES = [
  {
    label: 'Bundle Annual @ Stripe',
    data: {
      customer_name: 'Marcus Hill',
      email: 'marcus@stripe.com',
      company: 'Stripe',
      product_plan: 'Bundle Annual',
    },
  },
  {
    label: 'Pro Monthly @ HelloFresh',
    data: {
      customer_name: 'Priya Shah',
      email: 'priya@hellofresh.de',
      company: 'HelloFresh',
      product_plan: 'Pro Monthly',
    },
  },
  {
    label: 'Starter (Gmail user)',
    data: {
      customer_name: 'Sam',
      email: 'sam@gmail.com',
      company: '',
      product_plan: 'Starter',
    },
  },
]

export default function WelcomeForm({ onSubmit, isLoading }) {
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [plan, setPlan] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!customerName.trim() || !email.trim() || !plan.trim()) return
    onSubmit({
      customer_name: customerName.trim(),
      email: email.trim(),
      company: company.trim() || undefined,
      product_plan: plan.trim(),
    })
  }

  const fillSample = (sample) => {
    setCustomerName(sample.customer_name)
    setEmail(sample.email)
    setCompany(sample.company)
    setPlan(sample.product_plan)
  }

  const inputClass =
    'w-full rounded-xl border border-clara-purple/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink disabled:bg-clara-cream disabled:opacity-60 transition'
  const labelClass = 'block text-sm font-semibold text-clara-deep mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="welcome-name" className={labelClass}>Customer name</label>
          <input
            id="welcome-name" type="text" value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            disabled={isLoading} required
            className={inputClass} placeholder="Marcus Hill"
          />
        </div>
        <div>
          <label htmlFor="welcome-email" className={labelClass}>Email</label>
          <input
            id="welcome-email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading} required
            className={inputClass} placeholder="marcus@stripe.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="welcome-company" className={labelClass}>
            Company <span className="text-clara-ink/40 font-normal">(optional)</span>
          </label>
          <input
            id="welcome-company" type="text" value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={isLoading}
            className={inputClass} placeholder="Stripe"
          />
        </div>
        <div>
          <label htmlFor="welcome-plan" className={labelClass}>Plan they signed up for</label>
          <input
            id="welcome-plan" type="text" value={plan}
            onChange={(e) => setPlan(e.target.value)}
            disabled={isLoading} required
            className={inputClass} placeholder="Bundle Annual"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="submit" disabled={isLoading}
          className="rounded-full bg-clara-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-clara-sm hover:shadow-clara hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {isLoading ? 'Drafting…' : 'Draft welcome'}
        </button>

        <span className="text-xs text-clara-ink/50 mr-2">Or try a sample:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => fillSample(s.data)}
            disabled={isLoading}
            className="rounded-full border border-clara-purple/25 px-3 py-1 text-xs font-semibold text-clara-purple hover:bg-clara-purple hover:text-white transition disabled:opacity-50"
          >
            {s.label}
          </button>
        ))}
      </div>
    </form>
  )
}

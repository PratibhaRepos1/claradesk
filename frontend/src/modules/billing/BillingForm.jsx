import { useState } from 'react'

const SAMPLES = [
  {
    label: '5 days · friendly',
    data: { invoice_number: 'INV-4021', amount: 1240, days_overdue: 5,  customer_name: 'Sam Chen',  customer_email: 'sam@acme.io' },
  },
  {
    label: '14 days · direct',
    data: { invoice_number: 'INV-3987', amount: 2150, days_overdue: 14, customer_name: 'Riya Patel', customer_email: 'riya@studio.co' },
  },
  {
    label: '30 days · firm',
    data: { invoice_number: 'INV-3895', amount: 4800, days_overdue: 30, customer_name: 'Jamie Park', customer_email: 'jamie@latepay.io' },
  },
]

export default function BillingForm({ onSubmit, isLoading }) {
  const [invoice, setInvoice] = useState('')
  const [amount, setAmount] = useState('')
  const [days, setDays] = useState('')
  const [customer, setCustomer] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!invoice.trim() || !amount || !days || !customer.trim() || !email.trim()) return
    onSubmit({
      invoice_number: invoice.trim(),
      amount: Number(amount),
      days_overdue: Number(days),
      customer_name: customer.trim(),
      customer_email: email.trim(),
    })
  }

  const fillSample = (s) => {
    setInvoice(String(s.invoice_number))
    setAmount(String(s.amount))
    setDays(String(s.days_overdue))
    setCustomer(s.customer_name)
    setEmail(s.customer_email)
  }

  const inputClass =
    'w-full rounded-xl border border-clara-purple/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink disabled:bg-clara-cream disabled:opacity-60 transition'
  const labelClass = 'block text-sm font-semibold text-clara-deep mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="bill-inv" className={labelClass}>Invoice #</label>
          <input id="bill-inv" type="text" value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            disabled={isLoading} required className={inputClass} placeholder="INV-4021" />
        </div>
        <div>
          <label htmlFor="bill-amt" className={labelClass}>Amount (USD)</label>
          <input id="bill-amt" type="number" step="0.01" min="0.01" value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading} required className={inputClass} placeholder="1240" />
        </div>
        <div>
          <label htmlFor="bill-days" className={labelClass}>Days overdue</label>
          <input id="bill-days" type="number" step="1" min="0" value={days}
            onChange={(e) => setDays(e.target.value)}
            disabled={isLoading} required className={inputClass} placeholder="5" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bill-cust" className={labelClass}>Customer name</label>
          <input id="bill-cust" type="text" value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            disabled={isLoading} required className={inputClass} placeholder="Sam Chen" />
        </div>
        <div>
          <label htmlFor="bill-email" className={labelClass}>Customer email</label>
          <input id="bill-email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading} required className={inputClass} placeholder="sam@acme.io" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button type="submit" disabled={isLoading}
          className="rounded-full bg-clara-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-clara-sm hover:shadow-clara hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
          {isLoading && <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          {isLoading ? 'Drafting…' : 'Draft nudge'}
        </button>
        <span className="text-xs text-clara-ink/50 mr-2">Or try a sample:</span>
        {SAMPLES.map((s) => (
          <button key={s.label} type="button" onClick={() => fillSample(s.data)} disabled={isLoading}
            className="rounded-full border border-clara-purple/25 px-3 py-1 text-xs font-semibold text-clara-purple hover:bg-clara-purple hover:text-white transition disabled:opacity-50">
            {s.label}
          </button>
        ))}
      </div>
    </form>
  )
}

import { useState } from 'react'

const SAMPLES = [
  {
    label: 'Schedule conflict · regular',
    data: {
      customer_name: 'Priya Shah',
      service_type: 'Hair colour and cut',
      cancellation_reason: 'Work meeting moved last minute, sorry!',
      original_date: 'Friday 9 May, 2pm',
      booking_history: 'Regular for 2 years, 8 visits',
    },
  },
  {
    label: 'Dissatisfaction · repeat canceller',
    data: {
      customer_name: 'Tom Reed',
      service_type: 'Massage therapy',
      cancellation_reason: 'Felt the price was too high for what was delivered last time.',
      original_date: 'Saturday 10 May, 11am',
      booking_history: 'Cancelled twice in last 6 months',
    },
  },
  {
    label: 'External · weather',
    data: {
      customer_name: 'Léa Martin',
      service_type: 'Photo studio session',
      cancellation_reason: 'Weather warning means I can\'t get into town today.',
      original_date: 'Tuesday 13 May, 10am',
      booking_history: 'First-time booking',
    },
  },
]

export default function BookingsForm({ onSubmit, isLoading }) {
  const [name, setName] = useState('')
  const [service, setService] = useState('')
  const [reason, setReason] = useState('')
  const [date, setDate] = useState('')
  const [history, setHistory] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !service.trim() || !reason.trim() || !date.trim()) return
    onSubmit({
      customer_name: name.trim(),
      service_type: service.trim(),
      cancellation_reason: reason.trim(),
      original_date: date.trim(),
      booking_history: history.trim() || undefined,
    })
  }

  const fillSample = (s) => {
    setName(s.customer_name)
    setService(s.service_type)
    setReason(s.cancellation_reason)
    setDate(s.original_date)
    setHistory(s.booking_history)
  }

  const inputClass =
    'w-full rounded-xl border border-clara-purple/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink disabled:bg-clara-cream disabled:opacity-60 transition'
  const labelClass = 'block text-sm font-semibold text-clara-deep mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bk-name" className={labelClass}>Customer name</label>
          <input id="bk-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            disabled={isLoading} required className={inputClass} placeholder="Priya Shah" />
        </div>
        <div>
          <label htmlFor="bk-service" className={labelClass}>Service / appointment type</label>
          <input id="bk-service" type="text" value={service} onChange={(e) => setService(e.target.value)}
            disabled={isLoading} required className={inputClass} placeholder="Hair colour and cut" />
        </div>
      </div>

      <div>
        <label htmlFor="bk-date" className={labelClass}>Original date</label>
        <input id="bk-date" type="text" value={date} onChange={(e) => setDate(e.target.value)}
          disabled={isLoading} required className={inputClass} placeholder="Friday 9 May, 2pm" />
      </div>

      <div>
        <label htmlFor="bk-reason" className={labelClass}>Cancellation reason</label>
        <textarea id="bk-reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
          disabled={isLoading} required className={inputClass}
          placeholder="What did the customer say when cancelling?" />
      </div>

      <div>
        <label htmlFor="bk-history" className={labelClass}>
          Booking history <span className="text-clara-ink/40 font-normal">(optional)</span>
        </label>
        <textarea id="bk-history" rows={2} value={history} onChange={(e) => setHistory(e.target.value)}
          disabled={isLoading} className={inputClass}
          placeholder="Regular for 2 years · cancelled twice last quarter · etc." />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button type="submit" disabled={isLoading}
          className="rounded-full bg-clara-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-clara-sm hover:shadow-clara hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
          {isLoading && <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          {isLoading ? 'Drafting…' : 'Draft win-back'}
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

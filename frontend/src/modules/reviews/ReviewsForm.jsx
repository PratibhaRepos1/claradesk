import { useState } from 'react'

const SAMPLES = [
  {
    label: 'Severe · 1★ Google',
    data: {
      reviewer_name: 'Anna K',
      rating: 1,
      platform: 'google',
      review_text: 'Found a hair in my food and the manager was completely rude when I complained. Will report to health authorities.',
    },
  },
  {
    label: 'Moderate · 2★ Yelp',
    data: {
      reviewer_name: 'Mike J',
      rating: 2,
      platform: 'yelp',
      review_text: 'Waited 25 min for a coffee and the staff seemed disorganised. Drink was fine but the experience was not.',
    },
  },
  {
    label: 'Mild · 2★ TripAdvisor',
    data: {
      reviewer_name: 'Lina B',
      rating: 2,
      platform: 'tripadvisor',
      review_text: 'Room was small and a bit dated. Staff were lovely though.',
    },
  },
]

export default function ReviewsForm({ onSubmit, isLoading }) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(1)
  const [platform, setPlatform] = useState('google')
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    onSubmit({
      reviewer_name: name.trim(),
      rating: Number(rating),
      platform,
      review_text: text.trim(),
    })
  }

  const fillSample = (s) => {
    setName(s.reviewer_name)
    setRating(s.rating)
    setPlatform(s.platform)
    setText(s.review_text)
  }

  const inputClass =
    'w-full rounded-xl border border-clara-purple/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clara-pink focus:border-clara-pink disabled:bg-clara-cream disabled:opacity-60 transition'
  const labelClass = 'block text-sm font-semibold text-clara-deep mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="rv-name" className={labelClass}>Reviewer name</label>
          <input id="rv-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            disabled={isLoading} required className={inputClass} placeholder="Anna K" />
        </div>
        <div>
          <label htmlFor="rv-rating" className={labelClass}>Rating</label>
          <select id="rv-rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}
            disabled={isLoading} className={inputClass}>
            <option value={1}>1 star</option>
            <option value={2}>2 stars</option>
            <option value={3}>3 stars</option>
            <option value={4}>4 stars</option>
            <option value={5}>5 stars</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="rv-plat" className={labelClass}>Platform</label>
        <select id="rv-plat" value={platform} onChange={(e) => setPlatform(e.target.value)}
          disabled={isLoading} className={inputClass}>
          <option value="google">Google</option>
          <option value="yelp">Yelp</option>
          <option value="tripadvisor">TripAdvisor</option>
        </select>
      </div>

      <div>
        <label htmlFor="rv-text" className={labelClass}>Review text</label>
        <textarea id="rv-text" rows={5} value={text} onChange={(e) => setText(e.target.value)}
          disabled={isLoading} required className={inputClass}
          placeholder="Paste the negative review here…" />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button type="submit" disabled={isLoading}
          className="rounded-full bg-clara-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-clara-sm hover:shadow-clara hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
          {isLoading && <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          {isLoading ? 'Drafting…' : 'Draft response'}
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

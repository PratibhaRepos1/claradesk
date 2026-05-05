import SlackBadge from './SlackBadge.jsx'

export default function ResultPanel({ title, accent, children, slackPosted, slackChannel }) {
  const accentClass = accent ?? 'bg-slate-50 border-slate-200 text-slate-900'

  return (
    <div className={`mt-6 rounded-xl border p-5 ${accentClass}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-lg font-semibold">{title}</span>
        <SlackBadge posted={slackPosted} channel={slackChannel} />
      </div>
      <div className="mt-4 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

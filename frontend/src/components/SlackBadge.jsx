export default function SlackBadge({ posted, channel }) {
  if (posted) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Posted to Slack{channel ? ` ${channel}` : ''}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Slack not configured
    </span>
  )
}

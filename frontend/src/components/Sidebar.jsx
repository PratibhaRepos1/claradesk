import { NavLink, Link } from 'react-router-dom'

const MODULES = [
  { path: '/inbox',    label: 'Inbox Agent',      icon: '📬', desc: 'Route enquiries' },
  { path: '/leads',    label: 'Lead Agent',       icon: '🎯', desc: 'Follow-up emails' },
  { path: '/welcome',  label: 'Onboarding Agent', icon: '👋', desc: 'Onboarding' },
  { path: '/billing',  label: 'Billing Agent',    icon: '💳', desc: 'Invoice nudger' },
  { path: '/bookings', label: 'Booking Agent',    icon: '📅', desc: 'Win-back drafts' },
  { path: '/reviews',  label: 'Review Agent',     icon: '⭐', desc: 'Review replies' },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-clara-purple/10 bg-white px-6 py-8">
      <Link to="/" className="mb-8 flex items-center gap-2 group">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-clara-gradient text-white font-bold">C</span>
        <span>
          <span className="block font-display text-lg font-extrabold text-clara-deep group-hover:text-clara-magenta">
            ClaraDesk
          </span>
          <span className="block text-[11px] text-clara-ink/50">Every message, handled.</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        {MODULES.map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            className={({ isActive }) =>
              [
                'flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-clara-gradient text-white shadow-clara-sm'
                  : 'text-clara-ink/80 hover:bg-clara-pink/10 hover:text-clara-magenta',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-lg leading-tight" aria-hidden="true">{m.icon}</span>
                <span>
                  <span className="block font-semibold">{m.label}</span>
                  <span className={`block text-xs ${isActive ? 'text-white/80' : 'text-clara-ink/50'}`}>
                    {m.desc}
                  </span>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/"
        className="mt-6 rounded-xl border border-clara-purple/20 px-3 py-2 text-xs font-semibold text-clara-purple text-center hover:bg-clara-purple hover:text-white transition"
      >
        ← Back to home
      </Link>

      <div className="mt-auto pt-8 text-xs text-clara-ink/40">
        Powered by Claude · FastAPI · Slack
      </div>
    </aside>
  )
}

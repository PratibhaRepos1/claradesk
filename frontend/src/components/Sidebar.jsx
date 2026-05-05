import { NavLink } from 'react-router-dom'

const MODULES = [
  { path: '/inbox',    label: 'Clara Inbox',    icon: '📬', desc: 'Route enquiries' },
  { path: '/leads',    label: 'Clara Leads',    icon: '🎯', desc: 'Follow-up emails' },
  { path: '/welcome',  label: 'Clara Welcome',  icon: '👋', desc: 'Onboarding' },
  { path: '/billing',  label: 'Clara Billing',  icon: '💳', desc: 'Invoice nudger' },
  { path: '/bookings', label: 'Clara Bookings', icon: '📅', desc: 'Win-back drafts' },
  { path: '/reviews',  label: 'Clara Reviews',  icon: '⭐', desc: 'Review replies' },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900">ClaraDesk</h1>
        <p className="mt-1 text-xs text-slate-500">
          Every customer message, handled with intelligence.
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {MODULES.map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            className={({ isActive }) =>
              [
                'flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-900'
                  : 'text-slate-700 hover:bg-slate-100',
              ].join(' ')
            }
          >
            <span className="text-lg leading-tight" aria-hidden="true">{m.icon}</span>
            <span>
              <span className="block font-medium">{m.label}</span>
              <span className="block text-xs text-slate-500">{m.desc}</span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8 text-xs text-slate-400">
        Powered by Claude · FastAPI · Slack
      </div>
    </aside>
  )
}

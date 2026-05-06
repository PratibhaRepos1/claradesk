import { Link } from 'react-router-dom'

const CALENDLY_URL = 'https://calendly.com/claradesk/15min'

const STEPS = [
  {
    n: 1,
    icon: '💳',
    title: 'Pick a plan',
    duration: '2 minutes',
    body:
      'Choose Starter, Pro, or Bundle on the pricing page. Pay through Stripe — no setup fees, cancel any time. You will land on a confirmation page with a Calendly link for the next step.',
    cta: { label: 'See pricing', to: '/pricing' },
  },
  {
    n: 2,
    icon: '📞',
    title: 'Book a 15-min onboarding call',
    duration: '15 minutes',
    body:
      'Pick a slot from your Calendly link. On the call we confirm your plan fits, gather the details we need (Slack workspace, your team size, your inquiry volume), and answer any questions left over from the demo.',
    cta: { label: 'Book a call', href: CALENDLY_URL },
  },
  {
    n: 3,
    icon: '💬',
    title: 'Connect your Slack workspace',
    duration: '5 minutes',
    body:
      'One-click OAuth — you click "Add ClaraDesk to Slack", pick your workspace, and we install a small bot. Then you map each Clara agent to a Slack channel: Inbox Agent → #sales, #support, #partnerships; Lead Agent → #sales-leads; Onboarding → #onboarding; and so on.',
  },
  {
    n: 4,
    icon: '🎨',
    title: 'Tune your brand voice',
    duration: '10 minutes',
    body:
      'Paste 3 of your team\'s best previous replies into the brand voice screen. Clara studies tone, pacing and signoff style, and folds them into the system prompt. Every draft from that moment on sounds like your team — not a generic AI.',
  },
  {
    n: 5,
    icon: '👥',
    title: 'Invite your team',
    duration: '5 minutes',
    body:
      'Email invites to your reps. They click the link, set a password, and land on the dashboard. Pro plan includes up to 5 users — Bundle is unlimited. Reps inherit your brand voice and Slack channel mapping automatically.',
  },
  {
    n: 6,
    icon: '🚀',
    title: 'Go live',
    duration: '15 minutes',
    body:
      'Wire your contact form, your CRM, or your booking tool to Clara\'s API endpoint. We provide a Zapier template and a code snippet that works with HubSpot, Calendly, Stripe, Shopify, and most CMS contact forms. The first lead lands in Slack within minutes.',
  },
  {
    n: 7,
    icon: '📊',
    title: 'Watch the pipeline',
    duration: 'Ongoing',
    body:
      'On Bundle, your manager dashboard shows hot/warm/cold lead counts, top intent tags, conversion by tag, and how often each rep used Clara that week. Check it on Monday morning. That single view is what makes Clara worth keeping after month one.',
  },
]

const TIMELINE_TOTAL = '~50 minutes total · then live forever'

const TROUBLESHOOTING = [
  {
    q: 'What if my contact form isn\'t a standard tool?',
    a: 'Anything that can POST JSON to a URL works — that means almost everything. We help you set up a Zapier connector on the onboarding call, no code required.',
  },
  {
    q: 'Do I have to use Slack? My team uses Teams.',
    a: 'Slack is the only integration shipping today. Teams is on the roadmap — book a call to get on the early-access list.',
  },
  {
    q: 'What happens to existing inquiries that came in before setup?',
    a: 'Forward them to a special inbox we set up for you. Clara processes the backlog overnight and posts the results to Slack the next morning.',
  },
  {
    q: 'Can I see what Clara is about to send before it goes out?',
    a: 'Always. Clara only ever drafts — your reps approve, edit, and send. There is no "auto-send" mode in any plan, by design.',
  },
]

export default function SetupPage() {
  return (
    <div className="min-h-full bg-clara-cream text-clara-ink">
      {/* Top promo strip */}
      <div className="bg-clara-gradient text-white text-sm">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center">
          <span className="font-medium">
            🎉 Launch week — 40% off the all-6 Bundle. Use code <span className="font-bold">CLARA40</span>
          </span>
        </div>
      </div>

      {/* Sticky nav */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-clara-purple/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-clara-gradient text-white font-bold">C</span>
            <span className="font-display text-xl font-extrabold text-clara-deep">ClaraDesk</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-clara-ink/80">
            <Link to="/#solutions" className="hover:text-clara-magenta">Solutions</Link>
            <Link to="/pricing"    className="hover:text-clara-magenta">Pricing</Link>
            <Link to="/setup"      className="text-clara-magenta">Setup</Link>
            <Link to="/#blog"      className="hover:text-clara-magenta">Blog</Link>
            <Link to="/#faq"       className="hover:text-clara-magenta">FAQ</Link>
          </nav>

          <Link
            to="/inbox"
            className="rounded-full bg-clara-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-clara hover:shadow-lg hover:scale-[1.02] transition"
          >
            Try free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-clara-pink/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-clara-sky/30 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-clara-purple/20 px-4 py-1.5 text-xs font-semibold text-clara-purple shadow-clara-sm">
            How setup works
          </span>
          <h1 className="mt-5 font-display text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-clara-deep">
            From signup to first lead{' '}
            <span className="bg-clara-gradient bg-clip-text text-transparent">in under an hour.</span>
          </h1>
          <p className="mt-5 text-lg text-clara-ink/70 max-w-2xl mx-auto">
            No developers required. No long contracts. Here is exactly what happens after you click "Get the Bundle".
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white border border-clara-purple/20 px-4 py-1.5 text-xs font-semibold text-clara-deep">
            <span className="text-clara-pink">⏱</span> {TIMELINE_TOTAL}
          </div>
        </div>
      </section>

      {/* Timeline of steps */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <ol className="relative space-y-6">
          {STEPS.map((step, idx) => (
            <li key={step.n} className="relative">
              {idx < STEPS.length - 1 && (
                <span
                  className="absolute left-7 top-16 bottom-[-1.5rem] w-0.5 bg-gradient-to-b from-clara-pink/30 via-clara-purple/30 to-clara-sky/30"
                  aria-hidden="true"
                />
              )}

              <article className="relative rounded-2xl bg-white border border-clara-purple/10 shadow-clara-sm p-6 flex gap-5">
                <div className="flex-shrink-0">
                  <div className="grid place-items-center w-14 h-14 rounded-2xl bg-clara-gradient text-white font-display font-extrabold text-xl shadow-clara-sm">
                    {step.n}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">{step.icon}</span>
                    <h3 className="font-display text-xl font-extrabold text-clara-deep">{step.title}</h3>
                    <span className="rounded-full bg-clara-pink/10 px-2.5 py-0.5 text-[11px] font-semibold text-clara-magenta">
                      {step.duration}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-clara-ink/80">{step.body}</p>

                  {step.cta && (
                    <div className="mt-4">
                      {step.cta.to ? (
                        <Link
                          to={step.cta.to}
                          className="inline-block rounded-full border border-clara-purple/30 px-4 py-1.5 text-xs font-semibold text-clara-purple hover:bg-clara-purple hover:text-white transition"
                        >
                          {step.cta.label} →
                        </Link>
                      ) : (
                        <a
                          href={step.cta.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block rounded-full border border-clara-purple/30 px-4 py-1.5 text-xs font-semibold text-clara-purple hover:bg-clara-purple hover:text-white transition"
                        >
                          {step.cta.label} →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      {/* Concierge note */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="rounded-3xl bg-clara-gradient-3 p-7 text-white shadow-clara-sm">
          <div className="flex flex-wrap items-start gap-3">
            <span className="text-3xl" aria-hidden="true">🤝</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/80">Concierge mode</div>
              <h3 className="font-display text-xl font-extrabold mt-1">
                On Bundle, we set this up for you.
              </h3>
              <p className="mt-2 text-sm text-white/85">
                Bundle includes a 1-on-1 setup call where we screen-share, run through every step above with you, and configure Slack, brand voice and team invites while you watch. You leave the call live. Most teams are sending Clara-drafted replies the same afternoon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting / FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-clara-magenta">What if?</span>
          <h2 className="font-display text-3xl font-extrabold mt-2 text-clara-deep">
            Edge cases we hear most.
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {TROUBLESHOOTING.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl bg-white border border-clara-purple/10 p-5 open:shadow-clara-sm"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-clara-deep">
                <span>{f.q}</span>
                <span className="text-clara-pink group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-clara-ink/75">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl bg-clara-gradient p-10 lg:p-14 text-center text-white shadow-clara">
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold">Ready to set up?</h2>
          <p className="mt-3 text-white/85 max-w-xl mx-auto">
            Pick a plan, book the onboarding call, and Clara is live before lunch.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link
              to="/pricing"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-clara-purple hover:scale-[1.02] transition"
            >
              See pricing →
            </Link>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border-2 border-white/70 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition"
            >
              Book a 15-min call
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-clara-deep text-white/80">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-clara-gradient text-white font-bold">C</span>
            <span className="font-display text-xl font-extrabold text-white">ClaraDesk</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/pricing" className="hover:text-clara-sky">Pricing</Link>
            <Link to="/setup"   className="hover:text-clara-sky">Setup</Link>
            <Link to="/#blog"   className="hover:text-clara-sky">Blog</Link>
          </div>
          <span className="text-xs text-white/50">© {new Date().getFullYear()} ClaraDesk · Made by Pratibha Jadhav</span>
        </div>
      </footer>
    </div>
  )
}

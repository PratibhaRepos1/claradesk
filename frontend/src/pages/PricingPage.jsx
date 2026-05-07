import { Link } from 'react-router-dom'

const CALENDLY_URL = 'https://calendly.com/claradesk/15min'

const TIERS = [
  {
    name: 'Starter',
    price: 29,
    tagline: 'For solo founders and freelancers testing the water.',
    features: [
      '1 agent of your choice',
      '100 messages / month',
      '1 Slack channel',
      'Email support · 48h reply',
      'Cancel anytime',
    ],
    notIncluded: ['Pipeline dashboard', '1-on-1 setup call', 'Custom brand voice'],
    cta: 'Start solo',
    accent: 'from-clara-sky to-clara-purple',
    badge: null,
  },
  {
    name: 'Pro',
    price: 79,
    tagline: 'For growing teams that need more agents and more volume.',
    features: [
      'Any 3 agents you pick',
      '1,000 messages / month',
      'Unlimited Slack channels',
      'Up to 5 users',
      'Custom brand voice tuning',
      'Priority email support · 12h reply',
    ],
    notIncluded: ['Pipeline dashboard', '1-on-1 setup call'],
    cta: 'Go Pro',
    accent: 'from-clara-purple to-clara-magenta',
    badge: 'Most popular',
  },
  {
    name: 'Bundle',
    price: 89,
    listPrice: 146,
    tagline: 'All 6 Clara agents. Best value for any team running customer ops on Slack.',
    features: [
      'All 6 Clara agents',
      'Unlimited messages',
      'Unlimited Slack channels',
      'Unlimited users',
      'Pipeline dashboard included',
      'Custom brand voice tuning',
      '1-on-1 setup call',
      'Slack + email priority support',
      '30-day money-back guarantee',
    ],
    notIncluded: [],
    cta: 'Get the Bundle',
    accent: 'from-clara-pink to-clara-magenta',
    badge: 'Launch deal · save 40%',
  },
]

const PLAN_INCLUDES = [
  { icon: '🔒', label: 'Your data, your account', desc: 'Anthropic API run under your tenant. We never train on your messages.' },
  { icon: '⚡', label: 'Drafts in under 5 seconds', desc: 'Powered by Claude Sonnet 4 — fastest tier-1 LLM available.' },
  { icon: '💳', label: 'Monthly billing, cancel anytime', desc: 'No setup fees. No annual lock-in. Stripe-managed subscription.' },
  { icon: '🛟', label: 'Mock fallback if AI is down', desc: 'Drafts keep flowing even when the API is degraded — demo never breaks.' },
]

const FAQS = [
  {
    q: 'Do I need a developer to set this up?',
    a: 'No. Onboarding takes about 20 minutes — connect Slack, paste 3 of your previous replies, invite your team. We walk you through it on a 15-min call.',
  },
  {
    q: 'Can I switch or cancel my plan?',
    a: 'Yes — change tier or cancel any time from your billing page. Pro-rated refunds on downgrades.',
  },
  {
    q: 'What does "1 agent of your choice" mean on Starter?',
    a: 'You pick any one of the 6 (Inbox, Lead, Onboarding, Billing, Booking, or Review). Most Starter customers pick Inbox or Lead Agent first.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Every agent has a free demo on this site — try real inputs, no signup. For paid plans we offer a 30-day money-back guarantee instead of a time-limited trial.',
  },
  {
    q: 'How is "messages per month" counted?',
    a: 'One inquiry / lead / customer message = 1 message. Drafts and Slack posts are free. Unused messages do not roll over.',
  },
  {
    q: 'What if I need more than 1,000 messages on Pro?',
    a: 'Bundle is unlimited. If you need a custom enterprise plan, book a call below — we have done up to 50K messages/month.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-full bg-clara-cream text-clara-ink">
      {/* Top promo strip */}
      <div className="bg-clara-gradient text-white text-sm">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center">
          <span className="font-medium">
            🎉 Launch week — 40% off the all-6 Bundle. Use code <span className="font-bold">CLARA40</span> at checkout.
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

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-clara-ink/80">
            <Link to="/#solutions" className="hover:text-clara-magenta">Solutions</Link>
            <Link to="/journey"    className="hover:text-clara-magenta">Journey</Link>
            <Link to="/pricing"    className="text-clara-magenta">Pricing</Link>
            <Link to="/setup"      className="hover:text-clara-magenta">Setup</Link>
            <Link to="/#blog"      className="hover:text-clara-magenta">Blog</Link>
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

        <div className="relative mx-auto max-w-4xl px-6 pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-clara-purple/20 px-4 py-1.5 text-xs font-semibold text-clara-purple shadow-clara-sm">
            Pricing
          </span>
          <h1 className="mt-5 font-display text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-clara-deep">
            Simple plans.{' '}
            <span className="bg-clara-gradient bg-clip-text text-transparent">Pick what you need.</span>
          </h1>
          <p className="mt-5 text-lg text-clara-ink/70 max-w-2xl mx-auto">
            Every plan includes the real Claude API, Slack-ready integrations, and a graceful mock fallback so your team is never stuck. Cancel any time.
          </p>
        </div>
      </section>

      {/* Tier cards */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier) => {
            const isFeatured = tier.badge === 'Most popular'
            return (
              <article
                key={tier.name}
                className={[
                  'relative rounded-3xl bg-white border shadow-clara-sm overflow-hidden flex flex-col',
                  isFeatured
                    ? 'border-clara-purple ring-2 ring-clara-purple lg:scale-[1.03] z-10'
                    : 'border-clara-purple/10',
                ].join(' ')}
              >
                {tier.badge && (
                  <div className={`bg-gradient-to-r ${tier.accent} text-center py-2 text-xs font-bold uppercase tracking-widest text-white`}>
                    {tier.badge}
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  <h3 className="font-display text-2xl font-extrabold text-clara-deep">{tier.name}</h3>
                  <p className="mt-2 text-sm text-clara-ink/70">{tier.tagline}</p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold text-clara-deep">${tier.price}</span>
                    <span className="text-clara-ink/60">/mo</span>
                  </div>
                  {tier.listPrice && (
                    <div className="text-sm text-clara-ink/40 line-through">was ${tier.listPrice}/mo</div>
                  )}

                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className={[
                      'mt-6 rounded-full px-5 py-3 text-sm font-bold text-center transition',
                      isFeatured
                        ? `bg-gradient-to-r ${tier.accent} text-white shadow-clara hover:shadow-lg hover:scale-[1.02]`
                        : 'border-2 border-clara-purple text-clara-purple hover:bg-clara-purple hover:text-white',
                    ].join(' ')}
                  >
                    {tier.cta} →
                  </a>

                  <div className="mt-7">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-clara-magenta mb-3">
                      What's included
                    </div>
                    <ul className="space-y-2 text-sm text-clara-ink/85">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <span className="text-clara-pink mt-0.5">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tier.notIncluded.length > 0 && (
                    <div className="mt-5">
                      <ul className="space-y-2 text-sm text-clara-ink/40">
                        {tier.notIncluded.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <span className="mt-0.5">—</span>
                            <span className="line-through">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <p className="mt-6 text-center text-sm text-clara-ink/60">
          All prices in USD. Stripe-managed billing. No setup fees.{' '}
          <Link to="/setup" className="font-semibold text-clara-purple hover:text-clara-magenta">
            See how setup works →
          </Link>
        </p>
      </section>

      {/* Every plan includes */}
      <section className="bg-white border-y border-clara-purple/10">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Every plan includes</span>
            <h2 className="font-display text-3xl font-extrabold mt-2 text-clara-deep">
              The non-negotiables, on the house.
            </h2>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLAN_INCLUDES.map((p) => (
              <div key={p.label} className="rounded-2xl bg-clara-cream border border-clara-purple/10 p-5">
                <div className="text-3xl" aria-hidden="true">{p.icon}</div>
                <div className="mt-3 font-semibold text-clara-deep">{p.label}</div>
                <div className="mt-1 text-sm text-clara-ink/65">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-clara-magenta">FAQ</span>
          <h2 className="font-display text-3xl font-extrabold mt-2 text-clara-deep">
            Common pricing questions.
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map((f) => (
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

      {/* Talk to us CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl bg-clara-gradient-2 p-12 lg:p-14 text-white shadow-clara grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Not sure which plan?
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold mt-3">
              Talk to us — 15 minutes, no pressure.
            </h2>
            <p className="mt-3 text-white/85 max-w-xl">
              Tell us about your team and your inbox volume. We will recommend a plan, walk you through the setup, and answer anything that the FAQ did not cover.
            </p>
          </div>
          <div className="text-center lg:text-right">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-white px-7 py-4 text-sm font-bold text-clara-purple hover:scale-[1.02] transition"
            >
              Book a 15-min call →
            </a>
            <div className="mt-3 text-xs text-white/70">Replies within 4 business hours</div>
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

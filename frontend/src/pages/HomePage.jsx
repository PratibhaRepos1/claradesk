import { Link } from 'react-router-dom'

import { BLOG_POSTS } from '../data/blogPosts.js'

const PRODUCTS = [
  {
    path: '/inbox',
    icon: '📬',
    name: 'Inbox Agent',
    tagline: 'Never lose another enquiry.',
    blurb:
      'Drops every contact-form message into the right Slack channel — sales, support, partnership or spam — in seconds.',
    bullets: ['Auto-classify intent', 'Route to Slack live', 'Confidence + reasoning'],
    badge: 'Bestseller',
    badgeStyle: 'bg-clara-pink text-white',
    price: 'from $19/mo',
    accent: 'from-clara-pink to-clara-magenta',
  },
  {
    path: '/leads',
    icon: '🎯',
    name: 'Lead Agent',
    tagline: 'Turn cold leads into warm replies.',
    blurb:
      'Reads each enquiry, spots the real need and writes a personalised follow-up email under 150 words — ready to send.',
    bullets: ['Personalised email draft', 'Tone calibration', 'Subject line included'],
    badge: 'Hot deal',
    badgeStyle: 'bg-clara-magenta text-white',
    price: 'from $29/mo',
    accent: 'from-clara-magenta to-clara-purple',
  },
  {
    path: '/welcome',
    icon: '👋',
    name: 'Onboarding Agent',
    tagline: 'First impressions, on autopilot.',
    blurb:
      'Greets every new signup with an onboarding email tuned to their plan plus a 3-5 step checklist to drive activation.',
    bullets: ['Plan-aware welcome', 'Action checklist', 'Posts to #onboarding'],
    badge: 'New',
    badgeStyle: 'bg-clara-sky text-clara-ink',
    price: 'from $19/mo',
    accent: 'from-clara-purple to-clara-sky',
  },
  {
    path: '/billing',
    icon: '💳',
    name: 'Billing Agent',
    tagline: 'Get paid without the awkward ping.',
    blurb:
      'Drafts invoice nudges that match the days overdue — friendly, direct or firm — and posts the draft to #billing.',
    bullets: ['Tone by days overdue', 'Invoice + amount included', 'Under 100 words'],
    badge: '−40% launch',
    badgeStyle: 'bg-clara-purple text-white',
    price: 'from $25/mo',
    accent: 'from-clara-pink to-clara-purple',
  },
  {
    path: '/bookings',
    icon: '📅',
    name: 'Booking Agent',
    tagline: 'Win back every cancelled slot.',
    blurb:
      'Reads the cancellation reason and booking history, then writes a warm win-back with 2-3 reschedule options.',
    bullets: ['Reason-aware reply', 'Suggested time slots', 'Posts to #bookings'],
    badge: 'Popular',
    badgeStyle: 'bg-clara-pink text-white',
    price: 'from $25/mo',
    accent: 'from-clara-sky to-clara-magenta',
  },
  {
    path: '/reviews',
    icon: '⭐',
    name: 'Review Agent',
    tagline: 'Protect your stars, every time.',
    blurb:
      'Spots negative reviews, writes an empathetic public reply and a sharp internal note flagging root causes for the team.',
    bullets: ['Public + internal output', 'Root-issue tagging', 'Empathy-first tone'],
    badge: 'Reputation saver',
    badgeStyle: 'bg-clara-magenta text-white',
    price: 'from $29/mo',
    accent: 'from-clara-purple to-clara-pink',
  },
]

const FEATURES = [
  { icon: '⚡', title: 'Replies in seconds',   desc: 'Claude drafts in under 3s.' },
  { icon: '💬', title: 'Slack-native',          desc: 'Routes straight to your channels.' },
  { icon: '🧠', title: 'Powered by Claude',     desc: 'Top-tier reasoning, every message.' },
  { icon: '🛠️', title: 'Zero code to install',  desc: 'Connect, set tone, go live.' },
]

const TESTIMONIALS = [
  {
    quote:
      'Inbox Agent cleared a 200-message backlog on day one. We literally watched Slack light up.',
    name: 'Maya R.',
    role: 'Ops Lead, Lumen Studio',
  },
  {
    quote:
      'The billing nudges sound like me on a good day. Cash collected jumped 22% in three weeks.',
    name: 'Daniel K.',
    role: 'Founder, NorthFork Co.',
  },
  {
    quote:
      'Honestly the review responder saved a 1-star meltdown. That alone paid for the year.',
    name: 'Priya S.',
    role: 'Owner, Saffron & Sage',
  },
]

const FAQS = [
  {
    q: 'Do I need a developer to set this up?',
    a: 'No. Connect Slack, paste your Claude API key, pick a tone — Clara is live in under 10 minutes.',
  },
  {
    q: 'Can I try Clara before paying?',
    a: 'Yes. Every module has a free demo on this site — try the form, see the AI output, no signup needed.',
  },
  {
    q: 'Will Clara send messages without me approving?',
    a: 'Never. Clara always drafts. You approve, edit and send from Slack or your inbox.',
  },
  {
    q: 'What does the bundle include?',
    a: 'All 6 Clara modules, unlimited drafts, every Slack webhook, priority support — at 40% off list price for launch.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-full bg-clara-cream text-clara-ink">
      {/* Promo strip */}
      <div className="bg-clara-gradient text-white text-sm">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-3 text-center">
          <span aria-hidden="true">🎉</span>
          <span className="font-medium">
            Launch week — 40% off the all-6 Clara bundle. Use code <span className="font-bold">CLARA40</span>
          </span>
          <span className="hidden sm:inline opacity-80">· ends Sunday</span>
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
            <a href="#solutions" className="hover:text-clara-magenta">Solutions</a>
            <a href="#bundle"    className="hover:text-clara-magenta">Bundle</a>
            <a href="#reviews"   className="hover:text-clara-magenta">Reviews</a>
            <a href="#blog"      className="hover:text-clara-magenta">Blog</a>
            <a href="#faq"       className="hover:text-clara-magenta">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#solutions" className="hidden sm:inline text-sm font-medium text-clara-deep hover:text-clara-magenta">
              Sign in
            </a>
            <Link
              to="/inbox"
              className="rounded-full bg-clara-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-clara hover:shadow-lg hover:scale-[1.02] transition"
            >
              Try free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-clara-pink/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-clara-sky/30 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-clara-purple/20 px-4 py-1.5 text-xs font-semibold text-clara-purple shadow-clara-sm">
              <span className="w-2 h-2 rounded-full bg-clara-pink animate-pulse" /> 6 AI modules · one Clara
            </span>

            <h1 className="mt-6 font-display text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Every customer message,
              <span className="block bg-clara-gradient bg-clip-text text-transparent">handled with intelligence.</span>
            </h1>

            <p className="mt-6 text-lg text-clara-ink/70 max-w-xl">
              ClaraDesk is the AI sales floor for your inbox. Six ready-made Clara modules
              answer enquiries, chase leads, onboard customers, nudge invoices, win back
              bookings and protect your reviews — drafts ready in seconds.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/inbox"
                className="rounded-full bg-clara-gradient px-7 py-3.5 text-sm font-semibold text-white shadow-clara hover:scale-[1.02] transition"
              >
                Start with Inbox Agent →
              </Link>
              <a
                href="#solutions"
                className="rounded-full border-2 border-clara-purple px-7 py-3.5 text-sm font-semibold text-clara-purple hover:bg-clara-purple hover:text-white transition"
              >
                See all 6 solutions
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-clara-ink/60">
              <span className="flex items-center gap-2"><span className="text-clara-pink">★★★★★</span> 4.9/5 from early users</span>
              <span>· No credit card to demo</span>
              <span>· Live in 10 min</span>
            </div>
          </div>

          {/* Hero card stack */}
          <div className="relative h-[28rem] lg:h-[32rem]">
            <div className="absolute top-0 right-6 w-72 rounded-2xl bg-white p-5 shadow-clara border border-clara-purple/10 rotate-[-3deg]">
              <div className="flex items-center gap-2 text-xs font-semibold text-clara-magenta">📬 Inbox Agent</div>
              <p className="mt-3 text-sm font-semibold">"Hi, do you have pricing for 50 seats?"</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-clara-pink/10 px-3 py-1 text-xs font-semibold text-clara-magenta">
                💼 Sales · high confidence
              </div>
              <div className="mt-3 text-xs text-clara-ink/60">→ routed to #sales</div>
            </div>

            <div className="absolute top-32 left-2 w-72 rounded-2xl bg-white p-5 shadow-clara border border-clara-purple/10 rotate-[2deg]">
              <div className="flex items-center gap-2 text-xs font-semibold text-clara-purple">💳 Billing Agent</div>
              <p className="mt-3 text-sm">
                <span className="font-semibold">Subject:</span> Quick nudge on invoice #4021
              </p>
              <p className="mt-1 text-xs text-clara-ink/70 line-clamp-3">
                Hi Sam, just a friendly reminder that invoice #4021 ($1,240) is now 9 days past due…
              </p>
              <div className="mt-3 inline-flex rounded-full bg-clara-purple/10 px-3 py-1 text-xs font-semibold text-clara-purple">tone · direct</div>
            </div>

            <div className="absolute bottom-0 right-0 w-72 rounded-2xl bg-clara-gradient-2 p-5 shadow-clara text-white rotate-[-2deg]">
              <div className="flex items-center gap-2 text-xs font-semibold">⭐ Review Agent</div>
              <p className="mt-3 text-sm font-semibold">Thanks for the honest feedback, Jordan.</p>
              <p className="mt-1 text-xs opacity-90 line-clamp-3">
                We're sorry the wait time fell short of what you expect from us. The team has already…
              </p>
              <div className="mt-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">empathy · public reply</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="bg-white border-y border-clara-purple/10">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="text-2xl" aria-hidden="true">{f.icon}</div>
              <div>
                <div className="font-semibold text-clara-deep">{f.title}</div>
                <div className="text-sm text-clara-ink/60">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions / Product grid */}
      <section id="solutions" className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Shop our solutions</span>
            <h2 className="font-display text-4xl font-extrabold mt-2 text-clara-deep">
              6 Clara modules. One AI sales floor.
            </h2>
            <p className="mt-3 text-clara-ink/70 max-w-2xl">
              Every module is a ready-to-use AI worker. Mix and match — or grab the bundle and let Clara run the whole customer floor.
            </p>
          </div>
          <span className="rounded-full bg-clara-pink/10 text-clara-magenta px-4 py-2 text-sm font-semibold">
            🔥 Launch week pricing
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <article
              key={p.path}
              className="group relative rounded-3xl bg-white border border-clara-purple/10 shadow-clara-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-clara transition"
            >
              {/* Card hero */}
              <div className={`relative h-36 bg-gradient-to-br ${p.accent} flex items-center justify-center`}>
                <span className="text-6xl drop-shadow-md" aria-hidden="true">{p.icon}</span>
                <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-bold ${p.badgeStyle}`}>
                  {p.badge}
                </span>
                <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-clara-deep">
                  {p.price}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-xl font-extrabold text-clara-deep">{p.name}</h3>
                <p className="mt-1 text-sm font-semibold text-clara-magenta">{p.tagline}</p>
                <p className="mt-3 text-sm text-clara-ink/70">{p.blurb}</p>

                <ul className="mt-4 space-y-1.5 text-sm text-clara-ink/80">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="text-clara-pink mt-0.5">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-clara-purple/10">
                  <Link
                    to={p.path}
                    className="flex-1 text-center rounded-full bg-clara-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-clara-sm hover:shadow-clara transition"
                  >
                    Try {p.name.split(' ')[0]} free
                  </Link>
                  <Link
                    to={p.path}
                    className="rounded-full border border-clara-purple/30 px-4 py-2.5 text-sm font-semibold text-clara-purple hover:bg-clara-purple hover:text-white transition"
                    aria-label={`More about ${p.name}`}
                  >
                    →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bundle promo */}
      <section id="bundle" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-clara-gradient-2 p-10 lg:p-14 text-white shadow-clara">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-clara-sky/40 blur-3xl" aria-hidden="true" />
          <div className="relative grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                Bundle deal
              </span>
              <h3 className="font-display text-3xl lg:text-4xl font-extrabold mt-3">
                All 6 Clara modules. <span className="text-clara-sky">40% off.</span> One Clara to run them.
              </h3>
              <p className="mt-3 text-white/80 max-w-2xl">
                Stop stitching tools together. The Clara bundle ships every module, every Slack channel
                and priority support — for less than two of them on their own.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/inbox"
                  className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-clara-purple hover:scale-[1.02] transition"
                >
                  Get the bundle →
                </Link>
                <a
                  href="#faq"
                  className="rounded-full border-2 border-white/60 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  How it works
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6 text-center">
              <div className="text-xs font-bold uppercase tracking-widest text-white/70">Bundle price</div>
              <div className="mt-2 flex items-baseline justify-center gap-2">
                <span className="text-5xl font-extrabold">$89</span>
                <span className="text-white/70">/mo</span>
              </div>
              <div className="mt-1 text-sm text-white/60 line-through">was $146/mo</div>
              <div className="mt-4 text-xs text-white/80">code <span className="font-bold text-clara-sky">CLARA40</span> · ends Sunday</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="bg-white border-y border-clara-purple/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-clara-magenta">Loved by busy teams</span>
            <h2 className="font-display text-4xl font-extrabold mt-2 text-clara-deep">
              Real businesses. Real replies. Sent.
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-2xl bg-clara-cream p-6 border border-clara-purple/10">
                <div className="text-clara-pink text-lg">★★★★★</div>
                <blockquote className="mt-3 text-clara-ink/80 italic">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm">
                  <div className="font-semibold text-clara-deep">{t.name}</div>
                  <div className="text-clara-ink/60">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-clara-magenta">FAQ</span>
          <h2 className="font-display text-4xl font-extrabold mt-2 text-clara-deep">
            Quick answers, before you ask.
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
              <p className="mt-3 text-sm text-clara-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* From the blog */}
      <section id="blog" className="bg-white border-y border-clara-purple/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-clara-magenta">From the blog</span>
              <h2 className="font-display text-4xl font-extrabold mt-2 text-clara-deep">
                Why Clara, in our own words.
              </h2>
              <p className="mt-3 text-clara-ink/70 max-w-2xl">
                Short reads on what our agents do, how they pay for themselves, and what is happening under the hood.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group rounded-3xl bg-clara-cream border border-clara-purple/10 overflow-hidden hover:-translate-y-1 hover:shadow-clara transition flex flex-col"
              >
                <div className={`relative h-32 bg-gradient-to-br ${post.accent} flex items-center justify-between px-6`}>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl drop-shadow-md" aria-hidden="true">{post.icon}</span>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-clara-deep">
                      {post.agent}
                    </span>
                  </div>
                  <span className="rounded-full bg-white/20 backdrop-blur border border-white/30 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                    {post.eyebrow}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-extrabold text-clara-deep leading-snug group-hover:text-clara-magenta transition">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm text-clara-ink/70 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-5 flex items-center justify-between text-xs">
                    <span className="text-clara-ink/50">
                      {post.readMinutes} min read · {post.publishedOn}
                    </span>
                    <span className="font-semibold text-clara-magenta group-hover:text-clara-pink">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20">
        <div className="rounded-3xl bg-clara-gradient p-12 lg:p-16 text-center text-white shadow-clara">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold">
            Ready to sell smarter?
          </h2>
          <p className="mt-4 text-white/85 max-w-2xl mx-auto">
            Try any Clara module free. No card. No setup. Just paste a real message and watch Clara reply.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/inbox"
              className="rounded-full bg-white px-8 py-4 text-sm font-bold text-clara-purple hover:scale-[1.02] transition"
            >
              Try Clara free →
            </Link>
            <a
              href="#solutions"
              className="rounded-full border-2 border-white/70 px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition"
            >
              Browse all 6
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-clara-deep text-white/80">
        <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-clara-gradient text-white font-bold">C</span>
              <span className="font-display text-xl font-extrabold text-white">ClaraDesk</span>
            </div>
            <p className="mt-3 text-sm">Every customer message, handled with intelligence.</p>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Solutions</div>
            <ul className="space-y-2 text-sm">
              {PRODUCTS.map((p) => (
                <li key={p.path}>
                  <Link to={p.path} className="hover:text-clara-sky">{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Company</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#bundle"  className="hover:text-clara-sky">Bundle</a></li>
              <li><a href="#reviews" className="hover:text-clara-sky">Reviews</a></li>
              <li><a href="#blog"    className="hover:text-clara-sky">Blog</a></li>
              <li><a href="#faq"     className="hover:text-clara-sky">FAQ</a></li>
              <li>
                <a href="https://pratibharepos1.github.io/crafted-by-pratibha/" target="_blank" rel="noreferrer" className="hover:text-clara-sky">
                  Portfolio
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Stay in the loop</div>
            <p className="text-sm">Drops, deals and Clara updates — once a month, never spam.</p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@business.com"
                className="flex-1 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-clara-sky"
              />
              <button
                type="submit"
                className="rounded-full bg-clara-gradient px-4 py-2 text-sm font-semibold text-white"
              >
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-white/50 flex flex-wrap items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} ClaraDesk. Built with Claude.</span>
            <span>Made by Pratibha Jadhav</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

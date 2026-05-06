import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { BLOG_POSTS, getPostBySlug } from '../data/blogPosts.js'

export default function BlogPage() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  // Always start at the top when navigating between posts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  if (!post) {
    return <Navigate to="/" replace />
  }

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug)

  return (
    <div className="min-h-full bg-clara-cream text-clara-ink">
      {/* Top promo strip */}
      <div className="bg-clara-gradient text-white text-sm">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center">
          <span className="font-medium">
            🎉 Launch week — 40% off the all-6 ClaraDesk bundle. Use code <span className="font-bold">CLARA40</span>
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
            <Link to="/setup"      className="hover:text-clara-magenta">Setup</Link>
            <Link to="/#blog"      className="hover:text-clara-magenta">Blog</Link>
            <Link to="/#faq"       className="hover:text-clara-magenta">FAQ</Link>
          </nav>

          <Link
            to={post.agentPath}
            className="rounded-full bg-clara-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-clara hover:shadow-lg hover:scale-[1.02] transition"
          >
            Try {post.agent.split(' ')[0]} free
          </Link>
        </div>
      </header>

      {/* Article hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-clara-pink/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-clara-sky/30 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-3xl px-6 pt-16 pb-10">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-clara-purple hover:text-clara-magenta mb-6">
            ← All posts
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${post.accent} px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white`}>
              {post.eyebrow}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-clara-purple/15 px-3 py-1 text-xs font-semibold text-clara-deep">
              <span aria-hidden="true">{post.icon}</span> {post.agent}
            </span>
            <span className="text-xs text-clara-ink/60">{post.readMinutes} min read · {post.publishedOn}</span>
          </div>

          <h1 className="mt-5 font-display text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-clara-deep">
            {post.title}
          </h1>

          <p className="mt-5 text-lg text-clara-ink/70 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-6 text-sm text-clara-ink/50">
            By <span className="font-semibold text-clara-deep">{post.author}</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <div className="space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-extrabold text-clara-deep">
                {section.heading}
              </h2>
              <p className="mt-3 text-base lg:text-[17px] leading-relaxed text-clara-ink/85">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* Inline CTA */}
        <div className={`mt-14 rounded-3xl bg-gradient-to-br ${post.accent} p-8 lg:p-10 text-white shadow-clara`}>
          <div className="text-xs font-bold uppercase tracking-widest text-white/80">
            Try it now
          </div>
          <h3 className="font-display text-2xl lg:text-3xl font-extrabold mt-2">
            {post.agent} — free demo, no signup
          </h3>
          <p className="mt-2 text-white/85 max-w-xl">
            Paste a real message from your inbox and watch Claude reply in under 5 seconds. The whole flow is on this site.
          </p>
          <div className="mt-5">
            <Link
              to={post.agentPath}
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-clara-purple hover:scale-[1.02] transition"
            >
              Open {post.agent} →
            </Link>
          </div>
        </div>

        {/* Other posts */}
        {otherPosts.length > 0 && (
          <div className="mt-16">
            <div className="text-xs font-bold uppercase tracking-widest text-clara-magenta mb-4">
              Keep reading
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {otherPosts.map((other) => (
                <Link
                  key={other.slug}
                  to={`/blog/${other.slug}`}
                  className="rounded-2xl bg-white border border-clara-purple/10 p-5 hover:-translate-y-0.5 hover:shadow-clara-sm transition"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-clara-magenta">
                    <span aria-hidden="true">{other.icon}</span> {other.agent}
                  </div>
                  <div className="mt-2 font-display text-lg font-extrabold text-clara-deep leading-snug">
                    {other.title}
                  </div>
                  <div className="mt-2 text-xs text-clara-ink/60">{other.readMinutes} min read →</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

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

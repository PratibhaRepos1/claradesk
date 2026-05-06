export const BLOG_POSTS = [
  {
    slug: 'inbox-agent-stops-leaks',
    eyebrow: 'Why buy',
    accent: 'from-clara-pink to-clara-magenta',
    icon: '📬',
    agent: 'Inbox Agent',
    agentPath: '/inbox',
    title: 'Why your contact form is leaking $50K a year — and how Inbox Agent plugs it',
    excerpt:
      'If you route every contact-form message into one inbox and triage by hand, you are losing hot leads to spam, missing partnerships under the support pile, and burning a junior on a job nobody wants.',
    readMinutes: 4,
    publishedOn: '2026-05-06',
    author: 'Pratibha Jadhav',
    sections: [
      {
        heading: 'The contact-form chaos tax',
        body:
          'Every business with a contact form on its website ends up with the same mess: real buyers, support tickets, partnership pitches and SEO spam all landing in the same inbox. Someone — usually the founder, the office manager, or a junior on the sales team — opens that inbox in the morning, reads each message, decides what it is, and forwards it on. On a busy week with 200 messages, that is four hours of human time spent on triage. None of it is selling. None of it is solving customer problems. It is just *sorting*.',
      },
      {
        heading: 'The leak nobody measures',
        body:
          'The problem is not just time. It is the leaks. A hot buying inquiry sits next to a viagra spam for three hours before anyone reads it. A partnership offer gets forwarded to support and dies in a ticket queue. A 1-star review threat gets buried below a generic "what do you do?" enquiry. Each of those is a missed dollar — and at SMB scale, even one missed enterprise deal a quarter is more revenue than your entire AI tool stack costs for the year.',
      },
      {
        heading: 'What Inbox Agent actually does',
        body:
          'Inbox Agent reads every message Claude classifies it into one of four buckets — sales, support, partnership, spam — with a confidence score and a one-sentence reason, and routes it to the right Slack channel automatically. That means your sales reps see sales messages in #sales the moment they arrive. Your support team sees support tickets in #support. Your founder sees partnership offers in their own channel. And spam goes to an archive nobody has to look at. No triage. No forwarding. No "I forgot to check the inbox today".',
      },
      {
        heading: 'The numbers your customer cares about',
        body:
          'A team handling 200 messages a week saves roughly 4 hours of triage time a week — about $5,000 a year at SMB salary rates. But the bigger number is the leak. If Inbox Agent surfaces just *one* missed lead a month that would have otherwise been buried, the product pays for itself ten times over. We see real customers cite catching a 1-star review threat in 4 minutes instead of 3 hours as the moment they decided to keep paying. Speed matters. Routing matters. Triage time is not the prize — *not missing the message that mattered* is the prize.',
      },
      {
        heading: 'How to try it in 30 seconds',
        body:
          'Open the Inbox Agent demo on this site. Type a real message someone might send through your contact form — sales question, support issue, partnership pitch, even spam. Hit classify. You will see the category, the confidence, and the reason in under three seconds, plus a Slack post landing in the right channel. That is the whole product. No installation. No training. No prompt engineering. It is the simplest agent in ClaraDesk and the one most teams turn on first.',
      },
    ],
  },
  {
    slug: 'lead-agent-four-features',
    eyebrow: 'Capability',
    accent: 'from-clara-purple to-clara-pink',
    icon: '🎯',
    agent: 'Lead Agent',
    agentPath: '/leads',
    title: 'From cold inquiry to booked demo: the 4 AI features inside Lead Agent',
    excerpt:
      'Lead Agent does not just write follow-up emails. It scores the lead, tags intent for your CRM, suggests the next move, and ships two tone variants in a single Claude call. Here is how each feature compounds.',
    readMinutes: 6,
    publishedOn: '2026-05-06',
    author: 'Pratibha Jadhav',
    sections: [
      {
        heading: 'The "just use ChatGPT" trap',
        body:
          'Every founder we talk to asks the same question: why pay for Lead Agent when a sales rep can paste an inquiry into ChatGPT and ask for a follow-up email? Honest answer — for one email, ChatGPT is fine. For thirty inquiries a day, across five reps, with a CRM behind it, ChatGPT is a 90-second-per-lead workflow with no data trail and no team visibility. Lead Agent is a 10-second-per-lead workflow with a structured database growing under it. The product is not better prose. The product is *workflow*.',
      },
      {
        heading: 'Feature 1 — Lead score (hot, warm, cold)',
        body:
          'Every inquiry comes back tagged hot, warm, or cold with a one-sentence reasoning that cites the actual signals — "budget approved, end-of-quarter timeline, 75-seat minimum". That single field changes how the rep starts their day. They open Slack, see the hot leads first, work them in priority. No guessing. No reading 30 inquiries to figure out which two matter today. The reasoning string makes it auditable — a manager can see why Claude scored a lead hot and challenge it if needed.',
      },
      {
        heading: 'Feature 2 — Intent tags ready for your CRM',
        body:
          'Each lead also comes back with two to five intent tags in a `key:value` shape — `pricing`, `team_size:75`, `timeline:this_quarter`, `competitor_mentioned`, `integration_question`. These are not decorative. Drop them straight into Salesforce or HubSpot as custom fields. Six months later your sales ops team can run filters like "show me every lead tagged competitor_mentioned that closed". That is a pipeline analytics story you literally cannot build with copy-paste ChatGPT.',
      },
      {
        heading: 'Feature 3 — Next-action suggestion',
        body:
          'Every lead gets one sharp instruction the rep can act on without thinking — "Book a 15-min discovery call within 24 hours" or "Send pricing PDF and a relevant case study" or "Tag as nurture, follow up in 30 days". This is the single most useful field for junior reps, who often hesitate after reading an inquiry because they do not know what good looks like. Lead Agent removes that hesitation.',
      },
      {
        heading: 'Feature 4 — Two tone variants in one call',
        body:
          'Instead of generating one email and forcing the rep to regenerate when the tone is off, Lead Agent ships a friendly variant and a professional variant in the same Claude response. The rep clicks the tab that matches their relationship with the lead and edits from there. This saves a Claude call per lead — about 30% of the API cost — and removes the "let me try another prompt" loop that wastes time and produces inconsistent brand voice.',
      },
      {
        heading: 'Bonus — production hardening you do not see',
        body:
          'Word counts in the UI are recomputed server-side after Claude responds, because Claude can be sloppy with arithmetic. The JSON parser tolerates markdown fences in case Claude wraps its response in ```json. There is a mock fallback that returns the same shape if the API is down or out of credits, so live demos never break. Pydantic validates every input and every output — bad payloads return 422 before any logic runs. None of this is visible in the UI. All of it is why the product stays up.',
      },
      {
        heading: 'How to try it',
        body:
          'Open the Lead Agent demo. Click "Try a hot lead sample" — it pre-fills a Stripe-style enquiry. Hit "Draft follow-up". You will see the score, the reasoning, the intent tags, the next action, and two editable email variants in under five seconds. Edit either one. Copy. Send. The whole flow is what your sales floor will do thirty times a day.',
      },
    ],
  },
]

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

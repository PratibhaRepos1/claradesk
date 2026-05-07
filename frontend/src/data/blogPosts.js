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
  {
    slug: 'onboarding-agent-activation-gap',
    eyebrow: 'Time saved',
    accent: 'from-clara-purple to-clara-sky',
    icon: '👋',
    agent: 'Onboarding Agent',
    agentPath: '/welcome',
    title: 'Why every SaaS leaks 30% of signups in week 1 — and what Onboarding Agent does about it',
    excerpt:
      'Most product-led companies lose more revenue to silent week-one churn than to cancellations. Personalised onboarding fixes it — but writing one welcome email at a time is what kills CSM teams.',
    readMinutes: 5,
    publishedOn: '2026-05-07',
    author: 'Pratibha Jadhav',
    sections: [
      {
        heading: 'The activation gap nobody puts on the board deck',
        body:
          'Industry data on product-led SaaS is brutal. About 60% of signups never log in a second time. Of those who do, only half complete a single meaningful action in week one. That is your activation gap, and it is the leakiest part of the funnel — bigger than your churn rate, bigger than your refund rate, bigger than every paid-acquisition leak combined. The reason is not your product. It is that nobody made the new customer feel personally welcomed and pointed at the one thing that proves the product works.',
      },
      {
        heading: 'Why CSM teams cannot scale the personal welcome',
        body:
          'A senior customer success manager writes a good welcome email in eight to twelve minutes. Read the signup, identify the plan tier, write a few sentences that reference what they bought, build a checklist of three to five steps that match the plan, save it as a draft, send. At fifty signups a week that is six to ten hours of CSM time on email drafts alone. Most teams do not have that time, so they default to the same generic template for everyone — and the activation gap stays exactly where it was.',
      },
      {
        heading: 'What Onboarding Agent actually delivers',
        body:
          'Drop a new signup into Onboarding Agent and in under five seconds you get a welcome email under 200 words tuned to the specific plan they signed up for, a 3-5 step activation checklist where every step has a "why this matters for your plan" line, the single highest-ROI first win to drive activation, a CSM-facing health signal (green/yellow/red) with reasoning that flags tyre-kickers and high-value enterprise signups so your team knows who to call, and a day-7 follow-up subject line so the second touch is already queued. All in one Claude call. All editable. All ready to send.',
      },
      {
        heading: 'The numbers — at fifty signups a week',
        body:
          'Manual welcome workflow: 8-12 minutes per signup × 50 = 6.5-10 hours of CSM time per week. Onboarding Agent workflow: 30 seconds to review and send × 50 = 25 minutes per week. That is 6 to 9 hours saved per CSM per week, or roughly $20K-30K of CSM salary per year freed up to do work that does not scale linearly. But the real prize is activation. Personalised first-week emails lift activation rates by 25-40% in published industry studies — which means your existing acquisition spend gets that much more efficient. The product pays for itself before the first month is out.',
      },
      {
        heading: 'How to try it',
        body:
          'Open the Onboarding Agent demo on this site. Click "Bundle Annual @ Stripe" or one of the other samples. Hit "Draft welcome". You will see the health signal, the welcome email tuned to the plan, the activation checklist, and the day-7 teaser in under five seconds. Edit anything. Copy. Send. That single screen is what your CSM team does fifty times a week — or what Onboarding Agent does for them in two minutes.',
      },
    ],
  },
  {
    slug: 'billing-agent-cashflow',
    eyebrow: 'Cashflow',
    accent: 'from-clara-magenta to-clara-purple',
    icon: '💳',
    agent: 'Billing Agent',
    agentPath: '/billing',
    title: 'The $1.2 trillion problem hiding in your invoices — and the 8-second fix',
    excerpt:
      'Globally, businesses lose $1.2 trillion a year to overdue invoices. Most of that loss is recoverable — if someone sends a tone-tuned reminder at the right time. Billing Agent is that someone, in eight seconds.',
    readMinutes: 5,
    publishedOn: '2026-05-07',
    author: 'Pratibha Jadhav',
    sections: [
      {
        heading: 'The AR tax — why finance hates "follow up on invoices"',
        body:
          'Every accounts-receivable team carries the same dead weight: a list of overdue invoices, a calendar reminder to chase them, and the specific dread of writing the email. The first reminder must be friendly so you do not damage the relationship. The third reminder must be firm without sounding hostile. The fifth reminder threads the needle between "we still want your business" and "we are about to escalate." That tone calibration is real work, and most finance teams default to a single template — which means friendly customers get pestered and serious deadbeats get treated like they forgot.',
      },
      {
        heading: 'Why tone matters at days 5 vs days 30',
        body:
          'A 5-day-late invoice is almost always an oversight. A friendly reminder converts well over 90% of these — the customer apologises, pays, and the relationship is fine. A 30-day-late invoice is a different animal. Friendly tone there reads as weakness, the customer assumes you do not really need the money, and you wait another month. The right tone at 30 days is firm, formal, and references next steps. Get tone wrong on either end and you lose: the relationship, the cashflow, or both. Most teams get it wrong because they do not have time to write a fresh email for every invoice every time.',
      },
      {
        heading: 'What Billing Agent does in 8 seconds',
        body:
          'Drop in invoice number, amount, days overdue, customer name and email. Billing Agent calibrates tone automatically — friendly under 7 days, direct from 8 to 21 days, firm at 22 plus. It drafts an email under 100 words that names the invoice and amount directly and ends with a single clear call to action. It scores the recovery probability (high/medium/low) so your AR manager prioritises which invoices to call about today. And for high-value or older invoices, it suggests a payment plan concession the rep could include — "happy to split this across two months" — which is often the exact thing that unlocks a stuck payment.',
      },
      {
        heading: 'The numbers — at thirty overdue invoices a month',
        body:
          'Manual workflow: 5-7 minutes per reminder (look up customer, draft email, send) × 30 = 2.5 to 3.5 hours of finance-team time per month. Billing Agent: 30 seconds per reminder × 30 = 15 minutes per month. That is 2 to 3 hours of finance time saved monthly per AR person. But the real money is in collection rates. Industry data on dunning shows tone-calibrated reminders sent at the right cadence recover 12-18% more overdue invoice value in the first 30 days than generic templates. On a $50K AR balance that is $6,000 to $9,000 of cashflow recovered per month — every month — for a $25/mo agent.',
      },
      {
        heading: 'How to try it',
        body:
          'Open the Billing Agent demo and click "30 days · firm" — it pre-fills a $4,800 30-day-overdue invoice for Jamie Park. Hit "Draft nudge". You will see the firm tone, the recovery probability call (medium), and a payment-plan concession suggestion you can offer. Edit, copy, send. The same flow runs for the friendly 5-day reminder and the direct 14-day reminder — same agent, three different tones, three completely different emails.',
      },
    ],
  },
  {
    slug: 'booking-agent-empty-slot',
    eyebrow: 'Retention',
    accent: 'from-clara-sky to-clara-magenta',
    icon: '📅',
    agent: 'Booking Agent',
    agentPath: '/bookings',
    title: 'Every empty slot costs you twice — and Booking Agent rebooks it while the seat is still warm',
    excerpt:
      'For service businesses, a cancellation is two losses: the lost revenue from the slot, and the lost lifetime value if the customer does not come back. Booking Agent closes both gaps inside an hour.',
    readMinutes: 5,
    publishedOn: '2026-05-07',
    author: 'Pratibha Jadhav',
    sections: [
      {
        heading: 'The double cost of a cancellation',
        body:
          'When a customer cancels a salon appointment, a clinic visit, or a studio booking, the obvious loss is the revenue from that slot. The hidden loss is bigger — most cancellation studies show that customers who cancel without rebooking within 7 days have a 60% lower chance of ever coming back. That means each cancellation is a one-time revenue hit AND a probability dent on a multi-year customer relationship. The retention window is short. Whoever responds first usually wins.',
      },
      {
        heading: 'Why most win-back emails come three days too late',
        body:
          'A receptionist sees a cancellation come in mid-afternoon, finishes the current customer first, eats their dinner, and remembers to write the win-back email the next morning. By the time the email goes out, the customer has already booked a competitor or simply moved on. The win-back gets lost in their inbox. The receptionist meant well — but staffing busy reception desks for fast emotional support work is not realistic, and the cost of a slow reply gets baked into churn assumptions that nobody questions.',
      },
      {
        heading: 'What Booking Agent does in 6 seconds',
        body:
          'Drop in the cancellation reason and booking history. Booking Agent classifies the cancellation category — schedule conflict, dissatisfaction, financial, external, or other — and uses that to pick the right tone. It scores win-back probability based on reason and history. It flags risk factors the rep needs to know ("third cancellation in six months", "previously complained about pricing"). It drafts a warm email under 120 words that acknowledges the reason without lecturing. It generates a 160-character SMS variant for businesses where text is the right channel. And it suggests 2-4 generic time slots so the customer just has to reply with a yes.',
      },
      {
        heading: 'The numbers — at fifteen cancellations a week',
        body:
          'Manual workflow: 4-6 minutes per cancel (read note, check history, draft personalised reply) × 15 = 1 to 1.5 hours of reception time per week. Booking Agent: 20 seconds per cancel × 15 = 5 minutes per week. The time savings are nice — about an hour a week per receptionist — but the bigger win is response speed. Industry retention data shows win-back replies sent within 30 minutes of a cancellation rebook at roughly 40% versus 22% for replies sent the next day. On 60 cancellations a month at an average $80 service, that is an extra $864 of recovered revenue per month for any business that responds faster — every month.',
      },
      {
        heading: 'How to try it',
        body:
          'Open the Booking Agent demo and click "Dissatisfaction · repeat canceller". This is the hardest case — Tom has cancelled twice already and just complained about pricing. Hit "Draft win-back". Booking Agent flags the risk factors, picks a professional tone, lowers the win-back probability score, and drafts a measured email that does not pretend nothing has happened. That is the kind of nuance most receptionists do not have time to bake into a same-day reply.',
      },
    ],
  },
  {
    slug: 'review-agent-reputation',
    eyebrow: 'Reputation',
    accent: 'from-clara-pink to-clara-purple',
    icon: '⭐',
    agent: 'Review Agent',
    agentPath: '/reviews',
    title: 'A single 1-star review costs you 30 customers — Review Agent helps you reply before lunch',
    excerpt:
      'Bad reviews compound. Slow replies look like indifference. Generic replies look like a bot. Review Agent gives you a calibrated, empathetic public response and an internal action list inside two minutes.',
    readMinutes: 6,
    publishedOn: '2026-05-07',
    author: 'Pratibha Jadhav',
    sections: [
      {
        heading: 'The reputation tax — why one bad review hurts more than ten good ones help',
        body:
          'Published consumer-trust research is consistent: a single 1-star Google review reduces purchase intent by 22% on average for prospective customers who see it. One bad review effectively cancels out the persuasive value of about ten good ones. Worse, the review platforms boost recent activity in their algorithms — so a 1-star this week is more visible than your 5-star reviews from last year. The reputation tax compounds quickly, and the only thing that lifts it is a public reply that demonstrably acknowledges, owns, and resolves the issue.',
      },
      {
        heading: 'Why managers freeze on negative reviews',
        body:
          'Drafting a public reply to a negative review is one of the most stress-inducing tasks a small-business manager faces. Get the tone wrong and you sound defensive, which makes things worse. Be too generic and you look like a bot. Apologise too much and competitors screenshot it. Most managers stare at the review for 10 minutes, draft something, delete it, redraft, ask a colleague, edit again, and 25 minutes later post a reply that is okay but not great. Repeat that for every 1-star and 2-star review, and managers either burn out or stop replying entirely — which is the worst possible outcome for the algorithm.',
      },
      {
        heading: 'What Review Agent does in 12 seconds',
        body:
          'Drop in the review text, rating, and platform. Review Agent grades severity — mild, moderate, or severe — and surfaces compliance or safety language automatically (a review mentioning food safety or discrimination should never sit in a queue). It drafts a public response under 100 words, professional and empathetic, that addresses the specific issues raised in the review (not generic regret). It writes a 2-3 sentence internal note for the team. It identifies the root issues and assigns each one to a team owner — frontdesk, kitchen, support, billing, management, ops — so the people who can fix it actually see it. And it suggests a fair compensation when one is warranted.',
      },
      {
        heading: 'The numbers — at ten negative reviews a month',
        body:
          'Manual workflow: 8-15 minutes per review (read, draft public reply, redraft, write internal note, work out who needs to act) × 10 = 1.5 to 2.5 hours of manager time per month per location. Review Agent: 30 seconds per review × 10 = 5 minutes per month. The time savings matter, but the bigger leverage is response speed and consistency. Reviews replied to within 24 hours show a meaningful lift in algorithmic visibility on Google and Yelp, and consistent owner-assignment means the same kitchen issue does not show up in three separate reviews three months apart. For a multi-location SMB, Review Agent stops the reputation tax from compounding across locations — which is what protects the lifetime customer value of the entire business.',
      },
      {
        heading: 'How to try it',
        body:
          'Open the Review Agent demo and click "Severe · 1★ Google" — the most dangerous case, where a customer is threatening to report a hair-in-food incident to health authorities. Hit "Draft response". Review Agent flags severity as severe with reasoning, drafts a public reply that acknowledges specifics and does not minimise the issue, writes the internal note, assigns root issues to the kitchen and management, and suggests a full refund plus complimentary visit. That is the kind of response a stressed-out manager takes 45 minutes to craft on a bad day — produced in twelve seconds.',
      },
    ],
  },
]

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

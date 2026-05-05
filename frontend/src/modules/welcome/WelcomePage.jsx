import ComingSoon from '../shared/ComingSoon.jsx'

export default function WelcomePage() {
  return (
    <ComingSoon
      title="Clara Welcome"
      icon="👋"
      tagline="New customer onboarding message + checklist."
      buildWeek="Week 3"
      inputs={['customer_name', 'email', 'product_plan', 'company (optional)']}
      output="Subject line, welcome email (under 200 words), 3–5 onboarding checklist items."
      slackChannel="#onboarding"
      endpoint="POST /api/welcome/draft"
    />
  )
}

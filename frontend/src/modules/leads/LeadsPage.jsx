import ComingSoon from '../shared/ComingSoon.jsx'

export default function LeadsPage() {
  return (
    <ComingSoon
      title="Lead Agent"
      icon="🎯"
      tagline="New lead follow-up email writer."
      buildWeek="Week 2"
      inputs={['name', 'email', 'inquiry_details', 'company (optional)']}
      output="Subject line, personalised follow-up email (under 150 words), tone."
      slackChannel="#sales-leads"
      endpoint="POST /api/leads/draft"
    />
  )
}

import ComingSoon from '../shared/ComingSoon.jsx'

export default function BillingPage() {
  return (
    <ComingSoon
      title="Clara Billing"
      icon="💳"
      tagline="Overdue invoice nudger with tone calibration."
      buildWeek="Week 4"
      inputs={['invoice_number', 'amount', 'days_overdue', 'customer_name', 'customer_email']}
      output="Subject, payment reminder email (under 100 words). Tone is friendly (1–7 days), direct (8–21 days), or firm (22+ days)."
      slackChannel="#billing"
      endpoint="POST /api/billing/nudge"
    />
  )
}

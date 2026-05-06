import ComingSoon from '../shared/ComingSoon.jsx'

export default function BookingsPage() {
  return (
    <ComingSoon
      title="Booking Agent"
      icon="📅"
      tagline="Cancelled booking win-back drafter with reschedule offers."
      buildWeek="Week 5"
      inputs={['customer_name', 'service_type', 'cancellation_reason', 'original_date', 'booking_history']}
      output="Win-back message (under 120 words) and 2–3 suggested rescheduling time slots."
      slackChannel="#bookings"
      endpoint="POST /api/bookings/winback"
    />
  )
}

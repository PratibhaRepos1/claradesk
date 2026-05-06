import ComingSoon from '../shared/ComingSoon.jsx'

export default function ReviewsPage() {
  return (
    <ComingSoon
      title="Review Agent"
      icon="⭐"
      tagline="Negative review response drafter with public + internal outputs."
      buildWeek="Week 6"
      inputs={['reviewer_name', 'rating', 'review_text', 'platform']}
      output="Public response (under 100 words), internal note for the team, and a list of root issues."
      slackChannel="#reviews"
      endpoint="POST /api/reviews/draft"
    />
  )
}

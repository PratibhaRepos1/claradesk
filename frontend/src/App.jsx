import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import SetupPage from './pages/SetupPage.jsx'
import JourneyPage from './pages/JourneyPage.jsx'
import InboxPage from './modules/inbox/InboxPage.jsx'
import LeadsPage from './modules/leads/LeadsPage.jsx'
import WelcomePage from './modules/welcome/WelcomePage.jsx'
import BillingPage from './modules/billing/BillingPage.jsx'
import BookingsPage from './modules/bookings/BookingsPage.jsx'
import ReviewsPage from './modules/reviews/ReviewsPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route element={<Layout />}>
          <Route path="inbox"    element={<InboxPage />} />
          <Route path="leads"    element={<LeadsPage />} />
          <Route path="welcome"  element={<WelcomePage />} />
          <Route path="billing"  element={<BillingPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="reviews"  element={<ReviewsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

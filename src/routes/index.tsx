import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/landing-page/HeroSection'
import { AllEventsSection } from '@/components/landing-page/AllEventsSection'
import {  NewsletterSection } from '@/components/landing-page/AdditionalSections'
import { getTrendingEvents, getUpcomingEvents, getAllEvents } from '@/server/events'
import { ChevronRight } from 'lucide-react'
import { Footer } from '#/components/Footer'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [trendingEvents, upcomingEvents, allEvents] = await Promise.all([
      getTrendingEvents(),
      getUpcomingEvents(),
      getAllEvents(),
    ])
    return { trendingEvents, upcomingEvents, allEvents }
  },
  component: Home,
})

function Home() {
  const { allEvents } = Route.useLoaderData()

  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* Discovery Section */}
      <div className="bg-white border-y border-slate-100">
        <AllEventsSection events={allEvents} />
      </div>
      <NewsletterSection />
      <Footer />
    </div>
  )
}


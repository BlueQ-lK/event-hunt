import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/landing-page/HeroSection'
import { AllEventsSection } from '@/components/landing-page/AllEventsSection'
import { NewsletterSection } from '@/components/landing-page/AdditionalSections'
import { Footer } from '@/components/Footer'
import { getEventsByCity } from '@/server/events'
import { getStoredLocation, normalizeCitySlug, saveLocationLocally } from '@/lib/location'
import { useEffect } from 'react'

export const Route = createFileRoute('/$city/all')({
  loader: async ({ params }) => {
    const city = normalizeCitySlug(params.city)
    const allEvents = await getEventsByCity({ data: { city, limit: 100 } })
    return { allEvents, city }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { allEvents, city } = Route.useLoaderData()

  useEffect(() => {
    const cached = getStoredLocation()
    saveLocationLocally({
      city,
      lat: cached.lat,
      lng: cached.lng,
    })
  }, [city])

  return (
    <div className="min-h-screen">
      <HeroSection city={city} />
      <div className="bg-white border-y border-slate-100">
        <AllEventsSection events={allEvents} city={city} />
      </div>
      <NewsletterSection />
      <Footer />
    </div>
  )
}

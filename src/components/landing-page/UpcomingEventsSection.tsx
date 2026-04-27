import { Link } from '@tanstack/react-router'
import { ChevronRight, CalendarClock } from 'lucide-react'
import { EventCard } from '@/components/EventCard'

type Event = {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date | null
  startTime: string | null
  endTime: string | null
  locationName: string | null
  address: string | null
  city: string | null
  category: string | null
  bannerImage: string | null
  brochure: string | null
  createdAt: Date
}

export function UpcomingEventsSection({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Upcoming Events</h2>
              <p className="text-xs text-slate-400 font-medium">Don't miss what's coming up next</p>
            </div>
          </div>
          <Link to="/search" className="flex items-center gap-1 text-primary text-sm font-bold hover:gap-2 transition-all">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.slice(0, 4).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {events.length > 4 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.slice(4, 8).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

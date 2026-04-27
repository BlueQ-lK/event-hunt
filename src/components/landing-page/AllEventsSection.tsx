import { Link } from '@tanstack/react-router'
import { ChevronRight, LayoutGrid } from 'lucide-react'
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

export function AllEventsSection({ events }: { events: Event[] }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-slate-800">All Events</h2>
        </div>
        <Link to="/search" className="flex items-center gap-1 text-primary text-xs font-bold hover:gap-2 transition-all">
          View all events <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <LayoutGrid className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium text-sm">No events yet</p>
          <p className="text-slate-300 text-xs mt-1">Events will appear here once they're created</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

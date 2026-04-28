import { Link } from '@tanstack/react-router'
import { ChevronRight, LayoutGrid, Filter } from 'lucide-react'
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

const categories = ['All', 'Trending', 'Upcoming']

export function AllEventsSection({ events }: { events: Event[] }) {
  return (
    <section className="py-10">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Explore Events</h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
               {categories.map((cat) => (
                 <button 
                   key={cat} 
                   className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                     cat === 'All' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6">
              <LayoutGrid className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-900 font-bold text-lg">No events found</p>
            <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">We couldn't find any events matching your criteria right now.</p>
            <button className="mt-8 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            <div className="mt-16 flex justify-center">
              <Link 
                to="/search" 
                className="group flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
              >
                View more events <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}


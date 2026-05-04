import { Link } from '@tanstack/react-router'
import { ChevronRight, Sparkles, Map } from 'lucide-react'
import { EventCard } from '@/components/EventCard'
import { getBestStoredCity, normalizeCitySlug } from '@/lib/location'

function EmptyState() {
  return (
    <div className="py-32 flex flex-col items-center justify-center border border-slate-100 rounded-[2.5rem] bg-slate-50/50">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
        <Map className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Quiet around here.</h3>
      <p className="text-slate-500 font-medium">No events found in this area yet.</p>
    </div>
  )
}

export function AllEventsSection({ events, city }: { events: any[]; city?: string }) {
  const activeCity = normalizeCitySlug(city ?? getBestStoredCity())
  const cityText = activeCity.replace(/-/g, ' ')

  return (
    <section className="py-24 bg-white">
      <div className="container-custom px-6">
        {/* Header DNA: High Contrast & Serif Accents */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600 rounded-full">
              <Sparkles className="w-3 h-3" />
              Weekly Selection
            </span>
            
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Featured <span className="text-indigo-600 italic font-serif">Hunt</span>
            </h2>
            
            <p className="text-slate-500 font-medium mt-4 text-lg">
              Handpicked experiences curated for your week in {cityText}.
            </p>
          </div>

          <Link 
            to="/search"
            search={{ city: activeCity }}
            className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
          >
            View everything
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid Layout */}
        {events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {events.map((event) => (
              <div key={event.id} className="group cursor-pointer">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
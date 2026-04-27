import { Link } from '@tanstack/react-router'
import { ChevronRight, Bookmark } from 'lucide-react'

const upcomingEvents = [
  {
    id: '1',
    title: 'Chaitra Pournami Pooje',
    location: 'Yennahole Temple, Karnataka',
    date: 'May 23, 2024',
    image: 'https://images.unsplash.com/photo-1590050752117-23a9d7f28243?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Ashada Jatre',
    location: 'Udupi, Karnataka',
    date: 'Jul 10 - Jul 12, 2024',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Nag Panchami Special Pooja',
    location: 'Kollur Mookambika Temple, Karnataka',
    date: 'Aug 09, 2024',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=200&auto=format&fit=crop'
  }
]

export function CategoriesSection() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="text-primary">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Upcoming Events</h2>
        </div>
        <Link to="/search" className="flex items-center gap-1 text-primary text-xs font-bold hover:gap-2 transition-all">
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-6">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="flex items-center gap-4 group cursor-pointer">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-primary transition-colors">{event.title}</h4>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{event.location}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] font-bold text-slate-400">{event.date}</div>
              <button className="text-slate-300 hover:text-primary mt-1">
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

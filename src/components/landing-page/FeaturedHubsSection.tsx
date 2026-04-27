import { Link } from '@tanstack/react-router'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const hubs = [
  {
    id: '1',
    name: 'Yennahole Temple',
    location: 'Yennahole, Karnataka',
    eventCount: '156 Events',
    image: 'https://images.unsplash.com/photo-1590050752117-23a9d7f28243?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Kateel Shri Durgaparameshwari',
    location: 'Kateel, Karnataka',
    eventCount: '98 Events',
    image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Udupi Krishna Matha',
    location: 'Udupi, Karnataka',
    eventCount: '87 Events',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Kollur Mookambika Temple',
    location: 'Kollur, Karnataka',
    eventCount: '75 Events',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=600&auto=format&fit=crop'
  }
]

export function FeaturedHubsSection() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="text-primary">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Popular Festival Hubs</h2>
        </div>
        <Link to="/search" className="flex items-center gap-1 text-primary text-xs font-bold hover:gap-2 transition-all">
          View all hubs <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hubs.map((hub) => (
            <div key={hub.id} className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3">
                <img 
                  src={hub.image} 
                  alt={hub.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-primary transition-colors">{hub.name}</h4>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-slate-500 truncate">{hub.location}</p>
                <span className="text-[10px] font-bold text-primary">{hub.eventCount}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Control */}
        <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md border border-slate-50 flex items-center justify-center text-slate-300 hover:text-primary transition-colors z-10">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

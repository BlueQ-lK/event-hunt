import { Search, MapPin, ChevronDown, Music, Briefcase, Trophy, Utensils, PartyPopper, Sparkles, Music2, Mic2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

const categories = [
  { name: 'Music', icon: Music, color: 'text-blue-600', bg: 'group-hover:bg-blue-50' },
  { name: 'Business', icon: Briefcase, color: 'text-slate-700', bg: 'group-hover:bg-slate-50' },
  { name: 'Sports', icon: Trophy, color: 'text-orange-600', bg: 'group-hover:bg-orange-50' },
  { name: 'Food & Drink', icon: Utensils, color: 'text-red-600', bg: 'group-hover:bg-red-50' },
  { name: 'Parties', icon: PartyPopper, color: 'text-purple-600', bg: 'group-hover:bg-purple-50' },
  { name: 'Festivals', icon: Sparkles, color: 'text-yellow-600', bg: 'group-hover:bg-yellow-50' },
  { name: 'Dance', icon: Music2, color: 'text-pink-600', bg: 'group-hover:bg-pink-50' },
  { name: 'Comedy', icon: Mic2, color: 'text-emerald-600', bg: 'group-hover:bg-emerald-50' },
]

export function HeroSection() {
  return (
    <>
      <section className="relative mx-6 rounded-3xl overflow-hidden shadow-2xl py-12">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1590050752117-23a9d7f28243?q=80&w=2000&auto=format&fit=crop" 
            alt="Temple Festival" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-12 md:px-24 text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Discover. Celebrate. <span className="text-primary">Connect.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-6 max-w-xl font-medium">
            Find and share festivals, events, and spiritual experiences around you.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center gap-0 bg-white rounded-xl p-1 shadow-2xl max-w-3xl overflow-hidden border border-white/20">
            <div className="flex-1 flex items-center px-4 py-3 group">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search events, temples, places..." 
                className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400"
              />
            </div>
            
            <div className="w-px h-8 bg-slate-200 hidden md:block" />
            
            <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors group">
              <MapPin className="w-5 h-5 text-primary mr-2" />
              <span className="text-slate-800 font-medium whitespace-nowrap">Near me</span>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
            </div>

            <Button className="bg-primary hover:bg-primary-hover text-white font-bold h-12 px-10 rounded-lg m-1">
              Search
            </Button>
          </div>

          {/* Popular Searches */}
          <div className="flex items-center gap-3 mt-6 flex-wrap">
            <span className="text-sm font-semibold text-white/70">Popular Searches:</span>
            {['Temple Festivals', 'Car Festivals', 'Music Events', 'Cultural Programs'].map(tag => (
              <button key={tag} className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold hover:bg-white/20 transition-all">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mangalore's Most-Loved Section */}
      <div className="mx-6 mt-10 mb-8 px-4">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mangalore's Most-Loved</h2>
          <div className="h-px flex-1 bg-slate-100 hidden sm:block" />
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to="/search" 
              search={{ category: cat.name }}
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className={`w-full aspect-square rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-primary/20 ${cat.bg}`}>
                <cat.icon className={`w-8 h-8 text-slate-400 group-hover:${cat.color} group-hover:scale-110 transition-all duration-500`} />
              </div>
              <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 tracking-widest uppercase transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

import { Search, MapPin, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

const categories = [
  { name: 'Music', image: '/images/music.png', color: 'from-blue-600/80 to-blue-900/90' },
  { name: 'Business', image: '/images/business.png', color: 'from-slate-700/80 to-slate-900/90' },
  { name: 'Sports', image: '/images/sports.png', color: 'from-orange-600/80 to-orange-900/90' },
  { name: 'Food & Drink', image: '/images/food-drink.png', color: 'from-red-600/80 to-red-900/90' },
  { name: 'Parties', image: '/images/parties.png', color: 'from-purple-600/80 to-purple-900/90' },
  { name: 'Festivals', image: '/images/festivals.png', color: 'from-yellow-600/80 to-yellow-900/90' },
  { name: 'Dance', image: '/images/dance.png', color: 'from-pink-600/80 to-pink-900/90' },
  { name: 'Comedy', image: '/images/comedy.png', color: 'from-emerald-600/80 to-emerald-900/90' },
]

export function HeroSection() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      navigate({
        to: '/search',
        search: { q: query.trim() }
      })
    }
  }

  const handlePopularSearch = (tag: string) => {
    navigate({
      to: '/search',
      search: { q: tag }
    })
  }

  return (
    <div className='container-custom'>
      <section className="relative rounded-3xl overflow-hidden  py-12">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-12 md:px-24 text-white">
          <h1 className="text-5xl md:text-6xl font-medium mb-6 tracking-tight">
            All Events in <span className="font-bold">$Mangalore</span>
          </h1>
          <p className="text-base text-white/80 mb-6 max-w-2xl font-medium">
            Discover the best things to do & events in $Mangalore. Explore concerts, meetups, open mics, art shows, music events and a lot more.
          </p>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row items-center gap-0 bg-white rounded-xl p-1 shadow-2xl max-w-3xl overflow-hidden border border-white/20"
          >
            <div className="flex-1 flex items-center px-4 py-3 group">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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

            <Button 
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-bold h-12 px-10 rounded-lg m-1"
            >
              Search
            </Button>
          </form>

          {/* Popular Searches */}
          <div className="flex items-center gap-3 mt-6 flex-wrap">
            <span className="text-sm font-semibold text-white/70">Popular Searches:</span>
            {['Temple Festivals', 'Car Festivals', 'Music Events', 'Cultural Programs'].map(tag => (
              <button 
                key={tag} 
                onClick={() => handlePopularSearch(tag)}
                className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold hover:bg-white/20 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mangalore's Most-Loved Section */}
      <div className="mt-12 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">$Mangalore Most-Loved</h2>
            <p className="text-slate-500 font-medium text-sm">Explore the most popular categories in the city</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to="/search" 
              search={{ category: cat.name }}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Background Image */}
              <img 
                src={cat.image} 
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
              
              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-white text-sm font-black uppercase tracking-wider drop-shadow-md">
                  {cat.name}
                </span>
                <div className="w-0 h-0.5 bg-white mt-2 group-hover:w-8 transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

import { Search, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getBestStoredCity, normalizeCitySlug } from '@/lib/location'

const categories = [
  { name: 'Music', emoji: '🎸' },
  { name: 'Business', emoji: '💼' },
  { name: 'Sports', emoji: '🏆' },
  { name: 'Food', emoji: '🍕' },
  { name: 'Parties', emoji: '✨' },
  { name: 'Festivals', emoji: '🎡' },
  { name: 'Dance', emoji: '💃' },
  { name: 'Comedy', emoji: '🎙️' },
]

export function HeroSection({ city }: { city?: string }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const activeCity = normalizeCitySlug(city ?? getBestStoredCity())
  const cityText = activeCity.replace(/-/g, ' ')

  // Re-implemented search logic
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      navigate({
        to: '/search',
        search: { q: query.trim(), city: activeCity }
      })
    }
  }

  // Re-implemented category navigation
  const handleCategoryClick = (categoryName: string) => {
    navigate({
      to: '/search',
      search: { category: categoryName.toLowerCase(), city: activeCity }
    })
  }

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Subtle Badge */}
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-indigo-50 text-indigo-600 rounded-full">
          Discover {cityText}
        </span>
        
        <h1 className="text-5xl md:text-7xl font-tight font-black text-slate-900 mb-6 tracking-tighter">
          Experience <span className="text-indigo-600 italic font-serif">everything.</span>
        </h1>
        
        <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          From temple festivals to underground music. Find what moves you in the city.
        </p>

        {/* Minimalist Search Bar - Wrapped in form for 'Enter' key support */}
        <form 
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto group"
        >
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-2 shadow-sm transition-all group-focus-within:border-indigo-600 group-focus-within:ring-4 group-focus-within:ring-indigo-50/50">
            <div className="flex-1 flex items-center px-4">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?" 
                className="w-full py-3 bg-transparent border-none focus:outline-none text-slate-800"
              />
            </div>
            <button 
              type="submit"
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors"
            >
              Hunt
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-full text-sm font-semibold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
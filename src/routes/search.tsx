import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { getEvents } from '@/server/events'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, 
  MapPin, 
  Calendar, 
  SlidersHorizontal, 
  ArrowUpRight, 
  X, 
  Clock, 
  ChevronDown, 
  Bookmark, 
  Facebook, 
  Instagram, 
  Youtube, 
  RotateCcw
} from 'lucide-react'
import { z } from 'zod'

import { Footer } from '@/components/Footer'
import { EventCard } from '@/components/EventCard'

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
})

export const Route = createFileRoute('/search')({
  validateSearch: (search) => searchSchema.parse(search),
  loader: async () => await getEvents(),
  component: SearchPage,
})

function SearchPage() {
  const events = Route.useLoaderData()
  const { q, category, location: searchLocation } = Route.useSearch()
  const [query, setQuery] = useState(q || '')
  const [location, setLocation] = useState(searchLocation || 'Yennahole, Karnataka')
  const [activeTab, setActiveTab] = useState(category || 'All Events')

  const tabs = ['All Events', 'Festivals', 'Cultural Programs', 'Poojas & Rituals']

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesQuery = event.title.toLowerCase().includes(query.toLowerCase()) || 
                           (event.locationName || '').toLowerCase().includes(query.toLowerCase()) ||
                           (event.city || '').toLowerCase().includes(query.toLowerCase())
      const matchesTab = activeTab === 'All Events' || (event.category || '').toLowerCase().includes(activeTab.toLowerCase().split(' ')[0])
      return matchesQuery && matchesTab
    })
  }, [events, query, activeTab])

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Search Header Section */}
      <section className="bg-white border-b border-slate-100 py-12 px-6">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Search Events</h1>
            <p className="text-slate-500 font-medium">Find festivals, events and cultural programs near you.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-0 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
              <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-200 group">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events, temples, places..." 
                  className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400"
                />
                {query && <X className="w-4 h-4 text-slate-300 cursor-pointer hover:text-slate-500" onClick={() => setQuery('')} />}
              </div>
              <div className="flex-1 flex items-center px-4 py-3 group">
                <MapPin className="w-5 h-5 text-primary mr-3" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium"
                />
                <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
              </div>
            </div>
            
            <Button className="bg-primary hover:bg-primary-hover text-white font-bold h-[54px] px-10 rounded-xl w-full lg:w-auto">
              Search
            </Button>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 ml-auto">
              <span>Sort by:</span>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 cursor-pointer hover:border-slate-300 transition-colors">
                <span>Relevance</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-900">Filters</h3>
                <button className="flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80">
                  Reset <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Filter Sections */}
              <div className="space-y-8">
                <FilterSection title="Date Range" isOpen>
                  <div className="space-y-3">
                    {['Any date', 'Today', 'This Weekend', 'This Month', 'Custom Range'].map(item => (
                      <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${item === 'Any date' ? 'border-primary' : 'border-slate-200 group-hover:border-slate-300'}`}>
                          {item === 'Any date' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                        </div>
                        <span className={`text-sm font-medium ${item === 'Any date' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Location" isOpen>
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-bold text-slate-600">Within 25 km</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="relative">
                      <Input value="Yennahole, Karnataka" readOnly className="bg-white border-slate-200 text-xs font-medium pr-10" />
                    </div>
                  </div>
                </FilterSection>

                <FilterSection title="Event Type" isOpen>
                  <div className="space-y-3">
                    {['Temple Festival', 'Cultural Program', 'Music & Dance', 'Poojas & Rituals', 'Community Event'].map(item => (
                      <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-slate-300 transition-all flex items-center justify-center">
                          {/* Checked state placeholder */}
                        </div>
                        <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">{item}</span>
                      </label>
                    ))}
                    <button className="text-xs font-bold text-primary mt-2">Show more</button>
                  </div>
                </FilterSection>

                <FilterSection title="Price" isOpen>
                  <div className="space-y-3">
                    {['Free', 'Paid'].map(item => (
                      <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-slate-300 transition-all flex items-center justify-center" />
                        <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </div>

              <Button className="w-full bg-primary hover:bg-primary-hover text-white font-bold mt-8 rounded-xl py-6">
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Results Area */}
          <main className="flex-1">
            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab} {tab === 'All Events' && `(${filteredEvents.length})`}
                </button>
              ))}
            </div>

            {/* Event List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            {filteredEvents.length === 0 && (
                <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">No events found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
              )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function FilterSection({ title, children, isOpen }: { title: string, children: React.ReactNode, isOpen?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 cursor-pointer">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
      </div>
      {isOpen && children}
    </div>
  )
}



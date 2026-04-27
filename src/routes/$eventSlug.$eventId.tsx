import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Share2, 
  Building2, 
  Globe, 
  Lock, 
  ArrowUpRight, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  CalendarPlus,
  Share,
  Flag,
  MessageSquare,
  CheckCircle2,
  Facebook,
  Twitter,
  Bookmark
} from 'lucide-react'
import { useState } from 'react'
import { EventCard } from '@/components/EventCard'
import { Footer } from '@/components/Footer'
import { getEvent, getEvents } from '@/server/events'

export const Route = createFileRoute('/$eventSlug/$eventId')({
  loader: async ({ params }) => {
    const [event, moreEvents] = await Promise.all([
      getEvent({ data: params.eventId }),
      getEvents()
    ])
    return { event, moreEvents: moreEvents.filter(e => e.id !== params.eventId).slice(0, 4) }
  },
  component: EventDetailsPage,
})

function EventDetailsPage() {
  const { event, moreEvents } = Route.useLoaderData()
  const [activeScheduleTab, setActiveScheduleTab] = useState(0)
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
        <p className="text-slate-500 mb-8">The requested event could not be found.</p>
        <Link to="/search">
          <Button className="bg-primary text-white px-8 h-12 font-bold">
            BACK TO SEARCH
          </Button>
        </Link>
      </div>
    )
  }

  // Formatting date for hero
  const startDate = new Date(event.startDate)
  const month = startDate.toLocaleString('default', { month: 'short' }).toUpperCase()
  const day = startDate.getDate()
  const year = startDate.getFullYear()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100 py-4 px-6">
        <div className="container-custom flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/search" className="hover:text-primary transition-colors">Events</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600">{event.title}</span>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hero Gallery */}
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-100 group">
              <div className="relative aspect-[16/9]">
                {event.bannerImage ? (
                  <img 
                    src={event.bannerImage} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <Calendar className="w-20 h-20 text-slate-400" />
                  </div>
                )}
                
                {/* Overlay Elements */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 px-4 text-center shadow-lg border border-white/20">
                  <div className="text-[10px] font-black text-slate-400 uppercase leading-none">{month}</div>
                  <div className="text-2xl font-black text-slate-800 leading-none mt-1">{day}</div>
                  <div className="text-[10px] font-bold text-slate-500 mt-1">{year}</div>
                </div>

                <div className="absolute top-6 right-6 flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <button className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="p-6 flex gap-3 overflow-x-auto scrollbar-hide">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${i === 1 ? 'border-primary' : 'border-transparent'}`}>
                    {event.bannerImage ? (
                      <img src={event.bannerImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100" />
                    )}
                    {i === 5 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                        +8
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* About the Event */}
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-6">About the Event</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-10">
                {event.description || `The ${event.title} is a significant cultural and spiritual festival celebrated with devotion and grandeur. The festival includes traditional rituals, processions, poojas, cultural programs, and community feasts.`}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-50">
                {[
                  { icon: Lock, label: 'Traditional Rituals', sub: 'Special poojas and homams' },
                  { icon: Globe, label: 'Cultural Programs', sub: 'Dance, music and folk performances' },
                  { icon: Building2, label: 'Community Feast', sub: 'Anna dana and prasadam distribution' },
                  { icon: Clock, label: 'Devotional Procession', sub: 'Rathotsava and pallakki seva' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{item.label}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-6">Location</h2>
              <p className="text-sm font-bold text-slate-500 mb-6">{event.locationName || event.city || event.address || 'Location to be announced'}</p>
              
              <div className="rounded-2xl overflow-hidden border border-slate-100 mb-6">
                <div className="h-[300px] bg-slate-100 relative">
                   <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200" alt="Map Placeholder" className="w-full h-full object-cover opacity-50" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white animate-bounce">
                        <MapPin className="w-6 h-6" />
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 rounded-2xl gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{event.address || event.city || 'Location Details'}</span>
                </div>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-bold text-xs rounded-xl flex items-center gap-2">
                   Open in Google Maps <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

          </div>

          {/* Sidebar (Right) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Quick Info Panel */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none text-[10px] font-bold px-3 py-1 rounded-full uppercase">{event.category || 'Event'}</Badge>
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Free Event</span>
              </div>

              <h1 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
                {event.title}
              </h1>

              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm font-black text-slate-800 truncate">{event.city || 'Location'}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-primary text-primary text-[10px] font-black rounded-lg h-8">Directions</Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Date</p>
                    <p className="text-sm font-black text-slate-800">{new Date(event.startDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {event.startTime && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time</p>
                      <p className="text-sm font-black text-slate-800">{event.startTime} onwards</p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 line-clamp-3">
                {event.description}
              </p>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: Bookmark, label: 'Save' },
                  { icon: Share, label: 'Share' },
                  { icon: CalendarPlus, label: 'Add' },
                  { icon: Flag, label: 'Report' },
                ].map((item, idx) => (
                  <button key={idx} className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <item.icon className="w-5 h-5 text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hub Card Detail Placeholder */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm overflow-hidden relative">
              <h3 className="text-lg font-black text-slate-800 mb-6">Organizer (Festival Hub)</h3>
              <div className="relative h-40 rounded-2xl overflow-hidden mb-6 bg-slate-100 flex items-center justify-center">
                 <Building2 className="w-12 h-12 text-slate-300" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-4">Temple Organization</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                Community-led organization dedicated to preserving cultural heritage and traditions.
              </p>
              
              <Button className="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white font-black rounded-xl py-6 transition-all">
                View Festival Hub
              </Button>
            </div>

            {/* Share this Event */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6">Share this Event</h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Facebook, label: 'Facebook', color: 'bg-[#1877F2]' },
                  { icon: MessageSquare, label: 'WhatsApp', color: 'bg-[#25D366]' },
                  { icon: Twitter, label: 'Twitter', color: 'bg-[#1DA1F2]' },
                  { icon: Share2, label: 'Copy Link', color: 'bg-slate-200 text-slate-600' },
                ].map((item, idx) => (
                  <button key={idx} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100">
                    <div className={`w-6 h-6 rounded-lg ${item.color} flex items-center justify-center text-white`}>
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>
        </div>

        {/* More Events Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-800">More Events</h2>
            <Link to="/search">
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5">
                View all events <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {moreEvents.map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

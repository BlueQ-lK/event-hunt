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
  Instagram,
  Bookmark,
  ExternalLink,
  Copy,
  Check,
  Plus
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { EventCard } from '@/components/EventCard'
import { Footer } from '@/components/Footer'
import { getEvent, getEvents, toggleInterest, getInterestStatus, getInterestCount, getInterestedUsers } from '@/server/events'
import { Card, CardContent } from '#/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { useServerFn } from '@tanstack/react-start'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export const Route = createFileRoute('/$eventSlug/$eventId')({
  loader: async ({ params }) => {
    const [event, moreEvents, interestCount, interestedUsers] = await Promise.all([
      getEvent({ data: params.eventId }),
      getEvents(),
      getInterestCount({ data: params.eventId }),
      getInterestedUsers({ data: params.eventId })
    ])
    return { 
      event, 
      moreEvents: moreEvents.filter(e => e.id !== params.eventId).slice(0, 4),
      initialInterestCount: interestCount,
      interestedUsers
    }
  },
  component: EventDetailsPage,
})

function EventDetailsPage() {
  const { event, moreEvents, initialInterestCount, interestedUsers } = Route.useLoaderData()
  const { data: session } = authClient.useSession()
  
  const [isInterested, setIsInterested] = useState(false)
  const [interestCount, setInterestCount] = useState(initialInterestCount)
  const [isPending, setIsPending] = useState(false)
  const [copied, setCopied] = useState(false)

  const toggleInterestFn = useServerFn(toggleInterest)
  const getStatusFn = useServerFn(getInterestStatus)

  useEffect(() => {
    if (session?.user && event) {
      getStatusFn({ data: { eventId: event.id } }).then(res => {
        setIsInterested(res.interested)
      })
    }
  }, [session, event, getStatusFn])

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Event Not Found</h1>
        <p className="text-slate-500 mb-8">The requested event could not be found.</p>
        <Link to="/search">
          <Button className="bg-primary text-white px-8 h-12 font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            BACK TO SEARCH
          </Button>
        </Link>
      </div>
    )
  }

  const handleToggleInterest = async () => {
    if (!session) {
      // Redirect to login or show alert
      alert('Please login to express interest')
      return
    }

    setIsPending(true)
    try {
      const res = await toggleInterestFn({ data: { eventId: event.id } })
      setIsInterested(res.interested)
      setInterestCount(prev => res.interested ? prev + 1 : prev - 1)
    } catch (err) {
      console.error(err)
    } finally {
      setIsPending(false)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.description || '',
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleGetDirections = () => {
    const query = encodeURIComponent(event.address || event.city || "")
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(url, '_blank')
  }

  const locationQuery = encodeURIComponent(event.address || event.city || "")
  const mapUrl = `https://maps.google.com/maps?q=${locationQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const formatTime = (timeStr?: string | null) => {
    if (!timeStr) return ''
    const [hours, minutes] = timeStr.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-100">

  <main className="max-w-6xl mx-auto px-6 py-12">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      {/* Content Area */}
      <div className="lg:col-span-8 space-y-10">
        
        {/* Header Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold tracking-widest uppercase text-primary">
              {event.category}
            </span>
            {interestCount > 5 && (
              <span className="text-[11px] font-medium text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded">
                Trending
              </span>
            )}
          </div>
                  {/* Simplified Hero */}
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-50">
          {event.bannerImage ? (
            <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-slate-200" />
            </div>
          )}
          <button 
            onClick={handleToggleInterest}
            disabled={isPending}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isInterested ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isInterested ? 'fill-current' : ''}`} />
          </button>
        </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            {event.title}
          </h1>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-sm">Posted by</span>
            <span className="text-sm font-semibold text-slate-900 underline underline-offset-4 cursor-pointer">
              {event.organizerName || 'Anonymous Organizer'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <Button 
              onClick={handleToggleInterest}
              disabled={isPending}
              className={`h-12 rounded-xl text-sm font-semibold transition-all ${
                isInterested 
                  ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' 
                  : 'bg-black text-white hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isInterested ? 'fill-current text-red-500' : ''}`} />
              {isInterested ? 'Interested' : "I'm Interested"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="h-12 rounded-xl border-slate-200 text-sm font-semibold"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                const start = new Date(event.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
                const end = event.endDate ? new Date(event.endDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : start;
                const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.address || event.city || '')}`;
                window.open(url, '_blank');
              }}
              className="h-12 rounded-xl border-slate-200 text-sm font-semibold"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex items-start gap-5 group">
              {/* Icon with a subtle background */}
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>

              <div className="flex-1 space-y-3">
                {/* Label */}
                 <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Date & Time</p>

                <div className="flex flex-col gap-3">
                  {/* Start Date & Time */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 leading-none">
                        {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long' })}
                      </span>
                      <span className="text-[13px] text-slate-500 mt-1 font-medium">
                        Starts at {formatTime(event.startTime)}
                      </span>
                    </div>

                    {/* Dash/Connector for Multi-day */}
                    {event.endDate && (
                      <div className="h-px w-4 bg-slate-200 mt-[-10px]" />
                    )}

                    {/* End Date (Only if different from start or specifically multi-day) */}
                    {event.endDate && (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 leading-none">
                          {new Date(event.endDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long' })}
                        </span>
                        <span className="text-[13px] text-slate-500 mt-1 font-medium">
                          Ends at {formatTime(event.endTime)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add to Calendar Action */}
                  <button
                    onClick={() => {
                      const start = new Date(event.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
                      const end = event.endDate ? new Date(event.endDate).toISOString().replace(/-|:|\.\d\d\d/g, "") : start;
                      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.address || event.city || '')}`;
                      window.open(url, '_blank');
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Add to calendar
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Location</p>
                <div className="space-y-0.5">
                  <p className="text-base font-semibold">
                    {event.address || event.city}
                  </p>
                  <button onClick={handleGetDirections} className="text-sm font-medium text-primary hover:underline">
                    View on map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Interested Audience */}
        {interestCount > 0 && (
          <div className="flex items-center gap-4 py-6">
            <div className="flex -space-x-3 overflow-hidden">
              {interestedUsers.map((user, idx) => {
                const colors = ['bg-red-100 text-red-600', 'bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-amber-100 text-amber-600', 'bg-purple-100 text-purple-600']
                const colorClass = colors[idx % colors.length]
                return (
                  <Avatar key={user.id} className={`inline-block border-2 border-white h-10 w-10 ${colorClass}`}>
                    <AvatarFallback className="font-bold">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )
              })}
              {interestCount > 4 && (
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 border-2 border-white text-xs font-bold text-slate-600">
                  +{interestCount - 4}
                </div>
              )}
            </div> 
            <p className="text-sm font-semibold text-slate-900 border-2 py-2 px-3 rounded-xl">
              {interestCount}+ people are interested
            </p>
          </div>
        )}

        {/* Description */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">About the event</h2>
          <div 
            className="text-slate-600 leading-relaxed rich-text-content"
            dangerouslySetInnerHTML={{ 
              __html: event.description || `Join us for ${event.title} in ${event.city}. This event promises to be an exciting experience for all attendees. Don't miss out on this opportunity to connect and engage with others in the community.` 
            }} 
          />
          <style>{`
            .rich-text-content {
              font-size: 0.9375rem;
              line-height: 1.6;
              color: #334155;
            }
            .rich-text-content p {
              margin-bottom: 1rem;
            }
            .rich-text-content ul, .rich-text-content ol {
              margin-bottom: 1rem;
              padding-left: 1.5rem;
            }
            .rich-text-content ul {
              list-style-type: disc;
            }
            .rich-text-content ol {
              list-style-type: decimal;
            }
            .rich-text-content b, .rich-text-content strong {
              font-weight: 700;
            }
            .rich-text-content i, .rich-text-content em {
              font-style: italic;
            }
            .rich-text-content u {
              text-decoration: underline;
            }
          `}</style>
        </section>

        {/* Minimal Map */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Location</h2>
            <button onClick={handleGetDirections} className="text-sm font-medium text-primary hover:underline">
              Get Directions
            </button>
          </div>
          <div 
            className="h-64 rounded-xl overflow-hidden bg-slate-100 transition-all cursor-pointer border border-slate-100"
            onClick={handleGetDirections}
          >
           <iframe
              title="Event Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
            />
          </div>
        </section>
        {/* FAQ Section */}
        <section className="space-y-6 pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            <button className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Report event
            </button>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-slate-100">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">Is there a registration fee?</AccordionTrigger>
              <AccordionContent className="text-slate-500 text-sm">
                Please check the event details or contact the organizer for pricing information. Most events listed are free or have transparent pricing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-slate-100">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">How do I reach the venue?</AccordionTrigger>
              <AccordionContent className="text-slate-500 text-sm">
                You can use the "View on map" link in the location section to get exact directions from your current location.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-slate-100">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">Can I bring a guest?</AccordionTrigger>
              <AccordionContent className="text-slate-500 text-sm">
                This depends on the event capacity. We recommend sharing the event link with your friends so they can also mark their interest!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        
      </div>

      {/* Sidebar - Clean Sticky */}
      <aside className="lg:col-span-4">
        <div className=" space-y-6">
          <div className="p-8 rounded-2xl border border-slate-100 bg-white">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
              {(() => {
                const now = new Date()
                const start = new Date(event.startDate)
                const end = event.endDate ? new Date(event.endDate) : null
                
                let statusLabel = 'Upcoming'
                let statusColor = 'bg-emerald-500'
                
                if (end && now > end) {
                  statusLabel = 'Event Ended'
                  statusColor = 'bg-slate-300'
                } else if (now >= start) {
                  statusLabel = 'Live Now'
                  statusColor = 'bg-red-500 animate-pulse'
                }

                return (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                    <p className="text-xl font-semibold">{statusLabel}</p>
                  </div>
                )
              })()}
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-medium text-slate-600">Want to join this event?</p>
                <p className="text-xs text-slate-400 mt-1">Mark your interest to stay updated with any changes or announcements.</p>
              </div>
              <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-widest">
                {interestCount} People Interested
              </p>
            </div>
          </div>

          {/* Event Social Links */}
          {(event.facebook?.trim() || event.instagram?.trim() || event.twitter?.trim()) && (
            <div className="p-8 rounded-2xl border border-slate-100 bg-white">
              <p className="text-sm font-medium text-slate-500 mb-4">Event Links</p>
              <div className="flex flex-col gap-3">
                {event.facebook?.trim() && (
                  <a href={event.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
                    <Facebook className="w-4 h-4" />
                    Facebook
                    <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                  </a>
                )}
                {event.instagram?.trim() && (
                  <a href={event.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
                    <Instagram className="w-4 h-4" />
                    Instagram
                    <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                  </a>
                )}
                {event.twitter?.trim() && (
                  <a href={event.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
                    <Twitter className="w-4 h-4" />
                    X (Twitter)
                    <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </aside>
    </div>

    {/* Suggested Events */}
    {moreEvents.length > 0 && (
      <section className="mt-24 pt-12 border-t border-slate-100">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">More in {event.city}</h2>
            <p className="text-slate-500 text-sm">Similar experiences you might enjoy.</p>
          </div>
          <Link to="/search" className="text-sm font-semibold hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {moreEvents.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </section>
    )}
  </main>
  <Footer />
</div>
  )
}


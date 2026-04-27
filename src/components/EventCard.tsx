import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Calendar, Hourglass, Heart } from 'lucide-react'
import { slugify } from '@/lib/eventSlug'
import { toggleInterest, getInterestCount, getInterestStatus } from '@/server/events'
import { authClient } from '#/lib/auth-client'

export function EventCard({ event }: { event: any }) {
  const { data: session } = authClient.useSession()
  const navigate = useNavigate()
  const [isInterested, setIsInterested] = useState(false)
  const [interestCount, setInterestCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Load initial interest status and count
  useEffect(() => {
    Promise.all([
      getInterestStatus({ data: { eventId: event.id } }),
      getInterestCount({ data: event.id })
    ]).then(([status, count]) => {
      setIsInterested(status.interested)
      setInterestCount(count)
      setInitialized(true)
    }).catch(() => {
      setInitialized(true)
    })
  }, [event.id, session?.user.id])

  const handleInterestToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    if (!session) {
      navigate({ to: '/login' })
      return
    }

    setLoading(true)

    // Optimistic update
    const wasInterested = isInterested
    setIsInterested(!wasInterested)
    setInterestCount(prev => wasInterested ? Math.max(0, prev - 1) : prev + 1)

    try {
      const result = await toggleInterest({ data: { eventId: event.id } })
      setIsInterested(result.interested)
      // Refetch actual count
      const freshCount = await getInterestCount({ data: event.id })
      setInterestCount(freshCount)
    } catch {
      // Revert on error
      setIsInterested(wasInterested)
      setInterestCount(prev => wasInterested ? prev + 1 : Math.max(0, prev - 1))
    } finally {
      setLoading(false)
    }
  }, [event.id, isInterested, loading, navigate, session])

  // Format date: Sun, 24 May, 2026
  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dayName = days[date.getDay()]
    const day = String(date.getDate()).padStart(2, '0')
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${dayName}, ${day} ${month}, ${year}`
  }

  return (
    <Link
      to="/$eventSlug/$eventId"
      params={{
        eventSlug: slugify(event.title),
        eventId: event.id
      }}
      className="block group"
    >
      <div className="flex flex-col h-full bg-transparent">
        {/* Image Container */}
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-slate-100">
          {event.bannerImage ? (
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-slate-400" />
            </div>
          )}

          {/* I'm Interested Button */}
          <button
            onClick={handleInterestToggle}
            disabled={loading || !session}
            className={`absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold shadow-md border transition-all z-10 ${
              isInterested
                ? 'bg-red-500 text-white border-red-500 scale-105'
                : 'bg-white text-slate-500 border-slate-100 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
            } ${loading ? 'opacity-70 cursor-wait' : !session ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
            title={!session ? 'Login required' : isInterested ? 'Remove interest' : "I'm Interested"}
          >
            <Heart className={`w-3 h-3 transition-all ${isInterested ? 'fill-current' : ''}`} />
            <span>{!session ? 'Login to interact' : isInterested ? 'Interested' : "I'm Interested"}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-400">
            {formatDate(event.startDate)}
          </p>

          <h3 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {event.title}
          </h3>

          <p className="text-[11px] text-slate-400 font-medium">
            {event.locationName || event.city || event.address || 'Location to be announced'}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1">
              <Heart className={`w-3 h-3 ${interestCount > 0 ? 'text-red-400' : 'text-slate-300'}`} />
              <span className="text-[11px] font-medium text-slate-500">
                {initialized ? `${interestCount}` : '—'} Interested
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1">
                <Hourglass className="w-3 h-3 text-slate-400" />
                <span className="text-[11px] font-medium">Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

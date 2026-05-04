import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { 
  User, 
  Mail, 
  Bell, 
  Inbox, 
  Heart, 
  Settings, 
  Clock, 
  CalendarSync,
  Search,
  ChevronRight
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EventCard } from '@/components/EventCard'
import { ManageEvents } from '#/components/manageEvent'
import { BarChart3 } from 'lucide-react'
import { authClient } from '#/lib/auth-client'
import { getMyInterestedEvents } from '@/server/events'

const defaultPreferences = {
  newsletterTime: '09:00 AM',
  calendarSync: true,
  allEmailsSubscribed: true
}

import { z } from 'zod'
import { getSession } from '#/lib/auth.functions'

const profileSearchSchema = z.object({
  tab: z.enum(['interested', 'settings', 'manage']).optional().default('interested'),
})

export const Route = createFileRoute('/profile')({
  validateSearch: profileSearchSchema,
  component: ProfilePage,
  beforeLoad: async () => {
    const session = await getSession();
    if(!session){
      throw redirect({to: "/login"})
    }
    return { user: session.user };
  }
})

function ProfilePage() {
  const { tab } = Route.useSearch()
  const navigate = useNavigate()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [interestedEvents, setInterestedEvents] = useState<any[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState<string | null>(null)

  const handleTabChange = (value: string) => {
    navigate({
      from: Route.fullPath,
      to: '.',
      search: (prev) => ({ ...prev, tab: value as any }),
    })
  }

  const userName = session?.user.name ?? 'Guest User'
  const userEmail = session?.user.email ?? 'Not logged in'
  const userAvatar = userName
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'GU'

  useEffect(() => {
    if (isSessionPending) return
    if (!session) {
      setInterestedEvents([])
      setEventsLoading(false)
      return
    }

    let mounted = true
    const loadInterested = async () => {
      setEventsLoading(true)
      setEventsError(null)
      try {
        const data = await getMyInterestedEvents()
        if (mounted) {
          setInterestedEvents(data)
        }
      } catch (error) {
        if (mounted) {
          setEventsError(error instanceof Error ? error.message : 'Failed to load interested events.')
        }
      } finally {
        if (mounted) {
          setEventsLoading(false)
        }
      }
    }

    loadInterested()
    return () => {
      mounted = false
    }
  }, [session, isSessionPending])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* User Profile Header (Mobile Only) / Sidebar (Desktop) */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="flex items-center md:flex-col md:items-start gap-4 md:gap-3 mb-6 md:mb-8 px-2">
              <Avatar className="w-14 h-14 md:w-16 md:h-16 border-2 border-white shadow-md ring-1 ring-slate-100">
                <AvatarImage src={session?.user.image ?? ''} />
                <AvatarFallback className="bg-slate-900 text-white text-sm font-bold">{userAvatar}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 md:mt-2">
                <h2 className="text-base md:text-lg font-bold text-slate-900 truncate leading-tight">{userName}</h2>
                <p className="text-xs text-slate-500 truncate">{userEmail}</p>
              </div>
            </div>

            {/* Navigation - Horizontal on Mobile, Vertical on Desktop */}
            <div className="relative">
              <nav className="flex md:flex-col items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {[
                  { id: 'interested', label: 'Interested', icon: Heart },
                  { id: 'settings', label: 'Settings', icon: Settings },
                  { id: 'manage', label: 'Manage Events', icon: BarChart3 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex-none md:w-full flex items-center justify-between px-4 md:px-3 py-2.5 md:py-2 rounded-full md:rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      tab === item.id 
                        ? 'bg-slate-900 text-white md:bg-slate-100 md:text-slate-900' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className={`w-4 h-4 ${tab === item.id ? 'text-white md:text-primary' : 'text-slate-400'}`} />
                      {item.label}
                    </div>
                    {tab === item.id && <ChevronRight className="hidden md:block w-3 h-3 text-slate-400" />}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content: High Density */}
          <main className="flex-1 min-w-0">
            <Tabs value={tab} className="w-full">
              
              {/* Interested Events Grid */}
              <TabsContent value="interested" className="mt-0 outline-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Your Plans</h3>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <Input placeholder="Filter events..." className="pl-9 h-9 text-xs rounded-lg border-slate-200 bg-slate-50/50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {eventsLoading ? (
                    <div className="col-span-full py-20 text-center">
                      <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-2" />
                      <p className="text-xs text-slate-400">Finding your plans...</p>
                    </div>
                  ) : interestedEvents.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                      <div className="bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                        <CalendarSync className="w-6 h-6 text-slate-300" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">No events saved yet</h4>
                      <p className="text-xs text-slate-400 mb-6 max-w-[200px] mx-auto">Discover and save events you're interested in to see them here.</p>
                      <Button variant="outline" size="sm" className="rounded-full h-8 px-6 text-[11px]" onClick={() => navigate({ to: '/search' })}>
                        Explore Events
                      </Button>
                    </div>
                  ) : (
                    interestedEvents.map(event => <EventCard key={event.id} event={event} />)
                  )}
                </div>
              </TabsContent>

              {/* Settings: Sleeker Card Layout */}
              <TabsContent value="settings" className="mt-0 space-y-6 outline-none">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Account Settings</h3>
                
                <Card className="border border-slate-100 shadow-none rounded-xl overflow-hidden">
                  <CardHeader className="py-4 px-5 border-b border-slate-50">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Communication</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 divide-y divide-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-slate-800">Email Address</Label>
                        <p className="text-[11px] text-slate-500">{userEmail}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] px-4 rounded-lg w-fit">Change</Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-slate-800">Newsletter Digest</Label>
                        <p className="text-[11px] text-slate-500">Scheduled for {preferences.newsletterTime}</p>
                      </div>
                      <Input 
                        type="time" 
                        value={preferences.newsletterTime} 
                        className="w-full sm:w-28 h-8 text-[11px] rounded-lg"
                        onChange={(e) => setPreferences({...preferences, newsletterTime: e.target.value})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-5">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-slate-800">Calendar Sync</Label>
                        <p className="text-[11px] text-slate-500">Auto-add events to Google Calendar</p>
                      </div>
                      <Switch 
                        checked={preferences.calendarSync} 
                        onCheckedChange={(v) => setPreferences({...preferences, calendarSync: v})}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-slate-800">Email Notifications</Label>
                    <p className="text-[11px] text-slate-500">Toggle all marketing and update emails</p>
                  </div>
                  <Switch 
                    checked={preferences.allEmailsSubscribed}
                    onCheckedChange={(v) => setPreferences({...preferences, allEmailsSubscribed: v})}
                  />
                </div>
              </TabsContent>

              <TabsContent value="manage" className="mt-0 outline-none">
                <ManageEvents />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}

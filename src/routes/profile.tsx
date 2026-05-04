import { createFileRoute, useNavigate } from '@tanstack/react-router'
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

const profileSearchSchema = z.object({
  tab: z.enum(['interested', 'settings', 'manage']).optional().default('interested'),
})

export const Route = createFileRoute('/profile')({
  validateSearch: profileSearchSchema,
  component: ProfilePage
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
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Compact Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="flex items-center gap-3 mb-8 px-2">
              <Avatar className="w-12 h-12 border border-slate-100 shadow-sm">
                <AvatarImage src={session?.user.image ?? ''} />
                <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">{userAvatar}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate">{userName}</h2>
                <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'interested', label: 'Interested', icon: Heart },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'manage', label: 'Manage Events', icon: BarChart3 },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    tab === item.id 
                      ? 'bg-slate-100 text-slate-900' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`w-4 h-4 ${tab === item.id ? 'text-primary' : 'text-slate-400'}`} />
                    {item.label}
                  </div>
                  {tab === item.id && <ChevronRight className="w-3 h-3 text-slate-400" />}
                </button>
              ))}
            </nav>
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

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventsLoading ? (
                    <div className="col-span-full py-10 text-center text-xs text-slate-400">Loading...</div>
                  ) : interestedEvents.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-xs text-slate-400">No events found.</div>
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
                    <div className="flex items-center justify-between p-5">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-slate-800">Email Address</Label>
                        <p className="text-[11px] text-slate-500">{userEmail}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] px-4 rounded-lg">Change</Button>
                    </div>

                    <div className="flex items-center justify-between p-5">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-slate-800">Newsletter Digest</Label>
                        <p className="text-[11px] text-slate-500">Scheduled for {preferences.newsletterTime}</p>
                      </div>
                      <Input 
                        type="time" 
                        value={preferences.newsletterTime} 
                        className="w-28 h-8 text-[11px] rounded-lg"
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

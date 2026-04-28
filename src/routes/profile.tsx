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
  Search
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
    <div className="min-h-screen bg-slate-50/50">
      <div className="container-custom max-w-6xl">
          <div className='flex flex-col  items-center mb-4'>
             <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-md">
                  <AvatarImage src={session?.user.image ?? ''} />
                  <AvatarFallback className="bg-primary text-white text-2xl font-bold">{userAvatar}</AvatarFallback>
              </Avatar>
              <h2 className=" text-xl font-bold text-slate-800">{userName}</h2>
          </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
              <div className=" rounded-2xl border-slate-100  mb-8 flex justify-center sticky top-20">
                <TabsList className="bg-white shadow-sm border-none ">
                  <TabsTrigger value="interested" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-bold text-sm flex gap-2 items-center">
                    <Heart className="w-4 h-4" />
                    Interested
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-bold text-sm flex gap-2 items-center">
                    <Settings className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="manage" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-bold text-sm flex gap-2 items-center">
                    <BarChart3 className="w-4 h-4" />
                    Manage Events
                  </TabsTrigger>
                </TabsList>
              </div>


              {/* Interested Content */}
              <TabsContent value="interested" className="m-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Events & Plans</h3>
                    <p className="text-sm text-slate-500 font-medium">Keep track of festivals you're interested in</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search your plans..." className="pl-9 w-64 rounded-xl border-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {eventsLoading ? (
                    <div className="text-sm text-slate-500">Loading interested events...</div>
                  ) : interestedEvents.length === 0 ? (
                    <div className="text-sm text-slate-500">
                      {session ? 'No interested events yet.' : 'Login to see your interested events.'}
                    </div>
                  ) : interestedEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                {eventsError && (
                  <p className="mt-4 text-sm text-red-600">{eventsError}</p>
                )}
              </TabsContent>

              {/* Settings Content */}
              <TabsContent value="settings" className="m-0 space-y-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Account Settings</h3>
                  <p className="text-sm text-slate-500 font-medium">Manage your preferences and connection</p>
                </div>

                {/* Communication Preferences */}
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="bg-slate-50/50 pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Communication Preferences
                    </CardTitle>
                    <CardDescription>How you receive updates and newsletters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</Label>
                        <p className="text-sm font-bold text-slate-800">{userEmail}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-fit rounded-xl border-slate-200">Edit Email</Button>
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</Label>
                        <p className="text-sm font-bold text-slate-800">Not set</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-fit rounded-xl border-slate-200">Edit Phone</Button>
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5 text-slate-400" />
                           <Label className="text-sm font-bold text-slate-700">Preferred Newsletter Time</Label>
                        </div>
                        <p className="text-xs text-slate-500">When should we send your daily event digest?</p>
                      </div>
                      <div className="w-full md:w-32">
                         <Input 
                           type="time" 
                           value={preferences.newsletterTime} 
                           onChange={(e) => setPreferences({...preferences, newsletterTime: e.target.value})}
                           className="rounded-xl border-slate-200" 
                         />
                      </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <CalendarSync className="w-3.5 h-3.5 text-slate-400" />
                           <Label className="text-sm font-bold text-slate-700">Google Calendar Sync</Label>
                        </div>
                        <p className="text-xs text-slate-500">Automatically add interested events to your calendar</p>
                      </div>
                      <Switch 
                        checked={preferences.calendarSync} 
                        onCheckedChange={(checked) => setPreferences({...preferences, calendarSync: checked})}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Preferences */}
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="bg-slate-50/50 pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="w-4 h-4 text-primary" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Control what notifications you receive</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                      <div className="space-y-1">
                        <Label className="text-sm font-bold text-red-900">Unsubscribe from all emails</Label>
                        <p className="text-xs text-red-600">You will stop receiving all newsletters and event updates.</p>
                      </div>
                      <Switch 
                        className="data-[state=checked]:bg-red-500"
                        checked={!preferences.allEmailsSubscribed} 
                        onCheckedChange={(checked) => setPreferences({...preferences, allEmailsSubscribed: !checked})}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50/30 border-t border-slate-100 py-4 flex justify-end">
                    <Button className="bg-primary hover:bg-primary-hover text-white rounded-xl px-8 font-bold">Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Manage Events Content */}
              <TabsContent value="manage" className="m-0">
                <ManageEvents />
              </TabsContent>
            </Tabs>
          </div>

        </div>
      </div>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  Bell, 
  Calendar, 
  Inbox, 
  Heart, 
  Settings, 
  Clock, 
  CalendarSync,
  ChevronRight,
  MoreVertical,
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
import { ManageEvents } from '#/routes/manage/manageEvent'
import { BarChart3 } from 'lucide-react'

// Dummy Data
const dummyUser = {
  name: 'Aryan Singh',
  email: 'aryan.singh@example.com',
  phone: '+91 98765 43210',
  avatar: 'AS',
  newsletterTime: '09:00 AM',
  calendarSync: true,
  allEmailsSubscribed: true
}

const dummyMessages = [
  {
    id: 1,
    sender: 'Sri Venkateshwara Swamy Temple',
    subject: 'Brahmostavam 2026 Schedule Updated',
    preview: 'Namaste Aryan, the schedule for the upcoming Brahmostavam has been updated with new...',
    date: '2 hours ago',
    unread: true
  },
  {
    id: 2,
    sender: 'Navratri Utsav Committee',
    subject: 'Ticket Confirmation: Mega Dandiya Night',
    preview: 'Your tickets for the Mega Dandiya Night are confirmed! You can find them in the...',
    date: '1 day ago',
    unread: false
  },
  {
    id: 3,
    sender: 'EventHunt Support',
    subject: 'Welcome to EventHunt!',
    preview: 'Welcome to the world\'s finest festival curation platform. We are excited to have you...',
    date: '3 days ago',
    unread: false
  }
]

const dummyInterestedEvents = [
  {
    id: 'event-1',
    title: 'Annual Brahmostavam 2026',
    startDate: '2026-05-15',
    locationName: 'Temple Grounds, Bangalore',
    category: 'Village Festival',
    bannerImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'event-2',
    title: 'Mega Dandiya Night',
    startDate: '2026-10-12',
    locationName: 'Police Grounds, Pune',
    category: 'Tradition',
    bannerImage: 'https://images.unsplash.com/photo-1514525253344-a8130a218a10?auto=format&fit=crop&q=80&w=800',
  }
]

export const Route = createFileRoute('/profile')({
  component: ProfilePage
})

function ProfilePage() {
  const [user, setUser] = useState(dummyUser)

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      <div className="container-custom max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Info */}
          <div className="w-full md:w-80 shrink-0">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>
              <CardContent className="pt-0 -mt-12 text-center pb-8">
                <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-md">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-white text-2xl font-bold">{user.avatar}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-bold text-slate-800">{user.name}</h2>
                <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">12</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Interested</p>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <p className="text-lg font-bold text-slate-800">4</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attended</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 space-y-2">
               <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-600 font-medium hover:bg-white hover:text-primary transition-all">
                 <User className="w-4 h-4" />
                 View Public Profile
               </Button>
               <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-slate-600 font-medium hover:bg-white hover:text-primary transition-all">
                 <Bell className="w-4 h-4" />
                 Notification History
               </Button>
               <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-red-500 font-medium hover:bg-red-50 hover:text-red-600 transition-all">
                 Logout
               </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="interested" className="w-full">
              <div className="bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm mb-8 inline-flex">
                <TabsList className="bg-transparent border-none">
                  <TabsTrigger value="inbox" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-bold text-sm flex gap-2 items-center">
                    <Inbox className="w-4 h-4" />
                    Inbox
                    <Badge variant="secondary" className="bg-red-500 text-white border-none text-[10px] h-4 w-4 p-0 flex items-center justify-center rounded-full ml-1">1</Badge>
                  </TabsTrigger>
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

              {/* Inbox Content */}
              <TabsContent value="inbox" className="m-0 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">Your Messages</h3>
                  <div className="flex gap-2">
                     <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 text-slate-600">Mark all as read</Button>
                  </div>
                </div>
                
                <Card className="border-none shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {dummyMessages.map((msg) => (
                      <div key={msg.id} className={`p-6 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${msg.unread ? 'bg-primary/5' : ''}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${msg.unread ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                           <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                             <h4 className={`text-sm font-bold truncate ${msg.unread ? 'text-slate-900' : 'text-slate-700'}`}>{msg.sender}</h4>
                             <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-2">{msg.date}</span>
                          </div>
                          <p className={`text-sm font-bold mb-1 truncate ${msg.unread ? 'text-slate-800' : 'text-slate-600'}`}>{msg.subject}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{msg.preview}</p>
                        </div>
                        <button className="text-slate-300 hover:text-slate-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

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
                  {dummyInterestedEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
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
                        <p className="text-sm font-bold text-slate-800">{user.email}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-fit rounded-xl border-slate-200">Edit Email</Button>
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</Label>
                        <p className="text-sm font-bold text-slate-800">{user.phone}</p>
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
                           value={user.newsletterTime} 
                           onChange={(e) => setUser({...user, newsletterTime: e.target.value})}
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
                        checked={user.calendarSync} 
                        onCheckedChange={(checked) => setUser({...user, calendarSync: checked})}
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
                        checked={!user.allEmailsSubscribed} 
                        onCheckedChange={(checked) => setUser({...user, allEmailsSubscribed: !checked})}
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

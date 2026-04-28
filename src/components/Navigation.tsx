import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Search, Bell, MapPin, Plus, ChevronDown, LogOut, User } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, LayoutDashboard, PlusCircle, HelpCircle, Settings } from 'lucide-react'
import { getMyInterestedEvents } from '@/server/events'
import { useEffect, useState } from 'react'
import { Badge } from './ui/badge'

export function Navigation() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()
  const [interestCount, setInterestCount] = useState(0)

  useEffect(() => {
    if (session?.user) {
      getMyInterestedEvents().then(events => {
        setInterestCount(events.length)
      }).catch(() => {})
    }
  }, [session?.user])

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: '/login' })
        },
      },
    })
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-slate-100 py-3 px-6">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">EventHunt</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="nav-link-active">Home</Link>
            <Link to="/search" className="hover:text-primary transition-colors">Events</Link>
            <Link to="/" className="hover:text-primary transition-colors">Map</Link>
            <Link to="/" className="hover:text-primary transition-colors">About Us</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>Yennahole, KA</span>
            <ChevronDown className="w-3 h-3" />
          </div>

          <Link className="relative hidden xl:block" to="/search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <div className='bg-slate-50 border border-slate-100 rounded-lg pl-10 pr-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'>
              <span>Search events, temples, places...</span>
            </div>
          </Link>

          <Link to="/manage/create">
            <Button className="bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg px-5 py-2 shadow-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </Link>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none group">
                    <Avatar className="w-9 h-9 border border-primary/20 group-hover:border-primary transition-colors">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-xl border-slate-100 bg-white">
                  {/* Section 1: Main Profile */}
                  <DropdownMenuLabel className="p-2">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <Avatar className="w-10 h-10 border border-slate-100">
                        <AvatarImage src={session.user.image || undefined} />
                        <AvatarFallback className="bg-primary/5 text-primary font-bold text-sm">
                          {session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors">{session.user.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">View Profile</span>
                      </div>
                    </Link>
                    <div className="mt-2 grid grid-cols-1 gap-1 px-1">
                       <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                         <span className="text-xs font-medium text-slate-500">Total event interest</span>
                         <Badge variant="secondary" className="bg-white text-primary border-slate-100 font-bold h-5 px-1.5">{interestCount}</Badge>
                       </div>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuGroup className="px-1 py-1">
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-slate-50 cursor-pointer">
                      <Link to="/profile" search={{ tab: 'interested' }} className="flex items-center w-full">
                        <Heart className="mr-2 h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-600">Interested events & Plans</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-slate-50" />

                  {/* Section 2: Host Control */}
                  <DropdownMenuGroup className="px-1 py-1">
                    <DropdownMenuLabel className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Host Control</DropdownMenuLabel>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-slate-50 cursor-pointer">
                      <Link to="/manage/create" className="flex items-center w-full">
                        <PlusCircle className="mr-2 h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-600">Create an event</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-slate-50 cursor-pointer">
                      <Link to="/profile" search={{ tab: 'manage' }} className="flex items-center w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-600">Event manage</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-slate-50" />

                  {/* Section 3: Help & Settings */}
                  <DropdownMenuGroup className="px-1 py-1">
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-slate-50 cursor-pointer">
                      <Link to="/help" className="flex items-center w-full">
                        <HelpCircle className="mr-2 h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-600">Need help</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-slate-50 cursor-pointer">
                      <Link to="/profile" search={{ tab: 'settings' }} className="flex items-center w-full">
                        <Settings className="mr-2 h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-600">Account setting</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl focus:bg-red-50 text-red-600 cursor-pointer group">
                      <LogOut className="mr-2 h-4 w-4 text-red-400 group-hover:text-red-600 transition-colors" />
                      <span className="font-bold">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="text-sm font-semibold">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

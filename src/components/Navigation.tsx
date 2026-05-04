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
import { Heart, LayoutDashboard, PlusCircle, HelpCircle, Settings, Navigation as NavIcon, Loader2, Menu, X } from 'lucide-react'
import { getMyInterestedEvents } from '@/server/events'
import { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { getStoredCity, normalizeCitySlug, saveCityLocally, fetchCityFromCoords } from '@/lib/location'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateUserCity } from '@/server/location'

export function Navigation() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()
  const [interestCount, setInterestCount] = useState(0)
  const [activeCity, setActiveCity] = useState(getStoredCity())
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [manualCity, setManualCity] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (session?.user) {
      getMyInterestedEvents().then(events => {
        setInterestCount(events.length)
      }).catch(() => {})
    }
  }, [session?.user])

  useEffect(() => {
    setActiveCity(getStoredCity())
  }, [])

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: '/login' })
        },
      },
    })
  }

  const handleLocationSelect = async (city: string) => {
    const normalized = normalizeCitySlug(city)
    saveCityLocally(normalized)
    
    if (session?.user) {
      try {
        await updateUserCity({ data: { city: normalized } })
      } catch (error) {
        console.error('Failed to update city in DB:', error)
      }
    }
    
    setActiveCity(normalized)
    setIsLocationDialogOpen(false)
    setManualCity('')
    
    // Navigate to the new city page
    navigate({ 
      to: '/$city/all', 
      params: { city: normalized } 
    })
  }

  const handleUseCurrentLocation = async () => {
    setIsLocating(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        })
      })
      const city = await fetchCityFromCoords(position.coords.latitude, position.coords.longitude)
      await handleLocationSelect(city)
    } catch (error) {
      console.error('Error getting location:', error)
      // Fallback or error message could be added here
    } finally {
      setIsLocating(false)
    }
  }

  const handleManualSubmit = () => {
    if (manualCity.trim()) {
      handleLocationSelect(manualCity)
    }
  }

  return (
    <nav className="fixed top-0 z-50 w-full px-4 sm:px-6 pt-4 pointer-events-none">
      <div className="mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl border border-slate-100 bg-white/90 backdrop-blur-md shadow-sm pointer-events-auto">
        
        {/* Left: Brand & Links */}
        <div className="flex items-center gap-10">
          <Link to="/$city/all" params={{ city: activeCity }} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-black tracking-tighter text-slate-900">EventHunt.</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-[13px] font-bold uppercase tracking-wider text-slate-500">
            <Link to="/$city/all" params={{ city: activeCity }} className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/search" className="hover:text-indigo-600 transition-colors">Explore</Link>
            <Link to="/$city/all" params={{ city: activeCity }} className="hover:text-indigo-600 transition-colors">Map</Link>
          </div>
        </div>

        {/* Center/Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Location Picker - Subtle & Integrated */}
          <button 
            onClick={() => setIsLocationDialogOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all group"
          >
            <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-0.5 tracking-tight">Location</p>
              <p className="text-xs font-bold text-slate-700 leading-none capitalize">{activeCity.replace(/-/g, ' ')}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </button>

          <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden md:block" />

          {/* Minimal Search Trigger */}
          <Link to="/search" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <Search className="w-5 h-5" />
          </Link>

          {/* Primary Action */}
          <Link to="/manage/create" className="ml-1 sm:ml-2">
            <Button className="bg-slate-900 hover:bg-indigo-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl px-3 sm:px-5 h-9 sm:h-10 shadow-lg shadow-slate-900/10 transition-all active:scale-95">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 ml-1 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* User Profile - Hidden on mobile, moved to drawer */}
          <div className="ml-2 pl-3 border-l border-slate-100 hidden lg:block">
            {isPending ? (
              <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none group">
                    <Avatar className="w-9 h-9 rounded-xl border-2 border-transparent group-hover:border-indigo-100 transition-all">
                      <AvatarImage src={session.user.image || undefined} className="rounded-xl" />
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-xs rounded-xl">
                        {session.user.name[0]}
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

      {/* Mobile Menu Overlay & Drawer */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm lg:hidden z-[-1] pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden absolute top-[calc(100%+12px)] left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto pointer-events-auto">
          <div className="p-4 space-y-6">
            {/* User Info (Mobile) */}
            {session?.user ? (
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarImage src={session.user.image || undefined} />
                  <AvatarFallback className="bg-indigo-600 text-white font-bold">{session.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-slate-900">{session.user.name}</p>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Member</p>
                </div>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold">
                  Sign In to EventHunt
                </Button>
              </Link>
            )}

            {/* Location Picker (Mobile) */}
            <button 
              onClick={() => {
                setIsLocationDialogOpen(true)
                setIsMobileMenuOpen(false)
              }}
              className="w-full flex items-center justify-between p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Your Location</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{activeCity.replace(/-/g, ' ')}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Nav Links (Mobile) */}
            <div className="grid grid-cols-1 gap-2">
              <Link 
                to="/$city/all" 
                params={{ city: activeCity }} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <NavIcon className="w-4 h-4 text-slate-500" />
                </div>
                Home
              </Link>
              <Link 
                to="/search" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Search className="w-4 h-4 text-slate-500" />
                </div>
                Explore Events
              </Link>
              {session?.user && (
                <>
                  <Link 
                    to="/profile" 
                    search={{ tab: 'interested' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-rose-500" />
                    </div>
                    My Favorites
                  </Link>
                  <Link 
                    to="/profile" 
                    search={{ tab: 'manage' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                    </div>
                    My Events
                  </Link>
                </>
              )}
            </div>

            {/* Footer Actions (Mobile) */}
            <div className="pt-4 border-t border-slate-100">
              {session?.user && (
                <button 
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    )}

  <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
  <DialogContent className="sm:max-w-[340px] p-0 overflow-hidden border border-slate-200 shadow-xl rounded-2xl">
    {/* Minimal Header */}
    <div className="px-5 pt-5 pb-4">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <DialogTitle className="text-base font-bold text-slate-900">
          Set Location
        </DialogTitle>
      </div>
      <DialogDescription className="text-xs font-medium text-slate-500 leading-relaxed">
        Discover the best events and activities happening near you.
      </DialogDescription>
    </div>

    <div className="px-5 pb-6 space-y-4">
      {/* Manual Input with Integrated Submit */}
      <div className="space-y-1.5">
        <Label htmlFor="city" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">
          City Name
        </Label>
        <div className="relative group">
          <Input 
            id="city" 
            placeholder="Search city..." 
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
            className="h-10 rounded-xl border-slate-200 focus:border-primary bg-slate-50/50 pl-9 pr-12 text-xs font-medium transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
          
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button 
              size="sm"
              onClick={handleManualSubmit}
              disabled={!manualCity.trim() || isLocating}
              className="h-8 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold transition-all"
            >
              Set
            </Button>
          </div>
        </div>
      </div>

      {/* Modern Divider */}
      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-slate-100"></div>
        <span className="flex-shrink mx-3 text-[9px] font-bold uppercase tracking-widest text-slate-300">Or</span>
        <div className="flex-grow border-t border-slate-100"></div>
      </div>

      {/* Current Location Action */}
     <Button 
              variant="outline" 
              className="w-full flex items-center gap-3 justify-center h-14 rounded-2xl border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all font-bold text-slate-700"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
            >
              {isLocating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <NavIcon className="w-5 h-5" />
              )}
              {isLocating ? 'Determining location...' : 'Use current location'}
            </Button>
    </div>
  </DialogContent>
</Dialog>
    </nav>
  )
}

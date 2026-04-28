import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Search, Bell, MapPin, Plus, ChevronDown, LogOut, User } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Navigation() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

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
                  <button className="outline-none">
                    <Avatar className="w-9 h-9 border border-primary/20">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-bold">{session.user.name}</span>
                      <span className="text-xs text-slate-500">{session.user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
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

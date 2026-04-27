import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Search, Menu, Zap } from 'lucide-react'

export function Navigation() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-background/50 backdrop-blur-2xl border-b border-border px-6 md:px-20 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors italic">EH.</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors cursor-pointer border-b-2 border-transparent hover:border-primary pb-1">Discover</Link>
            <Link to="/" className="hover:text-primary transition-colors cursor-pointer border-b-2 border-transparent hover:border-primary pb-1">Network</Link>
            <Link to="/" className="hover:text-primary transition-colors cursor-pointer border-b-2 border-transparent hover:border-primary pb-1">Legacy</Link>
            <Link to="/" className="hover:text-primary transition-colors cursor-pointer border-b-2 border-transparent hover:border-primary pb-1">Studio</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-secondary/50 text-muted-foreground hover:border-primary transition-colors cursor-pointer">
            <Search className="w-4 h-4" />
            <span className="text-[9px] font-mono uppercase tracking-widest">Search Index</span>
            <kbd className="text-[9px] bg-background px-1.5 py-0.5 rounded border border-border font-mono">⌘K</kbd>
          </div>
          
          <Button variant="ghost" className="font-mono text-[10px] uppercase tracking-widest hover:text-primary rounded-full px-6">
            Login
          </Button>
          
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full font-black uppercase tracking-tighter px-8 h-11 text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            JOIN.
          </Button>
          
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full h-11 w-11 border border-border">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

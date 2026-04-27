import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-start justify-center px-6 md:px-20 py-20 dot-matrix overflow-hidden bg-background">
      {/* Swiss Style Background Overlay */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 -z-10 hidden lg:block border-l border-border" />
      
      <div className="max-w-6xl w-full z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">System Status: Active / Event Discovery 2.0</span>
        </div>

        <h1 className="text-7xl md:text-[10rem] font-black uppercase leading-[0.85] tracking-tighter mb-12 text-foreground">
          Event<br />
          <span className="text-primary italic">Hunt.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end w-full">
          <div className="lg:col-span-8">
            <p className="text-xl md:text-3xl font-medium leading-tight text-muted-foreground mb-12 max-w-2xl">
              Exploring the intersection of local traditions and modern discovery. 
              Find your next destination.
            </p>

            {/* Nothing OS Style Search Box */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full p-2 bg-card border border-border rounded-[2rem] focus-within:border-primary transition-colors">
              <div className="flex items-center flex-1 px-4 w-full">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <Input 
                  placeholder="Event, Hub or Organizer" 
                  className="bg-transparent border-none focus-visible:ring-0 text-xl font-medium h-14"
                />
              </div>
              <div className="w-px h-8 bg-border hidden md:block" />
              <div className="flex items-center flex-1 px-4 w-full">
                <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
                <Input 
                  placeholder="Location" 
                  className="bg-transparent border-none focus-visible:ring-0 text-xl font-medium h-14"
                />
              </div>
              <Button className="w-full md:w-auto h-14 px-10 bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] font-bold text-lg flex items-center gap-2 group">
                SEARCH <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex flex-col items-end text-right border-t border-border pt-8">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Trending Now</span>
            <ul className="space-y-2 font-bold text-lg">
              <li className="hover:text-primary cursor-pointer transition-colors">/ BRAHMOSTAVAM_2026</li>
              <li className="hover:text-primary cursor-pointer transition-colors">/ SUNBEAT_GOA</li>
              <li className="hover:text-primary cursor-pointer transition-colors">/ DANDIYA_NIGHT_PUNE</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Abstract Swiss Element */}
      <div className="absolute bottom-10 right-20 hidden md:block">
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`w-2 h-2 ${i % 2 === 0 ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

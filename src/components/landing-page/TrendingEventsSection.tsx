import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { events, hubs } from '@/lib/dummy-data'
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react'
import { Button } from '../ui/button'

export function TrendingEventsSection() {
  return (
    <section className="py-24 px-6 md:px-20 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-foreground leading-none">
              Trending<br />
              <span className="text-primary italic">Now.</span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-xl font-medium">
              A curated selection of events gaining traction within the ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-[2px] w-12 bg-primary hidden md:block" />
             <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Updated Every 6H</span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[800px]">
          {/* Main Large Card */}
          <Card className="md:col-span-2 md:row-span-2 group relative overflow-hidden bg-secondary border-none rounded-[2.5rem]">
            <img 
              src={events[0].imageUrl} 
              alt={events[0].title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <CardContent className="absolute bottom-0 left-0 p-10 w-full">
              <Badge className="mb-6 bg-primary text-white border-none px-4 py-1 font-mono text-xs uppercase tracking-widest">
                {events[0].category}
              </Badge>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
                {events[0].title}
              </h3>
              <div className="flex items-center gap-6 text-white/80 font-mono text-sm uppercase tracking-widest">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {events[0].startDate}</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {events[0].location}</span>
              </div>
            </CardContent>
            <div className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </Card>

          {/* Side Bento Cards */}
          <Card className="md:col-span-2 md:row-span-1 group bg-card border border-border rounded-[2.5rem] flex flex-col md:flex-row overflow-hidden hover:border-primary transition-colors">
            <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden">
               <img src={events[1].imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
            </div>
            <CardContent className="w-full md:w-1/2 p-8 flex flex-col justify-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 block">Recommended / Hub</span>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-tight">{events[1].title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-6">{events[1].description}</p>
              <div className="mt-auto">
                <Button variant="outline" className="rounded-full border-border hover:bg-primary hover:text-white hover:border-primary">
                  DETAILS
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Small Bento Cards */}
          <Card className="md:col-span-1 md:row-span-1 group bg-primary border-none rounded-[2.5rem] p-8 flex flex-col justify-between text-white">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">View All</h3>
              <p className="text-white/70 text-xs font-mono uppercase tracking-widest">340+ ACTIVE EVENTS</p>
            </div>
          </Card>

          <Card className="md:col-span-1 md:row-span-1 group bg-card border border-border rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-primary transition-colors">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-card bg-secondary overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="" />
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter leading-tight mb-2">Join the Ecosystem</h3>
              <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">2.4K+ MEMBERS TRACKING</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

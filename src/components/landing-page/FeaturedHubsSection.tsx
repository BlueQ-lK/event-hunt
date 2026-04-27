import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { hubs } from '@/lib/dummy-data'
import { Building2, Globe, Lock, ArrowUpRight } from 'lucide-react'

export function FeaturedHubsSection() {
  return (
    <section className="py-24 px-6 md:px-20 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 mb-20">
          <div className="lg:w-1/2">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-foreground leading-[0.85] mb-8">
              Festival<br />
              <span className="text-primary italic">Hubs.</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-tight">
              The primary nodes of our ecosystem. Verified organizers managing cultural legacies and modern gatherings.
            </p>
          </div>
          <div className="lg:w-1/2 flex items-end justify-start lg:justify-end">
            <div className="flex flex-col gap-4 border-l-2 border-primary pl-8 py-4">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Network Stats</span>
              <div className="flex gap-12">
                <div>
                  <div className="text-4xl font-black mb-1">128+</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">ACTIVE HUBS</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-1">4.2K</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">VERIFIED ORGANIZERS</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hubs.map((hub) => (
            <Card key={hub.id} className="group bg-card border border-border rounded-[3rem] overflow-hidden hover:border-primary transition-all duration-500">
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={hub.imageUrl} 
                    alt={hub.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1">
                      {hub.visibility}
                    </Badge>
                  </div>
                </div>
                <div className="p-10 -mt-10 relative bg-card rounded-t-[3rem]">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
                    <Building2 className="w-3.5 h-3.5" />
                    {hub.type}
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">{hub.name}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 line-clamp-2">
                    {hub.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-8">
                     <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{hub.location}</span>
                     <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

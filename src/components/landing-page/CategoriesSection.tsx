import { Music, Landmark, Sparkles, Map, Users, PartyPopper, ArrowRight } from 'lucide-react'

const categories = [
  { name: 'Village Festivals', icon: <Map className="w-8 h-8" />, count: '45 Events' },
  { name: 'Temple Jatres', icon: <Landmark className="w-8 h-8" />, count: '120 Events' },
  { name: 'Music Concerts', icon: <Music className="w-8 h-8" />, count: '32 Events' },
  { name: 'Traditions', icon: <Sparkles className="w-8 h-8" />, count: '88 Events' },
  { name: 'Public Gatherings', icon: <Users className="w-8 h-8" />, count: '15 Events' },
  { name: 'Private Events', icon: <PartyPopper className="w-8 h-8" />, count: '12 Events' },
]

export function CategoriesSection() {
  return (
    <section className="py-24 px-6 md:px-20 bg-background border-y border-border dot-matrix">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground">
            Browse by<br />
            <span className="text-primary italic">Category.</span>
          </h2>
          <div className="w-full md:w-auto">
            <button className="w-full md:w-auto px-8 py-4 bg-card border border-border rounded-full font-bold uppercase tracking-widest text-xs hover:border-primary transition-colors flex items-center justify-center gap-3 group">
              View All Indices <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.name}
              className="flex items-start justify-between p-8 rounded-[2.5rem] bg-card border border-border hover:border-primary transition-all group cursor-pointer"
            >
              <div className="flex flex-col h-full justify-between">
                <div className="text-primary mb-12 group-hover:scale-110 transition-transform origin-left">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">{cat.name}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{cat.count}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5 -rotate-45" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

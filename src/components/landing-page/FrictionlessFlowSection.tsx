import { PlusCircle, Tag, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'

export function FrictionlessFlowSection() {
  const steps = [
    {
      title: "Data Entry.",
      desc: "Input essential event parameters. Simple. Direct.",
      icon: <PlusCircle className="w-10 h-10" />,
    },
    {
      title: "Node Mapping.",
      desc: "Assign to an existing Hub or spawn a new one instantly.",
      icon: <Tag className="w-10 h-10" />,
    },
    {
      title: "Live Feed.",
      desc: "Global broadcast across the entire network ecosystem.",
      icon: <Sparkles className="w-10 h-10" />,
    },
  ]

  return (
    <section className="py-32 px-6 md:px-20 bg-secondary/30 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-primary mb-6 block">Architecture / Logic</span>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-foreground mb-8">
            Zero Friction.<br />
            <span className="text-primary italic">Absolute Sync.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group bg-card border border-border p-12 rounded-[3rem] hover:border-primary transition-all overflow-hidden">
               {/* Nothing Style Grid Overlay */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-16">
                  <div className="text-primary group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <span className="font-mono text-4xl font-black text-secondary-foreground opacity-20">0{idx + 1}</span>
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-6 leading-none">{step.title}</h3>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-12">
                  {step.desc}
                </p>
                <div className="mt-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                  <span>Learn Protocol</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 flex flex-col md:flex-row items-center justify-center gap-12 border-t border-border pt-24">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="text-left">
                    <h4 className="text-xl font-black uppercase tracking-tighter">Verified Protocol</h4>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">AUTO-GENERATE HUBS v2.1</p>
                </div>
            </div>
            <div className="h-px w-24 bg-border hidden md:block" />
            <p className="text-muted-foreground font-medium text-center md:text-left max-w-sm">
                Our algorithm handles organizational structure automatically. Focus on the event, not the setup.
            </p>
        </div>
      </div>
    </section>
  )
}

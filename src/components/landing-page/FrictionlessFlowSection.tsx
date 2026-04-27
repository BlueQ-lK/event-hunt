import { MapPin, Bell, Users, ShieldCheck } from 'lucide-react'

const features = [
  {
    title: 'Discover Nearby',
    desc: 'Find events and festivals happening around you.',
    icon: <MapPin className="w-5 h-5 text-primary" />,
    iconBg: 'bg-primary/10'
  },
  {
    title: 'Stay Updated',
    desc: 'Never miss important festivals and events again.',
    icon: <Bell className="w-5 h-5 text-orange-500" />,
    iconBg: 'bg-orange-500/10'
  },
  {
    title: 'Connect Community',
    desc: 'Share, connect and celebrate with your community.',
    icon: <Users className="w-5 h-5 text-pink-500" />,
    iconBg: 'bg-pink-500/10'
  },
  {
    title: 'Verified Information',
    desc: 'Reliable and verified event details you can trust.',
    icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
    iconBg: 'bg-green-500/10'
  }
]

export function FrictionlessFlowSection() {
  return (
    <section className="py-12 bg-white/50 border-t border-slate-100 mt-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-4 group">
              <div className={`w-12 h-12 ${feature.iconBg} rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{feature.title}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

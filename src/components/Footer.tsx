import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-12 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                 <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                   <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                 </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">EventHunt</span>
            </div>
            <p className="text-slate-500 font-medium mb-8 max-w-sm leading-relaxed">
              Your one-stop platform to discover, share and celebrate festivals, events and spiritual experiences.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, idx) => (
                <button key={idx} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-primary transition-all shadow-lg hover:shadow-primary/20">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              {['Home', 'Events', 'Festival Hubs', 'Map', 'About Us', 'Contact Us'].map(link => (
                <li key={link}><Link to="/" className="hover:text-primary transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">For Organizers</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              {['Create Event', 'Manage Events', 'Festival Hubs', 'Organizer Guide'].map(link => (
                <li key={link}><Link to="/" className="hover:text-primary transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <h4 className="font-bold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              {['Help Center', 'FAQs', 'Privacy Policy', 'Terms of Service'].map(link => (
                <li key={link}><Link to="/" className="hover:text-primary transition-colors">{link}</Link></li>
              ))}
            </ul>
            {/* Background Art */}
            <div className="absolute top-0 right-[-100px] opacity-10 pointer-events-none hidden xl:block">
               <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M150 20L280 150L150 280L20 150L150 20Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M150 50L250 150L150 250L50 150L150 50Z" stroke="currentColor" strokeWidth="2" />
                  <circle cx="150" cy="150" r="30" stroke="currentColor" strokeWidth="2" />
                  <rect x="130" y="280" width="40" height="100" stroke="currentColor" strokeWidth="2" />
               </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-slate-100 gap-6">
          <p className="text-sm font-bold text-slate-400">© 2024 EventHunt. All rights reserved.</p>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
                <div className="w-5 h-5 bg-white rounded-full" />
                <div className="text-left">
                  <div className="text-[8px] leading-none uppercase">Get it on</div>
                  <div className="text-xs font-bold leading-none mt-1">Google Play</div>
                </div>
             </div>
             <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
                <div className="w-5 h-5 bg-white rounded-full" />
                <div className="text-left">
                  <div className="text-[8px] leading-none uppercase">Download on the</div>
                  <div className="text-xs font-bold leading-none mt-1">App Store</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Youtube, Twitter, ChevronRight, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-24 px-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand DNA Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-black text-white tracking-tighter">
                Event<span className="text-indigo-400 italic font-serif">Hunt</span>
              </span>
            </div>
            <p className="text-base leading-relaxed font-medium">
              Curating the world's finest festivals and underground experiences. Join the community and never miss a beat in the city.
            </p>
          </div>
          
          {/* Link Columns */}
          <div className="md:ml-auto">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">Company</h4>
            <ul className="space-y-5 text-sm font-bold">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About Hubs</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div className="md:ml-auto">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">Explore</h4>
            <ul className="space-y-5 text-sm font-bold">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Hosting an Event</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Trending Events</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Nearby Experiences</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div className="md:ml-auto">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">Social</h4>
            <div className="flex flex-col gap-5">
              <a href="#" className="flex items-center gap-3 group text-sm font-bold hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
                  <Instagram className="w-4 h-4" />
                </div>
                Instagram
              </a>
              <a href="#" className="flex items-center gap-3 group text-sm font-bold hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
                  <Twitter className="w-4 h-4" />
                </div>
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
          <p>© 2026 EventHunt. Built for the <span className="text-slate-500">Curious.</span></p>
          <div className="flex gap-10">
            <span className="text-indigo-600/50">Mangalore, IN</span>
            <button className="hover:text-white transition-colors cursor-pointer">Back to top ↑</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Youtube, Twitter, ChevronRight, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 sm:py-24 px-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16 sm:mb-20">
          {/* Brand DNA Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tighter">
                Event<span className="text-indigo-400 italic font-serif">Hunt</span>
              </span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed font-medium max-w-sm">
              Discover and explore top events happening around you with ease. Never miss out on the best experiences.
            </p>
          </div>
          
          {/* Link Columns */}
          <div className="lg:ml-auto">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-6 sm:mb-8">Company</h4>
            <ul className="space-y-4 sm:space-y-5 text-sm font-bold">
              <li><a href="#" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">About Hubs</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">Terms of Service</a></li>
            </ul>
          </div>

          <div className="lg:ml-auto">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-6 sm:mb-8">Explore</h4>
            <ul className="space-y-4 sm:space-y-5 text-sm font-bold">
              <li><a href="#" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">Hosting an Event</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">Trending Events</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">Nearby Experiences</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">Help Center</a></li>
            </ul>
          </div>

          <div className="lg:ml-auto">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-6 sm:mb-8">Social</h4>
            <div className="flex flex-row lg:flex-col gap-4 sm:gap-5">
              <a href="#" className="flex items-center gap-3 group text-sm font-bold hover:text-white transition-colors">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                </div>
                <span className="hidden lg:inline">Instagram</span>
              </a>
              <a href="#" className="flex items-center gap-3 group text-sm font-bold hover:text-white transition-colors">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all duration-300">
                  <Twitter className="w-4 h-4" />
                </div>
                <span className="hidden lg:inline">Twitter</span>
              </a>
              <a href="#" className="flex items-center gap-3 group text-sm font-bold hover:text-white transition-colors">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all duration-300">
                  <Facebook className="w-4 h-4" />
                </div>
                <span className="hidden lg:inline">Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 sm:pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
          <p className="text-center sm:text-left">© 2026 EventHunt. Built for the <span className="text-slate-500">Curious.</span></p>
          <div className="flex items-center gap-8 sm:gap-10">
            <span className="text-indigo-600/50">Mangalore, IN</span>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-2"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
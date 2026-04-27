import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/landing-page/HeroSection'
import { TrendingEventsSection } from '@/components/landing-page/TrendingEventsSection'
import { UpcomingEventsSection } from '@/components/landing-page/UpcomingEventsSection'
import { CategoriesSection } from '@/components/landing-page/CategoriesSection'
import { AllEventsSection } from '@/components/landing-page/AllEventsSection'
import { FrictionlessFlowSection } from '@/components/landing-page/FrictionlessFlowSection'
import { getTrendingEvents, getUpcomingEvents, getAllEvents } from '@/server/events'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [trendingEvents, upcomingEvents, allEvents] = await Promise.all([
      getTrendingEvents(),
      getUpcomingEvents(),
      getAllEvents(),
    ])
    return { trendingEvents, upcomingEvents, allEvents }
  },
  component: Home,
})

function Home() {
  const { trendingEvents, upcomingEvents, allEvents } = Route.useLoaderData()

  return (
    <div className="min-h-screen">
      <HeroSection />

      <TrendingEventsSection events={trendingEvents} />

      <UpcomingEventsSection events={upcomingEvents} />

      <div className="container-custom pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[380px]">
            <CategoriesSection />
          </div>
          <div className="flex-1">
            <AllEventsSection events={allEvents} />
          </div>
        </div>
      </div>

      <FrictionlessFlowSection />

      <footer className="py-10 border-t border-slate-100 bg-white">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-current">
                    <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                  </svg>
               </div>
               <span className="text-lg font-bold text-slate-800">EventHunt</span>
             </div>
             <p className="text-xs text-slate-400">© 2024 EventHunt. Curating the world's finest festivals.</p>
           </div>

           <div className="flex gap-8 text-xs font-bold text-slate-500">
             <a href="#" className="hover:text-primary transition-colors">About Hubs</a>
             <a href="#" className="hover:text-primary transition-colors">Safety Guidelines</a>
             <a href="#" className="hover:text-primary transition-colors">Event Hosting</a>
             <a href="#" className="hover:text-primary transition-colors">Privacy</a>
             <a href="#" className="hover:text-primary transition-colors">Terms</a>
           </div>
        </div>
      </footer>
    </div>
  )
}

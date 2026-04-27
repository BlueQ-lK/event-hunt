import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/landing-page/HeroSection'
import { TrendingEventsSection } from '@/components/landing-page/TrendingEventsSection'
import { CategoriesSection } from '@/components/landing-page/CategoriesSection'
import { FeaturedHubsSection } from '@/components/landing-page/FeaturedHubsSection'
import { FrictionlessFlowSection } from '@/components/landing-page/FrictionlessFlowSection'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <HeroSection />
      <TrendingEventsSection />
      <CategoriesSection />
      <FrictionlessFlowSection />
      <FeaturedHubsSection />
      
      {/* Swiss Style Footer */}
      <footer className="py-20 px-6 md:px-20 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 italic">EventHunt.</h2>
            <p className="text-muted-foreground max-w-sm font-medium">
              A decentralized-inspired event protocol. Built for discovery, optimized for community hubs.
            </p>
          </div>
          <div className="flex flex-col gap-4 font-mono text-[10px] uppercase tracking-widest">
            <span className="text-foreground font-bold mb-4">Navigation</span>
            <a href="#" className="hover:text-primary transition-colors">/ PROTOCOL_EXPLORER</a>
            <a href="#" className="hover:text-primary transition-colors">/ HUB_INDEX</a>
            <a href="#" className="hover:text-primary transition-colors">/ NETWORK_STATUS</a>
          </div>
          <div className="flex flex-col gap-4 font-mono text-[10px] uppercase tracking-widest">
            <span className="text-foreground font-bold mb-4">Legal</span>
            <a href="#" className="hover:text-primary transition-colors">/ TERMS_OF_SYNC</a>
            <a href="#" className="hover:text-primary transition-colors">/ PRIVACY_PROTOCOL</a>
            <a href="#" className="hover:text-primary transition-colors">/ LICENSE_v3.0</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground">
          <span>&copy; 2026 EVENTHUNT_CORP</span>
          <div className="flex gap-8">
            <span>UPTIME: 99.98%</span>
            <span>BUILD: v2.0.4-STABLE</span>
          </div>
        </div>
      </footer>
    </>
  )
}

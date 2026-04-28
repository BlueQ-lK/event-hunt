import { createFileRoute } from '@tanstack/react-router'
import { HelpCircle, Mail, MessageSquare, Phone, Search, ArrowRight, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const Route = createFileRoute('/help')({
  component: HelpPage
})

function HelpPage() {
  const faqs = [
    {
      question: "How do I create an event?",
      answer: "To create an event, you need to be logged in. Click on the 'Create Event' button in the navigation bar or go to your profile and select 'Manage Events' to start the process."
    },
    {
      question: "How can I track my interested events?",
      answer: "All events you've marked as 'Interested' are saved in your profile. Simply click on your avatar, select 'Profile', and go to the 'Interested' tab."
    },
    {
      question: "Is there a mobile app?",
      answer: "Currently, EventHunt is a web-based platform optimized for both desktop and mobile browsers. We are working on a dedicated mobile app for future release."
    },
    {
      question: "How do I contact an event host?",
      answer: "You can find the contact information or social media links of the host on the specific event detail page."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      <div className="container-custom max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">How can we help?</h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Search our help center or browse categories below to find the answers you need.
          </p>
          
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search for articles, guides, and more..." 
              className="pl-12 h-14 rounded-2xl border-slate-200 shadow-sm focus:ring-primary/20 text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">Chat Support</CardTitle>
              <CardDescription>Speak with our team</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Mail className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <CardTitle className="text-lg">Email Us</CardTitle>
              <CardDescription>Get a response in 24h</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Phone className="w-6 h-6 text-green-600 group-hover:text-white" />
              </div>
              <CardTitle className="text-lg">Call Support</CardTitle>
              <CardDescription>Mon-Fri, 9am - 6pm</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-slate-100">
                <AccordionTrigger className="text-left font-bold text-slate-700 hover:text-primary hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 font-medium leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Still need help?</h4>
              <p className="text-sm text-slate-500">Can't find the answer you're looking for? Please chat to our friendly team.</p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover text-white rounded-xl px-6 font-bold flex gap-2">
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group">
                  <span className="font-bold text-slate-600 group-hover:text-primary transition-colors">Documentation</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group">
                  <span className="font-bold text-slate-600 group-hover:text-primary transition-colors">Community Forum</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group">
                  <span className="font-bold text-slate-600 group-hover:text-primary transition-colors">Privacy Policy</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group">
                  <span className="font-bold text-slate-600 group-hover:text-primary transition-colors">Terms of Service</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { createEvent } from '@/server/events'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Upload, 
  Plus, 
  Search, 
  Building2, 

  ChevronRight,
  Info,
  PhoneCall,
  Image as ImageIcon, 
  ListChecks,
  ChevronDown,
  X,
} from 'lucide-react'
import { Footer } from '@/components/Footer'
import type { EventForm } from '@/lib/types'

export const Route = createFileRoute('/manage/create')({
  component: CreateEventPage,
})

function CreateEventPage() {
  const [formData, setFormData] = useState<EventForm>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: {
      name: '',
      address: '',
      city: ''
    },
    category: 'other',
    bannerImage: '',
    brochure: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!formData.title || !formData.startDate) {
      setSubmitError('Please fill in all required fields (Title, Start Date).')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await createEvent({
        data: {
          title: formData.title,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          startTime: formData.startTime || undefined,
          endTime: formData.endTime || undefined,
          locationName: formData.location.name || undefined,
          address: formData.location.address || undefined,
          city: formData.location.city || undefined,
          category: formData.category,
          bannerImage: typeof formData.bannerImage === 'string' ? formData.bannerImage || undefined : undefined,
          brochure: typeof formData.brochure === 'string' ? formData.brochure || undefined : undefined,
        }
      })
      navigate({ to: '/' })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const [showEndTime, setShowEndTime] = useState(false)


  const steps = [
    'Basic Information',
    'Date & Time',
    'Location',
    'Organized By',
    'Event Details',
    'Media & Documents',
    'Event Schedule',
    'Review & Publish'
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className=" py-6 px-6">
        <div className="container-custom flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Create Event</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600">Create Event</span>
            </div>
          </div>
        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
            {submitError}
          </div>
        )}
        <div className="flex items-center gap-3 mt-4 mb-8">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-hover text-white font-bold px-8 shadow-lg shadow-primary/20 disabled:opacity-60"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Event'}
          </Button>
        </div>
        </div>
      </header>

      <main className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Form Content (Left) */}
          <div className="lg:col-span-8 space-y-8 border p-5 rounded-lg">
            
            {/* Step 1: Basic Information */}
            <FormSection number={1} title="Basic Information" >
              <div className="space-y-3">
                <div className="">
                  <label className="text-xs font-bold text-slate-700">Event Title <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Input 
                      placeholder="Enter event title" 
                      className="h-12 bg-white border-slate-200 rounded-lg focus:ring-primary/20"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    <span className="absolute right-4 bottom-[-20px] text-[10px] font-bold text-slate-400">0/100</span>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-700">Event Description <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Textarea 
                      placeholder="Describe your event, its significance, and what people can expect..." 
                      className="min-h-[150px] bg-white border-slate-200 rounded-lg focus:ring-primary/20 py-4"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    <span className="absolute right-4 bottom-[-20px] text-[10px] font-bold text-slate-400">0/1000</span>
                  </div>
                </div>
              </div>
            </FormSection>
            {/* Step 2: Date & Time */}
            <FormSection number={2} title="Date & Time">
              <div className="space-y-4">

                {/* Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                  {/* Start Date */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input 
                        type="date" 
                        className="h-12 bg-white border-slate-200 rounded-lg pl-10" 
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      />
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Start Time */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input 
                        type="time" 
                        className="h-12 bg-white border-slate-200 rounded-lg pl-10" 
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      />
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Toggle Button (3rd column) */}
                  <div className="flex items-center h-12">
                    <Button 
                      type="button"
                      variant="ghost" 
                      className={`font-semibold text-xs flex items-center gap-2 p-0 h-auto ${
                        showEndTime 
                          ? "text-red-500 hover:text-red-600 hover:bg-red-50" 
                          : "text-primary hover:text-primary-hover hover:bg-primary/5"
                      }`}
                      onClick={() => setShowEndTime(!showEndTime)}
                    >
                      <span className="text-base leading-none">
                        {showEndTime ? "−" : "+"}
                      </span>
                      {showEndTime ? "Remove end time" : "Add end time"}
                    </Button>
                  </div>

                </div>

                {/* End Fields (Below) */}
                {showEndTime && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">

                    {/* End Date */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        End Date
                      </label>
                      <div className="relative">
                        <Input 
                          type="date" 
                          className="h-12 bg-white border-slate-200 rounded-lg pl-10" 
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        />
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    {/* End Time */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        End Time
                      </label>
                      <div className="relative">
                        <Input 
                          type="time" 
                          className="h-12 bg-white border-slate-200 rounded-lg pl-10" 
                          value={formData.endTime}
                          onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        />
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </FormSection>

            {/* Step 3: Location */}
            <FormSection number={3} title="Location">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Location Name <span className="text-red-500">*</span></label>
                  <Input 
                    placeholder="Start typing location name for suggestions" 
                    className="h-12 bg-white border-slate-200 rounded-lg" 
                    value={formData.location.name}
                    onChange={(e) => setFormData({...formData, location: {...formData.location, name: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                   <Textarea 
                      placeholder="Address" 
                      className="min-h-[100px] bg-white border-slate-200 rounded-lg focus:ring-primary/20"
                      value={formData.location.address}
                      onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                    />
                </div>
                 <div className="space-y-2">
                  <Input 
                    placeholder="City" 
                    className="h-12 bg-white border-slate-200 rounded-lg" 
                    value={formData.location.city}
                    onChange={(e) => setFormData({...formData, location: {...formData.location, city: e.target.value}})}
                  />
                </div>
                <div className="h-48 bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200" alt="" className="w-full h-full object-cover opacity-40" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl animate-bounce">
                        <MapPin className="w-5 h-5" />
                      </div>
                   </div>
                </div>
              </div>
            </FormSection>


            {/* Step 5: Event Details */}
            <FormSection number={4} title="Event Details">
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Event Category</label>
                    <div className="relative">
                      <select 
                        className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700 font-medium text-sm"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as EventForm['category']})}
                      >
                        <option value="">Select category</option>
                        <option value="tech">Tech</option>
                        <option value="music">Music</option>
                        <option value="sports">Sports</option>
                        <option value="education">Education</option>
                        <option value="business">Business</option>
                        <option value="art">Art</option>
                        <option value="health">Health</option>
                        <option value="food">Food</option>
                        <option value="travel">Travel</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Step 6: Media & Documents */}
            <FormSection number={6} title="Media & Documents">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Event Banner / Image <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center bg-white hover:border-primary/50 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/10 transition-all">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 mb-1"><span className="text-primary">Click to upload</span> or drag and drop</p>
                    <p className="text-[10px] font-bold text-slate-400">PNG, JPG or WEBP (Max. 5MB)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Brochure / Poster <span className="text-slate-400 font-medium">(optional)</span></label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center bg-white hover:border-primary/50 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/10 transition-all">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 mb-1"><span className="text-primary">Click to upload</span> or drag and drop</p>
                    <p className="text-[10px] font-bold text-slate-400">PDF, PNG, JPG (Max. 10MB)</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-2">You can add more images and documents after creating the event.</p>
              </div>
            </FormSection>
          </div>

          {/* Sidebar (Right) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Event Preview */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Event Preview</h3>
              <Card className="bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <div className="aspect-[16/9] bg-slate-100 flex items-center justify-center relative">
                   <ImageIcon className="w-12 h-12 text-slate-300" />
                   <div className="absolute top-3 right-3">
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-2 py-1">Draft</Badge>
                   </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <h4 className="text-lg font-black text-slate-800">
                    {formData.title || 'Event Title'}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">Date & Time</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">{formData.location.name || 'Location'}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">About this event</p>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2 italic">
                      {formData.description || 'Event description will appear here...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Stepper */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-6">Complete these steps</h3>
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 transition-all ${idx === 0 ? 'bg-primary border-primary text-white' : 'border-slate-200 text-slate-300'}`}>
                      {idx + 1}
                    </div>
                    <span className={`text-xs font-bold transition-colors ${idx === 0 ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips for a great event */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Tips for a great event</h3>
              {[
                { icon: Info, label: 'Be Descriptive', text: 'Add clear and detailed information about your event.', color: 'bg-emerald-50 text-emerald-500' },
                { icon: ImageIcon, label: 'Add a Banner', text: 'A high quality image attracts more attendees.', color: 'bg-indigo-50 text-indigo-500' },
                { icon: Calendar, label: 'Include Schedule', text: 'Day-wise schedule helps people plan better.', color: 'bg-pink-50 text-pink-500' },
                { icon: ListChecks, label: 'Choose Correct Hub', text: 'Selecting the right festival hub helps people discover your event easily.', color: 'bg-orange-50 text-orange-500' },
              ].map((tip, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tip.color}`}>
                    <tip.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 mb-1">{tip.label}</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>

          </aside>
        </div>

       
      </main>

      <Footer />
    </div>
  )
}

function FormSection({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-primary/20">
          {number}
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
      </div>
      <div className="pl-0 md:pl-12 space-y-6">
        {children}
      </div>
    </div>
  )
}

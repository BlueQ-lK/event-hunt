import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Editor } from '@/components/editor'
import { fetchCoordsFromAddress } from '@/lib/location'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Upload, 
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react'
import type { EventForm as EventFormType } from '@/lib/types'

interface EventFormProps {
  initialData?: EventFormType
  isEditing?: boolean
  onSubmit: (data: any) => Promise<void>
  submitLabel: string
  submittingLabel: string
}

export function EventForm({ 
  initialData, 
  isEditing = false, 
  onSubmit, 
  submitLabel, 
  submittingLabel 
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormType>(initialData || {
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
    facebook: '',
    instagram: '',
    twitter: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showEndTime, setShowEndTime] = useState(!!formData.endTime || !!formData.endDate)

  const handleSubmit = async () => {
    if (!formData.title || !formData.startDate || !formData.startTime) {
      setSubmitError('Please fill in all required fields (Title, Start Date, Start Time).')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      // Geocode address
      let lat: number | undefined
      let lng: number | undefined
      if (formData.location.address && formData.location.city) {
        const coords = await fetchCoordsFromAddress(formData.location.address, formData.location.city)
        if (coords) {
          lat = coords.lat
          lng = coords.lng
        }
      }

      await onSubmit({
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        startTime: formData.startTime,
        endTime: formData.endTime || undefined,
        address: formData.location.address || undefined,
        city: formData.location.city || undefined,
        category: formData.category ?? 'other',
        bannerImage: typeof formData.bannerImage === 'string' ? formData.bannerImage || undefined : undefined,
        facebook: formData.facebook || undefined,
        instagram: formData.instagram || undefined,
        twitter: formData.twitter || undefined,
        latitude: lat,
        longitude: lng,
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTimeAMPM = (field: 'startTime' | 'endTime') => {
    const currentValue = formData[field];
    let hours = 12;
    let minutes = 0;
    
    if (currentValue) {
      const [h, m] = currentValue.split(':').map(Number);
      hours = h;
      minutes = m;
    }
    
    const newHours = hours >= 12 ? hours - 12 : hours + 12;
    const newTime = `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, [field]: newTime }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header & Action */}
      <div className="mb-16 sm:mb-24">
        <h1 className="text-5xl sm:text-7xl font-black text-center text-yinYang-accent tracking-tight leading-[0.9]">
          {isEditing ? 'Edit' : 'Create'} 
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 font-serif italic"> Event</span>
        </h1>
      </div>

      {submitError && (
        <div className="mb-12">
          <div className="p-6 bg-red-50/50 border-2 border-red-100/50 rounded-[2rem] text-sm font-bold text-red-700 flex items-center gap-5 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-red-100">
              <X className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-red-900">Submission Error</p>
              <p className="text-red-600/80 mt-0.5">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="space-y-12 sm:space-y-20">
        
        {/* Step 1: Basic Information */}
        <FormSection number={1} title="Basic Information" >
          <div className="space-y-3">
            <div className="">
              <label className="text-sm font-medium text-slate-700">Event Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <Input 
                  placeholder="Enter event name" 
                  className="h-12 bg-white border-zinc-300 rounded-lg focus:ring-primary/20"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <span className="absolute right-4 bottom-[-20px] text-[10px] font-bold text-slate-400">{formData.title.length}/100</span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-slate-700">Event Description <span className="text-red-500">*</span></label>
              <Editor 
                value={formData.description || ''}
                onChange={(html) => setFormData({...formData, description: html})}
                placeholder="Describe your event, its significance, and what people can expect..."
              />
            </div>
          </div>
        </FormSection>

        {/* Step 2: Date & Time */}
        <FormSection number={2} title="Date & Time">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input 
                    type="date" 
                    className="h-12 bg-white border-zinc-300 rounded-lg pl-10" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Start Time */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Input 
                    type="time" 
                    className="h-12 bg-white border-zinc-300 rounded-lg pl-10 pr-16 w-full" 
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  />
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <div className="absolute right-0 top-0 bottom-0 flex items-center pr-1">
                    <div className="h-8 w-px bg-slate-100 mx-1" />
                    <div className="flex flex-col items-center px-2">
                      <button 
                        type="button"
                        onClick={() => toggleTimeAMPM('startTime')}
                        className="text-black transition-colors"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <span className="text-[9px] font-black text-slate-500 select-none leading-tight py-0.5">
                        {formData.startTime ? (parseInt(formData.startTime.split(':')[0]) >= 12 ? 'PM' : 'AM') : 'AM'}
                      </span>
                      <button 
                        type="button"
                        onClick={() => toggleTimeAMPM('startTime')}
                        className="text-black transition-colors"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center h-12">
                <Button 
                  type="button"
                  variant="ghost" 
                  className={`font-medium text-sm flex items-center gap-2 p-0 h-auto ${
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

            {showEndTime && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    End Date
                  </label>
                  <div className="relative">
                    <Input 
                      type="date" 
                      className="h-12 bg-white border-zinc-300 rounded-lg pl-10" 
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    End Time
                  </label>
                  <div className="relative flex items-center">
                    <Input 
                      type="time" 
                      className="h-12 bg-white border-zinc-300 rounded-lg pl-10 pr-16 w-full" 
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    />
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <div className="absolute right-0 top-0 bottom-0 flex items-center pr-1">
                      <div className="h-8 w-px bg-slate-100 mx-1" />
                      <div className="flex flex-col items-center px-2">
                        <button 
                          type="button"
                          onClick={() => toggleTimeAMPM('endTime')}
                          className="text-black transition-colors"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <span className="text-[9px] font-black text-slate-500 select-none leading-tight py-0.5">
                          {formData.endTime ? (parseInt(formData.endTime.split(':')[0]) >= 12 ? 'PM' : 'AM') : 'AM'}
                        </span>
                        <button 
                          type="button"
                          onClick={() => toggleTimeAMPM('endTime')}
                          className="text-black transition-colors"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FormSection>

        {/* Step 3: Location */}
        <FormSection number={3} title="Location" description="Choose where your event will take place.">
          <div className="space-y-3">
            <div className="space-y-2">
               <Textarea 
                  placeholder="Address" 
                  className="min-h-[100px] bg-white border-zinc-300 rounded-lg focus:ring-primary/20"
                  value={formData.location.address}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                />
            </div>
             <div className="space-y-2">
              <Input 
                placeholder="City" 
                className="h-12 bg-white border-zinc-300 rounded-lg" 
                value={formData.location.city}
                onChange={(e) => setFormData({...formData, location: {...formData.location, city: e.target.value}})}
              />
            </div>
          </div>
        </FormSection>

        {/* Step 4: Event Type */}
        <FormSection number={4} title="Event Type">
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Event Category</label>
                <div className="relative">
                  <select 
                    className="w-full h-12 bg-white border border-zinc-300 rounded-lg px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700 font-medium text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as EventFormType['category']})}
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

        {/* Step 5: Social Media */}
        <FormSection number={5} title="Social Media">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Facebook</label>
                <Input 
                  placeholder="https://facebook.com/event" 
                  className="h-12 bg-white border-zinc-300 rounded-lg" 
                  value={formData.facebook}
                  onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Instagram</label>
                <Input 
                  placeholder="https://instagram.com/event" 
                  className="h-12 bg-white border-zinc-300 rounded-lg" 
                  value={formData.instagram}
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">X / Twitter</label>
                <Input 
                  placeholder="https://x.com/event" 
                  className="h-12 bg-white border-zinc-300 rounded-lg" 
                  value={formData.twitter}
                  onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Step 6: Media & Documents */}
        <FormSection number={6} title="Media & Documents">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Event Banner / Image <span className="text-red-500">*</span></label>
              <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 flex flex-col items-center justify-center bg-white hover:border-primary/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/10 transition-all">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700 mb-1"><span className="text-primary">Click to upload</span> or drag and drop</p>
                <p className="text-[10px] font-bold text-slate-400">PNG, JPG or WEBP (Max. 5MB)</p>
              </div>
            </div>
          </div>
          </div>
        </FormSection>

        <div className="pt-8 border-t border-slate-100 block">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl transition-all"
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

function FormSection({ number, title, description, children }: { number: number; title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm sm:text-base shrink-0 shadow-xl shadow-indigo-600/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          {number}
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
          {description && <p className="text-slate-500 text-sm sm:text-sm">{description}</p>}
        </div>
      </div>
      <div className="pl-0 sm:pl-16 space-y-8 sm:space-y-10">
        {children}
      </div>
    </div>
  )
}

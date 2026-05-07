import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'
import { useRef, useTransition, useEffect, useState } from 'react'
import { searchEvents, searchEventsSchema } from '@/server/events'
import { Button } from '@/components/ui/button'
import {
  Search,
  MapPin,
  X,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Footer } from '@/components/Footer'
import { EventCard } from '@/components/EventCard'
import { getBestStoredCity, normalizeCitySlug } from '@/lib/location'

// ── URL search-param schema ──────────────────────────────────────────────────
const searchSchema = searchEventsSchema

export const Route = createFileRoute('/search')({
  validateSearch: (raw) => searchSchema.parse(raw),
  beforeLoad: ({ search }) => {
    if (search.city === undefined) {
      throw redirect({
        to: '/search',
        search: {
          ...search,
          city: getBestStoredCity(),
        },
      })
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => searchEvents({ data: deps }),
  component: SearchPage,
})

// ── Category tabs config ─────────────────────────────────────────────────────
const CATEGORY_TABS = [
  { label: 'All Events', value: 'all' },
  { label: 'Tech',       value: 'tech' },
  { label: 'Music',      value: 'music' },
  { label: 'Sports',     value: 'sports' },
  { label: 'Education',  value: 'education' },
  { label: 'Business',   value: 'business' },
  { label: 'Art',        value: 'art' },
  { label: 'Health',     value: 'health' },
  { label: 'Food',       value: 'food' },
  { label: 'Travel',     value: 'travel' },
  { label: 'Other',      value: 'other' },
]

const DATE_RANGE_OPTIONS = [
  { label: 'Any date',   value: 'any' },
  { label: 'Today',      value: 'today' },
  { label: 'Tomorrow',   value: 'tomorrow' },
  { label: 'This week',  value: 'this-week' },
  { label: 'This month', value: 'this-month' },
]

const SORT_OPTIONS = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'Event Date ↑',       value: 'date-asc' },
  { label: 'Event Date ↓',       value: 'date-desc' },
]

// ── Page ─────────────────────────────────────────────────────────────────────
function SearchPage() {
  const result   = Route.useLoaderData()
  const search   = Route.useSearch()
  const navigate = useNavigate({ from: '/search' })
  const [isPending, startTransition] = useTransition()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Destructure current params with defaults
  const {
    q         = '',
    category  = 'all',
    dateRange = 'any',
    city      = '',
    sort      = 'newest',
    page      = 1,
    limit     = 24,
  } = search
  const cityValue = city ? city.replace(/-/g, ' ') : ''

  // Local input state (debounced before pushing to URL)
  const [inputQ, setInputQ] = useState(q)
  const [inputCity, setInputCity] = useState(cityValue)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep local input in sync if URL changes externally (e.g. browser back/forward)
  useEffect(() => { setInputQ(q) }, [q])
  useEffect(() => { setInputCity(cityValue) }, [cityValue])

  // Helper: push new search params to URL (triggers loader)
  function navigate2(params: Partial<typeof search>) {
    startTransition(() => {
      navigate({
        search: (prev) => ({
          ...prev,
          ...params,
          page: ('page' in params) ? params.page : 1, // reset page on any filter change
        }),
      })
    })
  }

  // Debounced text search
  function handleQueryChange(val: string) {
    setInputQ(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      navigate2({ q: val || undefined })
    }, 400)
  }

  function handleCityChange(val: string) {
    setInputCity(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      // Normalize but allow empty string so beforeLoad doesn't redirect if explicitly cleared
      // but wait, if it's empty, maybe we want to keep it as "" in the URL?
      const normalized = normalizeCitySlug(val, '')
      navigate2({ city: normalized })
    }, 400)
  }

  function handleQuerySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    navigate2({ 
      q: inputQ || undefined,
      city: normalizeCitySlug(inputCity, '') || undefined
    })
  }

  function clearAll() {
    setInputQ('')
    setInputCity(getBestStoredCity())
    navigate2({ q: undefined, category: undefined, dateRange: undefined, city: undefined, sort: undefined, page: 1 })
  }

  // Pagination
  const totalPages = Math.ceil((result.total) / limit)
  const hasActiveFilters = !!(q || (category && category !== 'all') || (dateRange && dateRange !== 'any') || city)

  return (
    <div className="bg-[#F8FAFC] min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-10 px-6">
        <div className="container-custom">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-1 text-center">Discover <span className='font-serif italic text-indigo'>Events</span></h1>
            <p className="text-slate-500 font-medium text-center">Find festivals, events and cultural programs near you.</p>
          </div>

          <form onSubmit={handleQuerySubmit} className="flex flex-col md:flex-row gap-3">
            {/* Query input */}
            <div className="flex-[2] flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3.5 sm:py-4 gap-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={inputQ}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search events, places, categories…"
                className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 font-bold placeholder:text-slate-400 text-sm sm:text-base"
              />
              {inputQ && (
                <button type="button" onClick={() => handleQueryChange('')} className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            {/* City input */}
            <div className="relative flex-1 flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3.5 sm:py-4 gap-3 md:max-w-[300px] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
              <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
              <input
                type="text"
                value={inputCity}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="City"
                className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 font-bold placeholder:text-slate-400 text-sm sm:text-base"
              />
              {inputCity && (
                <button type="button" onClick={() => handleCityChange('')} className="absolute right-4 p-1 hover:bg-yinYang-accent hover:text-white rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </form>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Active filters:</span>
              {q && (
                <FilterChip label={`"${q}"`} onRemove={() => { setInputQ(''); navigate2({ q: undefined }) }} />
              )}
              {category && category !== 'all' && (
                <FilterChip label={CATEGORY_TABS.find(c => c.value === category)?.label ?? category} onRemove={() => navigate2({ category: undefined })} />
              )}
              {dateRange && dateRange !== 'any' && (
                <FilterChip label={DATE_RANGE_OPTIONS.find(d => d.value === dateRange)?.label ?? dateRange} onRemove={() => navigate2({ dateRange: undefined })} />
              )}
              {city && (
                <FilterChip label={city} onRemove={() => { setInputCity(''); navigate2({ city: '' }) }} />
              )}
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 ml-1"
              >
                Clear all <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="container-custom py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          {/* Mobile toggle */}
          <div className="flex items-center justify-between lg:hidden mb-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo" />
              Filters
              {hasActiveFilters && <div className="w-2 h-2 bg-indigo rounded-full ml-1 animate-pulse" />}
            </button>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{result.total} events found</span>
          </div>

          {/* Mobile Sidebar Overlay */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-[100] lg:hidden">
              <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <aside className="absolute right-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo" />
                    Filters
                  </h3>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <FilterContent 
                    dateRange={dateRange} 
                    category={category} 
                    navigate2={navigate2} 
                    clearAll={() => { clearAll(); setMobileSidebarOpen(false); }}
                    hasActiveFilters={hasActiveFilters}
                  />
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <Button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="w-full bg-slate-900 hover:bg-indigo text-white font-black uppercase tracking-widest h-14 rounded-2xl shadow-lg"
                  >
                    Show {result.total} Events
                  </Button>
                </div>
              </aside>
            </div>
          )}

          {/* Desktop Sidebar */}
          <aside className="lg:w-80 shrink-0 hidden lg:block">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sticky top-24">
              <FilterContent 
                dateRange={dateRange} 
                category={category} 
                navigate2={navigate2} 
                clearAll={clearAll}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* ── Results ─────────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {CATEGORY_TABS.map(tab => {
                // For individual single-category tabs, also highlight if only that one is selected
                const isActiveSingle = tab.value !== 'all' &&
                  category === tab.value
                const finalActive = tab.value === 'all'
                  ? (!category || category === 'all')
                  : isActiveSingle

                return (
                  <button
                    key={tab.value}
                    onClick={() => navigate2({ category: tab.value !== 'all' ? tab.value : undefined })}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all
                      ${finalActive
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'}`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Results bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-slate-500">
                {isPending
                  ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Searching…</span>
                  : <><span className="font-bold text-slate-800">{result.total}</span> event{result.total !== 1 ? 's' : ''} found</>
                }
              </p>

              {/* Sort */}
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <span className="hidden sm:block">Sort by:</span>
                <select
                  value={sort ?? 'newest'}
                  onChange={(e) => navigate2({ sort: e.target.value })}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:border-slate-300 transition-colors focus:outline-none focus:border-primary"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            {result.events.length > 0 ? (
              <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                  {result.events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      disabled={page <= 1}
                      onClick={() => navigate2({ page: page - 1 })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        // Show pages around current
                        let pageNum: number
                        if (totalPages <= 7) {
                          pageNum = i + 1
                        } else if (page <= 4) {
                          pageNum = i + 1
                        } else if (page >= totalPages - 3) {
                          pageNum = totalPages - 6 + i
                        } else {
                          pageNum = page - 3 + i
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => navigate2({ page: pageNum })}
                            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all
                              ${pageNum === page
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'}`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      disabled={page >= totalPages}
                      onClick={() => navigate2({ page: page + 1 })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">No events found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your search terms or filters.</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Clear all filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterContent({ 
  dateRange, 
  category, 
  navigate2, 
  clearAll, 
  hasActiveFilters 
}: { 
  dateRange: string | undefined; 
  category: string | undefined; 
  navigate2: (params: any) => void; 
  clearAll: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 text-[10px]">
          General Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo hover:opacity-80"
          >
            Reset <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="space-y-10">
        {/* Date Range */}
        <FilterSection title="Date Range">
          <div className="space-y-4 pt-2">
            {DATE_RANGE_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => navigate2({ dateRange: opt.value !== 'any' ? opt.value : undefined })}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                    ${(dateRange ?? 'any') === opt.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 group-hover:border-slate-300'}`}
                >
                  {(dateRange ?? 'any') === opt.value && (
                    <div className="w-2.5 h-2.5 bg-indigo rounded-full" />
                  )}
                </div>
                <span
                  onClick={() => navigate2({ dateRange: opt.value !== 'any' ? opt.value : undefined })}
                  className={`text-sm font-bold cursor-pointer ${(dateRange ?? 'any') === opt.value ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}
                >
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Category checkboxes */}
        <FilterSection title="Category">
          <div className="space-y-4 pt-2">
            {CATEGORY_TABS.slice(1).map(cat => {
              const activeCats = (category && category !== 'all') ? category.split(',') : []
              const isChecked = activeCats.includes(cat.value)

              function toggleCat() {
                let next: string[]
                if (isChecked) {
                  next = activeCats.filter(c => c !== cat.value)
                } else {
                  next = [...activeCats, cat.value]
                }
                navigate2({ category: next.length ? next.join(',') : undefined })
              }

              return (
                <label key={cat.value} className="flex items-center gap-3 cursor-pointer group" onClick={toggleCat}>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                    ${isChecked ? 'border-indigo-600 bg-indigo' : 'border-slate-200 group-hover:border-slate-300'}`}
                  >
                    {isChecked && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-bold capitalize ${isChecked ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    {cat.label}
                  </span>
                </label>
              )
            })}
          </div>
        </FilterSection>
      </div>
    </>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full mb-4 group"
      >
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && children}
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:opacity-70">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

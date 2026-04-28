import { createFileRoute, useNavigate } from '@tanstack/react-router'
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

// ── URL search-param schema ──────────────────────────────────────────────────
const searchSchema = searchEventsSchema

export const Route = createFileRoute('/search')({
  validateSearch: (raw) => searchSchema.parse(raw),
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

  // Local input state (debounced before pushing to URL)
  const [inputQ, setInputQ] = useState(q)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep local input in sync if URL changes externally (e.g. browser back/forward)
  useEffect(() => { setInputQ(q) }, [q])

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

  function handleQuerySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    navigate2({ q: inputQ || undefined })
  }

  function clearAll() {
    setInputQ('')
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
            <h1 className="text-3xl font-bold text-slate-900 mb-1 text-center">Discover Events</h1>
            <p className="text-slate-500 font-medium text-center">Find festivals, events and cultural programs near you.</p>
          </div>

          <form onSubmit={handleQuerySubmit} className="flex flex-col md:flex-row gap-3">
            {/* Query input */}
            <div className="flex-1 flex items-center bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 gap-3 focus-within:border-primary transition-colors">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={inputQ}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search events, places, categories…"
                className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400 text-sm"
              />
              {inputQ && (
                <button type="button" onClick={() => handleQueryChange('')}>
                  <X className="w-4 h-4 text-slate-300 hover:text-slate-500 transition-colors" />
                </button>
              )}
            </div>

            {/* City input */}
            <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 gap-3 md:w-64 focus-within:border-primary transition-colors">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <input
                type="text"
                value={city}
                onChange={(e) => navigate2({ city: e.target.value || undefined })}
                placeholder="City (e.g. Mangalore)"
                className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400 text-sm"
              />
              {city && (
                <button type="button" onClick={() => navigate2({ city: undefined })}>
                  <X className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                </button>
              )}
            </div>

            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold h-[50px] px-8 rounded-xl">
              Search
            </Button>
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
                <FilterChip label={city} onRemove={() => navigate2({ city: undefined })} />
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
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileSidebarOpen(v => !v)}
              className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
            </button>
            <span className="text-sm text-slate-400 font-medium">{result.total} events found</span>
          </div>

          <aside className={`lg:w-72 shrink-0 ${mobileSidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80"
                  >
                    Reset <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-7">
                {/* Date Range */}
                <FilterSection title="Date Range">
                  <div className="space-y-3">
                    {DATE_RANGE_OPTIONS.map(opt => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <div
                          onClick={() => navigate2({ dateRange: opt.value !== 'any' ? opt.value : undefined })}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                            ${(dateRange ?? 'any') === opt.value
                              ? 'border-primary'
                              : 'border-slate-200 group-hover:border-slate-300'}`}
                        >
                          {(dateRange ?? 'any') === opt.value && (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                          )}
                        </div>
                        <span
                          onClick={() => navigate2({ dateRange: opt.value !== 'any' ? opt.value : undefined })}
                          className={`text-sm font-medium cursor-pointer ${(dateRange ?? 'any') === opt.value ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}
                        >
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Category checkboxes */}
                <FilterSection title="Category">
                  <div className="space-y-3">
                    {CATEGORY_TABS.slice(1).map(cat => {
                      // category is comma-separated in URL
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
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                            ${isChecked ? 'border-primary bg-primary' : 'border-slate-200 group-hover:border-slate-300'}`}
                          >
                            {isChecked && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm font-medium capitalize ${isChecked ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                            {cat.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </FilterSection>
              </div>
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

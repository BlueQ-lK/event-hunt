import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'
import { db } from '@/db'
import { events, eventInterests, user } from '@/db/schema'
import { eq, and, gte, lte, desc, asc, sql, count, or, ilike } from 'drizzle-orm'
import { auth } from '#/lib/auth'

// ---- Search / Filter Server Function ----

export const searchEventsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),       // comma-separated list of category values
  dateRange: z.string().optional(),      // 'any' | 'today' | 'tomorrow' | 'this-week' | 'this-month'
  city: z.string().optional(),
  sort: z.string().optional(),           // 'newest' | 'oldest' | 'relevance' | 'date-asc'
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
})

export type SearchEventsInput = z.infer<typeof searchEventsSchema>

export const searchEvents = createServerFn({ method: 'GET' })
  .inputValidator(searchEventsSchema)
  .handler(async ({ data }) => {
    const {
      q,
      category,
      dateRange,
      city,
      sort = 'newest',
      page = 1,
      limit = 24,
    } = data

    const conditions: ReturnType<typeof and>[] = []

    // Full-text-style search across title, locationName, city, description
    if (q && q.trim()) {
      const term = `%${q.trim()}%`
      conditions.push(
        or(
          ilike(events.title, term),
          ilike(events.city, term),
          ilike(events.description, term),
        ) as any
      )
    }

    // Category filter (comma-separated e.g. "tech,music")
    if (category && category !== 'all') {
      const cats = category.split(',').map(c => c.trim()).filter(Boolean)
      if (cats.length === 1) {
        conditions.push(eq(events.category, cats[0] as any))
      } else if (cats.length > 1) {
        conditions.push(
          or(...cats.map(c => eq(events.category, c as any))) as any
        )
      }
    }

    // Date range filter
    if (dateRange && dateRange !== 'any') {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const todayEnd = new Date(todayStart.getTime() + 86_400_000 - 1)

      if (dateRange === 'today') {
        conditions.push(gte(events.startDate, todayStart))
        conditions.push(lte(events.startDate, todayEnd))
      } else if (dateRange === 'tomorrow') {
        const tomorrowStart = new Date(todayStart.getTime() + 86_400_000)
        const tomorrowEnd = new Date(tomorrowStart.getTime() + 86_400_000 - 1)
        conditions.push(gte(events.startDate, tomorrowStart))
        conditions.push(lte(events.startDate, tomorrowEnd))
      } else if (dateRange === 'this-week') {
        const weekEnd = new Date(todayStart.getTime() + 7 * 86_400_000)
        conditions.push(gte(events.startDate, todayStart))
        conditions.push(lte(events.startDate, weekEnd))
      } else if (dateRange === 'this-month') {
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
        conditions.push(gte(events.startDate, todayStart))
        conditions.push(lte(events.startDate, monthEnd))
      }
    }

    // City filter
    if (city && city !== 'all') {
      conditions.push(ilike(events.city, city))
    }

    // Price filter — events table has no explicit price field yet, so we use
    // the description heuristic: category "other" for now, placeholder for real price
    // (when you add a price/isFree column, swap this logic)
    // Currently a no-op passthrough so the rest of the filters still work.

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Sort
    let orderClause
    if (sort === 'oldest') {
      orderClause = asc(events.createdAt)
    } else if (sort === 'date-asc') {
      orderClause = asc(events.startDate)
    } else if (sort === 'date-desc') {
      orderClause = desc(events.startDate)
    } else {
      // newest (default)
      orderClause = desc(events.createdAt)
    }

    const offset = (page - 1) * limit

    const [rows, totalRows] = await Promise.all([
      db
        .select()
        .from(events)
        .where(whereClause)
        .orderBy(orderClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(events)
        .where(whereClause),
    ])

    return {
      events: rows,
      total: totalRows[0]?.count ?? 0,
      page,
      limit,
    }
  })

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  startTime: z.string().min(1),
  endTime: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  category: z
    .enum(['tech', 'music', 'sports', 'education', 'business', 'art', 'health', 'food', 'travel', 'other']),
  bannerImage: z.string().optional(),
  brochure: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
})

export type CreateEventInput = z.infer<typeof createEventSchema>

async function getSessionOrThrow() {
  const request = getRequest()
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}

export const createEvent = createServerFn({ method: 'POST' })
  .inputValidator(createEventSchema)
  .handler(async ({ data }) => {
    const session = await getSessionOrThrow()

    const [event] = await db
      .insert(events)
      .values({
        userId: session.user.id,
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        startTime: data.startTime,
        endTime: data.endTime,
        address: data.address,
        city: data.city,
        category: data.category,
        bannerImage: data.bannerImage,
        brochure: data.brochure,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter
      })
      .returning()

    return event
  })

export const getEvents = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await db.select().from(events).orderBy(desc(events.createdAt))
  })

export const getEvent = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const [result] = await db
      .select({
        event: events,
        organizer: {
          name: user.name,
          image: user.image
        }
      })
      .from(events)
      .leftJoin(user, eq(events.userId, user.id))
      .where(eq(events.id, id))
    
    if (!result) return null;
    
    return {
      ...result.event,
      organizerName: result.organizer?.name,
      organizerImage: result.organizer?.image
    }
  })


// ------- "I'm Interested" feature -------

export const toggleInterest = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ eventId: z.string() }))
  .handler(async ({ data }) => {
    const session = await getSessionOrThrow()

    const existing = await db
      .select()
      .from(eventInterests)
      .where(
        and(
          eq(eventInterests.eventId, data.eventId),
          eq(eventInterests.userId, session.user.id)
        )
      )

    if (existing.length > 0) {
      await db
        .delete(eventInterests)
        .where(
          and(
            eq(eventInterests.eventId, data.eventId),
            eq(eventInterests.userId, session.user.id)
          )
        )
      return { interested: false }
    }

    await db.insert(eventInterests).values({
      eventId: data.eventId,
      userId: session.user.id
    })
    return { interested: true }
  })

export const getInterestStatus = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ eventId: z.string() }))
  .handler(async ({ data }) => {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return { interested: false }
    }

    const existing = await db
      .select()
      .from(eventInterests)
      .where(
        and(
          eq(eventInterests.eventId, data.eventId),
          eq(eventInterests.userId, session.user.id)
        )
      )
    return { interested: existing.length > 0 }
  })

export const getInterestCount = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: eventId }) => {
    const [result] = await db
      .select({ count: count() })
      .from(eventInterests)
      .where(eq(eventInterests.eventId, eventId))
    return result.count
  })

export const getInterestedUsers = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: eventId }) => {
    const results = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image
      })
      .from(eventInterests)
      .innerJoin(user, eq(eventInterests.userId, user.id))
      .where(eq(eventInterests.eventId, eventId))
      .limit(4)
    
    return results
  })

export const getTrendingEvents = createServerFn({ method: 'GET' })
  .handler(async () => {
    const now = new Date()

    // Get total interest counts per event
    const interestCounts = db
      .select({
        eventId: eventInterests.eventId,
        interestCount: count(eventInterests.id).as('interest_count')
      })
      .from(eventInterests)
      .groupBy(eventInterests.eventId)
      .as('interest_counts')

    const trendingEvents = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        startDate: events.startDate,
        endDate: events.endDate,
        startTime: events.startTime,
        endTime: events.endTime,
        address: events.address,
        city: events.city,
        category: events.category,
        bannerImage: events.bannerImage,
        brochure: events.brochure,
        createdAt: events.createdAt,
        interestCount: interestCounts.interestCount
      })
      .from(events)
      .innerJoin(interestCounts, eq(events.id, interestCounts.eventId))
      .where(
        // Event has not ended yet: either no end date or end date >= now
        sql`(${events.endDate} IS NULL OR ${events.endDate} >= ${now})`
      )
      .orderBy(desc(interestCounts.interestCount))

    return trendingEvents
  })

/**
 * Upcoming Events:
 * Events that haven't started yet, ordered by start date ascending (soonest first).
 */
export const getUpcomingEvents = createServerFn({ method: 'GET' })
  .handler(async () => {
    const now = new Date()
    return await db
      .select()
      .from(events)
      .where(gte(events.startDate, now))
      .orderBy(events.startDate)
      .limit(8)
  })

/**
 * All Events:
 * All events ordered by creation date, for the "All Events" section.
 */
export const getAllEvents = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt))
      .limit(8)
  })

export const getEventsByCity = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ city: z.string().min(1), limit: z.number().optional() }))
  .handler(async ({ data }) => {
    const normalized = data.city.trim().toLowerCase().replace(/-/g, ' ')
    const rows = await db
      .select()
      .from(events)
      .where(ilike(events.city, normalized))
      .orderBy(desc(events.createdAt))
      .limit(data.limit ?? 24)

    return rows
  })

export const getMyManagedEvents = createServerFn({ method: 'GET' })
  .handler(async () => {
    const session = await getSessionOrThrow()

    return await db
      .select({
        id: events.id,
        title: events.title,
        startDate: events.startDate,
        endDate: events.endDate,
        startTime: events.startTime,
        endTime: events.endTime,
        address: events.address,
        city: events.city,
        category: events.category,
        bannerImage: events.bannerImage,
        createdAt: events.createdAt,
        interestCount: count(eventInterests.id),
      })
      .from(events)
      .leftJoin(eventInterests, eq(eventInterests.eventId, events.id))
      .where(eq(events.userId, session.user.id))
      .groupBy(events.id)
      .orderBy(desc(events.createdAt))
  })

export const getMyInterestedEvents = createServerFn({ method: 'GET' })
  .handler(async () => {
    const session = await getSessionOrThrow()

    return await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        startDate: events.startDate,
        endDate: events.endDate,
        startTime: events.startTime,
        endTime: events.endTime,
        address: events.address,
        city: events.city,
        category: events.category,
        bannerImage: events.bannerImage,
        brochure: events.brochure,
        createdAt: events.createdAt,
      })
      .from(eventInterests)
      .innerJoin(events, eq(events.id, eventInterests.eventId))
      .where(eq(eventInterests.userId, session.user.id))
      .orderBy(desc(eventInterests.createdAt))
  })

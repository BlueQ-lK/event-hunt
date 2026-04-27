import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'
import { db } from '@/db'
import { events, eventInterests } from '@/db/schema'
import { eq, and, gte, lte, desc, sql, count } from 'drizzle-orm'
import { auth } from '#/lib/auth'

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  startTime: z.string().min(1),
  endTime: z.string().optional(),
  locationName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  category: z
    .enum(['tech', 'music', 'sports', 'education', 'business', 'art', 'health', 'food', 'travel', 'other']),
  bannerImage: z.string().optional(),
  brochure: z.string().optional(),
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
        locationName: data.locationName,
        address: data.address,
        city: data.city,
        category: data.category,
        bannerImage: data.bannerImage,
        brochure: data.brochure
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
    const [event] = await db.select().from(events).where(eq(events.id, id))
    return event
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

// ------- Home Page Data -------

/**
 * Trending Events:
 * Ongoing events (started <= now <= ended OR no end date) where users marked "I'm Interested" in the last 7 days.
 * Sorted by interest count descending.
 */
export const getTrendingEvents = createServerFn({ method: 'GET' })
  .handler(async () => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get interest counts for the last week per event
    const interestCounts = db
      .select({
        eventId: eventInterests.eventId,
        interestCount: count(eventInterests.id).as('interest_count')
      })
      .from(eventInterests)
      .where(gte(eventInterests.createdAt, oneWeekAgo))
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
        locationName: events.locationName,
        address: events.address,
        city: events.city,
        category: events.category,
        bannerImage: events.bannerImage,
        brochure: events.brochure,
        createdAt: events.createdAt,
        interestCount: sql<number>`COALESCE(${interestCounts.interestCount}, 0)`
      })
      .from(events)
      .leftJoin(interestCounts, eq(events.id, interestCounts.eventId))
      .where(
        and(
          // Event has started
          lte(events.startDate, now),
          // Event has not ended yet (ongoing): either no end date or end date >= now
          sql`(${events.endDate} IS NULL OR ${events.endDate} >= ${now})`
        )
      )
      .orderBy(desc(sql`COALESCE(${interestCounts.interestCount}, 0)`))
      .limit(8)

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
        locationName: events.locationName,
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
        locationName: events.locationName,
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

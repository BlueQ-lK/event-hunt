import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'
import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '#/lib/auth'

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

export const updateUserCity = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ city: z.string().min(1) }))
  .handler(async ({ data }) => {
    const session = await getSessionOrThrow()

    await db
      .update(user)
      .set({ homeCity: data.city })
      .where(eq(user.id, session.user.id))

    return { success: true }
  })

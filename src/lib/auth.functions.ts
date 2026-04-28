import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { normalizeCitySlug } from "./location";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    return session;
});

export const ensureSession = createServerFn({ method: "GET" }).handler(async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
        throw new Error("Unauthorized");
    }

    return session;
});

export const updateMyHomeCity = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      city: z.string().min(1),
      lat: z.number().finite().optional(),
      lng: z.number().finite().optional(),
    })
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const normalizedCity = normalizeCitySlug(data.city);
    await db
      .update(user)
      .set({
        homeCity: normalizedCity,
        homeLatitude: data.lat,
        homeLongitude: data.lng,
      })
      .where(eq(user.id, session.user.id));

    return { homeCity: normalizedCity, homeLatitude: data.lat, homeLongitude: data.lng };
  });

export const getMyHomeLocation = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return null;
  }

  const [row] = await db
    .select({
      homeCity: user.homeCity,
      homeLatitude: user.homeLatitude,
      homeLongitude: user.homeLongitude,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!row?.homeCity) {
    return null;
  }

  return {
    city: normalizeCitySlug(row.homeCity),
    lat: row.homeLatitude ?? undefined,
    lng: row.homeLongitude ?? undefined,
  };
});
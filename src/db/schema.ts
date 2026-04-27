import {
  pgTable,
  text,
  varchar,
  timestamp,
  pgEnum,
  unique,
  boolean,
  index,
  time
} from "drizzle-orm/pg-core"
import { generateSnowflakeId } from "@/lib/snowflake"
import { relations } from "drizzle-orm";




// authentication schema

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// ---- ENUM ----
export const eventCategoryEnum = pgEnum("event_category", [
  "tech",
  "music",
  "sports",
  "education",
  "business",
  "art",
  "health",
  "food",
  "travel",
  "other"
])

// ---- EVENTS ----
export const events = pgTable("events", {
  id: varchar("id", { length: 20 })
    .primaryKey()
    .$defaultFn(() => generateSnowflakeId()),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  startTime: time("start_time").notNull(),
  endTime: time("end_time"),
  locationName: varchar("location_name", { length: 255 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  category: eventCategoryEnum("category").notNull(),
  bannerImage: text("banner_image"),
  brochure: text("brochure"),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
  userIdx: index("events_user_idx").on(table.userId),
  categoryIdx: index("events_category_idx").on(table.category),
  startDateIdx: index("events_start_date_idx").on(table.startDate)
}))

// ---- EVENT INTERESTS ----
export const eventInterests = pgTable("event_interests", {
  id: varchar("id", { length: 20 })
    .primaryKey()
    .$defaultFn(() => generateSnowflakeId()),
  eventId: varchar("event_id", { length: 20 })
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
  uniqueInterest: unique("unique_event_user_interest")
    .on(table.eventId, table.userId),

  eventIdx: index("event_interest_event_idx").on(table.eventId),
  userIdx: index("event_interest_user_idx").on(table.userId)
}))

// ---- RELATIONS ----
export const eventRelations = relations(events, ({ many }) => ({
  interests: many(eventInterests),
}))

export const eventInterestRelations = relations(eventInterests, ({ one }) => ({
  event: one(events, {
    fields: [eventInterests.eventId],
    references: [events.id],
  }),
}))

import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const rooms = pgTable('rooms', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
  isPublic: boolean().default(false).notNull(),
  originalFileName: text(),
  originalFileType: text(),
  originalFileContent: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

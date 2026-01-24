import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  personName: text("person_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  amount: integer("amount").notNull(),
  dueDate: timestamp("due_date").notNull(),
  isPaid: boolean("is_paid").default(false).notNull(),
});

export const insertReminderSchema = createInsertSchema(reminders, {
  dueDate: z.coerce.date(),
}).omit({
  id: true,
});
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;

export type CreateReminderRequest = InsertReminder;
export type UpdateReminderRequest = Partial<InsertReminder>;

import { db } from "./db";
import {
  reminders,
  type CreateReminderRequest,
  type UpdateReminderRequest,
  type Reminder
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getReminders(): Promise<Reminder[]>;
  getReminder(id: number): Promise<Reminder | undefined>;
  createReminder(reminder: CreateReminderRequest): Promise<Reminder>;
  updateReminder(id: number, updates: UpdateReminderRequest): Promise<Reminder>;
  deleteReminder(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getReminders(): Promise<Reminder[]> {
    return await db.select().from(reminders).orderBy(desc(reminders.dueDate));
  }

  async getReminder(id: number): Promise<Reminder | undefined> {
    const [reminder] = await db.select().from(reminders).where(eq(reminders.id, id));
    return reminder;
  }

  async createReminder(insertReminder: CreateReminderRequest): Promise<Reminder> {
    const [reminder] = await db.insert(reminders).values(insertReminder).returning();
    return reminder;
  }

  async updateReminder(id: number, updates: UpdateReminderRequest): Promise<Reminder> {
    const [updated] = await db.update(reminders)
      .set(updates)
      .where(eq(reminders.id, id))
      .returning();
    return updated;
  }

  async deleteReminder(id: number): Promise<void> {
    await db.delete(reminders).where(eq(reminders.id, id));
  }
}

export const storage = new DatabaseStorage();

import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.reminders.list.path, async (req, res) => {
    const reminders = await storage.getReminders();
    res.json(reminders);
  });

  app.post(api.reminders.create.path, async (req, res) => {
    try {
      const input = api.reminders.create.input.parse(req.body);
      const reminder = await storage.createReminder(input);
      res.status(201).json(reminder);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.reminders.update.path, async (req, res) => {
    const id = Number(req.params.id);
    try {
      const input = api.reminders.update.input.parse(req.body);
      const updated = await storage.updateReminder(id, input);
      if (!updated) {
        return res.status(404).json({ message: "Reminder not found" });
      }
      res.json(updated);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.reminders.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteReminder(id);
    res.status(204).send();
  });

  return httpServer;
}

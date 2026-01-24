import { storage } from "../server/storage";

async function seed() {
  console.log("Seeding database...");
  try {
    const existing = await storage.getReminders();
    if (existing.length === 0) {
      await storage.createReminder({
        personName: "Rahul Sharma",
        phoneNumber: "9876543210",
        amount: 500,
        dueDate: new Date(Date.now() + 86400000 * 2), // 2 days later
        isPaid: false
      });
      await storage.createReminder({
        personName: "Amit Patel",
        phoneNumber: "9123456789",
        amount: 1200,
        dueDate: new Date(Date.now() - 86400000), // Yesterday
        isPaid: false
      });
      await storage.createReminder({
        personName: "Sneha Gupta",
        phoneNumber: "9988776655",
        amount: 250,
        dueDate: new Date(Date.now() - 86400000 * 5), // 5 days ago
        isPaid: true
      });
      console.log("Seeded successfully!");
    } else {
      console.log("Database already has data, skipping seed.");
    }
  } catch (e) {
    console.error("Error seeding:", e);
  }
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

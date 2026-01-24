import { useReminders } from "@/hooks/use-reminders";
import { useLang } from "@/lib/lang-context";
import { StatsCard } from "@/components/StatsCard";
import { ReminderCard } from "@/components/ReminderCard";
import { ReminderForm } from "@/components/ReminderForm";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Loader2, Receipt } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: reminders, isLoading, error } = useReminders();
  const { t } = useLang();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        Error loading data
      </div>
    );
  }

  const filteredReminders = reminders?.filter(r => 
    r.personName.toLowerCase().includes(search.toLowerCase()) ||
    r.phoneNumber.includes(search)
  ).sort((a, b) => {
    // Sort logic: Unpaid first, then by date ascending (urgent first)
    if (a.isPaid === b.isPaid) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.isPaid ? 1 : -1;
  }) || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto min-h-screen relative flex flex-col">
        
        {/* Top Header */}
        <header className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-md z-40">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {t("app.title")}
            </h1>
            <p className="text-sm text-muted-foreground">Manage your dues</p>
          </div>
          <LanguageToggle />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 px-4 space-y-6">
          
          {/* Stats Section */}
          <section>
            <StatsCard reminders={reminders || []} />
          </section>

          {/* Search */}
          <section>
            <Input 
              placeholder="Search by name or phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-2xl bg-white border-border/60 shadow-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </section>

          {/* List Section */}
          <section className="space-y-4">
            {filteredReminders.length === 0 ? (
              <div className="text-center py-12 px-4 opacity-60">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">{t("empty.title")}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-[200px] mx-auto">
                  {t("empty.subtitle")}
                </p>
              </div>
            ) : (
              filteredReminders.map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))
            )}
          </section>
        </main>

        {/* FAB */}
        <ReminderForm />
      </div>
    </div>
  );
}

import { useLang } from "@/lib/lang-context";
import { Reminder } from "@shared/schema";
import { Wallet } from "lucide-react";

interface StatsCardProps {
  reminders: Reminder[];
}

export function StatsCard({ reminders }: StatsCardProps) {
  const { t } = useLang();

  const totalPending = reminders
    .filter(r => !r.isPaid)
    .reduce((sum, r) => sum + r.amount, 0);

  // Format currency roughly based on app context (Generic/INR)
  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalPending);

  return (
    <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-3xl p-6 shadow-xl shadow-primary/25 text-white overflow-hidden relative">
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2 opacity-90">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium tracking-wide uppercase">
            {t("stats.total_pending")}
          </span>
        </div>
        
        <div className="mt-4">
          <h2 className="text-4xl font-bold tracking-tight font-display">
            {formattedTotal}
          </h2>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-100 bg-emerald-800/30 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          <span>{reminders.filter(r => !r.isPaid).length} Pending Items</span>
        </div>
      </div>
    </div>
  );
}

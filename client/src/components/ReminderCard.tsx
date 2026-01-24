import { Reminder } from "@shared/schema";
import { useLang } from "@/lib/lang-context";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Phone, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Trash2, 
  Edit2 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUpdateReminder, useDeleteReminder } from "@/hooks/use-reminders";
import { ReminderForm } from "./ReminderForm";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReminderCardProps {
  reminder: Reminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  const { t, language } = useLang();
  const updateMutation = useUpdateReminder();
  const deleteMutation = useDeleteReminder();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const togglePaid = () => {
    updateMutation.mutate({
      id: reminder.id,
      isPaid: !reminder.isPaid
    });
  };

  const handleWhatsApp = () => {
    const dateStr = format(new Date(reminder.dueDate), "dd MMM yyyy");
    const amountStr = `₹${reminder.amount}`;
    
    let message = t("msg.whatsapp_template", {
      name: reminder.personName,
      amount: amountStr,
      date: dateStr
    });

    const url = `https://wa.me/${reminder.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg",
        reminder.isPaid 
          ? "bg-secondary/30 border-secondary/50" 
          : "bg-white border-border/50 hover:border-primary/20"
      )}>
        {/* Status Indicator Stripe */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
          reminder.isPaid ? "bg-emerald-500" : "bg-amber-500"
        )} />

        <div className="p-5 pl-6 flex flex-col gap-4">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className={cn(
                "font-display font-bold text-lg leading-tight",
                reminder.isPaid && "text-muted-foreground line-through decoration-emerald-500/50"
              )}>
                {reminder.personName}
              </h3>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                {reminder.phoneNumber}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="gap-2 cursor-pointer">
                  <Edit2 className="h-4 w-4" /> {t("btn.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteAlertOpen(true)} className="text-destructive gap-2 cursor-pointer">
                  <Trash2 className="h-4 w-4" /> {t("btn.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Details Row */}
          <div className="flex items-end justify-between mt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                {t("label.due_date")}
              </div>
              <p className={cn(
                "font-medium",
                !reminder.isPaid && new Date(reminder.dueDate) < new Date() ? "text-destructive" : "text-foreground"
              )}>
                {format(new Date(reminder.dueDate), "d MMM, yyyy")}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold font-display tracking-tight text-primary">
                ₹{reminder.amount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex gap-3 mt-1 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              className={cn(
                "flex-1 rounded-xl h-10 gap-2 transition-all border-dashed hover:border-solid hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200",
                reminder.isPaid && "bg-emerald-50 text-emerald-700 border-emerald-200 border-solid"
              )}
              onClick={togglePaid}
            >
              <CheckCircle2 className={cn("w-4 h-4", reminder.isPaid && "fill-current")} />
              {reminder.isPaid ? t("status.paid") : t("status.unpaid")}
            </Button>
            
            <Button 
              className="flex-1 rounded-xl h-10 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-md shadow-[#25D366]/20 border-none"
              onClick={handleWhatsApp}
            >
              <Phone className="w-4 h-4 fill-current" />
              WhatsApp
            </Button>
          </div>

        </div>
      </div>

      <ReminderForm 
        existingReminder={reminder} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the reminder for {reminder.personName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate(reminder.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

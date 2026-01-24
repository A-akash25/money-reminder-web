import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertReminderSchema } from "@shared/schema";
import { useCreateReminder, useUpdateReminder } from "@/hooks/use-reminders";
import { useLang } from "@/lib/lang-context";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import type { Reminder } from "@shared/schema";

// Schema for the form - needs coercing for number inputs from HTML
const formSchema = insertReminderSchema.extend({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  dueDate: z.coerce.date(),
});

type FormData = z.infer<typeof formSchema>;

interface ReminderFormProps {
  existingReminder?: Reminder;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function ReminderForm({ 
  existingReminder, 
  open, 
  onOpenChange,
  trigger 
}: ReminderFormProps) {
  const { t } = useLang();
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditMode = !!existingReminder;

  // Controlled open state wrapper
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const createMutation = useCreateReminder();
  const updateMutation = useUpdateReminder();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: existingReminder ? {
      ...existingReminder,
      dueDate: new Date(existingReminder.dueDate),
    } : {
      personName: "",
      phoneNumber: "",
      amount: 0,
      dueDate: new Date(),
      isPaid: false,
    },
  });

  const onSubmit = (data: FormData) => {
    if (isEditMode && existingReminder) {
      updateMutation.mutate({ id: existingReminder.id, ...data }, {
        onSuccess: () => setOpen(false),
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        !isEditMode && (
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg shadow-primary/40 hover:scale-105 transition-transform duration-200 z-50 p-0"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
        )
      )}
      <DialogContent className="sm:max-w-[425px] rounded-2xl gap-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-center">
            {isEditMode ? t("btn.edit") : t("btn.add_reminder")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="personName" className="text-muted-foreground font-medium">
              {t("label.name")}
            </Label>
            <Input
              id="personName"
              placeholder="e.g. Rahul Sharma"
              {...form.register("personName")}
              className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary/50 transition-all"
            />
            {form.formState.errors.personName && (
              <p className="text-xs text-destructive">{form.formState.errors.personName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-muted-foreground font-medium">
                {t("label.amount")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  {...form.register("amount")}
                  className="h-12 pl-8 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary/50 transition-all font-mono"
                />
              </div>
              {form.formState.errors.amount && (
                <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground font-medium">{t("label.due_date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal rounded-xl bg-muted/50 border-transparent hover:bg-muted",
                      !form.watch("dueDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("dueDate") ? format(form.watch("dueDate"), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("dueDate")}
                    onSelect={(date) => date && form.setValue("dueDate", date)}
                    initialFocus
                    className="rounded-xl border shadow-lg"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-muted-foreground font-medium">
              {t("label.phone")}
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+91 98765 43210"
              {...form.register("phoneNumber")}
              className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary/50 transition-all font-mono"
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-xs text-destructive">{form.formState.errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={() => setOpen(false)}
            >
              {t("btn.cancel")}
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("btn.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

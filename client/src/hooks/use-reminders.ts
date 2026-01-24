import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertReminder, UpdateReminderRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useReminders() {
  return useQuery({
    queryKey: [api.reminders.list.path],
    queryFn: async () => {
      const res = await fetch(api.reminders.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reminders");
      return api.reminders.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertReminder) => {
      const res = await fetch(api.reminders.create.path, {
        method: api.reminders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.reminders.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create reminder");
      }
      return api.reminders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reminders.list.path] });
      toast({
        title: "Success",
        description: "Reminder added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateReminderRequest) => {
      const url = buildUrl(api.reminders.update.path, { id });
      const res = await fetch(url, {
        method: api.reminders.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to update reminder");
      }
      return api.reminders.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reminders.list.path] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.reminders.delete.path, { id });
      const res = await fetch(url, {
        method: api.reminders.delete.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete reminder");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reminders.list.path] });
      toast({
        title: "Deleted",
        description: "Reminder removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

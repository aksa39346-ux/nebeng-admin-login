import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "customer" | "mitra";
export type StatusType = "aktif" | "tidak aktif" | "blokir" | "proses" | "selesai" | "ditolak";

export interface User {
  id: string;
  nama: string;
  email: string;
  no_hp: string | null;
  alamat: string | null;
  tanggal_lahir: string | null;
  role: UserRole;
  status: StatusType;
  foto_profil: string | null;
  created_at: string;
  updated_at: string;
}

export function useUsers(role?: UserRole) {
  return useQuery({
    queryKey: ["users", role],
    queryFn: async () => {
      let query = supabase.from("users").select("*").order("created_at", { ascending: false });
      
      if (role) {
        query = query.eq("role", role);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as User[];
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as User | null;
    },
    enabled: !!id,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StatusType }) => {
      const { data, error } = await supabase
        .from("users")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Status berhasil diperbarui" });
    },
    onError: (error) => {
      toast({ title: "Gagal memperbarui status", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...userData }: Partial<User> & { id: string }) => {
      const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      toast({ title: "Data berhasil diperbarui" });
    },
    onError: (error) => {
      toast({ title: "Gagal memperbarui data", description: error.message, variant: "destructive" });
    },
  });
}

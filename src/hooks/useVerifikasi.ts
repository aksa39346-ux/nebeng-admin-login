import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface VerifikasiKTP {
  id: string;
  user_id: string;
  no_ktp: string;
  nama_ktp: string;
  alamat_ktp: string | null;
  tempat_lahir: string | null;
  tanggal_lahir_ktp: string | null;
  jenis_kelamin: string | null;
  foto_ktp: string | null;
  foto_selfie: string | null;
  status: VerificationStatus;
  verified_at: string | null;
  verified_by: string | null;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

export function useVerifikasiByUser(userId: string) {
  return useQuery({
    queryKey: ["verifikasi", "user", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verifikasi_ktp")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data as VerifikasiKTP | null;
    },
    enabled: !!userId,
  });
}

export function usePendingVerifikasi(role?: "customer" | "mitra") {
  return useQuery({
    queryKey: ["verifikasi", "pending", role],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verifikasi_ktp")
        .select(`
          *,
          users:user_id (id, nama, email, no_hp, role, foto_profil)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      
      if (role) {
        return data.filter((item: any) => item.users?.role === role);
      }
      return data;
    },
  });
}

export function useUpdateVerifikasi() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      catatan 
    }: { 
      id: string; 
      status: VerificationStatus; 
      catatan?: string;
    }) => {
      const updateData: any = { 
        status,
        catatan,
      };
      
      if (status === "verified") {
        updateData.verified_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("verifikasi_ktp")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verifikasi"] });
      toast({ title: "Status verifikasi berhasil diperbarui" });
    },
    onError: (error) => {
      toast({ title: "Gagal memperbarui verifikasi", description: error.message, variant: "destructive" });
    },
  });
}

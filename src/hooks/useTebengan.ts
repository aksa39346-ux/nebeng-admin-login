import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StatusType } from "./useUsers";

export interface Tebengan {
  id: string;
  mitra_id: string;
  jenis: string;
  lokasi_jemput: string;
  lokasi_tujuan: string;
  tanggal_berangkat: string;
  waktu_berangkat: string;
  harga: number;
  kapasitas: number;
  kapasitas_terisi: number;
  deskripsi: string | null;
  status: StatusType;
  created_at: string;
  updated_at: string;
}

export interface TebenganWithMitra extends Tebengan {
  mitra?: {
    id: string;
    nama: string;
    email: string;
    no_hp: string | null;
    foto_profil: string | null;
  };
}

export function useTebenganList() {
  return useQuery({
    queryKey: ["tebengan"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tebengan")
        .select(`
          *,
          mitra:mitra_id (id, nama, email, no_hp, foto_profil)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TebenganWithMitra[];
    },
  });
}

export function useTebengan(id: string) {
  return useQuery({
    queryKey: ["tebengan", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tebengan")
        .select(`
          *,
          mitra:mitra_id (id, nama, email, no_hp, foto_profil)
        `)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as TebenganWithMitra | null;
    },
    enabled: !!id,
  });
}

export function useUpdateTebenganStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StatusType }) => {
      const { data, error } = await supabase
        .from("tebengan")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tebengan"] });
      toast({ title: "Status tebengan berhasil diperbarui" });
    },
    onError: (error) => {
      toast({ title: "Gagal memperbarui status", description: error.message, variant: "destructive" });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StatusType } from "./useUsers";

export interface Kendaraan {
  id: string;
  mitra_id: string;
  jenis_kendaraan: string;
  merk: string;
  model: string;
  tahun: number | null;
  warna: string | null;
  plat_nomor: string;
  foto_kendaraan: string | null;
  foto_stnk: string | null;
  status: StatusType;
  created_at: string;
  updated_at: string;
}

export function useKendaraanByMitra(mitraId: string) {
  return useQuery({
    queryKey: ["kendaraan", "mitra", mitraId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kendaraan_mitra")
        .select("*")
        .eq("mitra_id", mitraId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Kendaraan[];
    },
    enabled: !!mitraId,
  });
}

export function useKendaraan(id: string) {
  return useQuery({
    queryKey: ["kendaraan", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kendaraan_mitra")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Kendaraan | null;
    },
    enabled: !!id,
  });
}

export function useAllKendaraan() {
  return useQuery({
    queryKey: ["kendaraan", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kendaraan_mitra")
        .select(`
          *,
          users:mitra_id (id, nama, email, no_hp, foto_profil)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateKendaraan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...kendaraanData }: Partial<Kendaraan> & { id: string }) => {
      const { data, error } = await supabase
        .from("kendaraan_mitra")
        .update(kendaraanData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan"] });
      toast({ title: "Data kendaraan berhasil diperbarui" });
    },
    onError: (error) => {
      toast({ title: "Gagal memperbarui kendaraan", description: error.message, variant: "destructive" });
    },
  });
}

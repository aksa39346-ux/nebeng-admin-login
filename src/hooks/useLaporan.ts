import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StatusType } from "./useUsers";

export interface Laporan {
  id: string;
  pelapor_id: string;
  dilaporkan_id: string;
  booking_id: string | null;
  jenis_laporan: string;
  deskripsi: string;
  bukti: string | null;
  status: StatusType;
  hasil_investigasi: string | null;
  created_at: string;
  updated_at: string;
}

export interface LaporanWithDetails extends Laporan {
  pelapor?: {
    id: string;
    nama: string;
    email: string;
    role: string;
  };
  dilaporkan?: {
    id: string;
    nama: string;
    email: string;
    role: string;
  };
}

export function useLaporanList() {
  return useQuery({
    queryKey: ["laporan"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("laporan")
        .select(`
          *,
          pelapor:users!laporan_pelapor_id_fkey (id, nama, email, role),
          dilaporkan:users!laporan_dilaporkan_id_fkey (id, nama, email, role)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as LaporanWithDetails[];
    },
  });
}

export function useLaporanDetail(id: string) {
  return useQuery({
    queryKey: ["laporan", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("laporan")
        .select(`
          *,
          pelapor:users!laporan_pelapor_id_fkey (id, nama, email, role),
          dilaporkan:users!laporan_dilaporkan_id_fkey (id, nama, email, role)
        `)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as LaporanWithDetails | null;
    },
    enabled: !!id,
  });
}

export function useUpdateLaporan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      hasil_investigasi 
    }: { 
      id: string; 
      status?: StatusType; 
      hasil_investigasi?: string;
    }) => {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (hasil_investigasi) updateData.hasil_investigasi = hasil_investigasi;

      const { data, error } = await supabase
        .from("laporan")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laporan"] });
      toast({ title: "Laporan berhasil diperbarui" });
    },
    onError: (error) => {
      toast({ title: "Gagal memperbarui laporan", description: error.message, variant: "destructive" });
    },
  });
}

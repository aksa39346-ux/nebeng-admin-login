import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StatusType } from "./useUsers";

export interface Refund {
  id: string;
  booking_id: string;
  customer_id: string;
  jumlah_refund: number;
  alasan: string | null;
  status: StatusType;
  tanggal_pengajuan: string;
  tanggal_selesai: string | null;
  created_at: string;
  updated_at: string;
}

export interface RefundWithDetails extends Refund {
  customer?: {
    id: string;
    nama: string;
    email: string;
    no_hp: string | null;
    foto_profil: string | null;
  };
  booking?: {
    id: string;
    total_harga: number;
    status: string;
    tebengan?: {
      lokasi_jemput: string;
      lokasi_tujuan: string;
      tanggal_berangkat: string;
    };
  };
}

export function useRefunds() {
  return useQuery({
    queryKey: ["refunds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("refunds")
        .select(`
          *,
          customer:customer_id (id, nama, email, no_hp, foto_profil),
          booking:booking_id (
            id, total_harga, status,
            tebengan:tebengan_id (lokasi_jemput, lokasi_tujuan, tanggal_berangkat)
          )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as RefundWithDetails[];
    },
  });
}

export function useRefund(id: string) {
  return useQuery({
    queryKey: ["refund", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("refunds")
        .select(`
          *,
          customer:customer_id (id, nama, email, no_hp, foto_profil),
          booking:booking_id (
            id, total_harga, status,
            tebengan:tebengan_id (lokasi_jemput, lokasi_tujuan, tanggal_berangkat)
          )
        `)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as RefundWithDetails | null;
    },
    enabled: !!id,
  });
}

export function useUpdateRefundStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StatusType }) => {
      const updateData: any = { status };
      if (status === "aktif") {
        updateData.tanggal_selesai = new Date().toISOString();
      }
      
      const { data, error } = await supabase
        .from("refunds")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      toast({ title: "Status refund berhasil diperbarui" });
    },
    onError: (error) => {
      toast({ title: "Gagal memperbarui status", description: error.message, variant: "destructive" });
    },
  });
}

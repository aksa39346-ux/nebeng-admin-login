import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  id: string;
  user_id: string | null;
  booking_id: string | null;
  jumlah: number;
  metode_pembayaran: string | null;
  status: PaymentStatus;
  tanggal_pembayaran: string | null;
  keterangan: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentWithDetails extends Payment {
  user?: {
    id: string;
    nama: string;
    email: string;
  };
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          user:user_id (id, nama, email)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PaymentWithDetails[];
    },
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          user:user_id (id, nama, email)
        `)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as PaymentWithDetails | null;
    },
    enabled: !!id,
  });
}

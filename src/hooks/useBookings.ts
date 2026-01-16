import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  tebengan_id: string;
  customer_id: string;
  mitra_id: string;
  jumlah_penumpang: number;
  total_harga: number;
  status: BookingStatus;
  tanggal_booking: string;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingWithDetails extends Booking {
  customer?: {
    id: string;
    nama: string;
    email: string;
    no_hp: string | null;
    foto_profil: string | null;
  };
  mitra?: {
    id: string;
    nama: string;
    email: string;
    no_hp: string | null;
    foto_profil: string | null;
  };
  tebengan?: {
    id: string;
    jenis: string;
    lokasi_jemput: string;
    lokasi_tujuan: string;
    tanggal_berangkat: string;
    waktu_berangkat: string;
    harga: number;
  };
}

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          customer:users!bookings_customer_id_fkey (id, nama, email, no_hp, foto_profil),
          mitra:users!bookings_mitra_id_fkey (id, nama, email, no_hp, foto_profil),
          tebengan:tebengan_id (id, jenis, lokasi_jemput, lokasi_tujuan, tanggal_berangkat, waktu_berangkat, harga)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as BookingWithDetails[];
    },
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          customer:users!bookings_customer_id_fkey (id, nama, email, no_hp, foto_profil),
          mitra:users!bookings_mitra_id_fkey (id, nama, email, no_hp, foto_profil),
          tebengan:tebengan_id (id, jenis, lokasi_jemput, lokasi_tujuan, tanggal_berangkat, waktu_berangkat, harga)
        `)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as BookingWithDetails | null;
    },
    enabled: !!id,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({ title: "Status booking berhasil diperbarui" });
    },
    onError: (error) => {
      toast({ title: "Gagal memperbarui status", description: error.message, variant: "destructive" });
    },
  });
}

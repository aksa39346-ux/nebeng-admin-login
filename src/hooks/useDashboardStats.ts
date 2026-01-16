import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalCustomers: number;
  totalMitras: number;
  totalBookings: number;
  totalRefunds: number;
  pendingVerifikasi: number;
  activeTebengan: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [
        customersResult,
        mitrasResult,
        bookingsResult,
        refundsResult,
        verifikasiResult,
        tebenganResult,
      ] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "customer"),
        supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "mitra"),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("refunds").select("id", { count: "exact", head: true }),
        supabase.from("verifikasi_ktp").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("tebengan").select("id", { count: "exact", head: true }).eq("status", "aktif"),
      ]);

      return {
        totalCustomers: customersResult.count || 0,
        totalMitras: mitrasResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalRefunds: refundsResult.count || 0,
        pendingVerifikasi: verifikasiResult.count || 0,
        activeTebengan: tebenganResult.count || 0,
      } as DashboardStats;
    },
  });
}

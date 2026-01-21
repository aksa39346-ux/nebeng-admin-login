export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          catatan: string | null
          created_at: string
          customer_id: string
          id: string
          jumlah_penumpang: number
          mitra_id: string
          status: Database["public"]["Enums"]["booking_status"]
          tanggal_booking: string
          tebengan_id: string
          total_harga: number
          updated_at: string
        }
        Insert: {
          catatan?: string | null
          created_at?: string
          customer_id: string
          id?: string
          jumlah_penumpang?: number
          mitra_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          tanggal_booking?: string
          tebengan_id: string
          total_harga: number
          updated_at?: string
        }
        Update: {
          catatan?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          jumlah_penumpang?: number
          mitra_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          tanggal_booking?: string
          tebengan_id?: string
          total_harga?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_mitra_id_fkey"
            columns: ["mitra_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tebengan_id_fkey"
            columns: ["tebengan_id"]
            isOneToOne: false
            referencedRelation: "tebengan"
            referencedColumns: ["id"]
          },
        ]
      }
      kendaraan_mitra: {
        Row: {
          created_at: string
          foto_kendaraan: string | null
          foto_stnk: string | null
          id: string
          jenis_kendaraan: string
          merk: string
          mitra_id: string
          model: string
          plat_nomor: string
          status: Database["public"]["Enums"]["status_type"]
          tahun: number | null
          updated_at: string
          warna: string | null
        }
        Insert: {
          created_at?: string
          foto_kendaraan?: string | null
          foto_stnk?: string | null
          id?: string
          jenis_kendaraan: string
          merk: string
          mitra_id: string
          model: string
          plat_nomor: string
          status?: Database["public"]["Enums"]["status_type"]
          tahun?: number | null
          updated_at?: string
          warna?: string | null
        }
        Update: {
          created_at?: string
          foto_kendaraan?: string | null
          foto_stnk?: string | null
          id?: string
          jenis_kendaraan?: string
          merk?: string
          mitra_id?: string
          model?: string
          plat_nomor?: string
          status?: Database["public"]["Enums"]["status_type"]
          tahun?: number | null
          updated_at?: string
          warna?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kendaraan_mitra_mitra_id_fkey"
            columns: ["mitra_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      laporan: {
        Row: {
          booking_id: string | null
          bukti: string | null
          created_at: string
          deskripsi: string
          dilaporkan_id: string
          hasil_investigasi: string | null
          id: string
          jenis_laporan: string
          pelapor_id: string
          status: Database["public"]["Enums"]["status_type"]
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          bukti?: string | null
          created_at?: string
          deskripsi: string
          dilaporkan_id: string
          hasil_investigasi?: string | null
          id?: string
          jenis_laporan: string
          pelapor_id: string
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          bukti?: string | null
          created_at?: string
          deskripsi?: string
          dilaporkan_id?: string
          hasil_investigasi?: string | null
          id?: string
          jenis_laporan?: string
          pelapor_id?: string
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "laporan_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laporan_dilaporkan_id_fkey"
            columns: ["dilaporkan_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laporan_pelapor_id_fkey"
            columns: ["pelapor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          jumlah: number
          keterangan: string | null
          metode_pembayaran: string | null
          status: Database["public"]["Enums"]["payment_status"]
          tanggal_pembayaran: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          jumlah: number
          keterangan?: string | null
          metode_pembayaran?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          tanggal_pembayaran?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          jumlah?: number
          keterangan?: string | null
          metode_pembayaran?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          tanggal_pembayaran?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          alasan: string | null
          booking_id: string
          created_at: string
          customer_id: string
          id: string
          jumlah_refund: number
          status: Database["public"]["Enums"]["status_type"]
          tanggal_pengajuan: string
          tanggal_selesai: string | null
          updated_at: string
        }
        Insert: {
          alasan?: string | null
          booking_id: string
          created_at?: string
          customer_id: string
          id?: string
          jumlah_refund: number
          status?: Database["public"]["Enums"]["status_type"]
          tanggal_pengajuan?: string
          tanggal_selesai?: string | null
          updated_at?: string
        }
        Update: {
          alasan?: string | null
          booking_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          jumlah_refund?: number
          status?: Database["public"]["Enums"]["status_type"]
          tanggal_pengajuan?: string
          tanggal_selesai?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tebengan: {
        Row: {
          created_at: string
          deskripsi: string | null
          harga: number
          id: string
          jenis: string
          kapasitas: number
          kapasitas_terisi: number
          lokasi_jemput: string
          lokasi_tujuan: string
          mitra_id: string
          status: Database["public"]["Enums"]["status_type"]
          tanggal_berangkat: string
          updated_at: string
          waktu_berangkat: string
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          harga: number
          id?: string
          jenis: string
          kapasitas?: number
          kapasitas_terisi?: number
          lokasi_jemput: string
          lokasi_tujuan: string
          mitra_id: string
          status?: Database["public"]["Enums"]["status_type"]
          tanggal_berangkat: string
          updated_at?: string
          waktu_berangkat: string
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          harga?: number
          id?: string
          jenis?: string
          kapasitas?: number
          kapasitas_terisi?: number
          lokasi_jemput?: string
          lokasi_tujuan?: string
          mitra_id?: string
          status?: Database["public"]["Enums"]["status_type"]
          tanggal_berangkat?: string
          updated_at?: string
          waktu_berangkat?: string
        }
        Relationships: [
          {
            foreignKeyName: "tebengan_mitra_id_fkey"
            columns: ["mitra_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          alamat: string | null
          created_at: string
          email: string
          foto_profil: string | null
          id: string
          nama: string
          no_hp: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["status_type"]
          tanggal_lahir: string | null
          updated_at: string
        }
        Insert: {
          alamat?: string | null
          created_at?: string
          email: string
          foto_profil?: string | null
          id?: string
          nama: string
          no_hp?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["status_type"]
          tanggal_lahir?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string | null
          created_at?: string
          email?: string
          foto_profil?: string | null
          id?: string
          nama?: string
          no_hp?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["status_type"]
          tanggal_lahir?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      verifikasi_ktp: {
        Row: {
          alamat_ktp: string | null
          catatan: string | null
          created_at: string
          foto_ktp: string | null
          foto_selfie: string | null
          id: string
          jenis_kelamin: string | null
          nama_ktp: string
          no_ktp: string
          status: Database["public"]["Enums"]["verification_status"]
          tanggal_lahir_ktp: string | null
          tempat_lahir: string | null
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          alamat_ktp?: string | null
          catatan?: string | null
          created_at?: string
          foto_ktp?: string | null
          foto_selfie?: string | null
          id?: string
          jenis_kelamin?: string | null
          nama_ktp: string
          no_ktp: string
          status?: Database["public"]["Enums"]["verification_status"]
          tanggal_lahir_ktp?: string | null
          tempat_lahir?: string | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          alamat_ktp?: string | null
          catatan?: string | null
          created_at?: string
          foto_ktp?: string | null
          foto_selfie?: string | null
          id?: string
          jenis_kelamin?: string | null
          nama_ktp?: string
          no_ktp?: string
          status?: Database["public"]["Enums"]["verification_status"]
          tanggal_lahir_ktp?: string | null
          tempat_lahir?: string | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verifikasi_ktp_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      status_type:
        | "aktif"
        | "tidak aktif"
        | "blokir"
        | "proses"
        | "selesai"
        | "ditolak"
      user_role: "customer" | "mitra"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      status_type: [
        "aktif",
        "tidak aktif",
        "blokir",
        "proses",
        "selesai",
        "ditolak",
      ],
      user_role: ["customer", "mitra"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const

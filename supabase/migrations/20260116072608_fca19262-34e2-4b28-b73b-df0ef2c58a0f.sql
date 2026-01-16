-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('customer', 'mitra');

-- Create enum for status
CREATE TYPE public.status_type AS ENUM ('aktif', 'tidak aktif', 'blokir', 'proses');

-- Create enum for verification status
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create users table
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nama TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    no_hp TEXT,
    alamat TEXT,
    tanggal_lahir DATE,
    role user_role NOT NULL DEFAULT 'customer',
    status status_type NOT NULL DEFAULT 'aktif',
    foto_profil TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kendaraan_mitra table
CREATE TABLE public.kendaraan_mitra (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    mitra_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    jenis_kendaraan TEXT NOT NULL,
    merk TEXT NOT NULL,
    model TEXT NOT NULL,
    tahun INTEGER,
    warna TEXT,
    plat_nomor TEXT NOT NULL,
    foto_kendaraan TEXT,
    foto_stnk TEXT,
    status status_type NOT NULL DEFAULT 'aktif',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verifikasi_ktp table (for both customer and mitra)
CREATE TABLE public.verifikasi_ktp (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    no_ktp TEXT NOT NULL,
    nama_ktp TEXT NOT NULL,
    alamat_ktp TEXT,
    tempat_lahir TEXT,
    tanggal_lahir_ktp DATE,
    jenis_kelamin TEXT,
    foto_ktp TEXT,
    foto_selfie TEXT,
    status verification_status NOT NULL DEFAULT 'pending',
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    booking_id UUID,
    jumlah DECIMAL(12,2) NOT NULL,
    metode_pembayaran TEXT,
    status payment_status NOT NULL DEFAULT 'pending',
    tanggal_pembayaran TIMESTAMP WITH TIME ZONE,
    keterangan TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tebengan (ride sharing) table
CREATE TABLE public.tebengan (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    mitra_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    jenis TEXT NOT NULL, -- motor, mobil, barang
    lokasi_jemput TEXT NOT NULL,
    lokasi_tujuan TEXT NOT NULL,
    tanggal_berangkat DATE NOT NULL,
    waktu_berangkat TIME NOT NULL,
    harga DECIMAL(12,2) NOT NULL,
    kapasitas INTEGER NOT NULL DEFAULT 1,
    kapasitas_terisi INTEGER NOT NULL DEFAULT 0,
    deskripsi TEXT,
    status status_type NOT NULL DEFAULT 'aktif',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking table
CREATE TABLE public.bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tebengan_id UUID REFERENCES public.tebengan(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    mitra_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    jumlah_penumpang INTEGER NOT NULL DEFAULT 1,
    total_harga DECIMAL(12,2) NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    tanggal_booking TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create refunds table
CREATE TABLE public.refunds (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    jumlah_refund DECIMAL(12,2) NOT NULL,
    alasan TEXT,
    status status_type NOT NULL DEFAULT 'proses',
    tanggal_pengajuan TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    tanggal_selesai TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create laporan (reports) table
CREATE TABLE public.laporan (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pelapor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    dilaporkan_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    jenis_laporan TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    bukti TEXT,
    status status_type NOT NULL DEFAULT 'proses',
    hasil_investigasi TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kendaraan_mitra ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifikasi_ktp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tebengan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users (public read for basic info)
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for kendaraan_mitra
CREATE POLICY "Kendaraan viewable by everyone" ON public.kendaraan_mitra FOR SELECT USING (true);
CREATE POLICY "Mitra can manage own kendaraan" ON public.kendaraan_mitra FOR ALL USING (auth.uid()::text = mitra_id::text);

-- Create RLS policies for verifikasi_ktp (admin only)
CREATE POLICY "Verifikasi viewable by owner" ON public.verifikasi_ktp FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own verifikasi" ON public.verifikasi_ktp FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create RLS policies for payments
CREATE POLICY "Payments viewable by involved parties" ON public.payments FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create RLS policies for tebengan
CREATE POLICY "Tebengan viewable by everyone" ON public.tebengan FOR SELECT USING (true);
CREATE POLICY "Mitra can manage own tebengan" ON public.tebengan FOR ALL USING (auth.uid()::text = mitra_id::text);

-- Create RLS policies for bookings
CREATE POLICY "Bookings viewable by involved parties" ON public.bookings FOR SELECT 
  USING (auth.uid()::text = customer_id::text OR auth.uid()::text = mitra_id::text);
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- Create RLS policies for refunds
CREATE POLICY "Refunds viewable by owner" ON public.refunds FOR SELECT USING (auth.uid()::text = customer_id::text);
CREATE POLICY "Customers can request refunds" ON public.refunds FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- Create RLS policies for laporan
CREATE POLICY "Laporan viewable by reporter" ON public.laporan FOR SELECT USING (auth.uid()::text = pelapor_id::text);
CREATE POLICY "Users can create laporan" ON public.laporan FOR INSERT WITH CHECK (auth.uid()::text = pelapor_id::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kendaraan_updated_at BEFORE UPDATE ON public.kendaraan_mitra FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_verifikasi_updated_at BEFORE UPDATE ON public.verifikasi_ktp FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tebengan_updated_at BEFORE UPDATE ON public.tebengan FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_refunds_updated_at BEFORE UPDATE ON public.refunds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_laporan_updated_at BEFORE UPDATE ON public.laporan FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_roles table for admin management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin policies for all tables
CREATE POLICY "Admin full access users" ON public.users FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access kendaraan" ON public.kendaraan_mitra FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access verifikasi" ON public.verifikasi_ktp FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access payments" ON public.payments FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access tebengan" ON public.tebengan FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access bookings" ON public.bookings FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access refunds" ON public.refunds FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin full access laporan" ON public.laporan FOR ALL USING (public.has_role(auth.uid(), 'admin'));
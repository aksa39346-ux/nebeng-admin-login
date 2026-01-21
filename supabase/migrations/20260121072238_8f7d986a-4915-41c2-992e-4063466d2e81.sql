-- Tambahkan nilai baru ke enum status_type
ALTER TYPE public.status_type ADD VALUE IF NOT EXISTS 'selesai';
ALTER TYPE public.status_type ADD VALUE IF NOT EXISTS 'ditolak';
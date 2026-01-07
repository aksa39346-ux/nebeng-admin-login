import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Edit, Calendar, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// Dummy data dengan 3 status berbeda
const mitraDetailData: Record<string, {
  id: string;
  nama: string;
  layanan: string;
  kode: string;
  status: "PENGAJUAN" | "TERVERIFIKASI" | "DITOLAK";
  informasiPribadi: {
    namaLengkap: string;
    email: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: string;
    noTlp: string;
  };
  informasiKTP: {
    namaLengkap: string;
    nik: string;
    jenisKelamin: string;
    tanggalLahir: string;
    fotoKTP: string;
  };
  informasiSIM: {
    namaLengkap: string;
    nomorSIM: string;
    jenisKelamin: string;
    tanggalLahir: string;
    fotoSIM: string;
  };
}> = {
  "100001": {
    id: "100001",
    nama: "Muhammad Abdul",
    layanan: "Nebeng Motor",
    kode: "001235",
    status: "PENGAJUAN",
    informasiPribadi: {
      namaLengkap: "Muhammad Abdul Kadir",
      email: "100098360470019",
      tempatLahir: "London",
      tanggalLahir: "01-02-1999",
      jenisKelamin: "Laki - Laki",
      noTlp: "100098360470019",
    },
    informasiKTP: {
      namaLengkap: "Muhammad Abdul Kadir",
      nik: "100098360470019",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "01-02-1999",
      fotoKTP: "/placeholder.svg",
    },
    informasiSIM: {
      namaLengkap: "Muhammad Abdul Kadir",
      nomorSIM: "100098360470019",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "01-02-1999",
      fotoSIM: "/placeholder.svg",
    },
  },
  "100002": {
    id: "100002",
    nama: "Ahmad Rizki",
    layanan: "Nebeng Mobil",
    kode: "001236",
    status: "TERVERIFIKASI",
    informasiPribadi: {
      namaLengkap: "Ahmad Rizki Pratama",
      email: "ahmad.rizki@gmail.com",
      tempatLahir: "Jakarta",
      tanggalLahir: "15-05-1995",
      jenisKelamin: "Laki - Laki",
      noTlp: "081234567890",
    },
    informasiKTP: {
      namaLengkap: "Ahmad Rizki Pratama",
      nik: "3201234567890001",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "15-05-1995",
      fotoKTP: "/placeholder.svg",
    },
    informasiSIM: {
      namaLengkap: "Ahmad Rizki Pratama",
      nomorSIM: "1234567890123456",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "15-05-1995",
      fotoSIM: "/placeholder.svg",
    },
  },
  "100003": {
    id: "100003",
    nama: "Budi Santoso",
    layanan: "Titip Barang",
    kode: "001237",
    status: "DITOLAK",
    informasiPribadi: {
      namaLengkap: "Budi Santoso",
      email: "budi.santoso@gmail.com",
      tempatLahir: "Bandung",
      tanggalLahir: "20-08-1992",
      jenisKelamin: "Laki - Laki",
      noTlp: "082345678901",
    },
    informasiKTP: {
      namaLengkap: "Budi Santoso",
      nik: "3202345678900002",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "20-08-1992",
      fotoKTP: "/placeholder.svg",
    },
    informasiSIM: {
      namaLengkap: "Budi Santoso",
      nomorSIM: "2345678901234567",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "20-08-1992",
      fotoSIM: "/placeholder.svg",
    },
  },
};

const getStatusBadge = (status: "PENGAJUAN" | "TERVERIFIKASI" | "DITOLAK") => {
  switch (status) {
    case "PENGAJUAN":
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">Pengajuan</Badge>;
    case "TERVERIFIKASI":
      return <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">Terverifikasi</Badge>;
    case "DITOLAK":
      return <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">Ditolak</Badge>;
    default:
      return null;
  }
};

const DetailMitra = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const mitra = id ? mitraDetailData[id] : null;
  
  if (!mitra) {
    return (
      <div className="p-6">
        <p>Data mitra tidak ditemukan</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ChevronLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Detail Data Mitra</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-muted text-lg">
                  {mitra.nama.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{mitra.nama}</h2>
              <p className="text-muted-foreground text-sm">{mitra.layanan}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-primary font-medium">{mitra.kode}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <div className="mt-2">
                {getStatusBadge(mitra.status)}
              </div>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <span>Edit</span>
            <Edit size={16} />
          </Button>
        </div>

        {/* Informasi Pribadi */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Informasi Pribadi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Nama Lengkap</label>
              <Input value={mitra.informasiPribadi.namaLengkap} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input value={mitra.informasiPribadi.email} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tempat Lahir</label>
              <Input value={mitra.informasiPribadi.tempatLahir} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tanggal Lahir</label>
              <div className="relative mt-1">
                <Input value={mitra.informasiPribadi.tanggalLahir} readOnly className="bg-muted/50 pr-10" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
              <Input value={mitra.informasiPribadi.jenisKelamin} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">No. Tlp</label>
              <Input value={mitra.informasiPribadi.noTlp} readOnly className="mt-1 bg-muted/50" />
            </div>
          </div>
        </div>

        {/* Informasi KTP */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Informasi KTP</h3>
          <div className="flex gap-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                <Input value={mitra.informasiKTP.namaLengkap} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">NIK</label>
                <Input value={mitra.informasiKTP.nik} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
                <Input value={mitra.informasiKTP.jenisKelamin} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Tangal Lahir</label>
                <div className="relative mt-1">
                  <Input value={mitra.informasiKTP.tanggalLahir} readOnly className="bg-muted/50 pr-10" />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
            </div>
            <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden border">
              <img src={mitra.informasiKTP.fotoKTP} alt="KTP" className="w-full h-full object-cover" />
              <div className="absolute bottom-1 left-1 bg-primary/80 rounded-full p-1">
                <SearchIcon size={12} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Informasi SIM */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Informasi SIM</h3>
          <div className="flex gap-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                <Input value={mitra.informasiSIM.namaLengkap} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Nomor SIM</label>
                <Input value={mitra.informasiSIM.nomorSIM} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
                <Input value={mitra.informasiSIM.jenisKelamin} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Tangal Lahir</label>
                <div className="relative mt-1">
                  <Input value={mitra.informasiSIM.tanggalLahir} readOnly className="bg-muted/50 pr-10" />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
            </div>
            <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden border">
              <img src={mitra.informasiSIM.fotoSIM} alt="SIM" className="w-full h-full object-cover" />
              <div className="absolute bottom-1 left-1 bg-primary/80 rounded-full p-1">
                <SearchIcon size={12} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMitra;

import { createContext, useContext, useState, ReactNode } from "react";

export interface MitraData {
  id: string;
  nama: string;
  email: string;
  noTlp: string;
  layanan: string;
  status: string;
  tanggal: Date;
}

export interface MitraDetailData {
  id: string;
  nama: string;
  layanan: string;
  kode: string;
  status: "PENGAJUAN" | "TERVERIFIKASI" | "DITOLAK" | "DIBLOCK";
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
}

// Initial list data
const initialMitraList: MitraData[] = [
  { id: "100001", nama: "Muhammad Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Motor", status: "PENGAJUAN", tanggal: new Date(2024, 0, 15) },
  { id: "100002", nama: "Ahmad Rizki", email: "ahmad.rizki@gmail.com", noTlp: "081234567890", layanan: "Mobil", status: "TERVERIFIKASI", tanggal: new Date(2024, 0, 20) },
  { id: "100003", nama: "Budi Santoso", email: "budi.santoso@gmail.com", noTlp: "082345678901", layanan: "Titip Barang", status: "DITOLAK", tanggal: new Date(2024, 1, 5) },
  { id: "100004", nama: "Dewi Kartika", email: "dewi.k@gmail.com", noTlp: "083456789012", layanan: "Motor", status: "PENGAJUAN", tanggal: new Date(2024, 1, 10) },
  { id: "100005", nama: "Eko Prasetyo", email: "eko.pras@gmail.com", noTlp: "084567890123", layanan: "Mobil", status: "TERVERIFIKASI", tanggal: new Date(2024, 1, 15) },
  { id: "100006", nama: "Fitri Handayani", email: "fitri.h@gmail.com", noTlp: "085678901234", layanan: "Barang", status: "DITOLAK", tanggal: new Date(2024, 2, 1) },
  { id: "100007", nama: "Gilang Ramadhan", email: "gilang.r@gmail.com", noTlp: "086789012345", layanan: "Motor", status: "PENGAJUAN", tanggal: new Date(2024, 2, 10) },
  { id: "100008", nama: "Hendra Wijaya", email: "hendra.w@gmail.com", noTlp: "087890123456", layanan: "Mobil", status: "TERVERIFIKASI", tanggal: new Date(2024, 2, 15) },
  { id: "100009", nama: "Indah Permata", email: "indah.p@gmail.com", noTlp: "088901234567", layanan: "Motor", status: "PENGAJUAN", tanggal: new Date(2024, 3, 1) },
  { id: "100010", nama: "Joko Susilo", email: "joko.s@gmail.com", noTlp: "089012345678", layanan: "Barang", status: "DITOLAK", tanggal: new Date(2024, 3, 5) },
];

// Initial detail data
const initialMitraDetail: Record<string, MitraDetailData> = {
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
  "100004": {
    id: "100004",
    nama: "Dewi Kartika",
    layanan: "Nebeng Motor",
    kode: "001238",
    status: "PENGAJUAN",
    informasiPribadi: {
      namaLengkap: "Dewi Kartika Sari",
      email: "dewi.k@gmail.com",
      tempatLahir: "Surabaya",
      tanggalLahir: "10-03-1994",
      jenisKelamin: "Perempuan",
      noTlp: "083456789012",
    },
    informasiKTP: {
      namaLengkap: "Dewi Kartika Sari",
      nik: "3203456789000003",
      jenisKelamin: "Perempuan",
      tanggalLahir: "10-03-1994",
      fotoKTP: "/placeholder.svg",
    },
    informasiSIM: {
      namaLengkap: "Dewi Kartika Sari",
      nomorSIM: "3456789012345678",
      jenisKelamin: "Perempuan",
      tanggalLahir: "10-03-1994",
      fotoSIM: "/placeholder.svg",
    },
  },
  "100005": {
    id: "100005",
    nama: "Eko Prasetyo",
    layanan: "Nebeng Mobil",
    kode: "001239",
    status: "TERVERIFIKASI",
    informasiPribadi: {
      namaLengkap: "Eko Prasetyo",
      email: "eko.pras@gmail.com",
      tempatLahir: "Semarang",
      tanggalLahir: "25-07-1990",
      jenisKelamin: "Laki - Laki",
      noTlp: "084567890123",
    },
    informasiKTP: {
      namaLengkap: "Eko Prasetyo",
      nik: "3204567890000004",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "25-07-1990",
      fotoKTP: "/placeholder.svg",
    },
    informasiSIM: {
      namaLengkap: "Eko Prasetyo",
      nomorSIM: "4567890123456789",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "25-07-1990",
      fotoSIM: "/placeholder.svg",
    },
  },
  "100006": {
    id: "100006",
    nama: "Fitri Handayani",
    layanan: "Titip Barang",
    kode: "001240",
    status: "DITOLAK",
    informasiPribadi: {
      namaLengkap: "Fitri Handayani",
      email: "fitri.h@gmail.com",
      tempatLahir: "Yogyakarta",
      tanggalLahir: "12-11-1993",
      jenisKelamin: "Perempuan",
      noTlp: "085678901234",
    },
    informasiKTP: {
      namaLengkap: "Fitri Handayani",
      nik: "3205678901000005",
      jenisKelamin: "Perempuan",
      tanggalLahir: "12-11-1993",
      fotoKTP: "/placeholder.svg",
    },
    informasiSIM: {
      namaLengkap: "Fitri Handayani",
      nomorSIM: "5678901234567890",
      jenisKelamin: "Perempuan",
      tanggalLahir: "12-11-1993",
      fotoSIM: "/placeholder.svg",
    },
  },
  "100007": {
    id: "100007",
    nama: "Gilang Ramadhan",
    layanan: "Nebeng Motor",
    kode: "001241",
    status: "PENGAJUAN",
    informasiPribadi: {
      namaLengkap: "Gilang Ramadhan",
      email: "gilang.r@gmail.com",
      tempatLahir: "Malang",
      tanggalLahir: "05-04-1996",
      jenisKelamin: "Laki - Laki",
      noTlp: "086789012345",
    },
    informasiKTP: {
      namaLengkap: "Gilang Ramadhan",
      nik: "3206789012000006",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "05-04-1996",
      fotoKTP: "/placeholder.svg",
    },
    informasiSIM: {
      namaLengkap: "Gilang Ramadhan",
      nomorSIM: "6789012345678901",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "05-04-1996",
      fotoSIM: "/placeholder.svg",
    },
  },
  "100008": {
    id: "100008",
    nama: "Hendra Wijaya",
    layanan: "Nebeng Mobil",
    kode: "001242",
    status: "TERVERIFIKASI",
    informasiPribadi: {
      namaLengkap: "Hendra Wijaya",
      email: "hendra.w@gmail.com",
      tempatLahir: "Surabaya",
      tanggalLahir: "18-09-1991",
      jenisKelamin: "Laki - Laki",
      noTlp: "087890123456",
    },
    informasiKTP: {
      namaLengkap: "Hendra Wijaya",
      nik: "3207890123000007",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "18-09-1991",
      fotoKTP: "/placeholder.svg",
    },
    informasiSIM: {
      namaLengkap: "Hendra Wijaya",
      nomorSIM: "7890123456789012",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "18-09-1991",
      fotoSIM: "/placeholder.svg",
    },
  },
  "100009": {
    id: "100009",
    nama: "Indah Permata",
    layanan: "Nebeng Motor",
    kode: "001243",
    status: "PENGAJUAN",
    informasiPribadi: {
      namaLengkap: "Indah Permata",
      email: "indah.p@gmail.com",
      tempatLahir: "Bandung",
      tanggalLahir: "22-06-1997",
      jenisKelamin: "Perempuan",
      noTlp: "088901234567",
    },
    informasiKTP: {
      namaLengkap: "Indah Permata",
      nik: "3208901234000008",
      jenisKelamin: "Perempuan",
      tanggalLahir: "22-06-1997",
      fotoKTP: "/placeholder.svg",
    },
    informasiSIM: {
      namaLengkap: "Indah Permata",
      nomorSIM: "8901234567890123",
      jenisKelamin: "Perempuan",
      tanggalLahir: "22-06-1997",
      fotoSIM: "/placeholder.svg",
    },
  },
  "100010": {
    id: "100010",
    nama: "Joko Susilo",
    layanan: "Titip Barang",
    kode: "001244",
    status: "DITOLAK",
    informasiPribadi: {
      namaLengkap: "Joko Susilo",
      email: "joko.s@gmail.com",
      tempatLahir: "Solo",
      tanggalLahir: "30-12-1988",
      jenisKelamin: "Laki - Laki",
      noTlp: "089012345678",
    },
    informasiKTP: {
      namaLengkap: "Joko Susilo",
      nik: "3209012345000009",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "30-12-1988",
      fotoKTP: "/placeholder.svg",
    },
    informasiSIM: {
      namaLengkap: "Joko Susilo",
      nomorSIM: "9012345678901234",
      jenisKelamin: "Laki - Laki",
      tanggalLahir: "30-12-1988",
      fotoSIM: "/placeholder.svg",
    },
  },
};

interface MitraContextType {
  mitraList: MitraData[];
  mitraDetail: Record<string, MitraDetailData>;
  blockMitra: (id: string) => void;
  updateMitraStatus: (id: string, status: "PENGAJUAN" | "TERVERIFIKASI" | "DITOLAK" | "DIBLOCK") => void;
}

const MitraContext = createContext<MitraContextType | undefined>(undefined);

export const MitraProvider = ({ children }: { children: ReactNode }) => {
  const [mitraList, setMitraList] = useState<MitraData[]>(initialMitraList);
  const [mitraDetail, setMitraDetail] = useState<Record<string, MitraDetailData>>(initialMitraDetail);

  const blockMitra = (id: string) => {
    // Update list
    setMitraList(prev => 
      prev.map(mitra => 
        mitra.id === id ? { ...mitra, status: "DIBLOCK" } : mitra
      )
    );
    
    // Update detail
    setMitraDetail(prev => {
      if (prev[id]) {
        return {
          ...prev,
          [id]: { ...prev[id], status: "DIBLOCK" }
        };
      }
      return prev;
    });
  };

  const updateMitraStatus = (id: string, status: "PENGAJUAN" | "TERVERIFIKASI" | "DITOLAK" | "DIBLOCK") => {
    // Update list
    setMitraList(prev => 
      prev.map(mitra => 
        mitra.id === id ? { ...mitra, status } : mitra
      )
    );
    
    // Update detail
    setMitraDetail(prev => {
      if (prev[id]) {
        return {
          ...prev,
          [id]: { ...prev[id], status }
        };
      }
      return prev;
    });
  };

  return (
    <MitraContext.Provider value={{ mitraList, mitraDetail, blockMitra, updateMitraStatus }}>
      {children}
    </MitraContext.Provider>
  );
};

export const useMitra = () => {
  const context = useContext(MitraContext);
  if (!context) {
    throw new Error("useMitra must be used within a MitraProvider");
  }
  return context;
};

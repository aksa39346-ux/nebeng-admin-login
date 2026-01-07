import React, { createContext, useContext, useState, ReactNode } from "react";

export interface LaporanData {
  id: string;
  noOrder: string;
  namaCustomer: string;
  tanggal: Date;
  layanan: string;
  laporan: string;
  // Customer info
  customerAvatar?: string;
  customerPhone: string;
  customerNote: string;
  // Mitra info
  mitraId: string;
  namaMitra: string;
  mitraAvatar?: string;
  mitraPhone: string;
  mitraKendaraan: string;
  mitraMerkKendaraan: string;
  mitraPlatNomor: string;
  // Mitra personal info for detail
  mitraEmail: string;
  mitraTempatLahir: string;
  mitraTanggalLahir: string;
  mitraJenisKelamin: string;
}

interface LaporanContextType {
  laporanList: LaporanData[];
  getLaporanDetail: (id: string) => LaporanData | undefined;
  updateLaporan: (id: string, laporan: string) => void;
}

const LaporanContext = createContext<LaporanContextType | undefined>(undefined);

// Sample data
const initialLaporanData: LaporanData[] = [
  {
    id: "L001",
    noOrder: "0091",
    namaCustomer: "Clara Aulia",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Customer mencantukan alamat yang tidak ditemukan di peta dan tidak memberikan petunjuk tambahan lokasi.",
    customerPhone: "089373933994",
    customerNote: "Jika sudah di tik, maju lagi sedikit yah mas.",
    mitraId: "001235",
    namaMitra: "Muhammad Abdul",
    mitraPhone: "089373933994",
    mitraKendaraan: "Mobil",
    mitraMerkKendaraan: "TOYOTA",
    mitraPlatNomor: "B 4949 MBH",
    mitraEmail: "10009836047019",
    mitraTempatLahir: "London",
    mitraTanggalLahir: "01-02-1999",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L002",
    noOrder: "0091",
    namaCustomer: "Muhammda Abdul",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Customer mencantukan alamat yang...",
    customerPhone: "089373933994",
    customerNote: "Tolong hubungi saya kalau sudah sampai.",
    mitraId: "001236",
    namaMitra: "Ahmad Fauzi",
    mitraPhone: "089373933995",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "HONDA",
    mitraPlatNomor: "B 1234 ABC",
    mitraEmail: "10009836047020",
    mitraTempatLahir: "Jakarta",
    mitraTanggalLahir: "15-05-1995",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L003",
    noOrder: "0091",
    namaCustomer: "Muhammda Abdul",
    tanggal: new Date(2023, 9, 17),
    layanan: "Mobil",
    laporan: "Customer mencantukan alamat yang...",
    customerPhone: "089373933994",
    customerNote: "Ada di depan minimarket.",
    mitraId: "001237",
    namaMitra: "Budi Santoso",
    mitraPhone: "089373933996",
    mitraKendaraan: "Mobil",
    mitraMerkKendaraan: "TOYOTA",
    mitraPlatNomor: "B 5678 DEF",
    mitraEmail: "10009836047021",
    mitraTempatLahir: "Surabaya",
    mitraTanggalLahir: "20-08-1990",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L004",
    noOrder: "0091",
    namaCustomer: "Muhammda Abdul",
    tanggal: new Date(2023, 9, 17),
    layanan: "Nebeng Barang",
    laporan: "Customer mencantukan alamat yang...",
    customerPhone: "089373933994",
    customerNote: "Barang fragile, tolong hati-hati.",
    mitraId: "001238",
    namaMitra: "Dewi Putri",
    mitraPhone: "089373933997",
    mitraKendaraan: "Mobil",
    mitraMerkKendaraan: "DAIHATSU",
    mitraPlatNomor: "B 9012 GHI",
    mitraEmail: "10009836047022",
    mitraTempatLahir: "Bandung",
    mitraTanggalLahir: "10-03-1992",
    mitraJenisKelamin: "Perempuan",
  },
  {
    id: "L005",
    noOrder: "0091",
    namaCustomer: "Muhammda Abdul",
    tanggal: new Date(2023, 9, 17),
    layanan: "Titip Barang",
    laporan: "Customer mencantukan alamat yang...",
    customerPhone: "089373933994",
    customerNote: "Titip ke satpam kalau tidak ada.",
    mitraId: "001239",
    namaMitra: "Eko Prasetyo",
    mitraPhone: "089373933998",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "YAMAHA",
    mitraPlatNomor: "B 3456 JKL",
    mitraEmail: "10009836047023",
    mitraTempatLahir: "Semarang",
    mitraTanggalLahir: "25-12-1988",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L006",
    noOrder: "0091",
    namaCustomer: "Muhammda Abdul",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Customer mencantukan alamat yang...",
    customerPhone: "089373933994",
    customerNote: "Hubungi via WA saja.",
    mitraId: "001240",
    namaMitra: "Faisal Rahman",
    mitraPhone: "089373933999",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "HONDA",
    mitraPlatNomor: "B 7890 MNO",
    mitraEmail: "10009836047024",
    mitraTempatLahir: "Yogyakarta",
    mitraTanggalLahir: "05-07-1993",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L007",
    noOrder: "0091",
    namaCustomer: "Muhammda Abdul",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Customer mencantukan alamat yang...",
    customerPhone: "089373933994",
    customerNote: "Parkir di basement.",
    mitraId: "001241",
    namaMitra: "Gita Ayu",
    mitraPhone: "089373934000",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "SUZUKI",
    mitraPlatNomor: "B 1122 PQR",
    mitraEmail: "10009836047025",
    mitraTempatLahir: "Malang",
    mitraTanggalLahir: "18-11-1991",
    mitraJenisKelamin: "Perempuan",
  },
  {
    id: "L008",
    noOrder: "0091",
    namaCustomer: "Muhammda Abdul",
    tanggal: new Date(2023, 9, 17),
    layanan: "Nebeng Barang",
    laporan: "Customer mencantukan alamat yang...",
    customerPhone: "089373933994",
    customerNote: "Barang berat, butuh bantuan angkat.",
    mitraId: "001242",
    namaMitra: "Hendra Wijaya",
    mitraPhone: "089373934001",
    mitraKendaraan: "Mobil",
    mitraMerkKendaraan: "MITSUBISHI",
    mitraPlatNomor: "B 3344 STU",
    mitraEmail: "10009836047026",
    mitraTempatLahir: "Medan",
    mitraTanggalLahir: "30-09-1987",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L009",
    noOrder: "0091",
    namaCustomer: "Muhammda Abdul",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Customer mencantukan alamat yang...",
    customerPhone: "089373933994",
    customerNote: "Tunggu di lobby.",
    mitraId: "001243",
    namaMitra: "Irfan Hakim",
    mitraPhone: "089373934002",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "KAWASAKI",
    mitraPlatNomor: "B 5566 VWX",
    mitraEmail: "10009836047027",
    mitraTempatLahir: "Palembang",
    mitraTanggalLahir: "12-04-1994",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L010",
    noOrder: "0091",
    namaCustomer: "Muhammda Abdul",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Customer mencantukan alamat yang...",
    customerPhone: "089373933994",
    customerNote: "Rumah warna biru.",
    mitraId: "001244",
    namaMitra: "Joko Susanto",
    mitraPhone: "089373934003",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "VESPA",
    mitraPlatNomor: "B 7788 YZA",
    mitraEmail: "10009836047028",
    mitraTempatLahir: "Solo",
    mitraTanggalLahir: "22-06-1989",
    mitraJenisKelamin: "Laki - Laki",
  },
];

export const LaporanProvider = ({ children }: { children: ReactNode }) => {
  const [laporanList, setLaporanList] = useState<LaporanData[]>(initialLaporanData);

  const getLaporanDetail = (id: string) => {
    return laporanList.find((laporan) => laporan.id === id);
  };

  const updateLaporan = (id: string, laporan: string) => {
    setLaporanList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, laporan } : item
      )
    );
  };

  return (
    <LaporanContext.Provider value={{ laporanList, getLaporanDetail, updateLaporan }}>
      {children}
    </LaporanContext.Provider>
  );
};

export const useLaporan = () => {
  const context = useContext(LaporanContext);
  if (!context) {
    throw new Error("useLaporan must be used within a LaporanProvider");
  }
  return context;
};

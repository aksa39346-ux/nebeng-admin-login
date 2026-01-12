import React, { createContext, useContext, useState, ReactNode } from "react";

export interface LaporanData {
  id: string;
  noOrder: string;
  namaCustomer: string;
  customerId: string; // Link to CustomerContext
  tanggal: Date;
  layanan: string;
  laporan: string;
  // Customer info
  customerAvatar?: string;
  customerPhone: string;
  customerNote: string;
  // Mitra info
  mitraId: string; // Link to MitraContext
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

// Sample data - now with customerId and mitraId linked to real data
const initialLaporanData: LaporanData[] = [
  {
    id: "L001",
    noOrder: "0091",
    namaCustomer: "Siti Aminah",
    customerId: "200001", // Links to CustomerContext
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Customer mencantukan alamat yang tidak ditemukan di peta dan tidak memberikan petunjuk tambahan lokasi.",
    customerPhone: "081234567890",
    customerNote: "Jika sudah di tik, maju lagi sedikit yah mas.",
    mitraId: "100001", // Links to MitraContext
    namaMitra: "Muhammad Abdul",
    mitraPhone: "089563245757",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "HONDA",
    mitraPlatNomor: "B 4949 MBH",
    mitraEmail: "dul22345@gmail.com",
    mitraTempatLahir: "London",
    mitraTanggalLahir: "01-02-1999",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L002",
    noOrder: "0092",
    namaCustomer: "Rudi Hartono",
    customerId: "200002",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Customer mencantukan alamat yang tidak jelas.",
    customerPhone: "082345678901",
    customerNote: "Tolong hubungi saya kalau sudah sampai.",
    mitraId: "100002",
    namaMitra: "Ahmad Rizki",
    mitraPhone: "081234567890",
    mitraKendaraan: "Mobil",
    mitraMerkKendaraan: "TOYOTA",
    mitraPlatNomor: "B 1234 ABC",
    mitraEmail: "ahmad.rizki@gmail.com",
    mitraTempatLahir: "Jakarta",
    mitraTanggalLahir: "15-05-1995",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L003",
    noOrder: "0093",
    namaCustomer: "Rina Wati",
    customerId: "200003",
    tanggal: new Date(2023, 9, 17),
    layanan: "Mobil",
    laporan: "Driver tidak sopan kepada customer.",
    customerPhone: "083456789012",
    customerNote: "Ada di depan minimarket.",
    mitraId: "100003",
    namaMitra: "Budi Santoso",
    mitraPhone: "082345678901",
    mitraKendaraan: "Mobil",
    mitraMerkKendaraan: "TOYOTA",
    mitraPlatNomor: "B 5678 DEF",
    mitraEmail: "budi.santoso@gmail.com",
    mitraTempatLahir: "Bandung",
    mitraTanggalLahir: "20-08-1992",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L004",
    noOrder: "0094",
    namaCustomer: "Agus Setiawan",
    customerId: "200004",
    tanggal: new Date(2023, 9, 17),
    layanan: "Nebeng Barang",
    laporan: "Barang rusak saat pengiriman.",
    customerPhone: "084567890123",
    customerNote: "Barang fragile, tolong hati-hati.",
    mitraId: "100004",
    namaMitra: "Dewi Kartika",
    mitraPhone: "083456789012",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "HONDA",
    mitraPlatNomor: "B 9012 GHI",
    mitraEmail: "dewi.k@gmail.com",
    mitraTempatLahir: "Surabaya",
    mitraTanggalLahir: "10-03-1994",
    mitraJenisKelamin: "Perempuan",
  },
  {
    id: "L005",
    noOrder: "0095",
    namaCustomer: "Dewi Lestari",
    customerId: "200005",
    tanggal: new Date(2023, 9, 17),
    layanan: "Titip Barang",
    laporan: "Driver terlambat menjemput.",
    customerPhone: "085678901234",
    customerNote: "Titip ke satpam kalau tidak ada.",
    mitraId: "100005",
    namaMitra: "Eko Prasetyo",
    mitraPhone: "084567890123",
    mitraKendaraan: "Mobil",
    mitraMerkKendaraan: "DAIHATSU",
    mitraPlatNomor: "B 3456 JKL",
    mitraEmail: "eko.pras@gmail.com",
    mitraTempatLahir: "Semarang",
    mitraTanggalLahir: "25-07-1990",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L006",
    noOrder: "0096",
    namaCustomer: "Bambang Wijaya",
    customerId: "200006",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Customer membatalkan pesanan secara sepihak.",
    customerPhone: "086789012345",
    customerNote: "Hubungi via WA saja.",
    mitraId: "100006",
    namaMitra: "Fitri Handayani",
    mitraPhone: "085678901234",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "YAMAHA",
    mitraPlatNomor: "B 7890 MNO",
    mitraEmail: "fitri.h@gmail.com",
    mitraTempatLahir: "Yogyakarta",
    mitraTanggalLahir: "12-11-1993",
    mitraJenisKelamin: "Perempuan",
  },
  {
    id: "L007",
    noOrder: "0097",
    namaCustomer: "Sri Mulyani",
    customerId: "200007",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Driver mengemudi berbahaya.",
    customerPhone: "087890123456",
    customerNote: "Parkir di basement.",
    mitraId: "100007",
    namaMitra: "Gilang Ramadhan",
    mitraPhone: "086789012345",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "SUZUKI",
    mitraPlatNomor: "B 1122 PQR",
    mitraEmail: "gilang.r@gmail.com",
    mitraTempatLahir: "Malang",
    mitraTanggalLahir: "05-04-1996",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L008",
    noOrder: "0098",
    namaCustomer: "Hasan Basri",
    customerId: "200008",
    tanggal: new Date(2023, 9, 17),
    layanan: "Nebeng Barang",
    laporan: "Barang hilang saat pengiriman.",
    customerPhone: "088901234567",
    customerNote: "Barang berat, butuh bantuan angkat.",
    mitraId: "100008",
    namaMitra: "Hendra Wijaya",
    mitraPhone: "087890123456",
    mitraKendaraan: "Mobil",
    mitraMerkKendaraan: "MITSUBISHI",
    mitraPlatNomor: "B 3344 STU",
    mitraEmail: "hendra.w@gmail.com",
    mitraTempatLahir: "Surabaya",
    mitraTanggalLahir: "18-09-1991",
    mitraJenisKelamin: "Laki - Laki",
  },
  {
    id: "L009",
    noOrder: "0099",
    namaCustomer: "Yuni Astuti",
    customerId: "200009",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Customer tidak ada di lokasi penjemputan.",
    customerPhone: "089012345678",
    customerNote: "Tunggu di lobby.",
    mitraId: "100009",
    namaMitra: "Indah Permata",
    mitraPhone: "088901234567",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "KAWASAKI",
    mitraPlatNomor: "B 5566 VWX",
    mitraEmail: "indah.p@gmail.com",
    mitraTempatLahir: "Bandung",
    mitraTanggalLahir: "22-06-1997",
    mitraJenisKelamin: "Perempuan",
  },
  {
    id: "L010",
    noOrder: "0100",
    namaCustomer: "Andi Pratama",
    customerId: "200010",
    tanggal: new Date(2023, 9, 17),
    layanan: "Motor",
    laporan: "Mitra meminta pembayaran lebih dari tarif.",
    customerPhone: "081122334455",
    customerNote: "Rumah warna biru.",
    mitraId: "100010",
    namaMitra: "Joko Susilo",
    mitraPhone: "089012345678",
    mitraKendaraan: "Motor",
    mitraMerkKendaraan: "VESPA",
    mitraPlatNomor: "B 7788 YZA",
    mitraEmail: "joko.s@gmail.com",
    mitraTempatLahir: "Solo",
    mitraTanggalLahir: "30-12-1988",
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

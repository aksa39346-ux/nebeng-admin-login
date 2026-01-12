import React, { createContext, useContext, useState, ReactNode } from "react";

export interface RefundData {
  id: string;
  noOrder: string;
  namaCustomer: string;
  namaDriver: string;
  tanggal: Date;
  noTransaksi: string;
  jumlahRefund: number;
  status: "PROSES" | "SELESAI" | "BATAL";
}

export interface RefundDetail {
  id: string;
  noOrder: string;
  namaCustomer: string;
  namaDriver: string;
  tanggal: Date;
  noTransaksi: string;
  jumlahRefund: number;
  status: "PROSES" | "SELESAI" | "BATAL";
  idPesanan: string;
  metodeRefund: string;
  layananNebeng: string;
  biayaPenumpang: { quantity: number; price: number };
  biayaAdmin: number;
  totalRefund: number;
  titikJemput: { lokasi: string; waktu: string; alamat: string };
  tujuan: { lokasi: string; waktu: string; alamat: string };
}

// Sample data
const initialRefundList: RefundData[] = [
  { id: "R001", noOrder: "0091", namaCustomer: "Muhammda Abdul", namaDriver: "Maulana Injil", tanggal: new Date(2023, 9, 17), noTransaksi: "INV-123456789", jumlahRefund: 60000, status: "PROSES" },
  { id: "R002", noOrder: "0091", namaCustomer: "Muhammda Abdul", namaDriver: "Maulana Injil", tanggal: new Date(2023, 9, 17), noTransaksi: "INV-123456789", jumlahRefund: 60000, status: "SELESAI" },
  { id: "R003", noOrder: "0091", namaCustomer: "Muhammda Abdul", namaDriver: "Maulana Injil", tanggal: new Date(2023, 9, 17), noTransaksi: "INV-123456789", jumlahRefund: 60000, status: "SELESAI" },
  { id: "R004", noOrder: "0091", namaCustomer: "Muhammda Abdul", namaDriver: "Maulana Injil", tanggal: new Date(2023, 9, 17), noTransaksi: "INV-123456789", jumlahRefund: 60000, status: "SELESAI" },
  { id: "R005", noOrder: "0091", namaCustomer: "Muhammda Abdul", namaDriver: "Maulana Injil", tanggal: new Date(2023, 9, 17), noTransaksi: "INV-123456789", jumlahRefund: 60000, status: "PROSES" },
  { id: "R006", noOrder: "0091", namaCustomer: "Muhammda Abdul", namaDriver: "Maulana Injil", tanggal: new Date(2023, 9, 17), noTransaksi: "INV-123456789", jumlahRefund: 60000, status: "BATAL" },
  { id: "R007", noOrder: "0091", namaCustomer: "Muhammda Abdul", namaDriver: "Maulana Injil", tanggal: new Date(2023, 9, 17), noTransaksi: "INV-123456789", jumlahRefund: 60000, status: "BATAL" },
  { id: "R008", noOrder: "0091", namaCustomer: "Muhammda Abdul", namaDriver: "Maulana Injil", tanggal: new Date(2023, 9, 17), noTransaksi: "INV-123456789", jumlahRefund: 60000, status: "BATAL" },
  { id: "R009", noOrder: "0091", namaCustomer: "Muhammda Abdul", namaDriver: "Maulana Injil", tanggal: new Date(2023, 9, 17), noTransaksi: "INV-123456789", jumlahRefund: 60000, status: "PROSES" },
  { id: "R010", noOrder: "0091", namaCustomer: "Muhammda Abdul", namaDriver: "Maulana Injil", tanggal: new Date(2023, 9, 17), noTransaksi: "INV-123456789", jumlahRefund: 60000, status: "SELESAI" },
];

interface RefundContextType {
  refundList: RefundData[];
  getRefundDetail: (id: string) => RefundDetail | undefined;
  updateRefundStatus: (id: string, status: "PROSES" | "SELESAI" | "BATAL") => void;
}

const RefundContext = createContext<RefundContextType | undefined>(undefined);

export const RefundProvider = ({ children }: { children: ReactNode }) => {
  const [refundList, setRefundList] = useState<RefundData[]>(initialRefundList);

  const updateRefundStatus = (id: string, status: "PROSES" | "SELESAI" | "BATAL") => {
    setRefundList(prev => prev.map(refund => 
      refund.id === id ? { ...refund, status } : refund
    ));
  };

  const getRefundDetail = (id: string): RefundDetail | undefined => {
    const refund = refundList.find((r) => r.id === id);
    if (!refund) return undefined;

    return {
      ...refund,
      idPesanan: `NEBENG-98299A`,
      metodeRefund: "Transfer BRIVA",
      layananNebeng: "Motor",
      biayaPenumpang: { quantity: 2, price: 30000 },
      biayaAdmin: 0,
      totalRefund: refund.jumlahRefund,
      titikJemput: { lokasi: "Yogyakarta", waktu: "09.30 WIB", alamat: "Alun-alun Yogyakarta" },
      tujuan: { lokasi: "Purwokerto", waktu: "09.30 WIB", alamat: "Alun-alun Purwokerto" },
    };
  };

  return (
    <RefundContext.Provider value={{ refundList, getRefundDetail, updateRefundStatus }}>
      {children}
    </RefundContext.Provider>
  );
};

export const useRefund = () => {
  const context = useContext(RefundContext);
  if (context === undefined) {
    throw new Error("useRefund must be used within a RefundProvider");
  }
  return context;
};

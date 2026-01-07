import { createContext, useContext, useState, ReactNode } from "react";

export interface CustomerData {
  id: string;
  nama: string;
  email: string;
  noTlp: string;
  status: string;
  tanggal: Date;
}

export interface CustomerDetailData {
  id: string;
  nama: string;
  kode: string;
  status: "AKTIF" | "TIDAK_AKTIF";
  informasiPribadi: {
    namaLengkap: string;
    email: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: string;
    noTlp: string;
  };
}

// Initial list data
const initialCustomerList: CustomerData[] = [
  { id: "200001", nama: "Siti Aminah", email: "siti.aminah@gmail.com", noTlp: "081234567890", status: "AKTIF", tanggal: new Date(2024, 0, 10) },
  { id: "200002", nama: "Rudi Hartono", email: "rudi.h@gmail.com", noTlp: "082345678901", status: "AKTIF", tanggal: new Date(2024, 0, 15) },
  { id: "200003", nama: "Rina Wati", email: "rina.w@gmail.com", noTlp: "083456789012", status: "TIDAK_AKTIF", tanggal: new Date(2024, 1, 5) },
  { id: "200004", nama: "Agus Setiawan", email: "agus.s@gmail.com", noTlp: "084567890123", status: "AKTIF", tanggal: new Date(2024, 1, 10) },
  { id: "200005", nama: "Dewi Lestari", email: "dewi.l@gmail.com", noTlp: "085678901234", status: "AKTIF", tanggal: new Date(2024, 1, 20) },
  { id: "200006", nama: "Bambang Wijaya", email: "bambang.w@gmail.com", noTlp: "086789012345", status: "TIDAK_AKTIF", tanggal: new Date(2024, 2, 1) },
  { id: "200007", nama: "Sri Mulyani", email: "sri.m@gmail.com", noTlp: "087890123456", status: "AKTIF", tanggal: new Date(2024, 2, 10) },
  { id: "200008", nama: "Hasan Basri", email: "hasan.b@gmail.com", noTlp: "088901234567", status: "AKTIF", tanggal: new Date(2024, 2, 15) },
  { id: "200009", nama: "Yuni Astuti", email: "yuni.a@gmail.com", noTlp: "089012345678", status: "TIDAK_AKTIF", tanggal: new Date(2024, 3, 1) },
  { id: "200010", nama: "Andi Pratama", email: "andi.p@gmail.com", noTlp: "081122334455", status: "AKTIF", tanggal: new Date(2024, 3, 5) },
];

// Initial detail data
const initialCustomerDetail: Record<string, CustomerDetailData> = {
  "200001": {
    id: "200001",
    nama: "Siti Aminah",
    kode: "CST001",
    status: "AKTIF",
    informasiPribadi: {
      namaLengkap: "Siti Aminah",
      email: "siti.aminah@gmail.com",
      tempatLahir: "Jakarta",
      tanggalLahir: "10-05-1990",
      jenisKelamin: "Perempuan",
      noTlp: "081234567890",
    },
  },
  "200002": {
    id: "200002",
    nama: "Rudi Hartono",
    kode: "CST002",
    status: "AKTIF",
    informasiPribadi: {
      namaLengkap: "Rudi Hartono",
      email: "rudi.h@gmail.com",
      tempatLahir: "Bandung",
      tanggalLahir: "15-08-1988",
      jenisKelamin: "Laki - Laki",
      noTlp: "082345678901",
    },
  },
  "200003": {
    id: "200003",
    nama: "Rina Wati",
    kode: "CST003",
    status: "TIDAK_AKTIF",
    informasiPribadi: {
      namaLengkap: "Rina Wati",
      email: "rina.w@gmail.com",
      tempatLahir: "Surabaya",
      tanggalLahir: "20-03-1992",
      jenisKelamin: "Perempuan",
      noTlp: "083456789012",
    },
  },
  "200004": {
    id: "200004",
    nama: "Agus Setiawan",
    kode: "CST004",
    status: "AKTIF",
    informasiPribadi: {
      namaLengkap: "Agus Setiawan",
      email: "agus.s@gmail.com",
      tempatLahir: "Semarang",
      tanggalLahir: "25-11-1985",
      jenisKelamin: "Laki - Laki",
      noTlp: "084567890123",
    },
  },
  "200005": {
    id: "200005",
    nama: "Dewi Lestari",
    kode: "CST005",
    status: "AKTIF",
    informasiPribadi: {
      namaLengkap: "Dewi Lestari",
      email: "dewi.l@gmail.com",
      tempatLahir: "Yogyakarta",
      tanggalLahir: "12-07-1993",
      jenisKelamin: "Perempuan",
      noTlp: "085678901234",
    },
  },
  "200006": {
    id: "200006",
    nama: "Bambang Wijaya",
    kode: "CST006",
    status: "TIDAK_AKTIF",
    informasiPribadi: {
      namaLengkap: "Bambang Wijaya",
      email: "bambang.w@gmail.com",
      tempatLahir: "Malang",
      tanggalLahir: "30-01-1987",
      jenisKelamin: "Laki - Laki",
      noTlp: "086789012345",
    },
  },
  "200007": {
    id: "200007",
    nama: "Sri Mulyani",
    kode: "CST007",
    status: "AKTIF",
    informasiPribadi: {
      namaLengkap: "Sri Mulyani",
      email: "sri.m@gmail.com",
      tempatLahir: "Solo",
      tanggalLahir: "05-09-1991",
      jenisKelamin: "Perempuan",
      noTlp: "087890123456",
    },
  },
  "200008": {
    id: "200008",
    nama: "Hasan Basri",
    kode: "CST008",
    status: "AKTIF",
    informasiPribadi: {
      namaLengkap: "Hasan Basri",
      email: "hasan.b@gmail.com",
      tempatLahir: "Medan",
      tanggalLahir: "18-04-1989",
      jenisKelamin: "Laki - Laki",
      noTlp: "088901234567",
    },
  },
  "200009": {
    id: "200009",
    nama: "Yuni Astuti",
    kode: "CST009",
    status: "TIDAK_AKTIF",
    informasiPribadi: {
      namaLengkap: "Yuni Astuti",
      email: "yuni.a@gmail.com",
      tempatLahir: "Palembang",
      tanggalLahir: "22-06-1994",
      jenisKelamin: "Perempuan",
      noTlp: "089012345678",
    },
  },
  "200010": {
    id: "200010",
    nama: "Andi Pratama",
    kode: "CST010",
    status: "AKTIF",
    informasiPribadi: {
      namaLengkap: "Andi Pratama",
      email: "andi.p@gmail.com",
      tempatLahir: "Makassar",
      tanggalLahir: "08-12-1986",
      jenisKelamin: "Laki - Laki",
      noTlp: "081122334455",
    },
  },
};

interface CustomerContextType {
  customerList: CustomerData[];
  customerDetail: Record<string, CustomerDetailData>;
  updateCustomerStatus: (id: string, status: "AKTIF" | "TIDAK_AKTIF") => void;
  updateCustomerInfo: (id: string, info: CustomerDetailData["informasiPribadi"]) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customerList, setCustomerList] = useState<CustomerData[]>(initialCustomerList);
  const [customerDetail, setCustomerDetail] = useState<Record<string, CustomerDetailData>>(initialCustomerDetail);

  const updateCustomerStatus = (id: string, status: "AKTIF" | "TIDAK_AKTIF") => {
    setCustomerList(prev => 
      prev.map(customer => 
        customer.id === id ? { ...customer, status } : customer
      )
    );
    
    setCustomerDetail(prev => {
      if (prev[id]) {
        return {
          ...prev,
          [id]: { ...prev[id], status }
        };
      }
      return prev;
    });
  };

  const updateCustomerInfo = (id: string, info: CustomerDetailData["informasiPribadi"]) => {
    // Update list
    setCustomerList(prev => 
      prev.map(customer => 
        customer.id === id 
          ? { ...customer, nama: info.namaLengkap, email: info.email, noTlp: info.noTlp } 
          : customer
      )
    );
    
    // Update detail
    setCustomerDetail(prev => {
      if (prev[id]) {
        return {
          ...prev,
          [id]: { 
            ...prev[id], 
            nama: info.namaLengkap,
            informasiPribadi: info 
          }
        };
      }
      return prev;
    });
  };

  return (
    <CustomerContext.Provider value={{ customerList, customerDetail, updateCustomerStatus, updateCustomerInfo }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};

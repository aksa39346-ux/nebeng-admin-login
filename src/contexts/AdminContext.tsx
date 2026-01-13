import { createContext, useContext, useState, ReactNode } from "react";

export interface AdminProfile {
  namaLengkap: string;
  email: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  noTlp: string;
  role: string;
  layanan: string;
}

interface AdminContextType {
  profile: AdminProfile;
  updateProfile: (data: Partial<AdminProfile>) => void;
}

const defaultProfile: AdminProfile = {
  namaLengkap: "Muhammad Abdul Kadir",
  email: "Abdul000@gmail.com",
  tempatLahir: "London",
  tanggalLahir: "01-02-1999",
  jenisKelamin: "Laki - Laki",
  noTlp: "089373933994",
  role: "Admin",
  layanan: "Nebeng Motor",
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile>(defaultProfile);

  const updateProfile = (data: Partial<AdminProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  return (
    <AdminContext.Provider value={{ profile, updateProfile }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

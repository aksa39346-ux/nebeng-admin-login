import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface AdminProfile {
  namaLengkap: string;
  email: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  noTlp: string;
  role: string;
  layanan: string;
  foto: string;
}

interface AdminContextType {
  profile: AdminProfile;
  updateProfile: (data: Partial<AdminProfile>) => void;
}

const STORAGE_KEY = "admin-profile";

const defaultProfile: AdminProfile = {
  namaLengkap: "Muhammad Abdul Kadir",
  email: "Abdul000@gmail.com",
  tempatLahir: "London",
  tanggalLahir: "01-02-1999",
  jenisKelamin: "Laki - Laki",
  noTlp: "089373933994",
  role: "Admin",
  layanan: "Nebeng Motor",
  foto: "",
};

const getStoredProfile = (): AdminProfile => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultProfile, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error("Error loading profile from localStorage:", error);
  }
  return defaultProfile;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile>(getStoredProfile);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error("Error saving profile to localStorage:", error);
    }
  }, [profile]);

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

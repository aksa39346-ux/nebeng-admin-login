import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useCustomer } from "@/contexts/CustomerContext";

const getStatusBadge = (status: "AKTIF" | "TIDAK_AKTIF") => {
  switch (status) {
    case "AKTIF":
      return <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">Aktif</Badge>;
    case "TIDAK_AKTIF":
      return <Badge className="bg-gray-500 hover:bg-gray-600 text-white text-xs">Tidak Aktif</Badge>;
    default:
      return null;
  }
};

const DetailCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customerDetail } = useCustomer();
  
  const customer = id ? customerDetail[id] : null;
  
  if (!customer) {
    return (
      <div className="p-6">
        <p>Data customer tidak ditemukan</p>
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
        <h1 className="text-xl font-semibold">Detail Data Customer</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-muted text-lg">
                  {customer.nama.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{customer.nama}</h2>
              <p className="text-muted-foreground text-sm">Customer</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-primary font-medium">{customer.kode}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <div className="mt-2">
                {getStatusBadge(customer.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Pribadi */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Informasi Pribadi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Nama Lengkap</label>
              <Input value={customer.informasiPribadi.namaLengkap} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input value={customer.informasiPribadi.email} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tempat Lahir</label>
              <Input value={customer.informasiPribadi.tempatLahir} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tanggal Lahir</label>
              <div className="relative mt-1">
                <Input value={customer.informasiPribadi.tanggalLahir} readOnly className="bg-muted/50 pr-10" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
              <Input value={customer.informasiPribadi.jenisKelamin} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">No. Tlp</label>
              <Input value={customer.informasiPribadi.noTlp} readOnly className="mt-1 bg-muted/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCustomer;

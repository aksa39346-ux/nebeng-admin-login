import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useCustomer } from "@/contexts/CustomerContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getStatusBadge = (status: "AKTIF" | "TIDAK_AKTIF" | "PENGAJUAN") => {
  switch (status) {
    case "AKTIF":
      return <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">Aktif</Badge>;
    case "TIDAK_AKTIF":
      return <Badge className="bg-gray-500 hover:bg-gray-600 text-white text-xs">Tidak Aktif</Badge>;
    case "PENGAJUAN":
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">Pengajuan</Badge>;
    default:
      return null;
  }
};

const DetailCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customerDetail, updateCustomerStatus } = useCustomer();
  
  const customer = id ? customerDetail[id] : null;
  
  // Success modal states
  const [showTerimaModal, setShowTerimaModal] = useState(false);
  const [showTolakModal, setShowTolakModal] = useState(false);
  
  if (!customer) {
    return (
      <div className="p-6">
        <p>Data customer tidak ditemukan</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
      </div>
    );
  }

  const handleTerima = () => {
    if (!id) return;
    updateCustomerStatus(id, "AKTIF");
    setShowTerimaModal(true);
  };

  const handleTolak = () => {
    if (!id) return;
    updateCustomerStatus(id, "TIDAK_AKTIF");
    setShowTolakModal(true);
  };

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
        <h1 className="text-xl font-semibold">Detail Data Costumer</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-orange-200">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-lg">
                  {customer.nama.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{customer.nama}</h2>
              <p className="text-muted-foreground text-sm">Nebeng Motor</p>
              <span className="text-primary font-medium text-sm">{customer.kode}</span>
              <div className="mt-2">
                {getStatusBadge(customer.status)}
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 text-primary border-primary hover:bg-primary/10"
          >
            <Edit size={16} />
            Edit
          </Button>
        </div>

        {/* Informasi Pribadi */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Informasi Pribadi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Nama Lengkap</label>
              <Input 
                value={customer.informasiPribadi.namaLengkap} 
                readOnly
                className="mt-1 bg-muted/50" 
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input 
                value={customer.informasiPribadi.email} 
                readOnly
                className="mt-1 bg-muted/50" 
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tempat Lahir</label>
              <Input 
                value={customer.informasiPribadi.tempatLahir} 
                readOnly
                className="mt-1 bg-muted/50" 
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tanggal Lahir</label>
              <div className="relative mt-1">
                <Input 
                  value={customer.informasiPribadi.tanggalLahir} 
                  readOnly
                  className="pr-10 bg-muted/50" 
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
              <Select value={customer.informasiPribadi.jenisKelamin} disabled>
                <SelectTrigger className="mt-1 bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki - Laki">Laki - Laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">No. Tlp</label>
              <Input 
                value={customer.informasiPribadi.noTlp} 
                readOnly
                className="mt-1 bg-muted/50" 
              />
            </div>
          </div>
        </div>

        {/* Informasi KTP */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Informasi KTP</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                  <Input 
                    value={customer.informasiPribadi.namaLengkap} 
                    readOnly
                    className="mt-1 bg-muted/50" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">NIK</label>
                  <Input 
                    value="1002981636470019" 
                    readOnly
                    className="mt-1 bg-muted/50" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
                  <Select value={customer.informasiPribadi.jenisKelamin} disabled>
                    <SelectTrigger className="mt-1 bg-muted/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki - Laki">Laki - Laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Tanggal Lahir</label>
                  <div className="relative mt-1">
                    <Input 
                      value={customer.informasiPribadi.tanggalLahir} 
                      readOnly
                      className="pr-10 bg-muted/50" 
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="w-40 h-28 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg border-2 border-blue-200 flex items-center justify-center overflow-hidden">
                <div className="text-center p-2">
                  <div className="w-12 h-12 mx-auto bg-blue-200 rounded-full flex items-center justify-center mb-1">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-blue-600 font-medium">MUHAMMAD REHAN</p>
                  <p className="text-[10px] text-blue-500">KTP Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            onClick={handleTerima}
          >
            Terima
          </Button>
          <Button 
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 px-8"
            onClick={handleTolak}
          >
            Tolak
          </Button>
        </div>
      </div>

      {/* Terima Success Modal */}
      <Dialog open={showTerimaModal} onOpenChange={setShowTerimaModal}>
        <DialogContent className="sm:max-w-md p-0 border-0 overflow-hidden">
          <div className="h-1.5 bg-green-500" />
          <div className="p-8 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Customer Berhasil Diterima
            </h2>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <Button 
              className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => {
                setShowTerimaModal(false);
                navigate(-1);
              }}
            >
              Oke
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tolak Modal */}
      <Dialog open={showTolakModal} onOpenChange={setShowTolakModal}>
        <DialogContent className="sm:max-w-md p-0 border-0 overflow-hidden">
          <div className="h-1.5 bg-red-500" />
          <div className="p-8 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Customer Ditolak
            </h2>
            
            <div className="mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <Button 
              className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => {
                setShowTolakModal(false);
                navigate(-1);
              }}
            >
              Oke
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailCustomer;

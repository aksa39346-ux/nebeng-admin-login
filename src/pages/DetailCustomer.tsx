import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useCustomer } from "@/contexts/CustomerContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ktpPlaceholder from "@/assets/ktp-placeholder.png";

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
  const { customerDetail, updateCustomerStatus, updateCustomerInfo } = useCustomer();
  const { toast } = useToast();
  
  const customer = id ? customerDetail[id] : null;
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    namaLengkap: "",
    email: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    noTlp: "",
  });
  
  // Success modal states
  const [showTerimaModal, setShowTerimaModal] = useState(false);
  const [showTolakModal, setShowTolakModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showKTPPreview, setShowKTPPreview] = useState(false);
  
  if (!customer) {
    return (
      <div className="p-6">
        <p>Data customer tidak ditemukan</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
      </div>
    );
  }

  const handleEnterEditMode = () => {
    setEditData({
      namaLengkap: customer.informasiPribadi.namaLengkap,
      email: customer.informasiPribadi.email,
      tempatLahir: customer.informasiPribadi.tempatLahir,
      tanggalLahir: customer.informasiPribadi.tanggalLahir,
      jenisKelamin: customer.informasiPribadi.jenisKelamin,
      noTlp: customer.informasiPribadi.noTlp,
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSaveEdit = () => {
    if (!id) return;
    
    if (!editData.namaLengkap.trim() || !editData.email.trim() || !editData.noTlp.trim()) {
      toast({
        title: "Error",
        description: "Nama, Email, dan No. Tlp wajib diisi",
        variant: "destructive",
      });
      return;
    }
    
    updateCustomerInfo(id, editData);
    setIsEditMode(false);
    setShowEditSuccessModal(true);
  };

  const handleInputChange = (field: keyof typeof editData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

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
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={handleCancelEdit}
                >
                  <X size={16} />
                  Batal
                </Button>
                <Button 
                  className="gap-2 bg-primary hover:bg-primary/90"
                  onClick={handleSaveEdit}
                >
                  <Check size={16} />
                  Simpan
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="gap-2 text-primary border-primary hover:bg-primary/10"
                onClick={handleEnterEditMode}
              >
                <Edit size={16} />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Informasi Pribadi */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Informasi Pribadi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Nama Lengkap</label>
              <Input 
                value={isEditMode ? editData.namaLengkap : customer.informasiPribadi.namaLengkap} 
                readOnly={!isEditMode}
                onChange={(e) => handleInputChange("namaLengkap", e.target.value)}
                className={`mt-1 ${isEditMode ? "bg-background" : "bg-muted/50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input 
                value={isEditMode ? editData.email : customer.informasiPribadi.email} 
                readOnly={!isEditMode}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-1 ${isEditMode ? "bg-background" : "bg-muted/50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tempat Lahir</label>
              <Input 
                value={isEditMode ? editData.tempatLahir : customer.informasiPribadi.tempatLahir} 
                readOnly={!isEditMode}
                onChange={(e) => handleInputChange("tempatLahir", e.target.value)}
                className={`mt-1 ${isEditMode ? "bg-background" : "bg-muted/50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tanggal Lahir</label>
              <div className="relative mt-1">
                <Input 
                  value={isEditMode ? editData.tanggalLahir : customer.informasiPribadi.tanggalLahir} 
                  readOnly={!isEditMode}
                  onChange={(e) => handleInputChange("tanggalLahir", e.target.value)}
                  className={`pr-10 ${isEditMode ? "bg-background" : "bg-muted/50"}`}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
              {isEditMode ? (
                <Select value={editData.jenisKelamin} onValueChange={(val) => handleInputChange("jenisKelamin", val)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki - Laki">Laki - Laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select value={customer.informasiPribadi.jenisKelamin} disabled>
                  <SelectTrigger className="mt-1 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki - Laki">Laki - Laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">No. Tlp</label>
              <Input 
                value={isEditMode ? editData.noTlp : customer.informasiPribadi.noTlp} 
                readOnly={!isEditMode}
                onChange={(e) => handleInputChange("noTlp", e.target.value)}
                className={`mt-1 ${isEditMode ? "bg-background" : "bg-muted/50"}`}
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
                    value={customer.informasiKTP?.namaLengkap || customer.informasiPribadi.namaLengkap} 
                    readOnly
                    className="mt-1 bg-muted/50" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">NIK</label>
                  <Input 
                    value={customer.informasiKTP?.nik || "-"} 
                    readOnly
                    className="mt-1 bg-muted/50" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
                  <Select value={customer.informasiKTP?.jenisKelamin || customer.informasiPribadi.jenisKelamin} disabled>
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
                      value={customer.informasiKTP?.tanggalLahir || customer.informasiPribadi.tanggalLahir} 
                      readOnly
                      className="pr-10 bg-muted/50" 
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <img 
                src={ktpPlaceholder} 
                alt={`KTP ${customer.informasiKTP?.namaLengkap || customer.nama}`}
                className="w-48 h-auto rounded-lg border-2 border-blue-200 shadow-md object-cover cursor-pointer hover:opacity-90 hover:shadow-lg transition-all"
                onClick={() => setShowKTPPreview(true)}
              />
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

      {/* Edit Success Modal */}
      <Dialog open={showEditSuccessModal} onOpenChange={setShowEditSuccessModal}>
        <DialogContent className="sm:max-w-md p-0 border-0 overflow-hidden">
          <div className="h-1.5 bg-primary" />
          <div className="p-8 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Data Customer Berhasil Diperbarui
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
              onClick={() => setShowEditSuccessModal(false)}
            >
              Oke
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* KTP Preview Modal */}
      <Dialog open={showKTPPreview} onOpenChange={setShowKTPPreview}>
        <DialogContent className="sm:max-w-2xl p-4">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Preview KTP</h3>
            <img 
              src={ktpPlaceholder} 
              alt={`KTP ${customer.informasiKTP?.namaLengkap || customer.nama}`}
              className="w-full max-w-lg h-auto rounded-lg border-2 border-blue-200 shadow-lg"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              {customer.informasiKTP?.namaLengkap || customer.nama} - NIK: {customer.informasiKTP?.nik || "-"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailCustomer;

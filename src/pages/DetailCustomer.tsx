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
  const { customerDetail, updateCustomerInfo, updateCustomerStatus } = useCustomer();
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
  const [editStatus, setEditStatus] = useState<"AKTIF" | "TIDAK_AKTIF">("AKTIF");
  
  // Success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
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
    setEditStatus(customer.status);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSave = () => {
    if (!id) return;
    
    // Validate required fields
    if (!editData.namaLengkap.trim() || !editData.email.trim() || !editData.noTlp.trim()) {
      toast({
        title: "Error",
        description: "Nama, Email, dan No. Tlp wajib diisi",
        variant: "destructive",
      });
      return;
    }
    
    // Update customer info
    updateCustomerInfo(id, editData);
    
    // Update status if changed
    if (editStatus !== customer.status) {
      updateCustomerStatus(id, editStatus);
    }
    
    setIsEditMode(false);
    setShowSuccessModal(true);
  };

  const handleInputChange = (field: keyof typeof editData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
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
                {isEditMode ? (
                  <Select value={editStatus} onValueChange={(val) => setEditStatus(val as "AKTIF" | "TIDAK_AKTIF")}>
                    <SelectTrigger className="w-40 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AKTIF">
                        <span className="text-green-500">Aktif</span>
                      </SelectItem>
                      <SelectItem value="TIDAK_AKTIF">
                        <span className="text-gray-500">Tidak Aktif</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  getStatusBadge(customer.status)
                )}
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
                  onClick={handleSave}
                >
                  <Check size={16} />
                  Simpan
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="gap-2"
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
                <Input value={customer.informasiPribadi.jenisKelamin} readOnly className="mt-1 bg-muted/50" />
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
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md p-0 border-0 overflow-hidden">
          <div className="h-1.5 bg-[#6B5B7A]" />
          <div className="p-8 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Data Customer Berhasil Diperbarui
            </h2>
            
            <div className="mb-8">
              <div className="relative">
                <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center p-3 gap-2">
                  <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="w-8 h-1.5 bg-gray-300 rounded"></div>
                    <div className="w-6 h-1.5 bg-gray-300 rounded"></div>
                    <div className="w-7 h-1.5 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <Button 
              className="px-8 bg-[#1e3a5f] hover:bg-[#152a45] text-white"
              onClick={() => setShowSuccessModal(false)}
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

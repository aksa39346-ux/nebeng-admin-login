import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Edit, Check, X, CheckCircle, XCircle, Lock, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import ktpPlaceholder from "@/assets/ktp-placeholder.png";
import BlockCustomerPopup from "@/components/BlockCustomerPopup";
import UnblockCustomerPopup from "@/components/UnblockCustomerPopup";
import { useUser, useUpdateUserStatus, useUpdateUser, StatusType } from "@/hooks/useUsers";
import { useVerifikasiByUser, useUpdateVerifikasi, VerificationStatus } from "@/hooks/useVerifikasi";

type DisplayStatus = "PENGAJUAN" | "TERVERIFIKASI" | "DITOLAK" | "DIBLOCK";

const mapVerificationToDisplay = (status: VerificationStatus | undefined, userStatus: StatusType | undefined): DisplayStatus => {
  if (userStatus === "blokir") return "DIBLOCK";
  if (!status) return "PENGAJUAN";
  switch (status) {
    case "pending": return "PENGAJUAN";
    case "verified": return "TERVERIFIKASI";
    case "rejected": return "DITOLAK";
    default: return "PENGAJUAN";
  }
};

const getStatusBadge = (status: DisplayStatus) => {
  switch (status) {
    case "TERVERIFIKASI":
      return <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">Terverifikasi</Badge>;
    case "DITOLAK":
      return <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">Ditolak</Badge>;
    case "PENGAJUAN":
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">Pengajuan</Badge>;
    case "DIBLOCK":
      return <Badge className="bg-gray-500 hover:bg-gray-600 text-white text-xs">Diblock</Badge>;
    default:
      return null;
  }
};

const DetailCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch data from database
  const { data: customer, isLoading: isLoadingCustomer } = useUser(id || "");
  const { data: verifikasi, isLoading: isLoadingVerifikasi } = useVerifikasiByUser(id || "");
  const updateUserStatus = useUpdateUserStatus();
  const updateUser = useUpdateUser();
  const updateVerifikasi = useUpdateVerifikasi();
  
  const currentStatus = mapVerificationToDisplay(verifikasi?.status, customer?.status);
  const isBlocked = customer?.status === "blokir";
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    nama: "",
    email: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    no_hp: "",
  });
  
  // Modal states
  const [showConfirmTerima, setShowConfirmTerima] = useState(false);
  const [showConfirmTolak, setShowConfirmTolak] = useState(false);
  const [showTerimaModal, setShowTerimaModal] = useState(false);
  const [showTolakModal, setShowTolakModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showKTPPreview, setShowKTPPreview] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showBlockSuccess, setShowBlockSuccess] = useState(false);
  const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
  const [showUnblockSuccess, setShowUnblockSuccess] = useState(false);
  
  if (isLoadingCustomer || isLoadingVerifikasi) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="p-6">
        <p>Data customer tidak ditemukan</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const handleEnterEditMode = () => {
    setEditData({
      nama: customer.nama,
      email: customer.email,
      tempat_lahir: verifikasi?.tempat_lahir || "",
      tanggal_lahir: customer.tanggal_lahir || "",
      jenis_kelamin: verifikasi?.jenis_kelamin || "",
      no_hp: customer.no_hp || "",
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSaveEdit = () => {
    if (!id) return;
    
    if (!editData.nama.trim() || !editData.email.trim() || !editData.no_hp.trim()) {
      toast({
        title: "Error",
        description: "Nama, Email, dan No. Tlp wajib diisi",
        variant: "destructive",
      });
      return;
    }
    
    updateUser.mutate(
      {
        id,
        nama: editData.nama,
        email: editData.email,
        no_hp: editData.no_hp,
        tanggal_lahir: editData.tanggal_lahir || null,
      },
      {
        onSuccess: () => {
          setIsEditMode(false);
          setShowEditSuccessModal(true);
        }
      }
    );
  };

  const handleInputChange = (field: keyof typeof editData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleTerimaClick = () => {
    setShowConfirmTerima(true);
  };

  const handleTolakClick = () => {
    setShowConfirmTolak(true);
  };

  const handleConfirmTerima = () => {
    if (!id || !verifikasi) return;
    updateVerifikasi.mutate(
      { id: verifikasi.id, status: "verified" },
      {
        onSuccess: () => {
          setShowConfirmTerima(false);
          setShowTerimaModal(true);
        }
      }
    );
  };

  const handleConfirmTolak = () => {
    if (!id || !verifikasi) return;
    updateVerifikasi.mutate(
      { id: verifikasi.id, status: "rejected" },
      {
        onSuccess: () => {
          setShowConfirmTolak(false);
          setShowTolakModal(true);
        }
      }
    );
  };

  const handleBlock = () => {
    if (!id) return;
    updateUserStatus.mutate(
      { id, status: "blokir" },
      {
        onSuccess: () => {
          setShowBlockConfirm(false);
          setShowBlockSuccess(true);
        }
      }
    );
  };

  const handleUnblock = () => {
    if (!id) return;
    updateUserStatus.mutate(
      { id, status: "aktif" },
      {
        onSuccess: () => {
          setShowUnblockConfirm(false);
          setShowUnblockSuccess(true);
        }
      }
    );
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
                <AvatarImage src={customer.foto_profil || "/placeholder.svg"} />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-lg">
                  {customer.nama.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{customer.nama}</h2>
              <p className="text-muted-foreground text-sm">Nebeng Motor</p>
              <span className="text-primary font-medium text-sm">{customer.id.slice(0, 8).toUpperCase()}</span>
              <div className="mt-2">
                {getStatusBadge(currentStatus)}
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
                  disabled={updateUser.isPending}
                >
                  <Check size={16} />
                  {updateUser.isPending ? "Menyimpan..." : "Simpan"}
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
                value={isEditMode ? editData.nama : customer.nama} 
                readOnly={!isEditMode}
                onChange={(e) => handleInputChange("nama", e.target.value)}
                className={`mt-1 ${isEditMode ? "bg-background" : "bg-muted/50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input 
                value={isEditMode ? editData.email : customer.email} 
                readOnly={!isEditMode}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-1 ${isEditMode ? "bg-background" : "bg-muted/50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tempat Lahir</label>
              <Input 
                value={isEditMode ? editData.tempat_lahir : (verifikasi?.tempat_lahir || "-")} 
                readOnly={!isEditMode}
                onChange={(e) => handleInputChange("tempat_lahir", e.target.value)}
                className={`mt-1 ${isEditMode ? "bg-background" : "bg-muted/50"}`}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tanggal Lahir</label>
              <div className="relative mt-1">
                <Input 
                  value={isEditMode ? editData.tanggal_lahir : formatDate(customer.tanggal_lahir)} 
                  readOnly={!isEditMode}
                  onChange={(e) => handleInputChange("tanggal_lahir", e.target.value)}
                  className={`pr-10 ${isEditMode ? "bg-background" : "bg-muted/50"}`}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
              {isEditMode ? (
                <Select value={editData.jenis_kelamin} onValueChange={(val) => handleInputChange("jenis_kelamin", val)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki - Laki">Laki - Laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select value={verifikasi?.jenis_kelamin || "Laki - Laki"} disabled>
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
                value={isEditMode ? editData.no_hp : (customer.no_hp || "-")} 
                readOnly={!isEditMode}
                onChange={(e) => handleInputChange("no_hp", e.target.value)}
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
                    value={verifikasi?.nama_ktp || customer.nama} 
                    readOnly
                    className="mt-1 bg-muted/50" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">NIK</label>
                  <Input 
                    value={verifikasi?.no_ktp || "-"} 
                    readOnly
                    className="mt-1 bg-muted/50" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
                  <Select value={verifikasi?.jenis_kelamin || "Laki - Laki"} disabled>
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
                      value={formatDate(verifikasi?.tanggal_lahir_ktp || null)} 
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
                src={verifikasi?.foto_ktp || ktpPlaceholder} 
                alt={`KTP ${verifikasi?.nama_ktp || customer.nama}`}
                className="w-48 h-auto rounded-lg border-2 border-blue-200 shadow-md object-cover cursor-pointer hover:opacity-90 hover:shadow-lg transition-all"
                onClick={() => setShowKTPPreview(true)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          {isBlocked ? (
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-8 gap-2"
              onClick={() => setShowUnblockConfirm(true)}
            >
              <LockOpen size={16} />
              Unblock
            </Button>
          ) : (
            <>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                onClick={handleTerimaClick}
                disabled={updateVerifikasi.isPending}
              >
                Terima
              </Button>
              <Button 
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 px-8"
                onClick={handleTolakClick}
                disabled={updateVerifikasi.isPending}
              >
                Tolak
              </Button>
              <Button 
                variant="outline"
                className="border-gray-500 text-gray-700 hover:bg-gray-50 px-8 gap-2"
                onClick={() => setShowBlockConfirm(true)}
              >
                <Lock size={16} />
                Block
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modal: Konfirmasi Terima */}
      <Dialog open={showConfirmTerima} onOpenChange={setShowConfirmTerima}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center py-4">
            <h2 className="text-lg font-semibold mb-2">
              Anda akan Menerima verifikasi customer ini.
            </h2>
            <p className="text-muted-foreground mb-6">Apakah Anda yakin?</p>
            <div className="relative mb-6">
              <div className="w-20 h-24 bg-muted rounded-lg flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                <CheckCircle size={20} className="text-white" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmTerima(false)}
                className="min-w-24"
              >
                Kembali
              </Button>
              <Button 
                className="min-w-24 bg-primary hover:bg-primary/90"
                onClick={handleConfirmTerima}
                disabled={updateVerifikasi.isPending}
              >
                {updateVerifikasi.isPending ? "Memproses..." : "Ya."}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Konfirmasi Tolak */}
      <Dialog open={showConfirmTolak} onOpenChange={setShowConfirmTolak}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center py-4">
            <h2 className="text-lg font-semibold mb-2">
              Anda akan Menolak verifikasi customer ini.
            </h2>
            <p className="text-muted-foreground mb-6">Apakah Anda yakin?</p>
            <div className="relative mb-6">
              <div className="w-20 h-24 bg-muted rounded-lg flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1">
                <XCircle size={20} className="text-white" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmTolak(false)}
                className="min-w-24"
              >
                Kembali
              </Button>
              <Button 
                className="min-w-24 bg-red-500 hover:bg-red-600"
                onClick={handleConfirmTolak}
                disabled={updateVerifikasi.isPending}
              >
                {updateVerifikasi.isPending ? "Memproses..." : "Ya."}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Sukses Terima */}
      <Dialog open={showTerimaModal} onOpenChange={setShowTerimaModal}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center py-4">
            <div className="relative mb-6">
              <div className="w-20 h-24 bg-muted rounded-lg flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                <CheckCircle size={20} className="text-white" />
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Verifikasi Customer Berhasil
            </h2>
            <p className="text-muted-foreground mb-6">Customer telah berhasil diverifikasi</p>
            <Button 
              onClick={() => setShowTerimaModal(false)}
              className="min-w-24"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Sukses Tolak */}
      <Dialog open={showTolakModal} onOpenChange={setShowTolakModal}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center py-4">
            <div className="relative mb-6">
              <div className="w-20 h-24 bg-muted rounded-lg flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1">
                <XCircle size={20} className="text-white" />
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Penolakan Berhasil
            </h2>
            <p className="text-muted-foreground mb-6">Verifikasi customer telah ditolak</p>
            <Button 
              onClick={() => setShowTolakModal(false)}
              className="min-w-24"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Sukses Edit */}
      <Dialog open={showEditSuccessModal} onOpenChange={setShowEditSuccessModal}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center py-4">
            <div className="relative mb-6">
              <div className="w-20 h-24 bg-muted rounded-lg flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <path d="M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                <CheckCircle size={20} className="text-white" />
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Data Berhasil Disimpan
            </h2>
            <p className="text-muted-foreground mb-6">Data customer telah berhasil diperbarui</p>
            <Button 
              onClick={() => setShowEditSuccessModal(false)}
              className="min-w-24"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: KTP Preview */}
      <Dialog open={showKTPPreview} onOpenChange={setShowKTPPreview}>
        <DialogContent className="sm:max-w-2xl">
          <div className="flex justify-center">
            <img 
              src={verifikasi?.foto_ktp || ktpPlaceholder} 
              alt={`KTP ${verifikasi?.nama_ktp || customer.nama}`}
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Block Customer Popup */}
      <BlockCustomerPopup
        open={showBlockConfirm}
        onClose={() => setShowBlockConfirm(false)}
        onConfirm={handleBlock}
        customerName={customer.nama}
        showSuccess={showBlockSuccess}
        onCloseSuccess={() => setShowBlockSuccess(false)}
      />

      {/* Unblock Customer Popup */}
      <UnblockCustomerPopup
        open={showUnblockConfirm}
        onClose={() => setShowUnblockConfirm(false)}
        onConfirm={handleUnblock}
        customerName={customer.nama}
        showSuccess={showUnblockSuccess}
        onCloseSuccess={() => setShowUnblockSuccess(false)}
      />
    </div>
  );
};

export default DetailCustomer;

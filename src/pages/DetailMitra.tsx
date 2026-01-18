import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Edit, Calendar, Search as SearchIcon, CheckCircle, XCircle, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import UnblockMitraPopup from "@/components/UnblockMitraPopup";
import { useUser, useUpdateUserStatus, StatusType } from "@/hooks/useUsers";
import { useVerifikasiByUser, useUpdateVerifikasi, VerificationStatus } from "@/hooks/useVerifikasi";

const alasanPenolakan = [
  "Tidak Memenuhi Persyaratan Kendaraan",
  "Ketidaksesuaian Data Pengemudi",
  "Dokumen Kendaraan Tidak Valid",
  "Riwayat Pengemudi Tidak Memenuhi Kriteria",
  "Kendaraan Tidak Layak Operasi",
  "Penolakan Terhadap Aturan dan Kebijakan Aplikasi",
  "Indikasi Penipuan atau Kecurangan",
  "Lainnya",
];

const alasanPerubahan = [
  "Data sudah diperbaiki",
  "Dokumen baru diunggah",
  "Verifikasi ulang diperlukan",
  "Kesalahan penolakan sebelumnya",
];

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

const mapDisplayToVerification = (status: DisplayStatus): VerificationStatus => {
  switch (status) {
    case "PENGAJUAN": return "pending";
    case "TERVERIFIKASI": return "verified";
    case "DITOLAK": return "rejected";
    default: return "pending";
  }
};

const getStatusBadge = (status: DisplayStatus) => {
  switch (status) {
    case "PENGAJUAN":
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">Pengajuan</Badge>;
    case "TERVERIFIKASI":
      return <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">Terverifikasi</Badge>;
    case "DITOLAK":
      return <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">Ditolak</Badge>;
    case "DIBLOCK":
      return <Badge className="bg-gray-500 hover:bg-gray-600 text-white text-xs">Diblock</Badge>;
    default:
      return null;
  }
};

const DetailMitra = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch data from database
  const { data: mitra, isLoading: isLoadingMitra } = useUser(id || "");
  const { data: verifikasi, isLoading: isLoadingVerifikasi } = useVerifikasiByUser(id || "");
  const updateUserStatus = useUpdateUserStatus();
  const updateVerifikasi = useUpdateVerifikasi();
  
  // Get current status
  const currentStatus = mapVerificationToDisplay(verifikasi?.status, mitra?.status);
  const isBlocked = mitra?.status === "blokir";
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState<DisplayStatus>(currentStatus);
  
  // Modal states
  const [showConfirmTolak, setShowConfirmTolak] = useState(false);
  const [showAlasanTolak, setShowAlasanTolak] = useState(false);
  const [showSuccessVerifikasi, setShowSuccessVerifikasi] = useState(false);
  const [showSuccessTolak, setShowSuccessTolak] = useState(false);
  const [showUbahStatus, setShowUbahStatus] = useState(false);
  const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
  const [showUnblockSuccess, setShowUnblockSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  
  // Form states
  const [selectedAlasan, setSelectedAlasan] = useState("");
  const [catatanLainnya, setCatatanLainnya] = useState("");
  const [selectedAlasanPerubahan, setSelectedAlasanPerubahan] = useState("");
  
  if (isLoadingMitra || isLoadingVerifikasi) {
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
  
  if (!mitra) {
    return (
      <div className="p-6">
        <p>Data mitra tidak ditemukan</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
      </div>
    );
  }

  const handleEnterEditMode = () => {
    setIsEditMode(true);
    setEditStatus(currentStatus);
  };

  const handleSave = () => {
    if (!id || !verifikasi) return;
    
    // If changing to DITOLAK, show rejection reason modal
    if (editStatus === "DITOLAK" && currentStatus !== "DITOLAK") {
      setShowConfirmTolak(true);
      return;
    }
    
    // If changing to TERVERIFIKASI
    if (editStatus === "TERVERIFIKASI" && currentStatus !== "TERVERIFIKASI") {
      updateVerifikasi.mutate(
        { id: verifikasi.id, status: "verified" },
        {
          onSuccess: () => {
            setShowSuccessVerifikasi(true);
            setIsEditMode(false);
          }
        }
      );
      return;
    }
    
    // If changing from DITOLAK to PENGAJUAN
    if (editStatus === "PENGAJUAN" && currentStatus === "DITOLAK") {
      setShowUbahStatus(true);
      return;
    }
    
    // Just save without status change
    setIsEditMode(false);
  };

  const handleTolakConfirm = () => {
    setShowConfirmTolak(false);
    setShowAlasanTolak(true);
  };

  const handleSubmitTolak = () => {
    if (!id || !verifikasi) return;
    const catatan = selectedAlasan === "Lainnya" ? catatanLainnya : selectedAlasan;
    updateVerifikasi.mutate(
      { id: verifikasi.id, status: "rejected", catatan },
      {
        onSuccess: () => {
          setShowAlasanTolak(false);
          setShowSuccessTolak(true);
          setSelectedAlasan("");
          setCatatanLainnya("");
          setIsEditMode(false);
        }
      }
    );
  };

  const handleUbahKeProses = () => {
    if (!id || !verifikasi) return;
    updateVerifikasi.mutate(
      { id: verifikasi.id, status: "pending" },
      {
        onSuccess: () => {
          setEditStatus("PENGAJUAN");
          setShowUbahStatus(false);
          setSelectedAlasanPerubahan("");
          setIsEditMode(false);
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

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
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
        <h1 className="text-xl font-semibold">Detail Data Mitra</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={mitra.foto_profil || "/placeholder.svg"} />
                <AvatarFallback className="bg-muted text-lg">
                  {mitra.nama.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{mitra.nama}</h2>
              <p className="text-muted-foreground text-sm">Nebeng Motor</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-primary font-medium">{mitra.id.slice(0, 8).toUpperCase()}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <div className="mt-2">
                {isEditMode ? (
                  <Select value={editStatus} onValueChange={(val) => setEditStatus(val as DisplayStatus)}>
                    <SelectTrigger className="w-40 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENGAJUAN">
                        <span className="text-orange-500">Pengajuan</span>
                      </SelectItem>
                      <SelectItem value="TERVERIFIKASI">
                        <span className="text-green-500">Terverifikasi</span>
                      </SelectItem>
                      <SelectItem value="DITOLAK">
                        <span className="text-red-500">Ditolak</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    {getStatusBadge(currentStatus)}
                    {isBlocked && (
                      <span className="text-xs text-muted-foreground">(Status tidak dapat diubah)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Button 
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={handleSave}
                disabled={updateVerifikasi.isPending}
              >
                {updateVerifikasi.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            ) : isBlocked ? (
              <Button 
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setShowUnblockConfirm(true)}
              >
                <LockOpen size={16} />
                <span>Unblock</span>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleEnterEditMode}
              >
                <span>Edit</span>
                <Edit size={16} />
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
              <Input value={mitra.nama} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <Input value={mitra.email} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tempat Lahir</label>
              <Input value={verifikasi?.tempat_lahir || "-"} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tanggal Lahir</label>
              <div className="relative mt-1">
                <Input value={formatDate(mitra.tanggal_lahir)} readOnly className="bg-muted/50 pr-10" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
              <Input value={verifikasi?.jenis_kelamin || "-"} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">No. Tlp</label>
              <Input value={mitra.no_hp || "-"} readOnly className="mt-1 bg-muted/50" />
            </div>
          </div>
        </div>

        {/* Informasi KTP */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Informasi KTP</h3>
          <div className="flex gap-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                <Input value={verifikasi?.nama_ktp || "-"} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">NIK</label>
                <Input value={verifikasi?.no_ktp || "-"} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
                <Input value={verifikasi?.jenis_kelamin || "-"} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Tanggal Lahir</label>
                <div className="relative mt-1">
                  <Input value={formatDate(verifikasi?.tanggal_lahir_ktp || null)} readOnly className="bg-muted/50 pr-10" />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
            </div>
            {verifikasi?.foto_ktp && (
              <div 
                className="relative w-32 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setPreviewImage({ src: verifikasi.foto_ktp!, title: "Foto KTP" })}
              >
                <img src={verifikasi.foto_ktp} alt="KTP" className="w-full h-full object-cover" />
                <div className="absolute bottom-1 right-1 bg-primary/80 rounded-full p-1">
                  <SearchIcon size={12} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informasi SIM - placeholder since we don't have SIM data in DB yet */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Informasi SIM</h3>
          <div className="flex gap-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                <Input value={verifikasi?.nama_ktp || "-"} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Nomor SIM</label>
                <Input value="-" readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
                <Input value={verifikasi?.jenis_kelamin || "-"} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Tanggal Lahir</label>
                <div className="relative mt-1">
                  <Input value={formatDate(verifikasi?.tanggal_lahir_ktp || null)} readOnly className="bg-muted/50 pr-10" />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Konfirmasi Tolak */}
      <Dialog open={showConfirmTolak} onOpenChange={setShowConfirmTolak}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center py-4">
            <h2 className="text-lg font-semibold mb-2">
              Anda akan Menolak verifikasi mitra ini.
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
                onClick={handleTolakConfirm}
              >
                Ya.
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Alasan Penolakan */}
      <Dialog open={showAlasanTolak} onOpenChange={setShowAlasanTolak}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => {
                  setShowAlasanTolak(false);
                  setShowConfirmTolak(true);
                }}
              >
                <ChevronLeft size={16} />
              </Button>
              <DialogTitle>Pembatalan Verifikasi Mitra</DialogTitle>
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Berikan alasan pembatalan verifikasi mitra!
            </p>
            <RadioGroup value={selectedAlasan} onValueChange={setSelectedAlasan}>
              {alasanPenolakan.map((alasan) => (
                <div key={alasan} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value={alasan} id={alasan} />
                  <Label htmlFor={alasan} className="cursor-pointer">{alasan}</Label>
                </div>
              ))}
            </RadioGroup>
            {selectedAlasan === "Lainnya" && (
              <Textarea
                placeholder="Tulis alasan lainnya..."
                value={catatanLainnya}
                onChange={(e) => setCatatanLainnya(e.target.value)}
                className="mt-4"
              />
            )}
            <Button 
              className="w-full mt-6 bg-red-500 hover:bg-red-600"
              onClick={handleSubmitTolak}
              disabled={!selectedAlasan || (selectedAlasan === "Lainnya" && !catatanLainnya.trim()) || updateVerifikasi.isPending}
            >
              {updateVerifikasi.isPending ? "Memproses..." : "Konfirmasi Penolakan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Sukses Verifikasi */}
      <Dialog open={showSuccessVerifikasi} onOpenChange={setShowSuccessVerifikasi}>
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
              Verifikasi Mitra Berhasil
            </h2>
            <p className="text-muted-foreground mb-6">Mitra telah berhasil diverifikasi</p>
            <Button 
              onClick={() => setShowSuccessVerifikasi(false)}
              className="min-w-24"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Sukses Tolak */}
      <Dialog open={showSuccessTolak} onOpenChange={setShowSuccessTolak}>
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
            <p className="text-muted-foreground mb-6">Verifikasi mitra telah ditolak</p>
            <Button 
              onClick={() => setShowSuccessTolak(false)}
              className="min-w-24"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Ubah Status */}
      <Dialog open={showUbahStatus} onOpenChange={setShowUbahStatus}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Status ke Pengajuan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Pilih alasan perubahan status:
            </p>
            <RadioGroup value={selectedAlasanPerubahan} onValueChange={setSelectedAlasanPerubahan}>
              {alasanPerubahan.map((alasan) => (
                <div key={alasan} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value={alasan} id={`perubahan-${alasan}`} />
                  <Label htmlFor={`perubahan-${alasan}`} className="cursor-pointer">{alasan}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              className="w-full mt-6"
              onClick={handleUbahKeProses}
              disabled={!selectedAlasanPerubahan || updateVerifikasi.isPending}
            >
              {updateVerifikasi.isPending ? "Memproses..." : "Konfirmasi Perubahan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewImage?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img 
              src={previewImage?.src} 
              alt={previewImage?.title} 
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Unblock Popup */}
      <UnblockMitraPopup
        open={showUnblockConfirm}
        onClose={() => setShowUnblockConfirm(false)}
        onConfirm={handleUnblock}
        mitraName={mitra.nama}
        showSuccess={showUnblockSuccess}
        onCloseSuccess={() => setShowUnblockSuccess(false)}
      />
    </div>
  );
};

export default DetailMitra;

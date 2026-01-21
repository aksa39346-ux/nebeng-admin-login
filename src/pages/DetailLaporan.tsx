import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Copy, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BlockLaporanPopup from "@/components/BlockLaporanPopup";
import SaveLaporanPopup from "@/components/SaveLaporanPopup";
import { toast } from "sonner";
import { useLaporanDetail, useUpdateLaporan } from "@/hooks/useLaporan";
import { useUser, useUpdateUserStatus, StatusType } from "@/hooks/useUsers";
import { useVerifikasiByUser } from "@/hooks/useVerifikasi";
import { useBooking } from "@/hooks/useBookings";
import { useKendaraanByMitra } from "@/hooks/useKendaraan";
const DetailLaporan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch laporan data
  const { data: laporan, isLoading: isLoadingLaporan } = useLaporanDetail(id || "");
  const updateLaporan = useUpdateLaporan();
  const updateUserStatus = useUpdateUserStatus();
  
  // Fetch related booking if exists
  const { data: booking } = useBooking(laporan?.booking_id || "");
  
  // Fetch pelapor and dilaporkan user details
  const { data: pelaporUser } = useUser(laporan?.pelapor_id || "");
  const { data: dilaporkanUser } = useUser(laporan?.dilaporkan_id || "");
  
  // Fetch verifikasi for both users
  const { data: pelaporVerifikasi } = useVerifikasiByUser(laporan?.pelapor_id || "");
  const { data: dilaporkanVerifikasi } = useVerifikasiByUser(laporan?.dilaporkan_id || "");
  
  // Fetch kendaraan if dilaporkan is mitra
  const { data: kendaraanList } = useKendaraanByMitra(
    dilaporkanUser?.role === "mitra" ? dilaporkanUser.id : ""
  );
  const kendaraan = kendaraanList?.[0];

  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showBlockSuccess, setShowBlockSuccess] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showMitraDetail, setShowMitraDetail] = useState(false);
  const [editedLaporan, setEditedLaporan] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Update editedLaporan when laporan data loads
  if (laporan && !editedLaporan && laporan.hasil_investigasi) {
    setEditedLaporan(laporan.hasil_investigasi);
  }

  if (isLoadingLaporan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!laporan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Laporan tidak ditemukan</p>
      </div>
    );
  }

  // Determine who is customer and who is mitra based on roles
  const customerUser = pelaporUser?.role === "customer" ? pelaporUser : dilaporkanUser;
  const mitraUser = pelaporUser?.role === "mitra" ? pelaporUser : dilaporkanUser;
  const customerVerifikasi = pelaporUser?.role === "customer" ? pelaporVerifikasi : dilaporkanVerifikasi;
  const mitraVerifikasi = pelaporUser?.role === "mitra" ? pelaporVerifikasi : dilaporkanVerifikasi;

  const handleCopyId = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("ID berhasil disalin");
  };

  const handleBlockConfirm = (blockType: "mitra" | "customer") => {
    const userId = blockType === "mitra" ? mitraUser?.id : customerUser?.id;
    if (!userId) return;
    
    updateUserStatus.mutate(
      { id: userId, status: "blokir" },
      {
        onSuccess: () => {
          toast.success(`${blockType === "mitra" ? "Mitra" : "Customer"} berhasil diblokir`);
          setShowBlockConfirm(false);
          setShowBlockSuccess(true);
        }
      }
    );
  };

  const handleSaveLaporan = () => {
    if (!laporan?.id) return;
    
    updateLaporan.mutate(
      { id: laporan.id, hasil_investigasi: editedLaporan },
      {
        onSuccess: () => {
          setIsEditing(false);
          setShowSaveSuccess(true);
        }
      }
    );
  };

  const handleTanggapi = () => {
    setShowMitraDetail(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "selesai":
        return { label: "Selesai", bgColor: "bg-green-100", textColor: "text-green-700" };
      case "ditolak":
        return { label: "Ditolak", bgColor: "bg-red-100", textColor: "text-red-700" };
      default:
        return { label: "Proses", bgColor: "bg-yellow-100", textColor: "text-yellow-700" };
    }
  };

  const handleStatusChange = (newStatus: StatusType) => {
    if (!laporan?.id) return;
    
    updateLaporan.mutate(
      { id: laporan.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Status laporan berhasil diubah ke ${getStatusConfig(newStatus).label}`);
        }
      }
    );
  };

  const statusConfig = getStatusConfig(laporan.status);
  // Detail Laporan View
  if (!showMitraDetail) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/laporan")}
            className="h-8 w-8"
          >
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-2xl font-semibold">Detail Laporan</h1>
        </div>

        {/* Status & ID Pesanan */}
        <Card>
          <CardContent className="p-6">
            {/* Status Section */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-medium">Status Laporan:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`${statusConfig.bgColor} ${statusConfig.textColor} hover:${statusConfig.bgColor} gap-2 font-medium`}
                    disabled={updateLaporan.isPending}
                  >
                    {statusConfig.label}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("proses")}
                    className="text-yellow-700"
                  >
                    Proses
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("selesai")}
                    className="text-green-700"
                  >
                    Selesai
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("ditolak")}
                    className="text-red-700"
                  >
                    Ditolak
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ID Pesanan */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">ID Pesanan :</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {booking?.id ? `NEBENG-${booking.id.slice(0, 8).toUpperCase()}` : "-"}
                </span>
                {booking?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopyId(booking.id)}
                  >
                    <Copy size={16} />
                  </Button>
                )}
              </div>
            </div>
            {/* Customer and Mitra Info */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              {/* Customer */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={customerUser?.foto_profil || "/placeholder.svg"}
                    alt={customerUser?.nama || "Customer"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{customerUser?.nama || "-"}</h3>
                  <p className="text-muted-foreground text-sm">Costumer</p>
                  <p className="text-xs text-primary">ID: {customerUser?.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>

              {/* Mitra */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={mitraUser?.foto_profil || "/placeholder.svg"}
                      alt={mitraUser?.nama || "Mitra"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{mitraUser?.nama || "-"}</h3>
                    <p className="text-muted-foreground text-sm">Mitra</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">ID MITRA</p>
                  <div className="flex items-center gap-1">
                    <span className="text-primary font-medium">{mitraUser?.id.slice(0, 8).toUpperCase()}</span>
                    <ExternalLink size={14} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mt-8">
              <h4 className="font-semibold text-lg mb-4">Informasi Costumer</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                  <Input value={customerUser?.nama || "-"} disabled className="mt-1 bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">No. Tlp</label>
                  <Input value={customerUser?.no_hp || "-"} disabled className="mt-1 bg-gray-50" />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-muted-foreground">Catatan Untuk Driver</label>
                <Input value={booking?.catatan || "-"} disabled className="mt-1 bg-gray-50" />
              </div>
            </div>

            {/* Mitra Info */}
            <div className="mt-8">
              <h4 className="font-semibold text-lg mb-4">Informasi Mitra</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                  <Input value={mitraUser?.nama || "-"} disabled className="mt-1 bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">No. Tlp</label>
                  <Input value={mitraUser?.no_hp || "-"} disabled className="mt-1 bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm text-muted-foreground">Kendaraan</label>
                  <Input value={kendaraan?.jenis_kendaraan || "-"} disabled className="mt-1 bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Merk Kendaraan</label>
                  <Input value={kendaraan?.merk || "-"} disabled className="mt-1 bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm text-muted-foreground">Plat Nomor Kendaraan</label>
                  <Input value={kendaraan?.plat_nomor || "-"} disabled className="mt-1 bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Model Kendaraan</label>
                  <Input value={kendaraan?.model || "-"} disabled className="mt-1 bg-gray-50" />
                </div>
              </div>
            </div>

            {/* Laporan Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg">Laporan</h4>
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto"
                  onClick={handleTanggapi}
                >
                  Tanggapi
                </Button>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="font-medium text-sm text-muted-foreground mb-2">Jenis: {laporan.jenis_laporan}</p>
                <p className="text-foreground">{laporan.deskripsi}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Detail Data Mitra View (after clicking Tanggapi)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMitraDetail(false)}
          className="h-8 w-8"
        >
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-2xl font-semibold">Detail Data {dilaporkanUser?.role === "mitra" ? "Mitra" : "Customer"}</h1>
      </div>

      {/* Laporan Section with Edit */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg">Hasil Investigasi</h4>
            {!isEditing ? (
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setIsEditing(true)}
              >
                Edit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Button>
            ) : (
              <Button 
                className="bg-primary"
                onClick={handleSaveLaporan}
                disabled={updateLaporan.isPending}
              >
                Simpan
              </Button>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            {isEditing ? (
              <Textarea
                value={editedLaporan}
                onChange={(e) => setEditedLaporan(e.target.value)}
                className="min-h-[100px] bg-white"
                placeholder="Tulis hasil investigasi..."
              />
            ) : (
              <p className="text-foreground">{editedLaporan || laporan.hasil_investigasi || "Belum ada hasil investigasi"}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tindakan Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Tindakan</h4>
            <Button 
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => setShowBlockConfirm(true)}
            >
              Block Akun
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Blokir mitra atau customer yang terlibat dalam laporan ini
          </p>
        </CardContent>
      </Card>

      {/* Dilaporkan Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={dilaporkanUser?.foto_profil || "/placeholder.svg"}
                  alt={dilaporkanUser?.nama || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-xl">{dilaporkanUser?.nama || "-"}</h3>
              <p className="text-muted-foreground">
                {dilaporkanUser?.role === "mitra" ? `Nebeng ${kendaraan?.jenis_kendaraan || "Motor"}` : "Customer"}
              </p>
              <div className="flex items-center gap-1 text-primary">
                <span className="font-medium">{dilaporkanUser?.id.slice(0, 8).toUpperCase()}</span>
                <ExternalLink size={14} />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="mt-6">
            <h4 className="font-semibold text-lg mb-4">Informasi Pribadi</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                <Input value={dilaporkanUser?.nama || "-"} disabled className="mt-1 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <Input value={dilaporkanUser?.email || "-"} disabled className="mt-1 bg-gray-50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground">Tempat Lahir</label>
                <Input value={dilaporkanVerifikasi?.tempat_lahir || "-"} disabled className="mt-1 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Tanggal Lahir</label>
                <div className="relative">
                  <Input value={formatDate(dilaporkanUser?.tanggal_lahir)} disabled className="mt-1 bg-gray-50" />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
                <div className="relative">
                  <Input value={dilaporkanVerifikasi?.jenis_kelamin || "-"} disabled className="mt-1 bg-gray-50" />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">No. Tlp</label>
                <Input value={dilaporkanUser?.no_hp || "-"} disabled className="mt-1 bg-gray-50" />
              </div>
            </div>
          </div>

          {/* KTP Info */}
          <div className="mt-8">
            <h4 className="font-semibold text-lg mb-4">Informasi KTP</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">No. KTP</label>
                <Input value={dilaporkanVerifikasi?.no_ktp || "-"} disabled className="mt-1 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Nama di KTP</label>
                <Input value={dilaporkanVerifikasi?.nama_ktp || "-"} disabled className="mt-1 bg-gray-50" />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm text-muted-foreground">Alamat KTP</label>
              <Input value={dilaporkanVerifikasi?.alamat_ktp || "-"} disabled className="mt-1 bg-gray-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popups */}
      <BlockLaporanPopup
        open={showBlockConfirm}
        onOpenChange={setShowBlockConfirm}
        onConfirm={handleBlockConfirm}
        type="confirm"
        mitraName={mitraUser?.nama || "Mitra"}
        customerName={customerUser?.nama || "Customer"}
      />
      <BlockLaporanPopup
        open={showBlockSuccess}
        onOpenChange={setShowBlockSuccess}
        onConfirm={() => {}}
        type="success"
      />
      <SaveLaporanPopup
        open={showSaveSuccess}
        onOpenChange={setShowSaveSuccess}
      />
    </div>
  );
};

export default DetailLaporan;

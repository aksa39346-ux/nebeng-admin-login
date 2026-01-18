import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useBooking, BookingStatus } from "@/hooks/useBookings";
import { useKendaraanByMitra } from "@/hooks/useKendaraan";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-3">Selesai</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-3">Batal</Badge>;
    case "pending":
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3">Pending</Badge>;
    case "confirmed":
      return <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3">Dikonfirmasi</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white text-xs px-3">{status}</Badge>;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
};

const DetailPesanan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch booking data
  const { data: booking, isLoading: isLoadingBooking } = useBooking(id || "");
  
  // Fetch vehicle data for the mitra
  const { data: kendaraan, isLoading: isLoadingKendaraan } = useKendaraanByMitra(booking?.mitra_id || "");

  if (isLoadingBooking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Data pesanan tidak ditemukan</p>
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(booking.id);
    toast({
      title: "Berhasil",
      description: "ID Pesanan berhasil disalin",
    });
  };

  // Get vehicle info
  const vehicle = kendaraan?.[0];
  
  // Format dates
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: localeId });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    return timeString?.slice(0, 5) || "-";
  };

  // Calculate admin fee (10% of total)
  const adminFee = Math.round(booking.total_harga * 0.1);
  const basePrice = booking.total_harga - adminFee;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate("/dashboard/pesanan")}
        >
          <ChevronLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Detail Pesanan</h1>
      </div>

      {/* ID Pesanan */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">ID Pesanan :</span>
        <span className="text-sm text-muted-foreground">{booking.id.slice(0, 8).toUpperCase()}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyId}>
          <Copy size={14} />
        </Button>
      </div>

      {/* Customer and Mitra Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-14 w-14">
                <AvatarImage src={booking.customer?.foto_profil || "/placeholder.svg"} />
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {booking.customer?.nama?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{booking.customer?.nama || "Unknown"}</h3>
                <p className="text-sm text-muted-foreground">Customer</p>
                <div className="mt-1">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            </div>

            <h4 className="font-semibold mb-4">Informasi Customer</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                <Input value={booking.customer?.nama || "-"} readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">No. Tlp</label>
                <Input value={booking.customer?.no_hp || "-"} readOnly className="bg-muted/50" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Catatan Untuk Driver</label>
              <Input value={booking.catatan || "-"} readOnly className="bg-muted/50" />
            </div>
          </CardContent>
        </Card>

        {/* Mitra Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-14 w-14">
                <AvatarImage src={booking.mitra?.foto_profil || "/placeholder.svg"} />
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  {booking.mitra?.nama?.charAt(0) || "M"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{booking.mitra?.nama || "Unknown"}</h3>
                <p className="text-sm text-muted-foreground">Mitra</p>
                <div className="mt-1">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">ID MITRA</p>
                <p className="text-sm font-medium">{booking.mitra_id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>

            <h4 className="font-semibold mb-4">Informasi Mitra</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                <Input value={booking.mitra?.nama || "-"} readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">No. Tlp</label>
                <Input value={booking.mitra?.no_hp || "-"} readOnly className="bg-muted/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Kendaraan</label>
                <Input value={vehicle?.jenis_kendaraan || "-"} readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Merk Kendaraan</label>
                <Input value={vehicle ? `${vehicle.merk} ${vehicle.model}` : "-"} readOnly className="bg-muted/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Plat Nomor Kendaraan</label>
                <Input value={vehicle?.plat_nomor || "-"} readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Warna Kendaraan</label>
                <Input value={vehicle?.warna || "-"} readOnly className="bg-muted/50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rincian Perjalanan and Pembayaran */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rincian Perjalanan */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4">Rincian Perjalanan</h4>
            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-muted-foreground">
                {booking.tebengan?.tanggal_berangkat ? formatDate(booking.tebengan.tanggal_berangkat) : "-"}
              </span>
              <span className="text-muted-foreground">{booking.jumlah_penumpang} Penumpang</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Titik Jemput */}
              <div>
                <p className="text-xs text-primary font-medium mb-2">Titik Jemput</p>
                <h5 className="font-semibold text-primary text-lg">{booking.tebengan?.lokasi_jemput || "-"}</h5>
                <p className="text-sm text-muted-foreground">
                  {booking.tebengan?.waktu_berangkat ? formatTime(booking.tebengan.waktu_berangkat) : "-"}
                </p>
              </div>

              {/* Timeline dots */}
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="w-1 h-1 rounded-full bg-red-500"></div>
                  <div className="w-1 h-1 rounded-full bg-red-500"></div>
                  <div className="w-1 h-1 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-primary font-medium mb-2">Tujuan</p>
              <h5 className="font-semibold text-primary text-lg">{booking.tebengan?.lokasi_tujuan || "-"}</h5>
              <p className="text-sm text-muted-foreground">
                {booking.tebengan?.jenis || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rincian Pembayaran */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4">Rincian Pembayaran</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status Pembayaran</span>
                <span className="text-sm font-medium capitalize">{booking.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tanggal</span>
                <span className="text-sm font-medium">{formatDate(booking.tanggal_booking)}</span>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">ID Pesanan</span>
                  <span className="text-sm font-medium">{booking.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Jumlah Penumpang</span>
                  <span className="text-sm font-medium">{booking.jumlah_penumpang} Orang</span>
                </div>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Biaya Per Penebeng ({booking.jumlah_penumpang} Org)
                  </span>
                  <span className="text-sm font-medium">{formatCurrency(basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Biaya Admin</span>
                  <span className="text-sm font-medium">{formatCurrency(adminFee)}</span>
                </div>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className={`text-lg font-bold ${booking.status === "cancelled" ? "text-red-500 line-through" : "text-primary"}`}>
                    {formatCurrency(booking.total_harga)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailPesanan;

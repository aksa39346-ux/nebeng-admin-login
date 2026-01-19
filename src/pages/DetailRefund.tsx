import { useNavigate, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRefund } from "@/hooks/useRefunds";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return "0.00,-";
  return `${amount.toLocaleString('id-ID')}.00,-`;
};

const DetailRefund = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { data: refund, isLoading } = useRefund(id || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-background p-4">
        <Card className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-xl p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-8 w-40 mx-auto" />
            <Skeleton className="h-40 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (!refund) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Data refund tidak ditemukan</p>
          <Button onClick={() => navigate("/dashboard/refund")}>Kembali</Button>
        </div>
      </div>
    );
  }

  // Map database status to display status
  const getDisplayStatus = (status: string) => {
    switch (status) {
      case "aktif": return "SELESAI";
      case "proses": return "PROSES";
      case "tidak aktif": return "BATAL";
      case "blokir": return "BATAL";
      default: return "PROSES";
    }
  };

  const displayStatus = getDisplayStatus(refund.status);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "SELESAI":
        return {
          title: "REFUND SALDO BERHASIL",
          bgColor: "bg-[#6366f1]",
          iconBg: "bg-[#3b82f6]",
          icon: <Check className="text-white" size={32} />,
          textColor: "text-foreground",
        };
      case "PROSES":
        return {
          title: "REFUND SALDO DIPROSES",
          bgColor: "bg-[#6366f1]",
          iconBg: "bg-transparent",
          icon: (
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-[#1e3a5f]"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
          ),
          textColor: "text-foreground",
        };
      case "BATAL":
        return {
          title: "REFUND SALDO DIBATALKAN",
          bgColor: "bg-gray-400",
          iconBg: "bg-gray-400",
          icon: <X className="text-white" size={32} />,
          textColor: "text-gray-400",
        };
      default:
        return {
          title: "REFUND SALDO",
          bgColor: "bg-gray-400",
          iconBg: "bg-gray-400",
          icon: null,
          textColor: "text-foreground",
        };
    }
  };

  const statusConfig = getStatusConfig(displayStatus);

  // Calculate breakdown
  const biayaPenumpang = refund.booking?.tebengan 
    ? { quantity: 1, price: refund.booking.total_harga } 
    : { quantity: 1, price: refund.jumlah_refund };
  const biayaAdmin = 0; // Admin fee calculation
  const totalRefund = refund.jumlah_refund;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-background p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="text-center pt-8 pb-6 px-6">
          <h2 className={`text-lg font-bold mb-6 ${displayStatus === "BATAL" ? "text-gray-400" : "text-foreground"}`}>
            {statusConfig.title}
          </h2>
          
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {displayStatus === "SELESAI" && (
              <div className="w-16 h-16 rounded-full bg-[#3b82f6] flex items-center justify-center">
                <Check className="text-white" size={32} />
              </div>
            )}
            {displayStatus === "PROSES" && (
              <div className="flex gap-2 py-4">
                <div className="w-4 h-4 rounded-full bg-[#1e3a5f]"></div>
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              </div>
            )}
            {displayStatus === "BATAL" && (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                <X className="text-white" size={32} />
              </div>
            )}
          </div>

          {/* Date */}
          <p className={`text-sm mb-2 ${displayStatus === "BATAL" ? "text-gray-400" : "text-muted-foreground"}`}>
            {format(new Date(refund.tanggal_pengajuan), "EEEE, dd MMMM yyyy", { locale: localeId })}
          </p>

          {/* Amount */}
          <p className={`text-3xl font-bold ${displayStatus === "BATAL" ? "text-gray-400" : "text-foreground"}`}>
            {formatCurrency(refund.jumlah_refund)}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 mx-6"></div>

        {/* Details */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ID Pesanan</span>
            <span className="font-medium">NEBENG-{refund.booking_id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">No. Transaksi</span>
            <span className="font-medium">TRX-{refund.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mx-6"></div>

        {/* Breakdown */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Metode Refund</span>
            <span className="font-medium">Saldo Nebeng</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Layanan Nebeng</span>
            <span className="font-medium">{refund.booking?.tebengan?.lokasi_jemput ? "Nebeng Motor" : "Nebeng"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Biaya Penumpang</span>
            <span className="font-medium"></span>
          </div>
          <div className="flex justify-between text-sm pl-4">
            <span className="text-muted-foreground">{biayaPenumpang.quantity} x {formatCurrency(biayaPenumpang.price)}</span>
            <span className="font-medium">{formatCurrency(biayaPenumpang.quantity * biayaPenumpang.price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Biaya Admin</span>
            <span className="font-medium">{formatCurrency(biayaAdmin)}</span>
          </div>
          {refund.alasan && (
            <div className="pt-2 border-t">
              <span className="text-sm text-muted-foreground">Alasan:</span>
              <p className="text-sm font-medium mt-1">{refund.alasan}</p>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total Refund</span>
            <span className="font-bold text-lg">{formatCurrency(totalRefund)}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mx-6"></div>

        {/* Route Info */}
        {refund.booking?.tebengan && (
          <div className="px-6 py-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-[#3b82f6] font-medium mb-1">Titik Jemput</p>
                <p className="font-semibold">{refund.booking.tebengan.lokasi_jemput}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(refund.booking.tebengan.tanggal_berangkat), "dd MMM yyyy", { locale: localeId })}
                </p>
              </div>
              <div className="flex items-center px-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#3b82f6] font-medium mb-1">Tujuan</p>
                <p className="font-semibold">{refund.booking.tebengan.lokasi_tujuan}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(refund.booking.tebengan.tanggal_berangkat), "dd MMM yyyy", { locale: localeId })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="px-6 pb-6">
          <Button 
            className="w-full bg-[#1e3a5f] hover:bg-[#152a45] text-white py-6"
            onClick={() => navigate("/dashboard/refund")}
          >
            CLOSE
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DetailRefund;

import { useState } from "react";
import { Search, Calendar, Download, Eye, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data
const mitraData = [
  { id: "100092", nama: "Muhammda Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Motor", status: "PENGAJUAN" },
  { id: "100092", nama: "Muhammda Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Mobil", status: "PENGAJUAN" },
  { id: "100092", nama: "Muhammda Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Titip Barang", status: "PENGAJUAN" },
  { id: "100092", nama: "Muhammda Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Barang", status: "PENGAJUAN" },
  { id: "100092", nama: "Muhammda Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Mobil", status: "PENGAJUAN" },
  { id: "100092", nama: "Muhammda Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Motor", status: "PENGAJUAN" },
  { id: "100092", nama: "Muhammda Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Barang", status: "PENGAJUAN" },
  { id: "100092", nama: "Muhammda Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Mobil", status: "PENGAJUAN" },
  { id: "100092", nama: "Muhammda Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Motor", status: "PENGAJUAN" },
  { id: "100092", nama: "Muhammda Abdul", email: "dul22345@gmail.com", noTlp: "089563245757", layanan: "Mobil", status: "PENGAJUAN" },
];

const VerifikasiMitra = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const totalEntries = 120;
  const totalPages = 6;

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Data Mitra</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-background border-border"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Calendar size={18} />
                Kalender
              </Button>
              <Button className="gap-2 bg-primary">
                <Download size={18} />
                Download
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left py-3 px-4 font-medium rounded-tl-lg">NO. ID</th>
                  <th className="text-left py-3 px-4 font-medium">NAMA</th>
                  <th className="text-left py-3 px-4 font-medium">EMAIL</th>
                  <th className="text-left py-3 px-4 font-medium">NO. TLP</th>
                  <th className="text-left py-3 px-4 font-medium">LAYANAN</th>
                  <th className="text-left py-3 px-4 font-medium">STATUS</th>
                  <th className="text-center py-3 px-4 font-medium rounded-tr-lg">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {mitraData.map((mitra, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-4 px-4">{mitra.id}</td>
                    <td className="py-4 px-4">{mitra.nama}</td>
                    <td className="py-4 px-4 text-primary">{mitra.email}</td>
                    <td className="py-4 px-4">{mitra.noTlp}</td>
                    <td className="py-4 px-4">{mitra.layanan}</td>
                    <td className="py-4 px-4">
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                        {mitra.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye size={18} className="text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 size={18} className="text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>of {totalEntries} entries</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &lt;
              </Button>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="icon"
                  className={`h-8 w-8 ${currentPage === page ? "bg-primary text-white" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <span className="px-2 text-muted-foreground">...</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &gt;
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifikasiMitra;

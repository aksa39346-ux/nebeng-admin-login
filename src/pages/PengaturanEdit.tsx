import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Camera } from "lucide-react";
import SavePengaturanPopup from "@/components/SavePengaturanPopup";

const PengaturanEdit = () => {
  const navigate = useNavigate();
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    namaLengkap: "Muhammad Abdul Kadir",
    email: "Abdul000@gmail.com",
    tempatLahir: "London",
    tanggalLahir: "01-02-1999",
    jenisKelamin: "Laki - Laki",
    noTlp: "089373933994",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveClick = () => {
    setShowSavePopup(true);
  };

  const handleConfirmSave = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSavePopup(false);
    setShowSuccess(false);
    navigate("/dashboard/pengaturan");
  };

  const handleCancelSave = () => {
    setShowSavePopup(false);
  };

  const handleCancel = () => {
    navigate("/dashboard/pengaturan");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Edit Pengaturan</h1>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          {/* Profile Header with Photo Upload */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                  MA
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Muhammad Abdul</h2>
              <p className="text-sm text-muted-foreground">Nebeng Motor</p>
              <p className="text-sm text-muted-foreground">Admin</p>
            </div>
          </div>

          {/* Informasi Pribadi */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Informasi Pribadi</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Nama Lengkap</Label>
                <Input
                  value={profileData.namaLengkap}
                  onChange={(e) => setProfileData({ ...profileData, namaLengkap: e.target.value })}
                  className="bg-muted/50 border-muted"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="bg-muted/50 border-muted"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Tempat Lahir</Label>
                <Input
                  value={profileData.tempatLahir}
                  onChange={(e) => setProfileData({ ...profileData, tempatLahir: e.target.value })}
                  className="bg-muted/50 border-muted"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Tanggal Lahir</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value="1999-02-01"
                    onChange={(e) => setProfileData({ ...profileData, tanggalLahir: e.target.value })}
                    className="bg-muted/50 border-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Jenis Kelamin</Label>
                <Select
                  value={profileData.jenisKelamin}
                  onValueChange={(value) => setProfileData({ ...profileData, jenisKelamin: value })}
                >
                  <SelectTrigger className="bg-muted/50 border-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki - Laki">Laki - Laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">No. Tlp</Label>
                <Input
                  value={profileData.noTlp}
                  onChange={(e) => setProfileData({ ...profileData, noTlp: e.target.value })}
                  className="bg-muted/50 border-muted"
                />
              </div>
            </div>
          </div>

          {/* Informasi Akun */}
          <div className="space-y-6 mt-8">
            <h3 className="text-lg font-semibold text-foreground">Ubah Password</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Password Baru</Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Masukkan Password Baru"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="bg-muted/50 border-muted pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Masukkan Password Baru"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="bg-muted/50 border-muted pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button onClick={handleSaveClick}>
              Simpan Perubahan
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Batal
            </Button>
          </div>
        </CardContent>
      </Card>

      <SavePengaturanPopup
        open={showSavePopup}
        onOpenChange={setShowSavePopup}
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
        showSuccess={showSuccess}
        onSuccessClose={handleSuccessClose}
      />
    </div>
  );
};

export default PengaturanEdit;

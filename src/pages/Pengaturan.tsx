import { useState } from "react";
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
import { Eye, EyeOff, Pencil, Calendar } from "lucide-react";

const Pengaturan = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    namaLengkap: "Muhammad Abdul Kadir",
    email: "Abdul000@gmail.com",
    tempatLahir: "London",
    tanggalLahir: "01-02-1999",
    jenisKelamin: "Laki - Laki",
    noTlp: "089373933994",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "password123",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Pengaturan</h1>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-muted text-muted-foreground text-xl">
                  MA
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Muhammad Abdul</h2>
                <p className="text-sm text-muted-foreground">Nebeng Motor</p>
                <p className="text-sm text-muted-foreground">Admin</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary hover:bg-primary/10"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
            >
              Edit <Pencil className="ml-1 h-4 w-4" />
            </Button>
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
                  disabled={!isEditingProfile}
                  className="bg-muted/50 border-muted disabled:opacity-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditingProfile}
                  className="bg-muted/50 border-muted disabled:opacity-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Tempat Lahir</Label>
                <Input
                  value={profileData.tempatLahir}
                  onChange={(e) => setProfileData({ ...profileData, tempatLahir: e.target.value })}
                  disabled={!isEditingProfile}
                  className="bg-muted/50 border-muted disabled:opacity-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Tanggal Lahir</Label>
                <div className="relative">
                  <Input
                    value={profileData.tanggalLahir}
                    onChange={(e) => setProfileData({ ...profileData, tanggalLahir: e.target.value })}
                    disabled={!isEditingProfile}
                    className="bg-muted/50 border-muted disabled:opacity-100 pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Jenis Kelamin</Label>
                <Select
                  value={profileData.jenisKelamin}
                  onValueChange={(value) => setProfileData({ ...profileData, jenisKelamin: value })}
                  disabled={!isEditingProfile}
                >
                  <SelectTrigger className="bg-muted/50 border-muted disabled:opacity-100">
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
                  disabled={!isEditingProfile}
                  className="bg-muted/50 border-muted disabled:opacity-100"
                />
              </div>
            </div>
          </div>

          {/* Informasi Akun */}
          <div className="space-y-6 mt-8">
            <h3 className="text-lg font-semibold text-foreground">Informasi Akun</h3>
            
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      disabled={!isEditingPassword}
                      className="bg-muted/50 border-muted disabled:opacity-100 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary border-primary hover:bg-primary/10"
                  onClick={() => setIsEditingPassword(!isEditingPassword)}
                >
                  Edit <Pencil className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {isEditingPassword && (
                <>
                  <div className="space-y-2 max-w-md">
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

                  <div className="space-y-2 max-w-md">
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

                  <Button className="mt-4">
                    Simpan Password
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pengaturan;

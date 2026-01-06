import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Profile Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                K
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Ubah Foto
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" defaultValue="Kaori000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="kaori@nebeng.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">No. Telepon</Label>
              <Input id="phone" defaultValue="089512345678" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="Super Admin" disabled />
            </div>
          </div>

          <Button className="w-full">Simpan Perubahan</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

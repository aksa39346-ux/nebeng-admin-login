import { Search, Bell, X, UserCheck, AlertTriangle, XCircle, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface DashboardHeaderProps {
  userName?: string;
  pageTitle?: string;
  showWelcome?: boolean;
}

// Notification data
const notifications = [
  {
    id: 1,
    title: "Inosuke mendaftar sebagai mitra",
    description: "Menunggu verifikasi dari admin",
    time: "12 jam lalu",
    type: "mitra",
    icon: UserCheck,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 2,
    title: "Tanjiro merubah informasi akun",
    description: "Pada halaman mitra",
    time: "23 jam lalu",
    type: "info",
    icon: UserCheck,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: 3,
    title: "Tanjiro membatalkan tebengan",
    description: "Pada halaman pesanan",
    time: "2 hari lalu",
    type: "cancel",
    icon: XCircle,
    bgColor: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    id: 4,
    title: "Nezuko melakukan pelaporan mitra",
    description: "Pada halaman laporan",
    time: "10 hari lalu",
    type: "warning",
    icon: AlertTriangle,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-500",
  },
];

const DashboardHeader = ({ userName = "Admin", pageTitle = "Dashboard", showWelcome = false }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-16 bg-background border-b flex items-center justify-between px-6">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-foreground">
        {showWelcome ? `Selamat Datang, ${userName} 👋` : pageTitle}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search"
            className="w-64 pl-10 h-10 bg-muted/50 border-border"
          />
        </div>

        {/* Notifications */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Notifikasi</h3>
              <button
                onClick={() => setNotifOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${notif.bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <notif.icon size={20} className={notif.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {notif.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{userName}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 p-2 bg-background shadow-lg border rounded-lg">
            <DropdownMenuItem 
              onClick={() => navigate("/dashboard/pengaturan")}
              className="flex items-center justify-between py-3 px-4 cursor-pointer"
            >
              <span>Pengaturan</span>
              <User size={18} className="text-muted-foreground" />
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/")} 
              className="flex items-center justify-between py-3 px-4 cursor-pointer"
            >
              <span>Log out</span>
              <LogOut size={18} className="text-muted-foreground" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;

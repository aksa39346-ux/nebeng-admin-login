import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmationPopup from "@/components/ConfirmationPopup";
import { resetPassword } from "@/services/api";
import { toast } from "sonner";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Token dan email dari URL (Laravel kirim via email link)
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }

    setIsLoading(true);

    const { error } = await resetPassword({
      token,
      email,
      password: newPassword,
      password_confirmation: confirmPassword,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    setShowPopup(true);
  };

  const handlePopupClose = (open: boolean) => {
    setShowPopup(open);
    if (!open) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Card with top border */}
        <div className="bg-background rounded-lg shadow-lg overflow-hidden">
          {/* Top accent border */}
          <div className="h-1.5 bg-primary" />
          
          <div className="p-8">
            {/* Header with back button and lock icon */}
            <div className="flex items-start justify-between mb-6">
              <button
                onClick={() => navigate("/forgot-password")}
                className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-12 h-12 rounded-lg border-2 border-primary flex items-center justify-center">
                <Lock className="text-primary" size={24} />
              </div>
            </div>

            {/* Title and description */}
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Buat Kata Sandi Baru
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Kata sandi Anda harus delapan karakter dan berisi kombinasi angka, huruf, dan karakter khusus (#?!).
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                  Masukkan Sandi Baru
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Kata Sandi Baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 border-border bg-background placeholder:text-muted-foreground/60 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Ulang Sandi Baru
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Masukan Kata Sandi Baru Sekali Lagi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 border-border bg-background placeholder:text-muted-foreground/60 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Simpan"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      <ConfirmationPopup
        open={showPopup}
        onOpenChange={handlePopupClose}
        type="password-changed"
      />
    </div>
  );
};

export default ResetPassword;

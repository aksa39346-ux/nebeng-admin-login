import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import VerifikasiMitra from "./pages/VerifikasiMitra";
import DetailMitra from "./pages/DetailMitra";
import DaftarMitra from "./pages/DaftarMitra";
import VerifikasiCustomer from "./pages/VerifikasiCustomer";
import DetailCustomer from "./pages/DetailCustomer";
import { MitraProvider } from "./contexts/MitraContext";
import { CustomerProvider } from "./contexts/CustomerContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MitraProvider>
        <CustomerProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="verifikasi-mitra" element={<VerifikasiMitra />} />
                <Route path="verifikasi-mitra/:id" element={<DetailMitra />} />
                <Route path="mitra" element={<DaftarMitra />} />
                <Route path="mitra/:id" element={<DetailMitra />} />
                <Route path="verifikasi-costumer" element={<VerifikasiCustomer />} />
                <Route path="verifikasi-costumer/:id" element={<DetailCustomer />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CustomerProvider>
      </MitraProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

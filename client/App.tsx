import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import PlaceholderPage from "@/components/app/PlaceholderPage";
import Booking from "./pages/Booking";
import Resources from "./pages/Resources";
import Forum from "./pages/Forum";
import Admin from "./pages/Admin";
import LoginStudent from "./pages/LoginStudent";
import LoginInstitute from "./pages/LoginInstitute";
import LoginAdmin from "./pages/LoginAdmin";
import PanelStudent from "./pages/PanelStudent";
import PanelInstitute from "./pages/PanelInstitute";
import PanelAdmin from "./pages/PanelAdmin";
import LoginCounselor from "./pages/LoginCounselor";
import PanelCounselor from "./pages/PanelCounselor";
import { Header } from "@/components/app/Header";
import { CrisisFooter } from "@/components/app/CrisisFooter";
import { DarkStarfield } from "@/components/app/DarkStarfield";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <DarkStarfield />
      <div className="min-h-screen flex flex-col relative z-[1]">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login/student" element={<LoginStudent />} />
            <Route path="/login/institute" element={<LoginInstitute />} />
            <Route path="/login/admin" element={<LoginAdmin />} />
            <Route path="/panel/student" element={<PanelStudent />} />
            <Route path="/panel/institute" element={<PanelInstitute />} />
            <Route path="/panel/admin" element={<PanelAdmin />} />
            <Route path="/login/counselor" element={<LoginCounselor />} />
            <Route path="/panel/counselor" element={<PanelCounselor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <CrisisFooter />
      </div>
    </BrowserRouter>
  </TooltipProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

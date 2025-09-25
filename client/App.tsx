import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AnonymousLogin from "./pages/AnonymousLogin";
import PlaceholderPage from "@/components/app/PlaceholderPage";
import Booking from "./pages/Booking";
import Resources from "./pages/Resources";
import Forum from "./pages/Forum";
import Gamification from "./pages/Gamification";
import NavigationTest from "./pages/NavigationTest";
import Admin from "./pages/Admin";
import LoginInstitute from "./pages/LoginInstitute";
import LoginAdmin from "./pages/LoginAdmin";
import PanelInstitute from "./pages/PanelInstitute";
import PanelAdmin from "./pages/PanelAdmin";
import LoginCounselor from "./pages/LoginCounselor";
import PanelCounselor from "./pages/PanelCounselor";
import { Header } from "@/components/app/Header";
import { InstituteHeader } from "@/components/app/InstituteHeader";
import { CounselorHeader } from "@/components/app/CounselorHeader";
import { useRole } from "@/hooks/use-role";
import { CrisisFooter } from "@/components/app/CrisisFooter";
import { DarkStarfield } from "@/components/app/DarkStarfield";
import VapiWidget from "@/components/VapiWidget";
import { useVapiConfig } from "@/hooks/useVapi";
import { useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

const VapiWidgetWrapper = () => {
  const { role } = useRole();
  const location = useLocation();
  const vapiConfig = useVapiConfig();

  // Debug logging
  console.log('VapiWidget Debug:', {
    role,
    pathname: location.pathname,
    vapiConfigured: vapiConfig.isConfigured,
    apiKey: vapiConfig.apiKey ? 'Present' : 'Missing',
    assistantId: vapiConfig.assistantId ? 'Present' : 'Missing'
  });

  // Show voice widget on all pages for now (ignoring role requirement for testing)
  const showVapiWidget = 
    vapiConfig.isConfigured &&
    ["/", "/chat", "/resources", "/forum", "/gamification", "/navigation-test"].includes(location.pathname);

  console.log('Should show Vapi widget:', showVapiWidget);

  // Show widget if Vapi is configured
  if (!vapiConfig.isConfigured) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-red-500 text-white p-3 rounded-lg text-sm max-w-xs">
        ❌ Vapi not configured<br />
        API Key: {vapiConfig.apiKey ? '✅' : '❌'}<br />
        Assistant ID: {vapiConfig.assistantId ? '✅' : '❌'}
      </div>
    );
  }

  if (!showVapiWidget) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-blue-500 text-white p-3 rounded-lg text-sm">
        📍 Wrong page: {location.pathname}
      </div>
    );
  }

  return (
    <VapiWidget
      apiKey={vapiConfig.apiKey!}
      assistantId={vapiConfig.assistantId!}
      theme="mental-health"
      config={{
        voice: {
          provider: 'playht',
          voiceId: 'jennifer', // Calm, empathetic voice
        },
        firstMessage: "Hi! I'm here to provide emotional support and guidance. How are you feeling today?",
        // Add mental health specific configurations
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US',
        },
      }}
    />
  );
};

const App = () => {
  const { role } = useRole();
  const StudentHeader = <Header />;
  const ActiveHeader =
    role === "institute" ? (
      <InstituteHeader />
    ) : role === "counselor" ? (
      <CounselorHeader />
    ) : (
      StudentHeader
    );
  
  return (
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <DarkStarfield />
          <div className="min-h-screen flex flex-col relative z-[1]">
            {ActiveHeader}
            <main className="flex-1">
              <Routes>
                {/* Student Routes */}
                <Route
                  path="/"
                  element={
                    role && role !== "student" ? (
                      <Navigate
                        to={
                          role === "institute"
                            ? "/panel/institute"
                            : role === "counselor"
                              ? "/panel/counselor"
                              : "/admin"
                        }
                        replace
                      />
                    ) : (
                      <Index />
                    )
                  }
                />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/anonymous-login" element={<AnonymousLogin />} />
                
                {/* Protected Student Routes */}
                <Route
                  path="/chat"
                  element={
                    role && role !== "student" ? (
                      <Navigate
                        to={
                          role === "institute"
                            ? "/panel/institute"
                            : "/panel/counselor"
                        }
                        replace
                      />
                    ) : (
                      <ProtectedRoute><Chat /></ProtectedRoute>
                    )
                  }
                />
                <Route
                  path="/booking"
                  element={
                    role && role !== "student" ? (
                      <Navigate
                        to={
                          role === "institute"
                            ? "/panel/institute"
                            : "/panel/counselor"
                        }
                        replace
                      />
                    ) : (
                      <ProtectedRoute><Booking /></ProtectedRoute>
                    )
                  }
                />
                <Route
                  path="/resources"
                  element={
                    role && role !== "student" ? (
                      <Navigate
                        to={
                          role === "institute"
                            ? "/panel/institute"
                            : "/panel/counselor"
                        }
                        replace
                      />
                    ) : (
                      <ProtectedRoute><Resources /></ProtectedRoute>
                    )
                  }
                />
                <Route
                  path="/forum"
                  element={
                    role && role !== "student" ? (
                      <Navigate
                        to={
                          role === "institute"
                            ? "/panel/institute"
                            : "/panel/counselor"
                        }
                        replace
                      />
                    ) : (
                      <ProtectedRoute><Forum /></ProtectedRoute>
                    )
                  }
                />
                <Route
                  path="/gamification"
                  element={
                    role && role !== "student" ? (
                      <Navigate
                        to={
                          role === "institute"
                            ? "/panel/institute"
                            : "/panel/counselor"
                        }
                        replace
                      />
                    ) : (
                      <ProtectedRoute><Gamification /></ProtectedRoute>
                    )
                  }
                />
                <Route
                  path="/navigation-test"
                  element={<NavigationTest />}
                />
                
                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    role && role !== "admin" ? (
                      <Navigate to="/login/admin" replace />
                    ) : (
                      <ProtectedRoute><Admin /></ProtectedRoute>
                    )
                  }
                />
                
                {/* Role-based Login Routes */}
                <Route path="/login/student" element={<Navigate to="/" replace />} />
                <Route path="/login/institute" element={<LoginInstitute />} />
                <Route path="/login/admin" element={<LoginAdmin />} />
                <Route path="/login/counselor" element={<LoginCounselor />} />
                
                {/* Role-based Panel Routes */}
                <Route path="/panel/student" element={<Navigate to="/" replace />} />
                <Route path="/panel/institute" element={<PanelInstitute />} />
                <Route path="/panel/counselor" element={<PanelCounselor />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <CrisisFooter />
            <VapiWidgetWrapper />
          </div>
        </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

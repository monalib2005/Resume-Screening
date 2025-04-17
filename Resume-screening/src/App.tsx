import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GoogleOAuthProvider clientId="527647480558-ftvq69h51bjrd8koqmf95sn1otci2ara.apps.googleusercontent.com">
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/signin"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />}
              />
              <Route
                path="/signup"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />}
              />
              <Route
                path="/dashboard"
                element={<Dashboard/>}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
        </GoogleOAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

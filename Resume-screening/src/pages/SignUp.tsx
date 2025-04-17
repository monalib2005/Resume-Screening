
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="container mx-auto p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Button>
      </header>
      
      <main className="flex-1 container mx-auto flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Create an account</h2>
            <p className="text-muted-foreground">Sign up to get started with ResumeSparkRecruit</p>
          </div>
          
          <AuthForm type="signup" />
        </div>
      </main>
      
      <footer className="container mx-auto p-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ResumeSparkRecruit. All rights reserved.</p>
      </footer>
    </div>
  );
}

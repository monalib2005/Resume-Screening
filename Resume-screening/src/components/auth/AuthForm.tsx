import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";

type AuthFormProps = {
  type: "signin" | "signup";
};

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState(""); // For signup
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const trimmedEmail = email.trim();

    if (type === "signin") {
      if (!trimmedEmail || !password) {
        toast({
          title: "Error",
          description: "Please fill in all fields.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.post("http://localhost:5000/api/login", {
          email: trimmedEmail,
          password,
        });

        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");

        toast({
          title: "Success",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard");
      } catch (err: any) {
        toast({
          title: "Login Error",
          description: err.response?.data?.msg || err.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } else {
      // Signup logic
      if (!trimmedEmail || !password || !companyName) {
        toast({
          title: "Error",
          description: "Please fill in all fields.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.post("http://localhost:5000/api/signup", {
          email: trimmedEmail,
          password,
          name: companyName, 
        });

        const data = res.data;
        console.log(data);
        if (data.token) {
          toast({
            title: "Signup Successful",
            description: "You can now sign in.",
          });
          navigate("/signin");  // Redirect to signin after successful signup
        } else {
          toast({
            title: "Signup Error",
            description: data.message || "Something went wrong.",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error(err.response?.data);
        toast({
          title: "Signup Error",
          description: err.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    }

    setIsLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: "No credentials received from Google.",
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/google-login", {
        credential: credentialResponse.credential,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      toast({
        title: "Welcome!",
        description: "Google login successful.",
      });

      const getauth = localStorage.getItem("isAuthenticated");
      if(getauth)
        {
          console.log(getauth);
          navigate("/dashboard");
        }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Google Login Error",
        description: err.response?.data?.msg || err.message || "Google authentication failed.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {type === "signin" ? "Sign in to your account" : "Create an account"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {type === "signin" ? "Signing in..." : "Signing up..."}
                </>
              ) : (
                type === "signin" ? "Sign in" : "Sign up"
              )}
            </Button>
          </div>
        </form>

        {type === "signin" && (
          <div className="mt-4 text-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                toast({
                  variant: "destructive",
                  title: "Google Login Failed",
                  description: "Something went wrong with Google login.",
                })
              }
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          {type === "signin" ? (
            <>
              Don't have an account?{" "}
              <a className="text-primary hover:underline" href="/signup">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a className="text-primary hover:underline" href="/signin">
                Sign in
              </a>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default AuthForm;

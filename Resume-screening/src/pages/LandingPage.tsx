
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FloatingResume from "@/components/3d/FloatingResume";
import ScoreGauge from "@/components/3d/ScoreGauge";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [demoScores] = useState([85, 72, 45, 93]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background z-0"
          style={{ 
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              className="space-y-6"
              style={{ 
                transform: `translateY(${-scrollY * 0.2}px)`,
                opacity: 1 - (scrollY * 0.002)
              }}
            >
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                Hire Smarter with <br />
                <span className="text-primary">AI-Powered</span> Resume Screening
              </h1>
              <p className="text-xl text-muted-foreground">
                Our cutting-edge platform helps you find the perfect candidates faster by automatically screening resumes against your job requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg"
                  onClick={() => navigate("/signin")}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up Free
                </Button>
              </div>
            </div>
            
            <div 
              className="h-[400px] relative"
              style={{ 
                transform: `translateY(${-scrollY * 0.1}px) rotate(${scrollY * 0.02}deg)`
              }}
            >
              <div className="absolute w-full h-full">
                <FloatingResume />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Button variant="ghost" size="sm" className="rounded-full p-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform streamlines your hiring process from job creation to candidate selection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Create Job Listings",
                description: "Define job requirements, skills needed, and other criteria for the perfect candidate.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                ),
              },
              {
                title: "Upload Resumes",
                description: "Upload candidate resumes individually or in bulk for automated screening.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                ),
              },
              {
                title: "Review & Select",
                description: "Review AI-scored candidates, shortlist top performers, and notify them automatically.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 11-6 6v3h9l3-3"/>
                    <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-sm border transition-all duration-300 hover:shadow-md hover:border-primary/50"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Demo Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Smart Scoring System</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI analyzes resumes and scores candidates based on job requirements
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {demoScores.map((score, index) => (
              <div 
                key={index} 
                className="h-40 perspective-container flex items-center justify-center"
              >
                <ScoreGauge score={score} />
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              size="lg"
              onClick={() => navigate("/signup")}
            >
              Start Screening Resumes
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-primary">ResumeSparkRecruit</h3>
              <p className="text-sm text-muted-foreground">AI-powered resume screening solution</p>
            </div>
            
            <div className="flex gap-8">
              <div>
                <h4 className="font-medium mb-2">Product</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:underline">Features</a></li>
                  <li><a href="#" className="hover:underline">Pricing</a></li>
                  <li><a href="#" className="hover:underline">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Company</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:underline">About</a></li>
                  <li><a href="#" className="hover:underline">Blog</a></li>
                  <li><a href="#" className="hover:underline">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Legal</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:underline">Privacy</a></li>
                  <li><a href="#" className="hover:underline">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ResumeSparkRecruit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

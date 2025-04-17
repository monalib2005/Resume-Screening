import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface JobFormProps {
  onSubmit: (job: any) => void;
  settrigger: React.Dispatch<React.SetStateAction<boolean>>;
  trigger: boolean;
}

export function JobForm({ onSubmit,settrigger,trigger }: JobFormProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle || !jobDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const jobData = {
      title: jobTitle,
        description: jobDescription,
        skills: requiredSkills.split(",").map((skill) => skill.trim()),
    };

    const response = await axios.post("http://localhost:5000/api/jobs",jobData);
    settrigger(!trigger);
    toast({
      title: "Success",
      description: "Job has been created successfully.",
    });
    
    // Reset form
    setJobTitle("");
    setJobDescription("");
    setRequiredSkills("");
    setLocation("");
    setIsLoading(false);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description *</Label>
            <Textarea
              id="jobDescription"
              placeholder="Enter detailed job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="requiredSkills">Required Skills</Label>
              <Input
                id="requiredSkills"
                placeholder="e.g., React, TypeScript, CSS"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate skills with commas</p>
            </div>
          </div>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              "Create Job"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default JobForm;

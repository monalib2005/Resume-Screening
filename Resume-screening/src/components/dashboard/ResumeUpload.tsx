
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import axios from "axios";

interface ResumeUploadProps {
 
  onUploadComplete: (resumes: any[]) => void;
  selectedid:String;
}

export function ResumeUpload({ selectedid, onUploadComplete }: ResumeUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [candidateName, setCandidateName] = useState("Kalyani");
  const [candidateEmail, setCandidateEmail] = useState("fghg");
  
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type === "application/pdf"
      );
      
      if (newFiles.length !== e.target.files.length) {
        toast({
          title: "Warning",
          description: "Only PDF files are supported.",
          variant: "destructive",
        });
      }
      
      setFiles(newFiles);
    }
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    console.log(selectedid);
    e.preventDefault();
    console.log(files.length,candidateName,candidateEmail);
    if (!files.length || !candidateName || !candidateEmail) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a resume file.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
      formData.append("resume", files[0]); // assuming only one resume
      formData.append("jobId", selectedid as string);
      formData.append("name", candidateName);
      formData.append("email", candidateEmail);
      formData.append("score", "0");
      formData.append("status", "Screened");

      if(!selectedid)
        {
          toast({
            title: "Warning!",
            description: "Select the Job First."
          })
          return;
        }
      const response = await axios.post(
        "http://localhost:5000/api/candidates", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;
      onUploadComplete([result.candidate]);

      setUploading(true);
    
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const mockResumes = files.map((file, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      selectedid,
      name: candidateName,
      email: candidateEmail,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      status: "Processing",
      score: null,
    }));
    
    toast({
      title: "Success",
      description: `${files.length} resume(s) have been uploaded and are being processed.`,
    });
    
    // Reset form
    setFiles([]);
    setCandidateName("");
    setCandidateEmail("");
    setUploading(false);
    
    // Reset file input
    const fileInput = document.getElementById("resume") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF) *</Label>
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="resume" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                </div>
                <Input 
                  id="resume" 
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Selected files:</p>
                <ul className="text-sm text-muted-foreground">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <Button type="submit" disabled={uploading}>
            {uploading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Uploading...
              </>
            ) : (
              "Upload Resume"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ResumeUpload;

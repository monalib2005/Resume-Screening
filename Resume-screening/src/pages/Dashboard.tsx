import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import JobSection from "@/pages/JobSection";
import CandidateSection from "@/pages/CandidateSection";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const mockJobs = [
      { id: "job1", title: "Frontend Developer", description: "...", skills: ["React", "TypeScript"], location: "Remote", date: "2023-04-01T00:00:00.000Z" },
      { id: "job2", title: "Data Scientist", description: "...", skills: ["Python", "ML"], location: "New York", date: "2023-04-02T00:00:00.000Z" }
    ];
    const mockCandidates = [
      { id: "cand1", jobId: "job1", name: "John", email: "john@example.com", fileName: "resume.pdf", uploadDate: "2023-04-10", status: "Screened", score: 85 },
      { id: "cand2", jobId: "job2", name: "Emma", email: "emma@example.com", fileName: "resume.pdf", uploadDate: "2023-04-11", status: "Rejected", score: 45 }
    ];

    setJobs(mockJobs);
    setCandidates(mockCandidates.sort((a, b) => b.score - a.score));
    if (mockJobs.length > 0) setSelectedJob(mockJobs[0].id);
  }, []);

  const handleCreateJob = (job: any) => {
    setJobs([...jobs, job]);
    setSelectedJob(job.id);
  };

  const handleUploadResume = (newResumes: any[]) => {
    const processingResumes = newResumes.map(r => ({ ...r, status: "Processing", score: null }));
    setCandidates(prev => [...prev, ...processingResumes]);

    setTimeout(() => {
      const processed = newResumes.map(r => ({ ...r, status: "Screened", score: Math.floor(Math.random() * 51) + 50 }));
      setCandidates(prev =>
        [...prev.filter(c => !newResumes.some(nr => nr.id === c.id)), ...processed].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      );
    }, 4000);
  };

  const handleCandidateUpdate = (updated: any) => {
    const updatedCandidates = candidates.map(c => (c.id === updated.id ? updated : c));
    updatedCandidates.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    setCandidates(updatedCandidates);
    setUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    console.log("Changes saved:", candidates);
    setUnsavedChanges(false);
    alert("Changes saved.");
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const selectedJobData = jobs.find(job => job.id === selectedJob);
  const filteredCandidates = candidates.filter(c => c.jobId === selectedJob);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-primary">ResumeSparkRecruit</h1>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobs">
            <JobSection
              jobs={jobs}
              selectedJob={selectedJob}
              onSelect={setSelectedJob}
              onCreate={handleCreateJob}
              setJobs={setJobs}
            />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidateSection
              jobs={jobs}
              selectedJob={selectedJob}
              candidates={filteredCandidates}
              selectedJobData={selectedJobData}
              unsavedChanges={unsavedChanges}
              onCandidateUpdate={handleCandidateUpdate}
              onSaveChanges={handleSaveChanges}
              onSelect={setSelectedJob}
              
              onUpload={handleUploadResume}
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-3 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ResumeSparkRecruit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

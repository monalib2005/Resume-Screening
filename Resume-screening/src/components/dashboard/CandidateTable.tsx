import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  fileName: string;
  uploadDate: string;
  status: "Processing" | "Screened" | "Shortlisted" | "Rejected";
  score: number | null;
  
}

interface CandidateTableProps {
  candidates: Candidate[];
  onCandidateUpdate: (candidate: Candidate) => void;
  selectedid?: string;
}

export function CandidateTable({ candidates, onCandidateUpdate,selectedid }: CandidateTableProps) {
  const [sortedCandidates, setSortedCandidates] = useState<Candidate[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Candidate;
    direction: "asc" | "desc";
  } | null>(null);
  const [filter, setFilter] = useState<"all" | "shortlisted" | "rejected">("all");
  
  const { toast } = useToast();
  
  // useEffect(() => {
  //   let filteredCandidates = [...candidates];
    
  //   // Apply filters
  //   if (filter === "shortlisted") {
  //     filteredCandidates = filteredCandidates.filter(c => c.status === "Shortlisted");
  //   } else if (filter === "rejected") {
  //     filteredCandidates = filteredCandidates.filter(c => c.status === "Rejected");
  //   }
    
  //   // Apply sorting
  //   if (sortConfig) {
  //     filteredCandidates.sort((a, b) => {
  //       if (a[sortConfig.key] === null) return 1;
  //       if (b[sortConfig.key] === null) return -1;
        
  //       if (a[sortConfig.key] < b[sortConfig.key]) {
  //         return sortConfig.direction === "asc" ? -1 : 1;
  //       }
  //       if (a[sortConfig.key] > b[sortConfig.key]) {
  //         return sortConfig.direction === "asc" ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
    
  //   setSortedCandidates(filteredCandidates);
  // }, [candidates, sortConfig, filter]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      if(!selectedid)
        {
          return;
        }
      try {
        const response = await axios.get("http://localhost:5000/api/candidates" ,{
          params: { jobId: selectedid }
        });
        setSortedCandidates(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    
fetchJobs();
}, [selectedid]);

  const handleViewResume = async (candidateId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/candidates/${candidateId}/resume`, {responseType: "blob"});
      const blob = new Blob([response.data], { type: response.headers["content-type"]});
      const resumeUrl = URL.createObjectURL(blob);
      window.open(resumeUrl, "_blank");
    } catch (error) {
      console.error("Failed to fetch resume:", error);  
    }
  }

  const requestSort = (key: keyof Candidate) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  
  const handleStatusUpdate = (candidate: Candidate, status: "Shortlisted" | "Rejected") => {
    const updatedCandidate = { ...candidate, status };
    onCandidateUpdate(updatedCandidate);
    
    toast({
      title: `Candidate ${status}`,
      description: `${candidate.name} has been ${status.toLowerCase()}.`,
    });
  };
  
  const handleSendEmail = (candidate: Candidate) => {
    const status = candidate.status === "Shortlisted" ? "selected" : "not selected";
    
    toast({
      title: "Email Sent",
      description: `Notification email sent to ${candidate.name} that they were ${status}.`,
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500";
      case "Screened":
        return "bg-blue-500";
      case "Shortlisted":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">Candidates ({sortedCandidates.length})</div>
        <div className="flex space-x-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            onClick={() => setFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={filter === "shortlisted" ? "default" : "outline"} 
            onClick={() => setFilter("shortlisted")}
            size="sm"
          >
            Shortlisted
          </Button>
          <Button 
            variant={filter === "rejected" ? "default" : "outline"} 
            onClick={() => setFilter("rejected")}
            size="sm"
          >
            Rejected
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Name
                {sortConfig?.key === "name" && (
                  <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                )}
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => requestSort("score")}
              >
                Score
                {sortConfig?.key === "score" && (
                  <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => requestSort("status")}
              >
                Status
                {sortConfig?.key === "status" && (
                  <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                )}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No candidates found
                </TableCell>
              </TableRow>
            ) : (
              sortedCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>
                    <Button  onClick={() => handleViewResume(candidate._id)} variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    {candidate.score !== null ? (
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className={`h-2.5 rounded-full ${
                              candidate.score > 75
                                ? "bg-green-500"
                                : candidate.score > 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${candidate.score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{candidate.score}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Processing...</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(candidate.status)} text-white`}
                    >
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {candidate.status !== "Shortlisted" && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(candidate, "Shortlisted")}
                          >
                            Shortlist Candidate
                          </DropdownMenuItem>
                        )}
                        
                        {candidate.status !== "Rejected" && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(candidate, "Rejected")}
                          >
                            Reject Candidate
                          </DropdownMenuItem>
                        )}
                        
                        {(candidate.status === "Shortlisted" || 
                         candidate.status === "Rejected") && (
                          <DropdownMenuItem 
                            onClick={() => handleSendEmail(candidate)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Notification
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CandidateTable;

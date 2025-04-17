
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  location: string;
  date: string;
}

interface JobCardProps {
  job: Job;
  selectedJob: string | null;
  onSelect: (jobId: string) => void;
}

export function JobCard({ job, selectedJob, onSelect }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const isSelected = selectedJob === job.id;
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  return (
    <Card 
      className={`w-full transition-all duration-200 ${
        isSelected 
          ? "border-primary shadow-md ring-1 ring-primary" 
          : "hover:border-gray-300 hover:shadow-sm"
      }`}
      onClick={() => onSelect(job.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {job.location && (
                <Badge variant="outline" className="font-normal">
                  {job.location}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                Posted {new Date(job.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleExpand}
            className="mt-1"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          <Tabs defaultValue="description">
            <TabsList className="mb-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="text-sm">
              <p className="whitespace-pre-line">{job.description}</p>
            </TabsContent>
            <TabsContent value="skills">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}

export default JobCard;

import JobForm from "@/components/dashboard/JobForm";
import JobCard from "@/components/dashboard/JobCard";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

export default function JobSection({ jobs, selectedJob, onSelect, onCreate,setJobs }: any) {
    const [trigger,settrigger]=useState(false);
    useEffect(() => {
        const fetchJobs = async () => {
          try {
            const response = await axios.get("http://localhost:5000/api/jobs");
            console.log(response.data); // Do something with the data
            setJobs(response.data);
          } catch (error) {
            console.error("Failed to fetch jobs:", error);
          }
        };
        
  fetchJobs();
}, [trigger]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <JobForm onSubmit={onCreate} settrigger={settrigger} trigger={trigger}/>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Jobs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 p-4 max-h-[500px] overflow-auto">
            {jobs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No jobs created yet</p>
            ) : (
              jobs.map(job => (
                <JobCard key={job.id} job={job} selectedJob={selectedJob} onSelect={onSelect} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

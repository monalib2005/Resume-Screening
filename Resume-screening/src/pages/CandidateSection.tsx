import ResumeUpload from "@/components/dashboard/ResumeUpload";
import CandidateTable from "@/components/dashboard/CandidateTable";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CandidateSection({
  jobs,
  selectedJob,
  selectedJobData,
  candidates,
  onCandidateUpdate,
  unsavedChanges,
  onSaveChanges,
  onSelect,
  onUpload
}: any) {
    const [selectedid,setselectid]=useState();
    const [triger,setriger]=useState(false);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Jobs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 p-4 max-h-[300px] overflow-auto">
              {jobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No jobs created yet</p>
              ) : (
                jobs.map(job => (
                  <div key={job.id} onClick={() =>{console.log(job._id); setselectid(job._id)}}>
                    <p className={`cursor-pointer ${selectedid === job._id ? "text-red-500" : ""}`}>
                      {job.title}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        { (
          <div className="mt-6">
            <ResumeUpload selectedid={selectedid} onUploadComplete={onUpload} setriger={setriger} triger={triger} />
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        {selectedJob ? (
          <div className="space-y-6">
            {selectedJobData && (
              <div className="bg-card p-4 rounded-lg shadow-sm border space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedJobData.title}</h2>
                    <p className="text-muted-foreground">{selectedJobData.location}</p>
                  </div>

                  {unsavedChanges && (
                    <Button onClick={onSaveChanges} variant="outline" className="text-sm font-medium">
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            )}

            <CandidateTable selectedid={selectedid} candidates={candidates} onCandidateUpdate={onCandidateUpdate} triger={triger} />
          </div>
        ) : (
          <div className="bg-card p-8 rounded-lg border flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium mb-2">No Job Selected</h3>
            <p className="text-muted-foreground">Please select a job from the list to view candidates</p>
          </div>
        )}
      </div>
    </div>
  );
}

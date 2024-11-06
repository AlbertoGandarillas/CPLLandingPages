import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ExtendedViewCPLCourses } from "@/types/ExtendedViewCPLCourses";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

interface SelectedCoursesListProps {
  CollegeID: string;
}

export default function SelectedCoursesList({ CollegeID }: SelectedCoursesListProps) {
  const { toast } = useToast();
  const { removeCourse, getSelectedCoursesForCollege } = useSelectedCourses();
  const collegeSelectedCourses = getSelectedCoursesForCollege(CollegeID);

  // Fetch selected courses data
  const { data: selectedArticulations = [] } = useQuery<ExtendedViewCPLCourses[]>({
    queryKey: ['selectedCourses', CollegeID, collegeSelectedCourses],
    queryFn: async () => {
      if (collegeSelectedCourses.length === 0) return [];
      
      const outlineIds = collegeSelectedCourses.join(',');
      const res = await fetch(`/api/cpl-courses?college=${CollegeID}&outlineIds=${outlineIds}`);
      if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error('Failed to fetch selected courses');
      }
      const data = await res.json();
      return data.data || [];
    },
    enabled: collegeSelectedCourses.length > 0,
  });

  const handleToggleSelection = (articulation: ExtendedViewCPLCourses) => {
    removeCourse(articulation.OutlineID.toString(), articulation.CollegeID.toString());
    toast({
      variant: "warning",
      title: "Course removed",
      description: `${articulation.Subject} ${articulation.CourseNumber}: ${
        articulation.CourseTitle
      } has been removed from your selected courses.`,
    });
  };

  const handleClearAll = () => {
    selectedArticulations.forEach((articulation: ExtendedViewCPLCourses) => {
      removeCourse(articulation.OutlineID.toString(), articulation.CollegeID.toString());
    });
    toast({
      variant: "warning", 
      title: "All courses cleared",
      description: "All selected courses have been removed."
    });
  };

  if (collegeSelectedCourses.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Courses for CPL Review</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {selectedArticulations.length === 0 ? (
          <p>No courses selected yet.</p>
        ) : (
          <>
            <ul className="overflow-y-auto max-h-48 space-y-2">
              {selectedArticulations.map((articulation: ExtendedViewCPLCourses) => (
                <li
                  key={articulation.OutlineID}
                  className="flex justify-between items-center hover:bg-gray-50 rounded-sm p-1"
                >
                  <span className="text-xs pl-1">
                    {articulation.Subject} {articulation.CourseNumber}:{" "}
                    {articulation.CourseTitle}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleSelection(articulation)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <Button 
              variant="secondary" 
              className="mt-4 w-full" 
              size="sm" 
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

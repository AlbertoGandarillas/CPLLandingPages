import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ExtendedViewCPLCourses } from "@/types/ExtendedViewCPLCourses";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";
import { useToast } from "@/components/ui/use-toast";

interface SelectedCoursesListProps {
  articulations: ExtendedViewCPLCourses[];
  CollegeID: string;
}

export default function SelectedCoursesList({
  articulations,
  CollegeID,
}: SelectedCoursesListProps) {
  const { toast } = useToast();
  const { selectedCourses, removeCourse, getSelectedCoursesForCollege } = useSelectedCourses();
  const collegeSelectedCourses = getSelectedCoursesForCollege(CollegeID);

  const selectedArticulations = articulations.filter((articulation) =>
    collegeSelectedCourses.includes(articulation.OutlineID.toString())
  );

  const handleToggleSelection = (articulation:any) => {
    removeCourse(articulation.OutlineID.toString(), articulation.CollegeID)
    toast({
      variant: "warning",
      title: "Course removed",
      description: `${articulation.Subject} ${articulation.CourseNumber}: ${
        articulation.CourseTitle
      } has been removed from your selected courses.`,
    });
  };

  const handleClearAll = () => {
    selectedArticulations.forEach((articulation) => {
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
      <CardContent className="">
        {selectedArticulations.length === 0 ? (
          <p>No courses selected yet.</p>
        ) : (
          <>
            <ul className=" overflow-y-auto max-h-48">
              {selectedArticulations.map((articulation) => (
                <li
                  key={articulation.OutlineID}
                  className="flex justify-between items-center"
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
            <Button variant="secondary" className="mt-4 w-full" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

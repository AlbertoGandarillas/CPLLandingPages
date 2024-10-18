import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ExtendedViewCPLCourses } from "@/types/ExtendedViewCPLCourses";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";
import { useToast } from "@/components/ui/use-toast";

interface SelectedCoursesListProps {
  articulations: ExtendedViewCPLCourses[];
}

export default function SelectedCoursesList({
  articulations,
}: SelectedCoursesListProps) {
  const { toast } = useToast();
  const { selectedCourses, removeCourse } = useSelectedCourses();

  const selectedArticulations = articulations.filter((articulation) =>
    selectedCourses.includes(articulation.OutlineID.toString())
  );

  const handleToggleSelection = (articulation:any) => {
    removeCourse(articulation.OutlineID.toString())
    toast({
      variant: "warning",
      title: "Course removed",
      description: `${articulation.Subject} ${articulation.CourseNumber}: ${
        articulation.CourseTitle
      } has been removed from your selected courses.`,
    });
  };
 if (selectedCourses.length === 0) {
   return null;
 }
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Favorited Courses</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-64">
        {selectedArticulations.length === 0 ? (
          <p>No courses selected yet.</p>
        ) : (
          <ul className="space-y-2">
            {selectedArticulations.map((articulation) => (
              <li
                key={articulation.OutlineID}
                className="flex justify-between items-center"
              >
                <span className="text-sm pl-1">
                  {articulation.Subject} {articulation.CourseNumber}:{" "}
                  {articulation.CourseTitle}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleToggleSelection(articulation)
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

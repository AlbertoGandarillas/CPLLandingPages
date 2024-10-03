import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ExtendedViewCPLCourses } from "@/types/ExtendedViewCPLCourses";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";

interface SelectedCoursesListProps {
  articulations: ExtendedViewCPLCourses[];
}

export default function SelectedCoursesList({
  articulations,
}: SelectedCoursesListProps) {
  const { selectedCourses, removeCourse } = useSelectedCourses();

  const selectedArticulations = articulations.filter((articulation) =>
    selectedCourses.includes(articulation.OutlineID.toString())
  );

  return (
    <Card className="mt-4 hidden">
      <CardHeader>
        <CardTitle>Favorited Courses</CardTitle>
      </CardHeader>
      <CardContent>
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
                    removeCourse(articulation.OutlineID.toString())
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

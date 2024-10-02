import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExtendedViewCPLCourses } from "@/types/cpl";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";
interface CPLRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourses: string[];
  courses: ExtendedViewCPLCourses[];
  onSubmit: (name: string, email: string) => void;
}

export default function CPLRequestModal({
  isOpen,
  onClose,
  courses,
  onSubmit,
}: CPLRequestModalProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const { selectedCourses } = useSelectedCourses();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email);
    setName("");
    setEmail("");
  };

  const selectedArticulations = courses.filter((course) =>
    selectedCourses.includes(course.OutlineID.toString())
  );
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request CPL Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-y-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-y-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-y-4">
            <h3 className="text-sm font-medium mb-2">Selected Courses:</h3>
            <ul className="list-disc list-inside">
              {selectedCourses.map((id) => {
                const course = courses.find(
                  (c) => c.OutlineID.toString() === id
                );
                return course ? (
                  <li key={id} className="text-sm">
                    {course.Subject} {course.CourseNumber}: {course.CourseTitle}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
          <Button type="submit">Submit Request</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

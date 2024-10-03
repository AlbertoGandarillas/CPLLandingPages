import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExtendedViewCPLCourses } from "@/types/ExtendedViewCPLCourses";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";
import { Checkbox } from "@/components/ui/checkbox";
interface CPLRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourses: string[];
  courses: ExtendedViewCPLCourses[];
  onSubmit: (
    firstName: string,
    lastName: string,
    email: string,
    hasCCCApplyId: boolean,
    cccApplyId: string | null
  ) => Promise<void>;
}

export default function CPLRequestModal({
  isOpen,
  onClose,
  courses,
  onSubmit,
}: CPLRequestModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [hasCCCApplyId, setHasCCCApplyId] = useState(false);
  const [cccApplyId, setCCCApplyId] = useState("");
  const { selectedCourses } = useSelectedCourses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setHasCCCApplyId(false);
    setCCCApplyId("");
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(
        firstName,
        lastName,
        email,
        hasCCCApplyId,
        hasCCCApplyId ? cccApplyId : null
      );
      // Don't clear the form here, it will be handled in the parent component on success
    } catch (error) {
      console.error("Error submitting form:", error);
      // Form will remain filled, and submit button will be re-enabled
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedArticulations = courses.filter((course) =>
    selectedCourses.includes(course.OutlineID.toString())
  );
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request CPL Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasCCCApplyId"
              checked={hasCCCApplyId}
              onCheckedChange={(checked) =>
                setHasCCCApplyId(checked as boolean)
              }
            />
            <Label htmlFor="hasCCCApplyId" className="font-bold">
              Do you have a CCCApply ID?
            </Label>
          </div>
          {hasCCCApplyId && (
            <div className="grid gap-y-4">
              <Label htmlFor="cccApplyId" className="font-bold">
                CCCApply ID
              </Label>
              <Input
                id="cccApplyId"
                value={cccApplyId}
                onChange={(e) => setCCCApplyId(e.target.value)}
                required
              />
            </div>
          )}
          {hasCCCApplyId && cccApplyId && cccApplyId.length > 0 && (
            <>
              <div className="grid gap-y-4">
                <Label htmlFor="firstName" className="font-bold">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-y-4">
                <Label htmlFor="lastName" className="font-bold">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-y-4">
                <Label htmlFor="email" className="font-bold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-y-4 pb-4">
                <h3 className="text-sm mb-2 font-bold">Selected Courses:</h3>
                <ul className="list-disc list-inside">
                  {selectedCourses.map((id) => {
                    const course = courses.find(
                      (c) => c.OutlineID.toString() === id
                    );
                    return course ? (
                      <li key={id} className="text-sm">
                        {course.Subject} {course.CourseNumber}:{" "}
                        {course.CourseTitle}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

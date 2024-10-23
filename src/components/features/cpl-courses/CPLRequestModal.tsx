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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileAttachments } from "@/components/shared/FileAttachments";
import { CCCApplyInstructions } from "@/components/shared/CCCApplyInstructions";
import { AlertCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CPLRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourses: string[];
  courses: ExtendedViewCPLCourses[];
  CPLAssistantEmail: string;
  CollegeID?: string;
}

export default function CPLRequestModal({
  isOpen,
  onClose,
  courses,
  CPLAssistantEmail,
  CollegeID,
}: CPLRequestModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [hasCCCApplyId, setHasCCCApplyId] = useState<boolean | null>(null);
  const [cccApplyId, setCCCApplyId] = useState("");
  const { selectedCourses } = useSelectedCourses();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [selectedCertifications, setSelectedCertifications] = useState<
     Record<string, string[]>
   >({});
  const [unlistedQualifications, setUnlistedQualifications] = useState("");
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setHasCCCApplyId(null);
    setCCCApplyId("");
    setFiles([]);
    setSelectedCertifications({});
    setUnlistedQualifications("");
  };

  useEffect(() => {
    if (isOpen) {
      const initialCertifications: Record<string, string[]> = {};
      selectedCourses.forEach((courseId) => {
        const course = courses.find((c) => c.OutlineID.toString() === courseId);
        if (course && course.IndustryCertifications) {
          initialCertifications[courseId] = course.IndustryCertifications.map(
            (cert) => cert.IndustryCertification
          );
        }
      });
      setSelectedCertifications(initialCertifications);
    } else {
      setSelectedCertifications({});
    }
  }, [isOpen, courses, selectedCourses]);

   const handleCertificationChange = (
     courseId: string,
     certification: string,
     isChecked: boolean
   ) => {
     setSelectedCertifications((prev) => {
       const courseCerts = prev[courseId] || [];
       if (isChecked) {
         return { ...prev, [courseId]: [...courseCerts, certification] };
       } else {
         return {
           ...prev,
           [courseId]: courseCerts.filter((cert) => cert !== certification),
         };
       }
     });
   };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files!)]);
    }
  };
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleCPLRequestSubmit = async (
    firstName: string,
    lastName: string,
    email: string,
    files: File[],
    cccApplyId: string | null
  ) => {
    try {
      const fileData = await Promise.all(
        files.map(async (file) => {
          const base64 = await convertToBase64(file);
          return { name: file.name, type: file.type, data: base64 };
        })
      );
      const response = await fetch("/api/send-cpl-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          selectedCourses: selectedCourses.map((id) => {
            const course = courses.find((a) => a.OutlineID.toString() === id);
            return course
              ? {
                  course: `${course.Subject} ${course.CourseNumber}: ${course.CourseTitle}`,
                  certifications: selectedCertifications[id] || [],
                }
              : "";
          }),
          CPLAssistantEmail,
          unlistedQualifications,
          files: fileData,
          cccApplyId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      toast({
        title: "Request Sent",
        description: `Your CPL information request has been sent to ${CPLAssistantEmail}.`,
        variant: "success",
      });

      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send your request. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleCPLRequestDBSubmit = async (
    firstName: string,
    lastName: string,
    email: string,
    hasCCCApplyId: boolean | null,
    cccApplyId: string | null
  ) => {
    try {
      console.log("college id passed to cpl request");
      console.log(CollegeID);
      const response = await fetch("/api/cpl-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          hasCCCApplyId,
          cccApplyId,
          selectedCourses: selectedCourses.map((id) => {
            const course = courses.find((a) => a.OutlineID.toString() === id);
            return course
              ? {
                  course: `${course.Subject} ${course.CourseNumber}: ${course.CourseTitle}`,
                  certifications: selectedCertifications[id] || [],
                }
              : "";
          }),
          CollegeID,
          unlistedQualifications,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      toast({
        title: "Request Submitted",
        description:
          "Your CPL information request has been submitted successfully.",
        variant: "success",
      });

      await handleCPLRequestSubmit(firstName, lastName, email, files, cccApplyId);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleCPLRequestDBSubmit(
        firstName,
        lastName,
        email,
        hasCCCApplyId,
        cccApplyId
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedArticulations = courses.filter((course) =>
    selectedCourses.includes(course.OutlineID.toString())
  );
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 max-w-3xl min-w-[300px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Request CPL Information
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="hasCCCApplyId" className="font-bold">
                Do you have a CCCApply ID?
              </Label>
              <RadioGroup
                onValueChange={(value) => setHasCCCApplyId(value === "yes")}
                value={
                  hasCCCApplyId === null
                    ? undefined
                    : hasCCCApplyId
                    ? "yes"
                    : "no"
                }
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="hasCCCApplyId-yes" />
                  <Label htmlFor="hasCCCApplyId-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="hasCCCApplyId-no" />
                  <Label htmlFor="hasCCCApplyId-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            {hasCCCApplyId && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="cccApplyId" className="font-bold">
                  CCCApply ID
                </Label>
                <Input
                  id="cccApplyId"
                  className="w-38"
                  value={cccApplyId}
                  placeholder="Enter your CCCApply ID"
                  onChange={(e) => setCCCApplyId(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
          {hasCCCApplyId && cccApplyId && cccApplyId.length > 0 && (
            <>
              <div className="overflow-y-auto max-h-[550px] p-2">
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4 py-4">
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-y-4">
                        <Label htmlFor="firstName" className="font-bold">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          placeholder="Enter your first name"
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
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    <div className="grid gap-y-4 py-4">
                      <Label htmlFor="email" className="font-bold">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                    <FileAttachments
                      files={files}
                      onFileChange={handleFileChange}
                      onRemoveFile={removeFile}
                    />
                  </div>
                  <div>
                    <div className="grid gap-y-4">
                      <Label htmlFor="" className="font-bold">
                        Selected Courses:
                      </Label>
                      <ul className="list-disc list-inside overflow-y-auto max-h-64">
                        {selectedCourses.map((id) => {
                          const course = courses.find(
                            (c) => c.OutlineID.toString() === id
                          );
                          return course ? (
                            <li key={id} className="text-sm">
                              {course.Subject} {course.CourseNumber}:{" "}
                              {course.CourseTitle}
                              {course.IndustryCertifications &&
                                course.IndustryCertifications.length > 0 && (
                                  <ul className="list-none ml-4 mt-1">
                                    {course.IndustryCertifications.map(
                                      (cert, index) => (
                                        <li
                                          key={index}
                                          className="flex items-center space-x-2 py-1"
                                        >
                                          <Checkbox
                                            id={`cert-${id}-${index}`}
                                            checked={selectedCertifications[
                                              id
                                            ]?.includes(
                                              cert.IndustryCertification
                                            )}
                                            onCheckedChange={(checked) => {
                                              handleCertificationChange(
                                                id,
                                                cert.IndustryCertification,
                                                checked as boolean
                                              );
                                              setSelectedCertifications(
                                                (prev) => {
                                                  if (checked) {
                                                    return {
                                                      ...prev,
                                                      [id]: [
                                                        ...(prev[id] || []),
                                                        cert.IndustryCertification,
                                                      ],
                                                    };
                                                  } else {
                                                    return {
                                                      ...prev,
                                                      [id]:
                                                        prev[id]?.filter(
                                                          (c) =>
                                                            c !==
                                                            cert.IndustryCertification
                                                        ) || [],
                                                    };
                                                  }
                                                }
                                              );
                                            }}
                                          />
                                          <label
                                            htmlFor={`cert-${id}-${index}`}
                                            className="text-xs text-gray-600"
                                          >
                                            {cert.IndustryCertification}
                                          </label>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-start text-xs cursor-help">
                            <Info
                              size={32}
                              className="ml-3 text-gray-400 mr-2"
                            />
                            <p className="text-sm text-left">
                              Please provide documentation that showcases your
                              knowledge and competency in the course(s) for
                              which you are seeking credit for.
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="p-4 text-xs">
                          <ul className="list-disc list-inside">
                            <li>Certificate</li>
                            <li>License</li>
                            <li>Portfolio</li>
                            <li>Exam Scores</li>
                            <li>Evidence of Work Experience</li>
                            <li>Credit Recommendation by ACE, etc.</li>
                          </ul>
                          <p className="mt-2">
                            Any evidence that speaks to your knowledge of the
                            course content
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-100 p-3 mt-4 rounded-md">
                      <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                      <p>
                        Your information will be kept confidential and used only
                        for CPL evaluation purposes.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="grid gap-y-2">
                      <Label htmlFor="unlistedCertifications">
                        List Additional Qualifications
                      </Label>
                      <Textarea
                        id="unlistedCertifications"
                        placeholder="Enter any unlisted qualifications here..."
                        value={unlistedQualifications}
                        onChange={(e) =>
                          setUnlistedQualifications(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center w-full">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

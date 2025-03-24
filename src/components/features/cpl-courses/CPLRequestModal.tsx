import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { veteranApi } from "@/services/veterans";
import { catalogYearApi } from "@/services/catalogYear";

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
  const { selectedCourses, getSelectedCoursesForCollege } =
    useSelectedCourses();
  const collegeSelectedCourses = getSelectedCoursesForCollege(CollegeID || "");
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
      collegeSelectedCourses.forEach((courseId) => {
        const course = courses.find((c) => c.OutlineID.toString() === courseId);
        if (course?.IndustryCertifications) {
          initialCertifications[courseId] = course.IndustryCertifications.map(
            (cert) => cert.IndustryCertification
          );
        }
      });
      setSelectedCertifications(initialCertifications);
    }
  }, [isOpen, courses, collegeSelectedCourses]);

  const handleCertificationChange = useCallback(
    (courseId: string, certification: string, isChecked: boolean) => {
      setSelectedCertifications((prev) => {
        const courseCerts = prev[courseId] || [];

        if (isChecked) {
          // Only add if it doesn't exist
          if (!courseCerts.includes(certification)) {
            return {
              ...prev,
              [courseId]: [...courseCerts, certification],
            };
          }
          return prev;
        }

        // Remove certification
        return {
          ...prev,
          [courseId]: courseCerts.filter((cert) => cert !== certification),
        };
      });
    },
    []
  );

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
          selectedCourses: collegeSelectedCourses.map((id) => {
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
      // Step 1: Submit CPL request
      let cplRequest;
      try {
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
            selectedCourses: collegeSelectedCourses.map((id) => {
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
          throw new Error(`CPL request failed: ${response.statusText}`);
        }
        cplRequest = await response.json();
      } catch (error) {
        throw new Error(
          "Unable to submit your CPL request. Please try again or contact support if the problem persists."
        );
      }

      // Step 2: Get current catalog year
      let currentCatalogYear;
      try {
        currentCatalogYear = await catalogYearApi.getCurrentCatalogYear();
        if (!currentCatalogYear) {
          throw new Error("No active catalog year found");
        }
      } catch (error) {
        throw new Error(
          "System configuration error: Unable to determine current catalog year. Please contact support."
        );
      }

      // Step 3: Check if veteran exists and create record if needed
      let veteran;
      try {
        // Check if veteran already exists
        const { exists, veteran: existingVeteran } =
          await veteranApi.checkExisting({
            firstName,
            lastName,
            collegeId: CollegeID ? parseInt(CollegeID) : undefined,
            email,
          });

        if (exists && existingVeteran) {
          // Make sure we have a valid veteran ID and required flags are set

          if (!existingVeteran.id) {
            console.error("Invalid veteran record:", existingVeteran);
            throw new Error(
              "Invalid veteran record structure received from server"
            );
          }
          // Only upload documents if veteran has PotentialStudent and CPLLandingPage flags set
          if (existingVeteran.PotentialStudent && existingVeteran.CPLLandingPage) {
            if (files.length > 0) {
              try {
                await veteranApi.uploadDocuments(
                  existingVeteran.id,
                  await Promise.all(
                    files.map(async (file) => ({
                      VeteranID: existingVeteran.id,
                      Filename: file.name,
                      BinaryData: await convertToBase64(file),
                      FileDescription: file.name,
                      DocumentTypeID: 10,
                      user_id: 1,
                      Field: "student_joint_services",
                    }))
                  )
                );
              } catch (error) {
                console.error("Failed to upload documents:", error);
                throw new Error("Failed to upload documents. Please try again.");
              }
            }
          }

          veteran = existingVeteran; // Store the veteran for later use
        } else {
          // Create new veteran record with standard notes format
          const currentDate = new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          });
          const studentPlanNotes = [
            `Student requested CPL review : ${currentDate}`,
            cccApplyId && `\n\nCCCApply ID or Student ID\n${cccApplyId}`,
            "Requested review on course(s) ",
            collegeSelectedCourses
              .map((id) => {
                const course = courses.find(
                  (a) => a.OutlineID.toString() === id
                );
                if (!course) return "";

                const courseInfo = `${course.Subject} ${course.CourseNumber}: ${course.CourseTitle}`;
                const certInfo = selectedCertifications[id]?.length
                  ? selectedCertifications[id]
                      .map((cert) => `- ${cert}`)
                      .join("\n")
                  : "";

                return certInfo ? `${courseInfo}\n${certInfo}` : courseInfo;
              })
              .filter(Boolean)
              .join("\n"),
            unlistedQualifications &&
              `Additional Qualifications listed:\n${unlistedQualifications}`,
          ]
            .filter(Boolean)
            .join("\n\n");

          veteran = await veteranApi.createWithDocuments(
            {
              FirstName: firstName,
              LastName: lastName,
              Email: email,
              CollegeID: CollegeID ? parseInt(CollegeID) : undefined,
              StudentID: null,
              IsValidPdfFormat: null,
              CatalogYear: currentCatalogYear?.ID,
              StudentPlanNotes: studentPlanNotes,
              PotentialStudent: true,
              CPLSearchUpload: false,
              CPLLandingPage: true,
            },
            files
          );
        }

        // Make sure we have a valid veteran object
        if (!veteran) {
          throw new Error("Failed to create or retrieve veteran record");
        }
      } catch (error) {
        console.error("Veteran processing error:", error);
        throw new Error(
          "Unable to process veteran information. Please try again or contact support."
        );
      }

      // Step 4: Send email notification
      try {
        await handleCPLRequestSubmit(
          firstName,
          lastName,
          email,
          files,
          cccApplyId
        );
      } catch (error) {
        console.error("Email notification error:", error);
        toast({
          title: "Request Submitted",
          description:
            "Your request was processed successfully, but we couldn't send the confirmation email.",
          variant: "warning",
        });
        onClose();
        return;
      }

      // Success path
      toast({
        title: "Request Submitted Successfully",
        description:
          "Your CPL information request has been submitted and confirmed.",
        variant: "success",
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error in handleCPLRequestDBSubmit:", error);

      // Determine the error message to show to the user
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Show error toast with specific message
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
    collegeSelectedCourses.includes(course.OutlineID.toString())
  );
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 max-w-3xl min-w-[300px]">
        <DialogHeader>
          <DialogTitle>Request CPL Information</DialogTitle>
          <DialogDescription>
            Fill out this form to request information about Credit for Prior
            Learning (CPL) opportunities.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {hasCCCApplyId === false && <CCCApplyInstructions />}
          <div className="grid grid-cols-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="hasCCCApplyId" className="font-bold">
                Do you have a student ID or CCCApply ID?
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
                <Label htmlFor="cccApplyId" className="font-bold pl-2">
                  ID
                </Label>
                <Input
                  id="cccApplyId"
                  className="w-full"
                  value={cccApplyId}
                  placeholder="Enter student ID if available, if not your CCCApply ID"
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
                        {collegeSelectedCourses.map((id) => {
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
                                            onCheckedChange={(checked) =>
                                              handleCertificationChange(
                                                id,
                                                cert.IndustryCertification,
                                                checked as boolean
                                              )
                                            }
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

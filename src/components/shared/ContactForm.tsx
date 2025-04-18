import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Trash2 } from "lucide-react";
import { FileAttachments } from "./FileAttachments";
import { catalogYearApi } from "@/services/catalogYear";
import { veteranApi } from "@/services/veterans";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  CPLAssistantEmail: string;
  CollegeID?: string;
}

export function ContactForm({
  isOpen,
  onClose,
  CPLAssistantEmail,
  CollegeID,
}: ContactFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
    setFiles([]);
  };
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files!)]);
    }
  };
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
            hasCCCApplyId: null,
            cccApplyId: null,
            selectedCourses: "[]",
            CollegeID: CollegeID ? parseInt(CollegeID) : undefined,
            unlistedQualifications: message,
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
          const studentPlanNotes = message;

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
      

      const fileData = await Promise.all(
        files.map(async (file) => {
          const base64 = await convertToBase64(file);
          return { name: file.name, type: file.type, data: base64 };
        })
      );
      const payload = {
        firstName,
        lastName,
        email,
        message,
        CPLAssistantEmail,
        files: fileData,
      };

      const response = await fetch("/api/send-cpl-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Failed to send inquiry", response);
        throw new Error("Failed to send inquiry");
      }

      toast({
        title: "Inquiry Sent",
        description: "Your CPL inquiry has been sent successfully.",
        variant: "success",
      });

      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact CPL Assistant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Enter your first name"
              />
            </div>
            <div className="grid gap-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div className="grid gap-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
            />
          </div>
          <div className="grid gap-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <FileAttachments
            files={files}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExtendedViewCPLCourses } from "@/types/ExtendedViewCPLCourses";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface ArticulationListProps {
  articulations: ExtendedViewCPLCourses[];
  showCollegeName?: boolean;
  PrimaryBackgroundColor?: string;
  collegeId: string;
  CPLAssistantEmail?: string;
}

export default function ArticulationList({
  articulations,
  showCollegeName,
  PrimaryBackgroundColor,
  collegeId,
  CPLAssistantEmail,
}: ArticulationListProps) {
   const { selectedCourses, toggleCourse, getSelectedCoursesForCollege } = useSelectedCourses();
   const collegeSelectedCourses = getSelectedCoursesForCollege(collegeId);
   const { toast } = useToast();

   const handleStarClick = (articulation: ExtendedViewCPLCourses) => {
     const courseId = articulation.OutlineID.toString();
     const isSelected = collegeSelectedCourses.includes(courseId);

     toggleCourse(courseId, collegeId);

     toast({
       variant: isSelected ? "warning" : "success",
       title: isSelected ? "Course Removed" : "Course Added",
       description: `${articulation.Subject} ${
         articulation.CourseNumber
       } has been ${isSelected ? "removed from" : "added to"} your selection.`,
     });
   };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100 text-black ">
          <TableHead className="w-10"></TableHead>
          {showCollegeName && (
            <TableHead className="font-bold">College</TableHead>
          )}
          <TableHead className="font-bold">Subject</TableHead>
          <TableHead className="text-center font-bold">Course Number</TableHead>
          <TableHead className="font-bold">Title</TableHead>
          <TableHead className="text-center font-bold">Credits</TableHead>
          <TableHead className="font-bold">Possible Qualifications</TableHead>
          <TableHead className="font-bold">Credit Recommendations</TableHead>
          <TableHead className="font-bold">Possible Evidence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articulations.map((articulation) => (
          <TableRow key={articulation.OutlineID}>
            <TableCell>
              <div
                className="cursor-pointer"
                onClick={() => handleStarClick(articulation)}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {CPLAssistantEmail && (
                      <Star
                        className="h-4 w-4"
                        fill={
                          collegeSelectedCourses.includes(
                            articulation.OutlineID.toString()
                          )
                            ? PrimaryBackgroundColor
                              ? PrimaryBackgroundColor
                              : "#1d4ed8"
                            : "#c1c1c1"
                        }
                        color={
                          collegeSelectedCourses.includes(
                            articulation.OutlineID.toString()
                          )
                            ? PrimaryBackgroundColor
                              ? PrimaryBackgroundColor
                              : "#1d4ed8"
                            : "#c1c1c1"
                        }
                      />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add this course to your CPL Review</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableCell>
            {showCollegeName && <TableCell>{articulation.College}</TableCell>}
            <TableCell className="text-center align-top">
              {articulation.Subject}
            </TableCell>
            <TableCell className="text-center align-top">
              {articulation.CourseNumber}
            </TableCell>
            <TableCell className="align-top">
              {articulation.CourseTitle}
            </TableCell>
            <TableCell className="text-center align-top">
              {articulation.Units}
            </TableCell>
            <TableCell className="align-top">
              <div className="overflow-y-auto max-h-[200px]">
                {articulation.IndustryCertifications?.map((cert, index) => (
                  <div key={index} className="flex">
                    <p className="text-sm">{cert.CPLTypeDescription}</p>
                    <span className="pl-1"> - </span>
                    <p className="pl-1 text-sm font-semibold">
                      {cert.IndustryCertification}
                    </p>
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell className="align-top">
              <div className="overflow-y-auto max-h-[200px]">
                {articulation.IndustryCertifications?.map((cert, index) => (
                  <div key={index}>
                    {cert.ArticulationCreditRecommendations && (
                      <>
                        <p className="text-sm font-semibold">
                          {cert.IndustryCertification}
                        </p>
                        <ul className="list-disc list-inside ml-4">
                          {cert.ArticulationCreditRecommendations.split(',').map((credit, creditIndex) => (
                            <li key={creditIndex} className="text-xs">
                              {credit.trim()}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell className="align-top">
              <div className="overflow-y-auto max-h-[200px]">
                {articulation.IndustryCertifications?.map((cert, index) => (
                  <div key={index}>
                    {cert.EvidenceCompetency && (
                      <>
                        <p className="text-sm font-semibold">
                          {cert.IndustryCertification}
                        </p>
                        <ul className="list-disc list-inside ml-4">
                          {cert.EvidenceCompetency.split(',').map((evidence, evidenceIndex) => (
                            <li key={evidenceIndex} className="text-xs">
                              {evidence.trim()}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {!cert.EvidenceCompetency && cert.CPLTypeDescription === "Military" && (
                      <>
                        <p className="text-sm font-semibold">
                          {cert.IndustryCertification}
                        </p>
                        <ul className="list-disc list-inside ml-4">
                          <li className="text-xs">JST</li>
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

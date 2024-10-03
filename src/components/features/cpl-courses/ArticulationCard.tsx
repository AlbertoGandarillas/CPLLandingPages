import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Star } from "lucide-react";
import { ExtendedViewCPLCourses } from "@/types/ExtendedViewCPLCourses";
import CertificationHoverCard from "./CertificationHoverCard";
import { toast, useToast } from "@/components/ui/use-toast";
import { useSelectedCourses } from "@/contexts/SelectedCoursesContext";

interface ArticulationCardProps {
  articulation: ExtendedViewCPLCourses;
  showCollegeName?: boolean;
}

export default function ArticulationCard({
  articulation,
  showCollegeName,
}: ArticulationCardProps) {
  const { toast } = useToast();
  const { selectedCourses, toggleCourse } = useSelectedCourses();

  const isSelected = selectedCourses.includes(
    articulation.OutlineID.toString()
  );

  const handleToggleSelection = () => {
    toggleCourse(articulation.OutlineID.toString());
    toast({
      variant: isSelected ? "warning" : "success",
      title: isSelected ? "Course removed" : "Course added",
      description: `${articulation.Subject} ${articulation.CourseNumber}: ${
        articulation.CourseTitle
      } has been ${
        isSelected ? "removed from" : "added to"
      } your selected courses.`,
    });
  };
  return (
    <Card className="flex flex-col">
      <CardHeader className="bg-gray-100 flex-shrink-0">
        <CardTitle className="text-md h-auto flex align-bottom">
          <div className="flex items-center justify-between w-full gap-x-2">
            <p>
              {articulation.Subject} {articulation.CourseNumber} :{" "}
              {articulation.CourseTitle}
            </p>
            <HoverCard>
              <HoverCardTrigger className="cursor-default">
                <Info />
              </HoverCardTrigger>
              <HoverCardContent className="w-[450px] font-normal max-h-[300px] overflow-y-auto text-sm">
                <h3 className="text-lg font-bold mb-2">Catalog Description</h3>
                {articulation.Catalog}
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid flex-grow">
        <div className="">
          {showCollegeName && (
            <h4 className="text-sm font-bold py-4">
              <p>College : {articulation.College}</p>
            </h4>
          )}
          <div className="py-4 flex justify-between items-center w-full">
            <Badge
              className="font-bold flex justify-center text-xs bg-blue-100 text-blue-800 w-[100px]"
              variant="outline"
            >
              Credits: {articulation.Units}
            </Badge>
            <Button variant="ghost" size="icon" onClick={handleToggleSelection}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Star
                      className="h-4 w-4 hidden"
                      fill={isSelected ? "#1d4ed8" : "#c1c1c1"}
                      color={isSelected ? "#1d4ed8" : "#c1c1c1"}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add this course to your favorites</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
          </div>
          <div className="overflow-y-auto max-h-56">
            {articulation.IndustryCertifications &&
              articulation.IndustryCertifications.length > 0 && (
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-2 text-sm">
                        <div className="flex text-left justify-start">
                          Source
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info
                                  size={16}
                                  className="ml-1 text-gray-400 cursor-help"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Type of evidence required to receive credit
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableHead>
                      <TableHead className="text-sm text-left">
                        <div className="flex items-center justify-start">
                          Possible Qualifications
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info
                                  size={16}
                                  className="ml-1 text-gray-400 cursor-help"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Occupations, Certificates, On-the-job
                                  training, etc. that would qualify for this
                                  credit
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableHead>
                      <TableHead className="pl-0 text-sm">
                        <div className="flex items-center justify-start">
                          Possible Evidence
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info
                                  size={16}
                                  className="ml-1 text-gray-400 cursor-help"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Documentation required to verify credit
                                  eligibility
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articulation.IndustryCertifications.map((cert, index) => (
                      <TableRow key={index} className="py-2">
                        <TableCell className="text-sm text-left align-top">
                          {cert.CPLTypeDescription}
                        </TableCell>
                        <TableCell className="align-top">
                          <CertificationHoverCard
                            industryCertification={
                              cert.IndustryCertification || undefined
                            }
                            cplType={cert.CPLTypeDescription || null}
                            learningMode={
                              cert.CPLModeofLearningDescription || null
                            }
                            evidences={cert.Evidences || []}
                            crs={cert.CreditRecommendations || []}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          {cert.Evidences && cert.Evidences.length > 0 ? (
                            <ul className="ml-4">
                              {cert.Evidences.map((evidence, evidenceIndex) => (
                                <li
                                  key={evidenceIndex}
                                  className="text-sm list-disc"
                                >
                                  {evidence.EvidenCompetency}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <>{cert.CPLTypeDescription === "Military" && (<li className="text-sm pl-4 list-none">JST</li>)}</>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {articulation.IndustryCertifications?.some(
          (cert) => cert.CPLTypeDescription === "Military"
        ) && (
          <p className="text-xs text-sky-950 mt-2 font-semibold">
            * This has military type possible qualification, upload your JST for
            personalized details.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

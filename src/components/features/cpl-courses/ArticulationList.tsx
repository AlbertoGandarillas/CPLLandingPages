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

interface ArticulationListProps {
  articulations: ExtendedViewCPLCourses[];
  showCollegeName?: boolean;
}

export default function ArticulationList({
  articulations,
  showCollegeName,
}: ArticulationListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100 text-black ">
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
              {articulation.IndustryCertifications?.map((cert, index) => (
                <div key={index} className="flex">
                  <p className="text-sm">{cert.CPLTypeDescription}</p>
                  <span className="pl-1"> - </span>
                  <p className="pl-1 text-sm font-semibold">
                    {cert.IndustryCertification}
                  </p>
                </div>
              ))}
            </TableCell>
            <TableCell className="align-top">
              {articulation.IndustryCertifications?.map((cert, index) => (
                <div key={index}>
                  {cert.CreditRecommendations &&
                    cert.CreditRecommendations.length > 0 && (
                      <p className="text-sm font-semibold">
                        {cert.IndustryCertification}
                      </p>
                    )}
                  {cert.CreditRecommendations?.map((credit, creditIndex) => (
                    <p key={creditIndex} className="text-xs">
                      {credit.Criteria}
                    </p>
                  ))}
                </div>
              ))}
            </TableCell>
            <TableCell className="align-top">
              {articulation.IndustryCertifications?.map((cert, index) => (
                <div key={index}>
                  {cert.Evidences && cert.Evidences.length > 0 && (
                    <p className="text-sm font-semibold">
                      {cert.IndustryCertification}
                    </p>
                  )}
                  {cert.Evidences && cert.Evidences.length > 0 && (
                    <ul className="list-disc list-inside ml-4">
                      {cert.Evidences.map((evidence, evidenceIndex) => (
                        <li key={evidenceIndex} className="text-xs">
                          {evidence.EvidenCompetency}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

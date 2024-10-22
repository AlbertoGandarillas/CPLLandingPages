import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewCPLArticulations } from "@prisma/client";

interface ArticulationListProps {
  articulations: ViewCPLArticulations[];
}

export default function ArticulationList({
  articulations,
}: ArticulationListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100 text-black ">
          <TableHead className="font-bold">CPL TYpe</TableHead>
          <TableHead className="font-bold">College</TableHead>
          <TableHead className="font-bold">Subject</TableHead>
          <TableHead className="text-center font-bold">Course Number</TableHead>
          <TableHead className="font-bold">Title</TableHead>
          <TableHead className="text-center font-bold">Credits</TableHead>
          <TableHead className="font-bold">CID Number</TableHead>
          <TableHead className="font-bold">CID Descriptor</TableHead>
          <TableHead className="font-bold">Exhibit ID</TableHead>
          <TableHead className="font-bold">Exhibit Title</TableHead>
          <TableHead className="font-bold">Learning Mode</TableHead>
          <TableHead className="font-bold">Credit Recommendation</TableHead>
          <TableHead className="font-bold">Top Code</TableHead>
          <TableHead className="font-bold">Students</TableHead>
          <TableHead className="font-bold">Units</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articulations.map((articulation, index) => (
          <TableRow key={index}>
            <TableCell>{articulation.CPLTypeDescription}</TableCell>
            <TableCell>{articulation.College}</TableCell>
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
            <TableCell>{articulation.CIDNumber}</TableCell>
            <TableCell>{articulation.CIDDescriptor}</TableCell>
            <TableCell>{articulation.AceID}</TableCell>
            <TableCell>{articulation.IndustryCertification}</TableCell>
            <TableCell>{articulation.CPLModeofLearningDescription}</TableCell>
            <TableCell>{articulation.Criteria}</TableCell>
            <TableCell>{articulation.Program_Title}</TableCell>
            <TableCell className="text-center align-top">
              {articulation.Students}
            </TableCell>
            <TableCell className="text-center align-top">
              {articulation.CRUnits?.toString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

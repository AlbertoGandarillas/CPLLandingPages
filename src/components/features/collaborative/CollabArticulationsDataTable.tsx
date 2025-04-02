import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

interface Articulation {
  id: number;
  Course: string | null;
  Status: string | null;
  college: string | null;
  Slug: string | null;
}

interface ArticulationsDataTableProps {
  articulations: Articulation[];
}

export function CollabArticulationsDataTable({
  articulations,
}: ArticulationsDataTableProps) {
  if (!articulations || articulations.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No articulations found for this exhibit
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-auto pl-2 py-2">
      <Table className="w-full">
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow className="bg-muted text-gray-800">
            <TableHead className="text-xs w-[100px] text-center">Course</TableHead>
            <TableHead className="text-xs w-[80px]">Status</TableHead>
            <TableHead className="text-xs">College</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articulations.map((articulation, index) => (
            <TableRow key={`${articulation.id}-${index}`}>
              <TableCell className="text-xs w-[100px] text-center">
                {articulation.Course || "N/A"}
              </TableCell>
              <TableCell className="text-xs w-[80px]">
                <Badge variant="outline" className={`whitespace-nowrap ${
                  articulation.Status === "Articulated" ? "bg-green-100" :
                  articulation.Status === "In Progress" ? "bg-yellow-100" :
                  articulation.Status === "Not Articulated" ? "bg-red-100" : ""
                }`}>
                  {articulation.Status || "N/A"}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">
                <a
                  href={`/${articulation.Slug || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {articulation.college || "N/A"}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

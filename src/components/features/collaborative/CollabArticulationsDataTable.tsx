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
  CreditRecommendation: string | null;
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
    <div className="max-h-[300px] overflow-auto">
      <Table className="w-full">
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow className="bg-muted text-gray-800">
            <TableHead className="text-xs w-[100px] text-center">Course</TableHead>
            <TableHead className="text-xs">Credit Rec.</TableHead>
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
              <TableCell className="text-xs">
                {articulation.CreditRecommendation || "N/A"}
              </TableCell>
              <TableCell className="text-xs w-[80px]">
                {articulation.Status || "N/A"}
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLearningModes } from "@/hooks/useLearningModes";
import SkeletonWrapper from "./SkeletonWrapper";

export default function LearningModesTable() {
  const { data: learningModes, isLoading, error } = useLearningModes();

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading learning modes: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <SkeletonWrapper isLoading={isLoading} variant="table" />;
  }

  return (
    <Table className="w-96 text-xs">
      <TableBody>
        {learningModes?.map((mode) => (
          <TableRow key={mode.ID}>
            <TableCell>{mode.ModeofLearningCode}</TableCell>
            <TableCell>{mode.CPLModeofLearningDescription}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

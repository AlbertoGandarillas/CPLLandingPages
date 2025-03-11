import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CollabArticulationsDataTable } from "@/components/features/collaborative/CollabArticulationsDataTable";

interface Articulation {
  id: number;
  Course: string | null;
  CreditRecommendation: string | null;
  Status: string | null;
  college: string | null;
  Slug: string | null;
}

interface Exhibit {
  id: number;
  Title: string | null;
  CollaborativeID: number;
  AceID: string | null;
  college: string | null;
  VersionNumber: string | null;
  articulations: Articulation[];
}

interface ExhibitCardProps {
  exhibit: Exhibit;
}

export function ExhibitCard({ exhibit }: ExhibitCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-start justify-between gap-2">
          {exhibit.Title || "Untitled Exhibit"}
          <Badge className="w-[150px] text-center"
            variant={exhibit.CollaborativeID === 1 ? "default" : "outline"}
          >
            {exhibit.CollaborativeID === 1
              ? "CCCC State Wide CR"
              : "Non-CCCC State Wide CR"}
          </Badge>
        </CardTitle>
        <CardDescription>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="font-bold">{exhibit.AceID || "N/A"}</span>
            </div>
            <div>{exhibit.college || "N/A"}</div>
            <div className="text-right">
              Version: {exhibit.VersionNumber || "N/A"}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CollabArticulationsDataTable
          articulations={exhibit.articulations || []}
        />
      </CardContent>
    </Card>
  );
}

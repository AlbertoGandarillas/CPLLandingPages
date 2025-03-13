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
  CollaborativeType: string | null;
  AceID: string | null;
  college: string | null;
  VersionNumber: string | null;
  articulations: Articulation[];
  collaborativeTypes: CollaborativeType[];
}

interface CollaborativeType {
  id: number;
  Description: string;
  CollaborativeID: number;
}

interface ExhibitCardProps {
  exhibit: Exhibit;
}

export function ExhibitCard({ exhibit }: ExhibitCardProps) {
  return (
    <Card>
      <CardHeader className="bg-muted">
        <CardTitle className="text-lg flex items-start justify-between gap-2">
          {exhibit.Title || "Untitled Exhibit"}
          <div className="flex gap-2">
            {exhibit.collaborativeTypes?.map((type) => (
              <Badge
                key={type.id}
                className="text-center whitespace-nowrap"
                variant={type.CollaborativeID === 1 ? "default" : "outline"}
              >
                {type.CollaborativeID === 1
                  ? "CCC Statewide"
                  : type.Description}
              </Badge>
            ))}
          </div>
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
      <CardContent className="mt-3">
        <CollabArticulationsDataTable
          articulations={exhibit.articulations || []}
        />
      </CardContent>
    </Card>
  );
}

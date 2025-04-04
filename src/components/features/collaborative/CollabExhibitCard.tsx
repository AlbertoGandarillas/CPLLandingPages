import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CollabArticulationsDataTable } from "@/components/features/collaborative/CollabArticulationsDataTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface Articulation {
  id: number;
  Course: string | null;
  Status: string | null;
  college: string | null;
  Slug: string | null;
}

interface CreditRecommendation {
  id: number;
  CreditRecommendation: string | null;
  articulations: Articulation[];
}

interface Exhibit {
  id: number;
  Title: string | null;
  CollaborativeType: string | null;
  AceID: string | null;
  college: string | null;
  VersionNumber: string | null;
  EligibleStudents: number | null;
  EligibleCredits: number | null;
  creditRecommendations: CreditRecommendation[];
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
      <CardHeader className="">
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
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span>Originating College : </span> {exhibit.college || "N/A"}
            </div>
            <div className="text-right">
              Version: {exhibit.VersionNumber || "N/A"}
            </div>
          </div>
          {((exhibit.EligibleStudents !== null && exhibit.EligibleStudents > 0) || (exhibit.EligibleCredits !== null && exhibit.EligibleCredits > 0)) && (
            <div className="flex justify-between items-center gap-2">
                <div>
              {exhibit.EligibleStudents !== null && exhibit.EligibleStudents > 0 && (
                  <span>
                    Eligible Students: {exhibit.EligibleStudents}
                  </span>
              )}
                </div>
                <div>
              {exhibit.EligibleCredits !== null && exhibit.EligibleCredits > 0 && (
                  <span >
                    Eligible Credits: {exhibit.EligibleCredits}
                  </span>
              )}
                </div>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-3 max-h-[300px] overflow-auto">
        {exhibit.creditRecommendations.map((cr, index) => (
          <Collapsible key={index} defaultOpen={cr.articulations && cr.articulations.length > 0}>
            <div className="flex items-center justify-between space-x-4 px-4">
              <CollapsibleTrigger className="flex flex-1 items-center justify-between py-4 transition-all hover:underline [&[data-state=open]>svg]:rotate-180 bg-muted">
                <span className={`text-sm ${cr.articulations && cr.articulations.length > 0 ? "font-bold" : "font-normal"} text-left px-2`}>
                  {cr.CreditRecommendation}
                </span>
                {cr.articulations && cr.articulations.length > 0 && (
                  <ChevronDown className="mx-2 h-4 w-4 shrink-0 transition-transform duration-200" />
                )}
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md px-4">
                {cr.articulations && cr.articulations.length > 0 ? (
                  <CollabArticulationsDataTable
                    articulations={cr.articulations}
                  />
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No articulations found for this Credit Recommendation
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}

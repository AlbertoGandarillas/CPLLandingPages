import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface CertificationCardProps {
  certification: {
    IndustryCertification: string;
    CPLType: string | null;
    LearningMode: string | null;
    ModelOfLearning: number | null;
    TotalUnits: number;
    CollegeViews: {
      College: string;
      IndustryCertification: string;
      Slug: string | null;
      TotalUnits: number | null;
    }[];
  };
}

export default function CertificationCard({
  certification,
}: CertificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="flex flex-col  hover:shadow-lg transition-shadow">
      <CardHeader className="py-2 px-8">
        <CardTitle className="text-md overflow-y-auto h-12">
          {certification.IndustryCertification}
        </CardTitle>
        <CardDescription>
          Available at {certification.CollegeViews.length} college
          {certification.CollegeViews.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-between py-3">
          <Badge variant="outline" className="mb-2">
            {certification.LearningMode}
          </Badge>
          <Badge variant="secondary" className="mb-2">
            Avg {Math.round(certification.TotalUnits / certification.CollegeViews.length)}{" "}
            units
          </Badge>
        </div>
        <Button
          variant="link"
          className="w-full justify-between bg-muted"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          View Colleges
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>
        {isExpanded && (
          <>
            {certification.CollegeViews?.map((college, index) => (
              <div
                key={college.College}
                className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted my-2"
              >
                <span>{college.College}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {college.TotalUnits} units
                  </span>
                  <Link target="_blank" href={`/${college.Slug}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}

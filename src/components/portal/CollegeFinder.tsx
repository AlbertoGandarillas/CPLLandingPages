import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from "@/components/shared/SearchBar";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { LookupColleges } from "@prisma/client";

interface CollegeFinderProps {
  filteredColleges: (LookupColleges & {
    CollegeUIConfig: { Slug: string | null }[];
  })[];
  selectedCollege: number | null;
  onSelectCollege: (collegeId: number) => void;
  onSearch: (term: string) => void;
  onClear: () => void;
}

export const CollegeFinder = ({
  filteredColleges,
  selectedCollege,
  onSelectCollege,
  onSearch,
  onClear,
}: CollegeFinderProps) => {
  return (
    <Card className="md:col-span-1" data-intro="search-colleges">
      <CardHeader>
        <CardTitle>College Finder</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchBar
          onSearch={onSearch}
          onClear={onClear}
          placeholder="Search colleges by name, city, or zip code..."
          className="mb-4"
        />
        <ScrollArea className="h-[500px]">
          {filteredColleges.map((college) => (
            <div
              key={college.CollegeID}
              className="flex justify-between items-center"
            >
              <Button
                variant="ghost"
                className={`w-full justify-start text-left mb-2 ${
                  selectedCollege === college.CollegeID ? "bg-muted" : ""
                }`}
                onClick={() => onSelectCollege(college.CollegeID)}
              >
                <div>
                  <div className="font-semibold">{college.College}</div>
                  <div className="text-sm text-muted-foreground">
                    {college.City}, {college.StateCode} {college.ZipCode}
                  </div>
                </div>
              </Button>
              <Link
                target="_blank"
                className="p-4"
                href={`/${college.CollegeUIConfig[0]?.Slug || "#"}`}
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

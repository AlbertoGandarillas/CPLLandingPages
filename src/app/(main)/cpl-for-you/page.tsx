"use client";
import * as React from "react";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
export default function CPLForYou() {

  const [isPortfolioSpecific, setIsPortfolioSpecific] = React.useState(true);
  const [hasPortfolio, setHasPortfolio] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  const cplOptions = [
    {
      id: 1,
      title: "Business Administration",
      college: "Norco College",
      credits: 15,
      match: 95,
    },
    {
      id: 2,
      title: "Computer Science",
      college: "Riverside City College",
      credits: 12,
      match: 88,
    },
    {
      id: 3,
      title: "Nursing",
      college: "Moreno Valley College",
      credits: 18,
      match: 92,
    },
    {
      id: 4,
      title: "Psychology",
      college: "Norco College",
      credits: 9,
      match: 78,
    },
    {
      id: 5,
      title: "Engineering",
      college: "Riverside City College",
      credits: 21,
      match: 85,
    },
  ];

  const commonPathways = [
    {
      id: 1,
      title: "Associate in Business",
      duration: "2 years",
      credits: "60",
    },
    {
      id: 2,
      title: "Bachelor in Computer Science",
      duration: "4 years",
      credits: "120",
    },
    {
      id: 3,
      title: "Associate in Nursing",
      duration: "2 years",
      credits: "70",
    },
  ];

  const filteredOptions = isPortfolioSpecific
    ? cplOptions.filter((option) => option.match >= 80)
    : cplOptions;
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">CPL For You</h1>
        <div className="flex items-center space-x-2">
          <Switch
            id="portfolio-specific"
            checked={isPortfolioSpecific}
            onCheckedChange={setIsPortfolioSpecific}
          />
          <Label htmlFor="portfolio-specific">
            {isPortfolioSpecific ? "Portfolio Specific" : "All CPL Options"}
          </Label>
        </div>
      </div>

      {!hasPortfolio && (
        <Card className="bg-muted">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Create Your CPL Portfolio
              </h2>
              <p className="text-muted-foreground">
                Start building your portfolio to get personalized CPL
                recommendations.
              </p>
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Build Portfolio
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your CPL Options</CardTitle>
              <CardDescription>
                Explore Credit for Prior Learning opportunities tailored to your
                experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search CPL options..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
              <ScrollArea className="h-[400px]">
                {filteredOptions.map((option) => (
                  <Card key={option.id} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{option.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {option.college}
                          </p>
                        </div>
                        <Badge
                          variant={option.match >= 90 ? "default" : "secondary"}
                        >
                          {option.match}% Match
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm">
                          Potential Credits: {option.credits}
                        </p>
                        <Progress value={option.match} className="mt-2" />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          Learn More
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Pathways</CardTitle>
              <CardDescription>
                Explore common educational pathways based on your CPL
                opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {commonPathways.map((pathway) => (
                  <Card key={pathway.id}>
                    <CardContent className="p-4">
                      <GraduationCap className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="font-semibold">{pathway.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Duration: {pathway.duration}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Credits: {pathway.credits}
                      </p>
                      <Button variant="link" className="mt-2 p-0">
                        Explore Pathway
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your CPL Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Completion</span>
                  <span className="font-semibold">75%</span>
                </div>
                <Progress value={75} />
                <Button className="w-full mt-4">
                  {hasPortfolio ? "Update Portfolio" : "Start Portfolio"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Find Nearby Colleges
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="mr-2 h-4 w-4" />
                Explore Career Paths
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                Submit Portfolio to Colleges
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

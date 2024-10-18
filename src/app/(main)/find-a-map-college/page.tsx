"use client";
import * as React from "react";
import { Search, MapPin, List, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
interface College {
  id: number;
  name: string;
  city: string;
  averageCPL: number;
  topPrograms: string[];
}
const Map = ({
  colleges,
  selectedCollege,
}: {
  colleges: College[];
  selectedCollege: College | null;
}) => (
  <div className="h-[600px] bg-muted flex items-center justify-center">
    <MapIcon className="h-12 w-12 text-muted-foreground" />
    <span className="ml-2 text-muted-foreground">Interactive Map View</span>
  </div>
);
export default function FindAMapCollege() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCollege, setSelectedCollege] = React.useState<College | null>(
    null
  );
  const [colleges, setColleges] = React.useState([
    {
      id: 1,
      name: "Norco College",
      city: "Norco, CA",
      averageCPL: 14.4,
      topPrograms: ["Business Administration", "Accounting", "Nursing"],
    },
    {
      id: 2,
      name: "Riverside City College",
      city: "Riverside, CA",
      averageCPL: 15.2,
      topPrograms: ["Computer Science", "Psychology", "Biology"],
    },
    {
      id: 3,
      name: "Moreno Valley College",
      city: "Moreno Valley, CA",
      averageCPL: 13.8,
      topPrograms: ["Health Sciences", "Business", "Liberal Arts"],
    },
    // Add more colleges as needed
  ]);

  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.topPrograms.some((program) =>
        program.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Find a MAP College</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by Program, City, Zip Code, MOS, or Industry"
          className="pl-10 pr-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="map">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">
            <MapIcon className="mr-2 h-4 w-4" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>College Finder</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  {filteredColleges.map((college) => (
                    <Button
                      key={college.id}
                      variant="ghost"
                      className="w-full justify-start text-left mb-2"
                      onClick={() => setSelectedCollege(college)}
                    >
                      <div>
                        <div className="font-semibold">{college.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {college.city}
                        </div>
                      </div>
                    </Button>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardContent>
                <Map
                  colleges={filteredColleges}
                  selectedCollege={selectedCollege}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>College</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Average CPL</TableHead>
                    <TableHead>Top Programs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredColleges.map((college) => (
                    <TableRow key={college.id}>
                      <TableCell className="font-medium">
                        {college.name}
                      </TableCell>
                      <TableCell>{college.city}</TableCell>
                      <TableCell>{college.averageCPL} Credits</TableCell>
                      <TableCell>{college.topPrograms.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedCollege && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedCollege?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>City:</strong> {selectedCollege?.city}
            </p>
            <p>
              <strong>Average CPL:</strong> {selectedCollege.averageCPL} Credits
            </p>
            <p>
              <strong>Top Programs:</strong>{" "}
              {selectedCollege.topPrograms.join(", ")}
            </p>
            <Button className="mt-4">
              <MapPin className="mr-2 h-4 w-4" />
              View College Details
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Upload } from "lucide-react";
import { DocumentList } from "@/components/portal/DocumentList";
export default function PortfolioBuilder() {
  const [portfolioCompletion, setPortfolioCompletion] = React.useState(75);
  const [documents, setDocuments] = React.useState([
    {
      id: "1",
      name: "Joint Services Transcript.pdf",
      type: "PDF",
      uploadDate: "2023-06-01",
    },
    {
      id: "2",
      name: "Resume.docx",
      type: "Word Document",
      uploadDate: "2023-06-02",
    },
    {
      id: "3",
      name: "Certification.jpg",
      type: "Image",
      uploadDate: "2023-06-03",
    },
  ]);

  const pendingSections = [
    { title: "Certificates", status: "In progress" },
    { title: "Life Experiences", status: "Skipped" },
    { title: "AP/IB/CLEP scores", status: "Skipped" },
    { title: "Informal Learning/Self-taught", status: "Skipped" },
  ];

  const completedSections = [
    { title: "CV/Resume", status: "Completed" },
    { title: "About Me", status: "Completed" },
    { title: "JST", status: "Completed" },
    { title: "Languages", status: "Completed" },
  ];

  const handleOpenDocument = (id: string) => {
    console.log(`Opening document with id: ${id}`);
    // Implement document opening logic here
  };

  const handlePreviewDocument = (id: string) => {
    console.log(`Previewing document with id: ${id}`);
    // Implement document preview logic here
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };
  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CPL Portfolio Builder</h1>
          <div>
            <Button variant="outline" className="mr-2">
              Export
            </Button>
            <Button>Submit for Review</Button>
          </div>
        </div>

        <Card className="my-6">
          <CardHeader>
            <CardTitle>Portfolio Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={portfolioCompletion} className="w-full" />
            <p className="mt-2">{portfolioCompletion}% complete</p>
            <Button className="mt-4">Continue Building</Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="pending" className="mb-6">
          <TabsList>
            <TabsTrigger value="pending">Pending Sections</TabsTrigger>
            <TabsTrigger value="completed">Completed Sections</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <div className="grid gap-4 md:grid-cols-2">
              {pendingSections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Description text and additional text to improve usability
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-muted-foreground">
                        {section.status}
                      </span>
                      <Button variant="outline" size="sm">
                        {section.status === "In progress" ? "Update" : "Start"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="grid gap-4 md:grid-cols-2">
              {completedSections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Description text and additional text to improve usability
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-muted-foreground">
                        {section.status}
                      </span>
                      <Button variant="outline" size="sm">
                        Update
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="document-upload">
                  Upload your JST or other relevant documents
                </Label>
                <Input id="document-upload" type="file" />
              </div>
              <Button className="mt-4">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </CardContent>
          </Card>

          <DocumentList
            documents={documents}
            onOpen={handleOpenDocument}
            onPreview={handlePreviewDocument}
            onDelete={handleDeleteDocument}
          />
        </div>
      </div>
    </>
  );
}

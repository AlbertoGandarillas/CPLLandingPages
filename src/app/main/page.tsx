"use client";
import * as React from "react";
import {
  Search,
  MapPin,
  Upload,
  FileText,
  User,
  Menu,
  ChevronDown,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function Homepage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Hero section with search bar */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
          Discover Your Path to Academic Credit
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Unlock the value of your experiences with Credit for Prior Learning.
          Start your journey today.
        </p>
      </section>

      {/* Info cards */}
      <section className="grid mt-4 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              What is CPL?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Credit for Prior Learning (CPL) allows students and professionals
              to earn academic credit for knowledge and skills they&apos;ve
              gained outside the classroom, whether through work, military
              service, or other experiences. This tool guides you in identifying
              eligible prior learning and helps you streamline the process of
              turning that experience into recognized credit.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Why is a CPL portfolio important?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              A CPL portfolio is crucial because it organizes and presents your
              prior learning, skills, and experiences in a structured way that
              colleges can assess for credit. By compiling items like your JST,
              certificates, scores, and resume, the portfolio shows how your
              background meets academic standards, making it easier to receive
              credit when you enroll.
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-2 gap-6">
        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by Program, City, Zip Code, MOS, or Industry"
            className="pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <section className="flex items-center justify-center text-center">
          <Button size="lg" className="text-lg px-8 py-6">
            <FileText className="mr-2 h-5 w-5" />
            Start Your CPL Portfolio
          </Button>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Mapping Articulated Pathways
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Mapping articulated pathways ensures that common industry
                certifications and military occupations are accurately
                recognized, allowing students to earn academic credit
                efficiently and apply it directly toward their degree programs.
              </p>
              <Tabs defaultValue="certifications" className="w-full">
                <TabsList>
                  <TabsTrigger value="certifications">
                    Industry Certifications
                  </TabsTrigger>
                  <TabsTrigger value="occupations">
                    Military Occupations
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="certifications">
                  <DataTable
                    data={certifications}
                    columns={certificationColumns}
                  />
                </TabsContent>
                <TabsContent value="occupations">
                  <DataTable data={occupations} columns={occupationColumns} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <section className="hidden">
          <h2 className="text-2xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <Collapsible key={index} className="border rounded-lg">
                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 font-medium">
                  {faq.question}
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 text-sm">
                  {faq.answer}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}


// Data table component
function DataTable({ data, columns }: { data: any; columns: any }) {
  const [sorting, setSorting] = React.useState({ column: '', direction: 'asc' })

  const sortedData = React.useMemo(() => {
    if (sorting.column) {
      return [...data].sort((a, b) => {
        if (a[sorting.column] < b[sorting.column]) return sorting.direction === 'asc' ? -1 : 1
        if (a[sorting.column] > b[sorting.column]) return sorting.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return data
  }, [data, sorting])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column: any) => (
            <TableHead key={column.key} className="text-left">
              <Button
                variant="ghost"
                onClick={() => setSorting({
                  column: column.key,
                  direction: sorting.column === column.key && sorting.direction === 'asc' ? 'desc' : 'asc',
                })}
              >
                {column.label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((row: any, index: any) => (
          <TableRow key={index}>
            {columns.map((column: any) => (
              <TableCell key={column.key}>{row[column.key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Sample data
const certifications = [
  { title: "CompTIA A+", type: "IT", students: 120 },
  { title: "AWS Certified Solutions Architect", type: "Cloud Computing", students: 85 },
  { title: "Certified Nursing Assistant (CNA)", type: "Healthcare", students: 200 },
  { title: "Project Management Professional (PMP)", type: "Management", students: 150 },
  { title: "Certified Information Systems Security Professional (CISSP)", type: "Cybersecurity", students: 75 },
]

const occupations = [
  { title: "Unit Supply Specialist", type: "Logistics", students: 45 },
  { title: "Wheeled Vehicle Mechanic", type: "Maintenance", students: 43 },
  { title: "Signal Support Specialist", type: "Communications", students: 42 },
  { title: "Culinary Specialist", type: "Food Service", students: 38 },
  { title: "FIT Academy Conditioning (FIT-S3A)", type: "Physical Training", students: 37 },
]

const certificationColumns = [
  { key: 'title', label: 'Certification' },
  { key: 'type', label: 'Type' },
  { key: 'students', label: 'Students' },
]

const occupationColumns = [
  { key: 'title', label: 'Occupation' },
  { key: 'type', label: 'Type' },
  { key: 'students', label: 'Students' },
]

const faqs = [
  {
    question: "How do I know if I'm eligible for CPL?",
    answer: "Eligibility for CPL varies depending on your experiences and the institution. Generally, if you have significant work experience, military service, certifications, or other forms of learning outside traditional classrooms, you may be eligible. Contact your chosen institution for specific eligibility criteria."
  },
  {
    question: "How much credit can I earn through CPL?",
    answer: "The amount of credit you can earn through CPL varies by institution and program. Some colleges may have a cap on the number of credits you can earn through CPL, while others may be more flexible. It's best to check with your specific institution for their policies."
  },
  {
    question: "How long does the CPL process take?",
    answer: "The duration of the CPL process can vary depending on the complexity of your portfolio and the institution's review process. It can take anywhere from a few weeks to several months. Start the process as early as possible to ensure you have enough time before your intended enrollment date."
  },
]
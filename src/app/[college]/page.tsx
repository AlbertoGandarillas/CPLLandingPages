"use client";
import { useEffect, useState } from "react";
import IndustryCertificationsTable from "@/components/industry-certifications/IndustryCertificationsTable";
import MainCard from "@/components/shared/MainCard";
import { useQuery } from "@tanstack/react-query";
import { createQueryString } from "@/lib/createQueryString";
import ArticulationsTable from "@/components/cpl-courses/ArticulationsTable";
import { Logo } from "@/components/shared/Logo";
import ContactCard from "@/components/contact-info/ContactCard";
import SearchBar from "@/components/shared/SearchBar";
import SidebarButtons from "@/components/shared/SidebarButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Contacts from "@/components/contact-info/Contact";
export default function Home({ params }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<string | undefined>(
    undefined
  );
  const [selectedIndustryCertification, setSelectedIndustryCertification] =
    useState<string | null>(null);
  const handleIndustryCertificationSelect = (industryCertification: string) => {
    setSelectedIndustryCertification(industryCertification);
  };
  const {
    data: settings,
    error: settingsError,
    isLoading: settingsLoading,
  } = useQuery({
    queryKey: ["ui-settings", params.college],
    queryFn: () =>
      fetch(`/api/ui-settings/${params.college}`).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      }),
  });
  const {
    data: articulations,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["articulations", selectedCollege, selectedIndustryCertification],
    queryFn: () =>
      fetch(
        `/api/cpl-courses?${createQueryString({
          college: selectedCollege,
          industryCertification: selectedIndustryCertification,
        })}`
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      }),
  });
  const settingsObject = settings && settings.length > 0 ? settings[0] : null;

  useEffect(() => {
    if (settingsObject && settingsObject.College?.College) {
      setSelectedCollege(settingsObject.CollegeID);
    }
  }, [settingsObject]);

  if (settingsLoading) return <div>Loading settings...</div>;
  if (settingsError) return <div>Error loading settings</div>;
  if (!settingsObject) {
    return <div>No settings available</div>;
  }
  const logoUrl = `${process.env.NEXT_PUBLIC_LOGO_BASE_URL}${settingsObject.LogoUrl}`;
  const appName = `${process.env.NEXT_PUBLIC_APP_NAME}`;
  const appCopyright = `${process.env.NEXT_PUBLIC_APP_COPYRIGHT}`;

  return (
    <>
      <div
        className="flex flex-1"
        style={{
          backgroundColor: settingsObject.BodyBackground,
          color: settingsObject.BodyFontColor,
        }}
      >
        <aside className="w-[390px] p-4 flex flex-col justify-start">
          <Logo
            logoUrl={logoUrl}
            college={settingsObject.College.College}
            settings={settingsObject}
          />
          <ContactCard settings={settingsObject} />
          <SidebarButtons settings={settingsObject} />
          <MainCard
            title="Most Common Approved Opportunities"
            className="w-full mt-4"
          >
            <IndustryCertificationsTable
              onIndustryCertificationSelect={handleIndustryCertificationSelect}
              collegeId={settingsObject.CollegeID}
            />
          </MainCard>
          <Contacts settings={settingsObject} className="mt-4" />
        </aside>

        <main className="flex-1 p-4">
          <Accordion
            type="single"
            value={open}
            onValueChange={setOpen}
            collapsible
          >
            <AccordionItem value="item-1" className="border-r-4">
              <AccordionTrigger className=" bg-gray-100 text-3xl text-black p-4 flex justify-">
                <div></div>
                <h1>{appName}</h1>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader className="bg-white"></CardHeader>
                  <CardContent className="max-h-[350px] text-center overflow-y-auto">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: settingsObject.WebsiteText,
                      }}
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-4">
            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle className="grid grid-cols-2">
                  <div className="text-xl">Eligible Courses</div>
                  <SearchBar onSearch={setSearchTerm} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ArticulationsTable
                  articulations={articulations || []}
                  loading={isLoading}
                  error={error}
                  searchTerm={searchTerm}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <footer
        className=" text-white text-center p-4"
        style={{
          backgroundColor: settingsObject.HeaderBackgroundColor,
          color: settingsObject.HeaderFontColor,
        }}
      >
        <p>{appCopyright}</p>
      </footer>
    </>
  );
}

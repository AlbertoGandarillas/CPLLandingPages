import React, { useState } from "react";
import { Menu } from "lucide-react"; // Assuming you want to use an icon from lucide-react
import { Logo } from "../shared/Logo";
import ContactCard from "../shared/ContactCard";
import SidebarButtons from "../shared/SidebarButtons";
import Contacts from "../shared/Contact";
import Image from "next/image";
interface Contact {
  ContactType: string;
  Name: string;
  Email: string;
}
interface SidebarProps {
  settingsObject: {
    College: {
      College: string;
    };
    CollegeID: string;
    LogoUrl: string;
    Website: string;
    HideCollegeName: boolean;
    HeaderFontColor: string;
    HideLogo: boolean;
    Contacts: Contact[];
    Email: string;
    CompBackgroundColor: string;
    CompFontColor: string;
    PanelBackgroundColor: string;
    PanelFontColor: string;
    Links: Array<{
      LinkText: string;
      LinkURL: string;
      LinkTarget: string;
      Tooltip: string;
    }>;
    PhoneNumber: string;
    CollegeAward: boolean;
  };
  onIndustryCertificationSelect: (industryCertification: string) => void;
  children?: React.ReactNode;
  className?: string;
}
export default function Sidebar({
  settingsObject,
  children,
  onIndustryCertificationSelect,
  className
}: SidebarProps) {
  const logoUrl = `${process.env.NEXT_PUBLIC_LOGO_BASE_URL}${settingsObject.LogoUrl}`;
  return (
    <>

      {/* Sidebar content */}
      <aside
        className={`lg:block lg:sticky lg:top-0 lg:h-screen w-80 p-4 flex flex-col justify-start overflow-y-auto`}
      >
        {
          <>
            <Logo
              logoUrl={logoUrl}
              college={settingsObject.College.College}
              settings={settingsObject}
            />

            <ContactCard settings={settingsObject} />
            <SidebarButtons settings={settingsObject} />
            {/* <MainCard title="Approved Opportunities" className="w-full mt-4">
              <IndustryCertificationsTable
                onIndustryCertificationSelect={onIndustryCertificationSelect}
                collegeId={settingsObject.CollegeID}
              />
            </MainCard> */}
            {children}
            <Contacts settings={settingsObject} className="mt-4" />
            {settingsObject.CollegeAward && (
              <div className="mt-8">
                <Image
                  src="/images/LogoAward.png"
                  alt={settingsObject.College.College}
                  width={150}
                  height={150}
                  priority
                  className="max-w-[150px] m-auto"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    width: "auto",
                    maxHeight: "150px",
                  }}
                />
              </div>
            )}
          </>
        }
      </aside>
    </>
  );
}

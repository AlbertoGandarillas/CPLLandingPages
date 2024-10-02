import React, { useState } from "react";
import { Menu } from "lucide-react"; // Assuming you want to use an icon from lucide-react
import { Logo } from "../shared/Logo";
import ContactCard from "../shared/ContactCard";
import SidebarButtons from "../shared/SidebarButtons";
import Contacts from "../shared/Contact";
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
    Links: Array<{
      LinkText: string;
      LinkURL: string;
      LinkTarget: string;
      Tooltip: string;
    }>;
    PhoneNumber: string;
  };
  onIndustryCertificationSelect: (industryCertification: string) => void;
  children?: React.ReactNode;
}
export default function Sidebar({
  settingsObject,
  children,
  onIndustryCertificationSelect,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const logoUrl = `${process.env.NEXT_PUBLIC_LOGO_BASE_URL}${settingsObject.LogoUrl}`;
  return (
    <>
      {/* Mobile icon */}
      <div className="block lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-white bg-opacity-80 shadow-lg hover:bg-opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Sidebar content */}
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block w-80 p-4 flex flex-col justify-start`}
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
            <Contacts settings={settingsObject} className="mt-4" />
            {children}
          </>
        }
      </aside>
    </>
  );
}

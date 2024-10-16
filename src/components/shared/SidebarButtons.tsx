import React from "react";
import LinkButton from "./LinkButton";

interface SidebarButtonsProps {
  settings: {
    CollegeID: string;
    Email: string;
    CompBackgroundColor: string;
    CompFontColor: string;
    Links: Array<{
      LinkText: string;
      LinkURL: string;
      LinkTarget: string;
      Tooltip: string;
    }>;
  };
}

function normalizeUrl(url: string): string {
  if (url.startsWith("mailto:")) {
    return url;
  }
  url = url.trim();
  if (!/^(?:f|ht)tps?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url.replace(/^(https?:\/\/)www\./i, "$1");
}

export default function SidebarButtons({ settings }: SidebarButtonsProps) {
  const cplCounselor = `mailto:${settings.Email}`;

  return (
    <div className="grid gap-4 pt-4">
      {settings.Links.map((link, index) => (
        <LinkButton
          key={index}
          target="_blank"
          href={normalizeUrl(link.LinkURL)}
          style={{
            backgroundColor: settings.CompBackgroundColor,
            color: settings.CompFontColor,
          }}
          title={link.Tooltip}
          variant="default"
          className="w-full"
        >
          {link.LinkText}
        </LinkButton>
      ))}
    </div>
  );
}

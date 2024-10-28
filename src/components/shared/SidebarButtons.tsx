import React from "react";
import LinkButton from "./LinkButton";

interface SidebarButtonsProps {
  settings: {
    CollegeID: string;
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
  if (!/^https?:\/\/www\./i.test(url)) {
    url = url.replace(/^(https?:\/\/)/i, '$1www.');
  }
  return url;
}

export default function SidebarButtons({ settings }: SidebarButtonsProps) {
  const cplCounselor = `mailto:${settings.Email}`;

  return (
    <div className="grid gap-4 pt-2">
      {settings.Links.map((link, index) => (
        <LinkButton
          key={index}
          target="_blank"
          href={link.LinkURL}
          style={{
            backgroundColor: settings.PanelBackgroundColor,
            color: settings.PanelFontColor,
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

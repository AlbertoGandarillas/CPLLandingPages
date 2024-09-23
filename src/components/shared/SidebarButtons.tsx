import LinkButton from "./LinkButton";

interface SidebarButtonsProps {
  settings: {
    Email: string;
    CompBackgroundColor: string;
    CompFontColor: string;
    Links: Array<{
      LinkText: string;
      LinkURL: string;
      LinkTarget: string;
    }>;
  };
}
export default function SidebarButtons({ settings }: SidebarButtonsProps) {
  const cplCounselor = `mailto:${settings.Email}`;
  return (
    <div className="grid gap-4 pt-4">
      <LinkButton
        href={cplCounselor}
        style={{
          backgroundColor: settings.CompBackgroundColor,
          color: settings.CompFontColor,
        }}
        target="_blank"
        variant="default"
        className="w-full"
      >
        Contact a CPL Assistant
      </LinkButton>
      {settings.Links.map((link, index) => (
        <LinkButton
          key={index}
          target="_blank"
          href={link.LinkURL}
          style={{
            backgroundColor: settings.CompBackgroundColor,
            color: settings.CompFontColor,
          }}
          variant="default"
          className="w-full"
        >
          {link.LinkText}
        </LinkButton>
      ))}
    </div>
  );
}

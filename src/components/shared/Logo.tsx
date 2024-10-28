import Image from "next/image";

interface LogoProps {
  logoUrl: string;
  college: string;
  settings: {
    LogoUrl: string;
    Website: string;
    HideCollegeName: boolean;
    HeaderFontColor: string;
    HideLogo: boolean;
  };
}

export function Logo({ logoUrl, college, settings }: LogoProps) {
  const cleanedLogoUrl = cleanImageUrl(logoUrl);
  return (
    <div className="w-full text-center mb-2">
      {!settings.HideLogo && settings.LogoUrl && (
        <Image
          src={cleanedLogoUrl}
          alt={college}
          width={250}
          height={90}
          priority
          className="max-w-[250px] m-auto"
          style={{
            maxWidth: "100%",
            height: "auto",
            width: "auto",
            maxHeight: "120px",
          }}
        />
      )}
      {!settings.HideCollegeName && (
        <h1
          className="text-xl font-bold ml-4 mt-4"
          style={{
            color: settings.HeaderFontColor,
          }}
        >
          {college}
        </h1>
      )}
    </div>
  );
}
function cleanImageUrl(url: string) {
  return url.replace(/([^:]\/)\/+/g, "$1");
}
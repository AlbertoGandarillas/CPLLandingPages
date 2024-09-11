import Image from "next/image";

interface LogoProps {
  logoUrl: string;
  college: string;
  settings: {
    Website: string;
    HideCollegeName: boolean;
    HeaderFontColor: string;
    HideLogo: boolean;
  };
}

export function Logo({ logoUrl, college, settings }: LogoProps) {
  return (
    <div className="w-full text-center mb-4">
      {!settings.HideLogo && (
        <Image
          src={logoUrl}
          alt={college}
          width={250}
          height={90}
          layout="responsive"
          objectFit="contain"
          className="max-w-[250px] m-auto"
          style={{ maxHeight: "100%" }}
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

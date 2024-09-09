import Image from "next/image";
interface LogoProps {
  logoUrl: string;
  college: string;
  settings: {
    Website: string;
    HideCollegeName: boolean;
    HeaderFontColor: string;
  };
}
export function Logo({ logoUrl, college, settings }: LogoProps) {
  return (
    <div className="w-full text-center mb-4">
      {settings.HideCollegeName ? (
        <Image
          src={logoUrl}
          alt={college}
          width={250}
          height={90}
          layout="responsive" // Makes the image scale with the width of its container
          objectFit="contain" // Ensures the image is scaled correctly within its element bounds
          className="max-w-[250px] m-auto"
          style={{ maxHeight: "100%" }}
        />
      ) : (
        <h1
          className="text-4xl font-bold ml-4"
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
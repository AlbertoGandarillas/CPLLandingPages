"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LookupColleges, ViewCPLCertificationsByCollege } from "@prisma/client";
import { defaultIcon, selectedIcon } from "@/lib/leaflet-icons";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/map-overrides.css";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface CollegeMapProps {
  colleges: (LookupColleges & {
    CollegeUIConfig: {
      Slug: string | null;
    }[];
    CertificationsByCollege: ViewCPLCertificationsByCollege[];
  })[];
  onSelectCollege?: (collegeId: number) => void;
}

interface CollegeWithCoordinates extends LookupColleges {
  coordinates: LatLngTuple;
  CollegeUIConfig: {
    Slug: string | null;
  }[];
  CertificationsByCollege: ViewCPLCertificationsByCollege[];
}

export default function CollegeMap({ colleges, onSelectCollege }: CollegeMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [colleges]);

  const validColleges = colleges.filter(
    (college): college is CollegeWithCoordinates => {
      if (!college.Coordinates || college.Coordinates === "NULL") {
        return false;
      }

      try {
        const [lng, lat] = college.Coordinates.split(",").map((coord) =>
          parseFloat(coord.trim())
        );

        if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
          return false;
        }

        (college as CollegeWithCoordinates).coordinates = [lat, lng];
        return true;
      } catch (error) {
        console.log("Error parsing coordinates for:", college.College, error);
        return false;
      }
    }
  );

  if (!mounted) return null;

  return (
    <MapContainer
      center={[34.0522, -118.2437]}
      zoom={8}
      className="w-full h-[600px] z-0"
      scrollWheelZoom={true}
    >
      <div>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </div>

      {validColleges.map((college) => (
        <Marker
          key={college.CollegeID}
          position={college.coordinates}
          icon={defaultIcon}
          eventHandlers={{
            click: () => {
              onSelectCollege?.(college.CollegeID);
            },
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{college.College}</h3>
              <p className="text-sm text-gray-600">
                {college.City}, {college.StateCode} {college.ZipCode}
              </p>
              {college.CertificationsByCollege.length > 0 && (
                <div className="text-sm text-gray-500">
                  <p className="font-medium">Top Certifications:</p>
                  {college.CertificationsByCollege.sort(
                    (a, b) => (b.TotalUnits || 0) - (a.TotalUnits || 0)
                  )
                    .slice(0, 3)
                    .map((cert) => (
                      <div
                        key={cert.IndustryCertification}
                        className="flex justify-between text-sm"
                      >
                        <span className="truncate">
                          {cert.IndustryCertification}
                        </span>
                        <span className="pl-4">{cert.TotalUnits} units</span>
                      </div>
                    ))}
                </div>
              )}
              {college.CollegeUIConfig[0]?.Slug && (
                <div className="w-full flex justify-between">
                  <p className="text-sm text-gray-500">Go to College </p>
                  <Link
                    target="_blank"
                    className="p-4"
                    href={`/${college.CollegeUIConfig[0]?.Slug || "#"}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

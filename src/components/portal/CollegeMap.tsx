"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LookupColleges } from "@prisma/client";
import { defaultIcon, selectedIcon } from "@/lib/leaflet-icons";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/map-overrides.css";

interface CollegeMapProps {
  colleges: LookupColleges[];
}

interface CollegeWithCoordinates extends LookupColleges {
  coordinates: LatLngTuple;
}

export default function CollegeMap({
  colleges,
}: CollegeMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [colleges]);

  const validColleges = colleges.filter((college): college is CollegeWithCoordinates => {
    if (!college.Coordinates || college.Coordinates === 'NULL') {
      console.log('Invalid coordinates for:', college.College);
      return false;
    }

    try {
      const [lng, lat] = college.Coordinates.split(',').map(coord => 
        parseFloat(coord.trim())
      );

      if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
        console.log('Invalid number coordinates for:', college.College);
        return false;
      }

      (college as CollegeWithCoordinates).coordinates = [lat, lng];
      return true;
    } catch (error) {
      console.log('Error parsing coordinates for:', college.College, error);
      return false;
    }
  });

  if (!mounted) return null;

  return (
    <MapContainer
      center={[36.7783, -119.4179]}
      zoom={6}
      className="w-full h-[600px]"
      scrollWheelZoom={true}
    >
      <div >
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      </div>

      {validColleges.map((college) => {
        return (
          <Marker
            key={college.CollegeID}
            position={college.coordinates}
            icon={defaultIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{college.College}</h3>
                <p className="text-sm text-gray-600">
                  {college.City}, {college.StateCode} {college.ZipCode}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

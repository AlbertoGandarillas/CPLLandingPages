import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ViewCPLCreditRecommendations, ViewCPLEvidenceCompetency } from '@prisma/client';
import React from 'react'

interface CertificationHoverCardProps {
  industryCertification: string | null | undefined;
  cplType?: string | null;
  learningMode?: string | null;
  articulationCreditRecommendations?: string | null | undefined;
  evidences: string | null | undefined;
  crs?: string | null | undefined;
}

export default function CertificationHoverCard ({
  industryCertification,
  cplType,
  learningMode,
  articulationCreditRecommendations,
  evidences,
  crs,
}:CertificationHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer ">
        <li className="flex items-start">
          <span className="mr-[0.5em] flex-shrink-0"></span>
          <a className="text-sm font-semibold -mt-[0.1em] underline">
            {industryCertification || "N/A"}
          </a>
        </li>
      </HoverCardTrigger>
      <HoverCardContent className="w-[auto] z-50 max-w-[500px]">
        <h3 className="font-bold mb-2">{industryCertification}</h3>
        <p className="text-sm">
          <span className="font-bold">CPL Type : </span>
          {cplType}
        </p>
        <p className="text-sm">
          <span className="font-bold">Learning Mode : </span>
          {learningMode}
        </p>
        <div
          className={`grid gap-x-4 ${evidences && evidences.length > 0 && "grid-cols-2"} `}
        >
          {crs && crs.length > 0 && (
            <div>
              <p className="font-bold text-sm my-2">Credit Recommendations:</p>
              <ul className="list-disc list-inside ml-4 overflow-y-auto max-h-[150px]">
                {crs.split('|').map((criteria, crIndex) => {
                  const isMatched = articulationCreditRecommendations?.split('|').some(
                    recommendation => recommendation.trim() === criteria.trim()
                  );
                  return (
                    <li key={crIndex} className={`text-sm ${isMatched ? 'bg-blue-100 py-2' : ''}`}>
                      <span>{criteria.trim()}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {evidences && (
            <div>
              <p className="font-bold text-sm my-2">Possible Evidence:</p>
              <ul className="list-disc list-inside ml-4">
                {evidences.split('|').map((evidence, evidenceIndex) => (
                  <li key={evidenceIndex} className="text-sm">
                    {evidence.trim() || "No evidence specified"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

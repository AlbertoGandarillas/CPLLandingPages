import React, { useState, useEffect, useRef, useCallback } from "react";
import SearchBar from "../shared/SearchBar";
import { useCertifications } from "@/hooks/useCertifications";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import SelectCPLType from "./SelectCPLType";
import CertificationCard from "./CertificationCard";

export const Certifications = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cplType, setCplType] = useState("all");

  const handleSearch = useCallback((term: string) => {
    if (term.length >= 3 || term.length === 0) {
      setSearchTerm(term);
    }
  }, []);
  
  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error 
  } = useCertifications(searchTerm, cplType);

  const allCertifications = data?.pages.flatMap(page => page.items) ?? [];
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <SkeletonWrapper isLoading={true} fullWidth={true} variant="table" />;
  }

  if (error) {
    console.error("Error loading CPL Certifications:", error);
    return <div>Error loading CPL Certifications</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center gap-4 pb-4">
        <div className="w-96">
          <SelectCPLType selectedType={cplType} setSelectedType={setCplType} />
        </div>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search CPL Certifications by name..."
          className="w-full"
          value={searchTerm}
        />
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {allCertifications?.map((certification, index) => (
          <React.Fragment
            key={`${certification.CollegeViews[0].College}-${index}`}
          >
            <CertificationCard certification={certification} />
            {index === allCertifications.length - 1 && (
              <div ref={observerTarget} className="h-4" />
            )}
          </React.Fragment>
        ))}
        {isFetchingNextPage && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
            <SkeletonWrapper isLoading={true} fullWidth={true} variant="loading" />
          </div>
        )}
      </div>
    </div>
  );
};

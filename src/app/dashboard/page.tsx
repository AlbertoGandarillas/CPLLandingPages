"use client";
import { PotentialSavings } from "@/components/dashboard/PotentialSavings";
import ArticulationsTable from "@/components/features/cpl-articulations/ArticulationsTable";
import { DropdownCPLTypes } from "@/components/shared/DropdownCPLTypes";
import { DropdownImplementedColleges } from "@/components/shared/DropdownImplementedColleges";
import { DropdownLearningModes } from "@/components/shared/DropdownLearningModes";
import SearchBar from "@/components/shared/SearchBar";
import { createQueryString } from "@/lib/createQueryString";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
export default function DashboardPage() {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [selectedLearningMode, setSelectedLearningMode] = useState<
    string | null
  >(null);
  const [selectedCPLType, setSelectedCPLType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {
    data: articulations,
    error,
    isLoading,
  } = useQuery({
    queryKey: [
      "articulations",
      selectedCollege,
      selectedCPLType,
      selectedLearningMode,
    ],
    queryFn: () =>
      fetch(
        `/api/cpl-articulations?${createQueryString({
          college: selectedCollege ?? undefined,
          cplType: selectedCPLType ?? undefined,
          learningMode: selectedLearningMode,
        })}`
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      }),
  });
  const handleCollegeSelect = (collegeId: string | null) => {
    setSelectedCollege(collegeId);
  };
  const handleLerningModeSelect = (learningModeId: string | null) => {
    setSelectedLearningMode(learningModeId);
  };
  const handleCPLTypeSelect = (cplTypeId: string | null) => {
    setSelectedCPLType(cplTypeId);
  };
  return (
    <div>
      <PotentialSavings />
      <ArticulationsTable
        articulations={articulations || []}
        loading={isLoading}
        error={error}
        searchTerm={searchTerm}
        CollegeID={selectedCollege ? parseInt(selectedCollege, 10) : 1}
      >
        <div className="flex flex-row space-x-2">
          <SearchBar className="w-full lg:w-96" onSearch={setSearchTerm} />
          <DropdownImplementedColleges onCollegeSelect={handleCollegeSelect} />
          <DropdownLearningModes
            onLearningModeSelect={handleLerningModeSelect}
          />
          <DropdownCPLTypes onCPLTypeSelect={handleCPLTypeSelect} />
        </div>
      </ArticulationsTable>
    </div>
  );
}

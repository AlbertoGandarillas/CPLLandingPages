import React, { createContext, useState, useContext, useEffect } from "react";
import { CollegeUIConfig } from "@prisma/client";

type CollegeSettingsContextType = {
  collegeSettings: CollegeUIConfig | null;
  setCollegeSettings: React.Dispatch<
    React.SetStateAction<CollegeUIConfig | null>
  >;
};

const CollegeSettingsContext = createContext<
  CollegeSettingsContextType | undefined
>(undefined);

export const CollegeSettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [collegeSettings, setCollegeSettings] =
    useState<CollegeUIConfig | null>(null);

  return (
    <CollegeSettingsContext.Provider
      value={{ collegeSettings, setCollegeSettings }}
    >
      {children}
    </CollegeSettingsContext.Provider>
  );
};

export const useCollegeSettings = () => {
  const context = useContext(CollegeSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useCollegeSettings must be used within a CollegeSettingsProvider"
    );
  }
  return context;
};

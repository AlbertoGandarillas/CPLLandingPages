import React, { createContext, useState, useContext, useEffect } from "react";

type SelectedCoursesContextType = {
  selectedCourses: { [collegeId: string]: string[] };
  toggleCourse: (courseId: string, collegeId: string) => void;
  removeCourse: (courseId: string, collegeId: string) => void;
  getSelectedCoursesForCollege: (collegeId: string) => string[];
};

const SelectedCoursesContext = createContext<
  SelectedCoursesContextType | undefined
>(undefined);

export const SelectedCoursesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedCourses, setSelectedCourses] = useState<{
    [collegeId: string]: string[];
  }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedCollegeCourses");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("selectedCollegeCourses", JSON.stringify(selectedCourses));
  }, [selectedCourses]);

const toggleCourse = (courseId: string, collegeId: string) => {
  setSelectedCourses((prev) => {
    const collegeSelectedCourses = prev[collegeId] || [];
    const updatedCollegeCourses = collegeSelectedCourses.includes(courseId)
      ? collegeSelectedCourses.filter((id) => id !== courseId)
      : [...collegeSelectedCourses, courseId];

    return {
      ...prev,
      [collegeId]: updatedCollegeCourses,
    };
  });
};

const removeCourse = (courseId: string, collegeId: string) => {
  setSelectedCourses((prev) => ({
    ...prev,
    [collegeId]: (prev[collegeId] || []).filter((id) => id !== courseId),
  }));
};

const getSelectedCoursesForCollege = (collegeId: string) => {
  return selectedCourses[collegeId] || [];
};

  return (
    <SelectedCoursesContext.Provider
      value={{ selectedCourses, toggleCourse, removeCourse, getSelectedCoursesForCollege }}
    >
      {children}
    </SelectedCoursesContext.Provider>
  );
};

export const useSelectedCourses = () => {
  const context = useContext(SelectedCoursesContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedCourses must be used within a SelectedCoursesProvider"
    );
  }
  return context;
};

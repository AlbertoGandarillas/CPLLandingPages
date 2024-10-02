import React, { createContext, useState, useContext, useEffect } from "react";

type SelectedCoursesContextType = {
  selectedCourses: string[];
  toggleCourse: (courseId: string) => void;
  removeCourse: (courseId: string) => void;
};

const SelectedCoursesContext = createContext<
  SelectedCoursesContextType | undefined
>(undefined);

export const SelectedCoursesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedCourses");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("selectedCourses", JSON.stringify(selectedCourses));
  }, [selectedCourses]);

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
  };

  return (
    <SelectedCoursesContext.Provider
      value={{ selectedCourses, toggleCourse, removeCourse }}
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

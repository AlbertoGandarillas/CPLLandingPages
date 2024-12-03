"use client";
import { CircleHelp } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import introJs from "intro.js";
interface TourStep {
  title: string;
  element: string;
  intro: string;
  position?: "top" | "bottom" | "left" | "right";
}

type TourSteps = {
  [key: string]: TourStep[];
};

// Define tour steps for each page
export const tourSteps: TourSteps = {
  "/main": [
    {
      title: "Basic CPL Information",
      element: '[data-intro="basic-info"]',
      intro: "Here you can learn the basics of what CPL is...",
      position: "bottom",
    },
    {
      title: "Most Common CPL Opportunities",
      element: '[data-intro="most-common-cpl-opportunities"]',
      intro:
        "Here you can browse or search for available CPL credits offered by college or course.",
      position: "left",
    },
    {
      title: "Find a CPL Opportunity",
      element: '[data-intro="find-map-college"]',
      intro: "Click here to find a MAP College near you.",
      position: "right",
    },
    {
      title: "Additional Resources",
      element: '[data-intro="cccapply-fafsa"]',
      intro:
        "If you are ready to set up CCCApply, or already applied and need to apply for FAFSA, click the appropriate link here.",
      position: "right",
    },
  ],
  "/main/find-a-map-college": [
    {
      title: "Search for Colleges",
      element: '[data-intro="search-colleges"]',
      intro:
        "Use the search to find colleges in your area. To see specific opportunities at a college or to request a CPL review from a college, click the icon to view that colleges CPL page. To view some opportunities on this page, click the college name to filter the table of CPL Opportunities at the bottom of the page.",
      position: "bottom",
    },
    {
      title: "View Colleges on the Map",
      element: '[data-intro="view-colleges-on-map"]',
      intro:
        "Click and drag to move positions on the map, click on pins to see the college name and their top CPL offerings.",
      position: "left",
    },
    {
      title: "Browse Courses",
      element: '[data-intro="browse-courses"]',
      intro:
        "View some common CPL offerings in this table. You can filter the table by clicking the college name from the College Finder list, or search by keyword in the search bar.",
      position: "right",
    },
  ],
};

export default function OnBoarding() {
  const pathname = usePathname();
  const localStorageKey = `onboardingEnabled-${pathname}`;

  const [onboardingEnabled, setOnboardingEnabled] = React.useState(false);

  useEffect(() => {
    // Set initial value from localStorage when component mounts
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(localStorageKey);
      setOnboardingEnabled(storedValue !== "false");
    }
  }, [localStorageKey]);

  const startTour = () => {
    const steps = tourSteps[pathname as keyof typeof tourSteps] || [];
    if (steps.length > 0) {
      const intro = introJs();
      intro.setOptions({
        steps,
        doneLabel: "Finish",
      });

      intro.oncomplete(() => {
        setOnboardingEnabled(false);
        // Only update the current page's onboarding state
        localStorage.setItem(localStorageKey, "false");
      });

      intro.start();
    }
  };

  const handleToggle = (checked: boolean) => {
    setOnboardingEnabled(checked);
    // Only update the current page's onboarding state
    localStorage.setItem(localStorageKey, checked.toString());

    if (checked) {
      startTour();
    } else {
      const intro = introJs();
      intro.exit(true); // Pass true to force exit
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-sky-950/90 dark:bg-slate-900 border-0 text-gray-400 dark:text-white"
            >
              <CircleHelp className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 z-50">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Guided Tour</h4>
                <p className="text-sm text-muted-foreground">
                  Toggle the onboarding feature to learn how to use this page.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="onboarding"
                  checked={onboardingEnabled}
                  onCheckedChange={handleToggle}
                />
                <Label htmlFor="onboarding">
                  Enable Guided Tour for this page
                </Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </TooltipTrigger>
      <TooltipContent>
        <p>Here you can learn the basics of what CPL is</p>
      </TooltipContent>
    </Tooltip>
  );
}

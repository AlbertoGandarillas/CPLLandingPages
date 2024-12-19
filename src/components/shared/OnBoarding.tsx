"use client";
import { CircleHelp } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import React, { useEffect, useState } from "react";
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

export const tourSteps: TourSteps = {
  "/main": [
    {
      title: "Basic CPL Information",
      element: '[data-intro="basic-info"]',
      intro:
        "Start here to understand what Credit for Prior Learning (CPL) is and how it can help you earn credit for your experiences.",
      position: "bottom",
    },
    {
      title: "Why is a CPL Portfolio Important?",
      element: '[data-intro="why-cpl-portfolio"]',
      intro:
        "Learn why building a CPL portfolio is essential for demonstrating your prior learning and experiences to colleges.",
      position: "left",
    },
    {
      title: "Most Common CPL Opportunities",
      element: '[data-intro="most-common-cpl-opportunities"]',
      intro:
        "Explore CPL opportunities by filtering for Military, Apprentice, or Non-Military CPL, or search by program or keyword to find courses matching your interests.",
      position: "left",
    },
    {
      title: "Filter by Program",
      element: '[data-intro="filter-by-program"]',
      intro:
        "Narrow your search by selecting a program from this dropdown. Programs shown have CPL available at some MAP Colleges.",
      position: "right",
    },
    {
      title: "Exhibit and Course Views",
      element: '[data-intro="exhibit-course-views"]',
      intro:
        "Switch between Exhibit View and Course View to explore CPL options by course or college. The Course View includes a map and college list for easy navigation.",
      position: "right",
    },
    {
      title: "College Finder in Course View",
      element: '[data-intro="college-finder-course-view"]',
      intro:
        "In Course View, specific colleges can be found using a map and list to browse college specific CPL courses.",
      position: "right",
    },
    {
      title: "Get CPL at your College",
      element: '[data-intro="get-cpl-at-your-college"]',
      intro:
        "Once you've selected a college, click here to visit their CPL page and get more details about their opportunities.",
      position: "right",
    },
    {
      title: "CCCApply and FAFSA Links",
      element: '[data-intro="cccapply-fafsa"]',
      intro:
        "Ready to apply? Use these links to start your CCCApply application or complete your FAFSA.",
      position: "right",
    },
  ],
  "/main/find-a-map-college": [
    {
      title: "Search for Colleges",
      element: '[data-intro="search-colleges"]',
      intro:
        "Use the search to find colleges in your area. To see specific opportunities at a college or to request a CPL review from a college, click the icon to view that college's CPL page. To view some opportunities on this page, click the college name to filter the table of CPL Opportunities at the bottom of the page.",
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
  const [onboardingEnabled, setOnboardingEnabled] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(localStorageKey);
      if (storedValue === null) {
        localStorage.setItem(localStorageKey, "true");
        setOnboardingEnabled(true);
      } else {
        setOnboardingEnabled(storedValue !== "false");
      }
    }
  }, [localStorageKey]);

  const startTour = () => {
    const steps = tourSteps[pathname as keyof typeof tourSteps] || [];
    if (steps.length > 0) {
      const intro = introJs();
      intro.setOptions({
        steps,
        doneLabel: "Finish",
        exitOnOverlayClick: false,
        exitOnEsc: false,
        showStepNumbers: false,
      });

      intro.start();
    }
  };

  const handleToggle = (checked: boolean) => {
    setOnboardingEnabled(checked);
    localStorage.setItem(localStorageKey, checked.toString());

    if (checked) {
      startTour();
    } else {
      const intro = introJs();
      intro.exit(true);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <div>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-sky-950/90 dark:bg-slate-900 border-0 text-gray-400 dark:text-white"
                >
                  <CircleHelp className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <TooltipContent>
              <p>Here you can learn the basics of what CPL is</p>
            </TooltipContent>
          </div>
        </Tooltip>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Guided Tour</DialogTitle>
            <DialogDescription>
              Learn how to use this page with our interactive guide.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
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
        </DialogContent>
      </Dialog>
    </div>
  );
}

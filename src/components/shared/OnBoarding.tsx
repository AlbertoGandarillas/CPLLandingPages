"use client";
import { CircleHelp } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import React, { useEffect } from "react";

export default function OnBoarding() {
  const [onboardingEnabled, setOnboardingEnabled] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('onboardingEnabled') !== 'false';
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('onboardingEnabled', onboardingEnabled.toString());
  }, [onboardingEnabled]);

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
                  onCheckedChange={setOnboardingEnabled}
                />
                <Label htmlFor="onboarding">Enable Guided Tour</Label>
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


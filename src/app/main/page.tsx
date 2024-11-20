"use client";
import * as React from "react";
import { useEffect } from "react";
import introJs from 'intro.js';
import 'intro.js/minified/introjs.min.css';
import {
  FileText,
  Award,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Certifications } from "@/components/portal/Certifications";
export default function Homepage() {
  useEffect(() => {
    const onboardingEnabled = localStorage.getItem('onboardingEnabled') !== 'false';
    if (onboardingEnabled) {
      const intro = introJs();
            const style = document.createElement("style");
            style.textContent = `
        .introjs-skipbutton {
          position: absolute;
          right: 50px;
          bottom: 10px;
          color: #666;
          cursor: pointer;
        }
      `;
            document.head.appendChild(style);
      intro.setOptions({
        steps: [
          {
            title: "Basic CPL Information",
            element: '[data-intro="basic-info"]',
            intro: "Here you can learn the basics of what CPL is...",
            position: "bottom",
          },
          {
            title: "Find a MAP College",
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
        showProgress: false,
        exitOnOverlayClick: false,
        showButtons: true,
        showBullets: false,
        doneLabel: "Finish",
      });

      intro.oncomplete(() => {
        localStorage.setItem("onboardingEnabled", "false");
      });
      intro.start();
    }
  }, []);

  return (
    <>
      {/* Info cards */}
      <section className="grid md:grid-cols-2 gap-6" data-intro="basic-info">
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              What is CPL?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
              Credit for Prior Learning (CPL) allows students and professionals
              to earn academic credit for knowledge and skills they&apos;ve
              gained outside the classroom, whether through work, military
              service, or other experiences. This tool guides you in identifying
              eligible prior learning and helps you streamline the process of
              turning that experience into recognized credit.
          </CardContent>
        </Card>
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Why is a CPL portfolio important?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
              A CPL portfolio is crucial because it organizes and presents your
              prior learning, skills, and experiences in a structured way that
              colleges can assess for credit. By compiling items like your JST,
              certificates, scores, and resume, the portfolio shows how your
              background meets academic standards, making it easier to receive
              credit when you enroll.
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-6 mt-4">
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Most Common Industry Certifications and Military Occupations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Certifications onSelect={() => {}} />
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
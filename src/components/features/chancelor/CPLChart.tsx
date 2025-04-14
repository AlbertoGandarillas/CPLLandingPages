"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";

type College = {
  College: string;
  Savings: number;
  YearImpact: number;
  Combined: number;
  Students: number;
  AvgUnits: number;
  Units: number;
  ElectiveCredits: number;
  AreaCredits: number;
  CourseCredits: number;
};

type TransformedCollege = {
  name: string;
  units: number;
  students: number;
  impact: number;
  avgUnits: number;
  impactScore: number;
  componentScores: {
    avgUnitScore: number;
    studentScore: number;
    unitsScore: number;
    impactScore: number;
    reductions: string;
    creditTypeMultiplier: number;
  };
};

interface CPLChartProps {
  data: College[];
}

const CPLChart: React.FC<CPLChartProps> = ({ data }) => {
  const [tooltipData, setTooltipData] = useState<TransformedCollege | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isChartHovered, setIsChartHovered] = useState(false);

  const calculateCreditTypeMultiplier = (college: College): number => {
    const totalUnits = college.Units;
    if (totalUnits === 0) return 1;

    const coursePercent = (college.CourseCredits / totalUnits);
    const areaPercent = (college.AreaCredits / totalUnits);
    const electivePercent = (college.ElectiveCredits / totalUnits);

    return 1 + (coursePercent * 0.2) - (areaPercent * 0.1) - (electivePercent * 0.6);
  };

  const calculateImpactScore = (college: College): number => {
    const creditTypeMultiplier = calculateCreditTypeMultiplier(college);
    const avgUnitScore = Math.pow(Math.min(college.AvgUnits / 6, 1.5), 1.5) * creditTypeMultiplier;
    const studentScore = Math.log10(college.Students + 1) / Math.log10(1000);
    const unitsScore = Math.pow(college.Units / 5585, 0.5);
    const impactScore = Math.pow(college.Combined / 24153809, 0.3);

    const highVolumeLowAvgReduction =
      college.Students > 500 && college.AvgUnits < 5 ? 0.9 : 1;
    const lowAvgReduction =
      college.Students <= 500 && college.AvgUnits <= 4 ? 0.7 : 1;
    const lowVolumeReduction = college.Students < 40 ? 0.4 : 1;

    const rawScore =
      (avgUnitScore * 0.35 +
        studentScore * 0.25 +
        unitsScore * 0.25 +
        impactScore * 0.15) *
      highVolumeLowAvgReduction *
      lowVolumeReduction *
      lowAvgReduction;

    return Math.round(rawScore * 100);
  };

  const calculateComponentScores = (college: College) => {
    const creditTypeMultiplier = calculateCreditTypeMultiplier(college);
    const avgUnitScore =
      Math.pow(Math.min(college.AvgUnits / 6, 1.5), 1.5) * creditTypeMultiplier * 35;
    const studentScore =
      (Math.log10(college.Students + 1) / Math.log10(1000)) * 25;
    const unitsScore = Math.pow(college.Units / 5585, 0.5) * 25;
    const impactScore = Math.pow(college.Combined / 24153809, 0.3) * 15;
    const highVolReduction =
      college.Students > 500 && college.AvgUnits < 4.5 ? "0.95" : "None";
    const lowAvgReduction =
      college.Students <= 300 && college.AvgUnits <= 4 ? "0.7" : "None";
    const lowVolReduction = college.Students < 40 ? "0.4" : "None";

    return {
      avgUnitScore: Math.round(avgUnitScore),
      studentScore: Math.round(studentScore),
      unitsScore: Math.round(unitsScore),
      impactScore: Math.round(impactScore),
      creditTypeMultiplier,
      reductions: (() => {
        const reductions = [];

        if (college.Students > 500 && college.AvgUnits < 4.5) {
          reductions.push(`${highVolReduction} (High Volume, Low Average)`);
        }
        if (college.Students <= 300 && college.AvgUnits <= 4) {
          reductions.push(`${lowAvgReduction} (Low Average Units)`);
        }
        if (college.Students < 40) {
          reductions.push(`${lowVolReduction} (Low Volume)`);
        }

        return reductions.length > 0 ? reductions.join(" & ") : "None";
      })(),
    };
  };

  const transformedData: TransformedCollege[] = data
    .map((college) => ({
      name: college.College,
      units: college.Units,
      students: college.Students,
      impact: college.Combined,
      avgUnits: Number(college.AvgUnits.toFixed(1)),
      impactScore: calculateImpactScore(college),
      componentScores: calculateComponentScores(college),
    }))
    .sort((a, b) => b.impactScore - a.impactScore);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const chartElement = document.querySelector('.chart-container');
      if (!chartElement) return;
      
      const chartRect = chartElement.getBoundingClientRect();
      const isMouseInChart = 
        e.clientX >= chartRect.left &&
        e.clientX <= chartRect.right &&
        e.clientY >= chartRect.top &&
        e.clientY <= chartRect.bottom;

      if (!isMouseInChart) {
        setTooltipData(null);
        setHoveredIndex(null);
        setIsChartHovered(false);
        return;
      }

      if (isChartHovered) {
        setMousePosition({ x: e.clientX + 2, y: e.clientY + 2 });
      }
    };

    const handleScroll = () => {
      setTooltipData(null);
      setHoveredIndex(null);
      setIsChartHovered(false);
    };

    const handleMouseLeave = () => {
      setTooltipData(null);
      setHoveredIndex(null);
      setIsChartHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mouseleave", handleMouseLeave);

    const chartContainer = document.querySelector(".chart-container");
    if (chartContainer) {
      chartContainer.addEventListener("scroll", handleScroll);
      chartContainer.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (chartContainer) {
        chartContainer.removeEventListener("scroll", handleScroll);
        chartContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isChartHovered]);

  const handleMouseOver = (data: TransformedCollege, index: number) => {
    setTooltipData(data);
    setHoveredIndex(index);
    setIsChartHovered(true);
  };

  const handleMouseOut = () => {
    setTooltipData(null);
    setHoveredIndex(null);
    setIsChartHovered(false);
  };

  const systemAverage = Math.round(
    transformedData.reduce((acc, col) => acc + col.impactScore, 0) /
      transformedData.length
  );

  const displayData = transformedData.slice(0, 10);
  const maxScore = Math.max(...displayData.map((d) => d.impactScore));
  const axisMax = Math.ceil(maxScore / 20) * 20;

  const tooltipContent = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ payload: TransformedCollege }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const college = payload[0].payload;
      const scores = college.componentScores;
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold text-lg">{label}</p>
          <p className="text-xl font-semibold text-blue-600 mb-2">
            Total Score: {college.impactScore}
            <span className="text-sm text-gray-600 ml-2">
              ({college.impactScore > systemAverage ? "+" : ""}
              {college.impactScore - systemAverage} vs avg)
            </span>
          </p>
          <hr className="my-2" />
          <p className="font-medium">Score Components:</p>
          <div className="space-y-1 mt-2">
            <p>Average Units Score (35%): {scores.avgUnitScore} pts</p>
            <p>Total Students Score (25%): {scores.studentScore} pts</p>
            <p>Total CPL Units Score (25%): {scores.unitsScore} pts</p>
            <p>Economic Impact Score (15%): {scores.impactScore} pts</p>
          </div>
          <hr className="my-2" />
          <p className="font-medium">Credit Type Multiplier: {scores.creditTypeMultiplier.toFixed(2)}x</p>
          <p className="font-medium">Reductions Applied: {scores.reductions}</p>
          <hr className="my-2" />
          <div className="space-y-1 text-sm">
            <p>Average Units/Student: {college.avgUnits}</p>
            <p>Total CPL Students: {college.students.toLocaleString()}</p>
            <p>Total CPL Units: {college.units.toLocaleString()}</p>
            <p>Economic Impact: ${(college.impact / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full overflow-visible">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>CPL Impact</span>
          <span className="text-sm font-normal">
            Colleges by Implementation Success Score
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative overflow-visible">
        <div className="sticky top-0 bg-white z-10 h-12 border-b">
          <div style={{ marginLeft: "70px", width: "calc(100% - 100px)" }}>
            <ResponsiveContainer width="100%" height={48}>
              <BarChart
                data={transformedData}
                layout="vertical"
                margin={{ top: 15, right: 35, left: 30, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  domain={[0, axisMax]}
                  orientation="top"
                  tick={{ fontSize: 10 }}
                  tickCount={5}
                />
                <YAxis dataKey="name" type="category" hide={true} />
                <ReferenceLine
                  x={systemAverage}
                  stroke="#1d3864"
                  strokeDasharray="3 3"
                  label={{
                    value: `System Average: ${systemAverage}`,
                    position: "insideTopLeft",
                    fill: "#1d3864",
                    fontSize: 10,
                    offset: -30,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container h-[400px] overflow-y-auto">
          <div
            style={{
              width: "100%",
              height: `${transformedData.length * 50}px`,
              minHeight: "410px",
              position: "relative",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transformedData}
                layout="vertical"
                margin={{
                  top: 0,
                  right: 20,
                  left: 30,
                  bottom: 20,
                }}
                onMouseLeave={handleMouseOut}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, axisMax]} hide={true} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={(props: any) => {
                    const value = props.payload.value;
                    const score = transformedData.find(
                      (d) => d.name === value
                    )?.impactScore ?? 0;
                    const truncatedName = value.length > 15 
                      ? value.substring(0, 15) + '...'
                      : value;
                    return (
                      <g transform={`translate(${props.x},${props.y})`}>
                        <text
                          x={0}
                          y={0}
                          dy={4}
                          textAnchor="end"
                          fill="#666"
                          fontSize={11}
                        >{`${truncatedName} (${score})`}</text>
                      </g>
                    );
                  }}
                />
                <Bar
                  dataKey="impactScore"
                  fill="#0EA5E9"
                  onMouseOver={(data, index) => handleMouseOver(data, index)}
                  onMouseOut={handleMouseOut}
                >
                  {transformedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        hoveredIndex === index
                          ? "#1d3864"
                          : `rgb(14, 165, 233, ${
                              0.4 + (entry.impactScore / maxScore) * 0.6
                            })`
                      }
                    />
                  ))}
                </Bar>
                <ReferenceLine
                  x={systemAverage}
                  stroke="#1d3864"
                  strokeDasharray="3 3"
                  label={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {tooltipData && isChartHovered && (
          <div
            style={{
              position: "fixed",
              left: mousePosition.x,
              top: mousePosition.y,
              zIndex: 9999,
            }}
          >
            {tooltipContent({
              active: true,
              payload: [{ payload: tooltipData }],
              label: tooltipData.name,
            })}
          </div>
        )}
        <div className="mt-4 space-y-4">
          <div className="flex justify-end w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
              <div className="text-sm text-gray-600 space-y-2 text-xs">
                <p>• Average Units Score: Calculated based on total units, weighted by credit type. Course-to-course articulations receive a 20% bonus, while area credits (-10%) and elective credits (-60%) are reduced to encourage structured articulations.</p>
                <p>• Total Students Score: Based on the number of JSTs uploaded in MAP for your college.</p>
                <p>• Total CPL Units Score: Calculated from the total number of CPL units offered to students.</p>
                <p>• Economic Impact Score: Derived from your school&apos;s total economic impact.</p>
              </div>                
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          </div>
          <p className="mt-4 text-sm text-gray-600 inline-flex">
            A college successfully scaling CPL should demonstrate high efficiency
            (6+ units per CPL student) while serving a meaningful student
            population (100+ students). The ideal implementation balances
            efficiency (high average CPL units per student) with impact (reaching
            many students), indicating robust processes and broad adoption of CPL
            opportunities. Scores are calculated taking these principles into
            consideration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CPLChart;

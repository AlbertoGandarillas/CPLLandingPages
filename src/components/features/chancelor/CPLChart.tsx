"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type College = {
  College: string;
  Savings: number;
  YearImpact: number;
  Combined: number;
  Students: number;
  AvgUnits: number;
  Units: number;
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
    penalties: string;
  };
};

interface CPLChartProps {
  data: College[];
}

const CPLChart: React.FC<CPLChartProps> = ({ data }) => {
  const [tooltipData, setTooltipData] = useState<TransformedCollege | null>(
    null
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const calculateImpactScore = (college: College): number => {
    const avgUnitScore = Math.pow(Math.min(college.AvgUnits / 6, 1.5), 1.5);
    const studentScore = Math.log10(college.Students + 1) / Math.log10(1000);
    const unitsScore = Math.pow(college.Units / 5585, 0.5);
    const impactScore = Math.pow(college.Combined / 24153809, 0.3);

    const highVolumeLowAvgPenalty =
      college.Students > 500 && college.AvgUnits < 5 ? 0.9 : 1;
    const lowAvgPenalty =
      college.Students <= 500 && college.AvgUnits <= 4 ? 0.7 : 1;
    const lowVolumePenalty = college.Students < 40 ? 0.4 : 1;

    const rawScore =
      (avgUnitScore * 0.35 +
        studentScore * 0.25 +
        unitsScore * 0.25 +
        impactScore * 0.15) *
      highVolumeLowAvgPenalty *
      lowVolumePenalty *
      lowAvgPenalty;

    return Math.round(rawScore * 100);
  };

  const calculateComponentScores = (college: College) => {
    const avgUnitScore =
      Math.pow(Math.min(college.AvgUnits / 6, 1.5), 1.5) * 35;
    const studentScore =
      (Math.log10(college.Students + 1) / Math.log10(1000)) * 25;
    const unitsScore = Math.pow(college.Units / 5585, 0.5) * 25;
    const impactScore = Math.pow(college.Combined / 24153809, 0.3) * 15;
    const highVolPenalty =
      college.Students > 500 && college.AvgUnits < 4.5 ? "0.95" : "None";
    const lowAvgPenalty =
      college.Students <= 300 && college.AvgUnits <= 4 ? "0.7" : "None";
    const lowVolPenalty = college.Students < 40 ? "0.4" : "None";

    return {
      avgUnitScore: Math.round(avgUnitScore),
      studentScore: Math.round(studentScore),
      unitsScore: Math.round(unitsScore),
      impactScore: Math.round(impactScore),
      penalties: (() => {
        const penalties = [];

        if (college.Students > 500 && college.AvgUnits < 4.5) {
          penalties.push(`${highVolPenalty} (High Volume, Low Average)`);
        }
        if (college.Students <= 300 && college.AvgUnits <= 4) {
          penalties.push(`${lowAvgPenalty} (Low Average Units)`);
        }
        if (college.Students < 40) {
          penalties.push(`${lowVolPenalty} (Low Volume)`);
        }

        return penalties.length > 0 ? penalties.join(" & ") : "None";
      })(),
    };
  };

  const transformedData: TransformedCollege[] = data
    .map((college) => ({
      name: college.College,
      units: college.Units,
      students: college.Students,
      impact: college.Combined,
      avgUnits: college.AvgUnits,
      impactScore: calculateImpactScore(college),
      componentScores: calculateComponentScores(college),
    }))
    .sort((a, b) => b.impactScore - a.impactScore);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX + 10, y: e.clientY + 10 });
    };

    const handleScroll = () => {
      setTooltipData(null);
      setHoveredIndex(null);
    };

    const handleMouseLeave = () => {
      setTooltipData(null);
      setHoveredIndex(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    const chartContainer = document.querySelector(".chart-container");
    if (chartContainer) {
      chartContainer.addEventListener("scroll", handleScroll);
      chartContainer.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (chartContainer) {
        chartContainer.removeEventListener("scroll", handleScroll);
        chartContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const handleMouseOver = (data: TransformedCollege, index: number) => {
    setTooltipData(data);
    setHoveredIndex(index);
  };

  const handleMouseOut = () => {
    setTooltipData(null);
    setHoveredIndex(null);
  };

  // Calculate system average using all colleges
  const systemAverage = Math.round(
    transformedData.reduce((acc, col) => acc + col.impactScore, 0) /
      transformedData.length
  );

  // Create a new array with only top 10 colleges for display
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
            <p>Total CPL Units Score(25%): {scores.unitsScore} pts</p>
            <p>Economic Impact Score (15%): {scores.impactScore} pts</p>
          </div>
          <hr className="my-2" />
          <p className="font-medium">Penalties Applied: {scores.penalties}</p>
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
        {/* Sticky header */}
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

        {/* Main chart */}
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
                    // Truncate college name if too long
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

        {tooltipData && (
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
        <p className="mt-4 text-sm text-gray-600">
          A college successfully scaling CPL should demonstrate high efficiency
          (6+ units per CPL student) while serving a meaningful student
          population (100+ students). The ideal implementation balances
          efficiency (high average CPL units per student) with impact (reaching
          many students), indicating robust processes and broad adoption of CPL
          opportunities. Scores are calculated taking these principles into
          consideration.
        </p>
      </CardContent>
    </Card>
  );
};

export default CPLChart;

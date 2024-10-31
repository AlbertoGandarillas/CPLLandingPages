"use client";

import React from "react";
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

interface TopCollegesChartProps {
  data: {
    College: string;
    Savings: number;
    YearImpact: number;
    Combined: number;
    Students: number;
    AvgUnits: number;
    Units: number;
  }[];
}

const CPLImpactDashboard = ({ data }: TopCollegesChartProps) => {
  // Calculate composite score using revised weights
  const calculateImpactScore = (college: TopCollegesChartProps["data"][0]) => {
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


  const transformedData = data
    .map((college) => ({
      name: college.College,
      units: college.Units,
      students: college.Students,
      impact: college.Combined,
      avgUnits: college.AvgUnits,
      impactScore: calculateImpactScore(college),
    }))
    .sort((a, b) => b.impactScore - a.impactScore);

  // Calculate system average using all colleges
  const systemAverage = Math.round(
    transformedData.reduce((acc, col) => acc + col.impactScore, 0) /
      transformedData.length
  );

  // Create a new array with only top 10 colleges for display
  const displayData = transformedData.slice(0, 10);
  const maxScore = Math.max(...displayData.map((d) => d.impactScore));
  const axisMax = Math.ceil(maxScore / 20) * 20;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>CPL Impact</span>
          <span className="text-sm font-normal">
            Top 10 Colleges by CPL Implementation Success
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[410px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              layout="vertical"
              margin={{
                top: 20,
                right: 20,
                left: 60,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, axisMax]}
                label={{
                  value: "CPL Impact",
                  position: "bottom",
                  offset: 2,
                }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={140}
                tick={(props) => {
                  const matchingData = displayData.find(
                    (d) => d.name === props.payload.value
                  );
                  // Return empty text element if no matching data
                  if (!matchingData) return <text></text>;
                  return (
                    <g transform={`translate(${props.x},${props.y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={4}
                        textAnchor="end"
                        fill="#666"
                        fontSize={12}
                      >
                        {`${props.payload.value} (${matchingData.impactScore})`}
                      </text>
                    </g>
                  );
                }}
              />
              <Bar dataKey="impactScore" fill="#0EA5E9" name="CPL Impact">
                {displayData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgb(14, 165, 233, ${
                      0.4 + (entry.impactScore / axisMax) * 0.6
                    })`}
                    onMouseOver={(e) => {
                      (e.target as SVGElement).style.fill = "#1d3864";
                    }}
                    onMouseOut={(e) => {
                      (
                        e.target as SVGElement
                      ).style.fill = `rgb(14, 165, 233, ${
                        0.4 + (entry.impactScore / axisMax) * 0.6
                      })`;
                    }}
                  />
                ))}
              </Bar>
              <ReferenceLine
                x={systemAverage}
                stroke="#1d3864"
                strokeDasharray="3 3"
                label={{
                  value: `System Average: ${systemAverage}`,
                  position: "top",
                  fill: "#1d3864",
                  fontSize: 12,
                }}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const college = displayData.find((d) => d.name === label);
                    if (!college) return null;

                    return (
                      <div className="bg-white p-4 border rounded shadow-lg">
                        <p className="font-bold text-lg">{label}</p>
                        <p className="text-xl font-semibold text-blue-600 mb-2">
                          Impact: {college.impactScore}
                          <span className="text-sm text-gray-600 ml-2">
                            ({college.impactScore > systemAverage ? "+" : ""}
                            {college.impactScore - systemAverage} vs avg)
                          </span>
                        </p>
                        <hr className="my-2" />
                        <p className="font-medium">Component Scores:</p>
                        <div className="space-y-1 mt-2">
                          <p>
                            Ave. CPL Units (35%):{" "}
                            {(
                              Math.pow(
                                Math.min(college.avgUnits / 6, 1.5),
                                1.5
                              ) * 35
                            ).toFixed(1)}
                            pts
                          </p>
                          <p>
                            Total CPL Units (25%):{" "}
                            {(
                              (Math.log10(college.students + 1) /
                                Math.log10(1000)) *
                              25
                            ).toFixed(1)}
                            pts
                          </p>
                          <p>
                            Reach in Students (25%):{" "}
                            {(Math.pow(college.units / 5585, 0.5) * 25).toFixed(
                              1
                            )}{" "}
                            pts
                          </p>
                          <p>
                            Economic Impact (15%):{" "}
                            {(
                              Math.pow(college.impact / 24153809, 0.3) * 15
                            ).toFixed(1)}{" "}
                            pts
                          </p>
                        </div>
                        <hr className="my-2" />
                        <p className="font-medium">
                          Penalties Applied:{" "}
                          {(() => {
                            const penalties = [];

                            if (
                              college.students > 500 &&
                              college.avgUnits < 4.5
                            ) {
                              penalties.push(
                                `${
                                  college.students > 500 &&
                                  college.avgUnits < 4.5
                                    ? "0.95"
                                    : "None"
                                } (High Volume, Low Average)`
                              );
                            }
                            if (
                              college.students <= 300 &&
                              college.avgUnits <= 4
                            ) {
                              penalties.push(
                                `${
                                  college.students <= 300 &&
                                  college.avgUnits <= 4
                                    ? "0.7"
                                    : "None"
                                } (Low Average Units)`
                              );
                            }
                            if (college.students < 40) {
                              penalties.push(
                                `${
                                  college.students < 40 ? "0.4" : "None"
                                } (Low Volume)`
                              );
                            }

                            return penalties.length > 0
                              ? penalties.join(" & ")
                              : "None";
                          })()}
                        </p>
                        <hr className="my-2" />
                        <div className="space-y-1 text-sm">
                          <p>Average Units/Student: {college.avgUnits}</p>
                          <p>Total CPL Units: {college.units}</p>
                          <p>Students Served: {college.students}</p>
                          <p>
                            Economic Impact: $
                            {(college.impact / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
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

export default CPLImpactDashboard;

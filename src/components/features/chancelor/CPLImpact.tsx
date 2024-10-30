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
    const volumeScore = (college.Units / 5585) * 25;
    const studentsScore = (college.Students / 1796) * 20;
    const avgUnitScore = (college.AvgUnits / 11.3) * 45;
    const impactScore = (college.Combined / 24153809) * 10;

    return Math.round(volumeScore + studentsScore + avgUnitScore + impactScore);
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
        <div className="h-96">
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
                            Ave. CPL Units (45%):{" "}
                            {Math.round((college.avgUnits / 11.3) * 45)} pts
                          </p>
                          <p>
                            Total CPL Units (25%):{" "}
                            {Math.round((college.units / 5585) * 25)} pts
                          </p>
                          <p>
                            Reach in Students (20%):{" "}
                            {Math.round((college.students / 1796) * 20)} pts
                          </p>
                          <p>
                            Economic Impact (10%):{" "}
                            {Math.round((college.impact / 24153809) * 10)} pts
                          </p>
                        </div>
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
      </CardContent>
    </Card>
  );
};

export default CPLImpactDashboard;

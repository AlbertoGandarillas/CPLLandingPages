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
};

interface CPLImpactDashboardProps {
  data: College[];
}

const SCORE_WEIGHTS = {
  avgUnits: 0.35,
  students: 0.25,
  units: 0.25,
  impact: 0.15,
} as const;

const PENALTY_THRESHOLDS = {
  highVolumeLowAvg: { students: 500, avgUnits: 5, penalty: 0.9 },
  lowAvg: { students: 500, avgUnits: 4, penalty: 0.7 },
  lowVolume: { students: 40, penalty: 0.4 },
} as const;

const REFERENCE_VALUES = {
  maxAvgUnits: 6,
  maxUnits: 5585,
  maxImpact: 24153809,
  studentLogBase: 1000,
} as const;

const calculateImpactScore = (college: College): number => {
  const avgUnitScore = Math.pow(Math.min(college.AvgUnits / REFERENCE_VALUES.maxAvgUnits, 1.5), 1.5);
  const studentScore = Math.log10(college.Students + 1) / Math.log10(REFERENCE_VALUES.studentLogBase);
  const unitsScore = Math.pow(college.Units / REFERENCE_VALUES.maxUnits, 0.5);
  const impactScore = Math.pow(college.Combined / REFERENCE_VALUES.maxImpact, 0.3);

  const penalties = {
    highVolumeLowAvg: college.Students > PENALTY_THRESHOLDS.highVolumeLowAvg.students && 
                      college.AvgUnits < PENALTY_THRESHOLDS.highVolumeLowAvg.avgUnits ? 
                      PENALTY_THRESHOLDS.highVolumeLowAvg.penalty : 1,
    lowAvg: college.Students <= PENALTY_THRESHOLDS.lowAvg.students && 
            college.AvgUnits <= PENALTY_THRESHOLDS.lowAvg.avgUnits ? 
            PENALTY_THRESHOLDS.lowAvg.penalty : 1,
    lowVolume: college.Students < PENALTY_THRESHOLDS.lowVolume.students ? 
               PENALTY_THRESHOLDS.lowVolume.penalty : 1,
  };

  const rawScore = (
    avgUnitScore * SCORE_WEIGHTS.avgUnits +
    studentScore * SCORE_WEIGHTS.students +
    unitsScore * SCORE_WEIGHTS.units +
    impactScore * SCORE_WEIGHTS.impact
  ) * penalties.highVolumeLowAvg * penalties.lowAvg * penalties.lowVolume;

  return Math.round(rawScore * 100);
};

const getComponentScores = (college: TransformedCollege) => {
  return {
    avgUnits: (Math.pow(Math.min(college.avgUnits / 6, 1.5), 1.5) * 35).toFixed(1),
    students: ((Math.log10(college.students + 1) / Math.log10(1000)) * 25).toFixed(1),
    units: (Math.pow(college.units / 5585, 0.5) * 25).toFixed(1),
    impact: (Math.pow(college.impact / 24153809, 0.3) * 15).toFixed(1),
  };
};

const getPenaltiesText = (college: TransformedCollege): string => {
  const penalties = [];

  if (college.students > 500 && college.avgUnits < 4.5) {
    penalties.push("0.95 (High Volume, Low Average)");
  }
  if (college.students <= 300 && college.avgUnits <= 4) {
    penalties.push("0.7 (Low Average Units)");
  }
  if (college.students < 40) {
    penalties.push("0.4 (Low Volume)");
  }

  return penalties.length > 0 ? penalties.join(" & ") : "None";
};

const CustomTooltip: React.FC<any> = ({ active, payload, label, totalColleges }) => {
  if (!active || !payload?.length) return null;

  const college = payload[0].payload as TransformedCollege;
  const scores = getComponentScores(college);
  const systemAverage = Math.round(
    payload.reduce((acc: number, p: any) => acc + (p.payload as TransformedCollege).impactScore, 0) / totalColleges
  );
  return (
    <div className="bg-white p-4 border rounded shadow-lg">
      <p className="font-bold text-sm">{label}</p>
      <p className="text-xl font-semibold text-blue-600 mb-2">
        Impact: {college.impactScore}
        <span className="text-sm text-gray-600 ml-2">
          ({college.impactScore > systemAverage ? "+" : ""}
          
          {college.impactScore - systemAverage} vs avg)
        </span>
      </p>
      <hr className="my-2" />
      <p className="font-medium">Component Scores:</p>
      <div className="space-y-1 mt-2 text-xs">
        <p>Ave. CPL Units (35%): {scores.avgUnits} pts</p>
        <p>Total CPL Units (25%): {scores.students} pts</p>
        <p>Reach in Students (25%): {scores.units} pts</p>
        <p>Economic Impact (15%): {scores.impact} pts</p>
      </div>
      <hr className="my-2" />
      <p className="font-medium">Penalties Applied: </p>
      <p className="text-xs">{getPenaltiesText(college)}</p>
      <hr className="my-2" />
      <div className="space-y-1 text-xs">
        <p>Average Units/Student: {college.avgUnits}</p>
        <p>Total CPL Units: {college.units}</p>
        <p>Students Served: {college.students}</p>
        <p>Economic Impact: ${(college.impact / 1000000).toFixed(1)}M</p>
      </div>
    </div>
  );
};

const CPLImpactDashboard: React.FC<CPLImpactDashboardProps> = ({ data }) => {
  const transformedData = React.useMemo(() => 
    data
      .map((college): TransformedCollege => ({
        name: college.College,
        units: college.Units,
        students: college.Students,
        impact: college.Combined,
        avgUnits: college.AvgUnits,
        impactScore: calculateImpactScore(college),
      }))
      .sort((a, b) => b.impactScore - a.impactScore), // Only keep top 10
    [data]
  );

  const systemAverage = React.useMemo(() => 
    Math.round(
      transformedData.reduce((acc, col) => acc + col.impactScore, 0) / transformedData.length
    ),
    [transformedData]
  );

  const axisMax = React.useMemo(() => {
    const maxScore = Math.max(...transformedData.map((d) => d.impactScore));
    return Math.ceil(maxScore / 20) * 20;
  }, [transformedData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>CPL Impact</span>
          <span className="text-sm font-normal">
            Colleges by implementation success score
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[410px] overflow-y-auto">
          <div className="h-[3610px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transformedData}
                layout="vertical"
                margin={{ top: 20, right: 20, left: 60, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, axisMax]}
                  label={{ value: "CPL Impact", position: "bottom", offset: 2 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={({ x, y, payload }) => (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={4}
                        textAnchor="end"
                        fill="#666"
                        fontSize={12}
                      >
                        {`${payload.value} (${
                          transformedData.find((d) => d.name === payload.value)
                            ?.impactScore
                        })`}
                      </text>
                    </g>
                  )}
                />
                <Bar dataKey="impactScore" fill="#0EA5E9" name="CPL Impact">
                  {transformedData.map((entry, index) => (
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
                <Tooltip content={<CustomTooltip totalColleges={transformedData.length} />} cursor={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-600">
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

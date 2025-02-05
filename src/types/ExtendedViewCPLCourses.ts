import { ViewCPLCourses, ViewCPLCreditRecommendations, ViewCPLEvidenceCompetency, ViewCPLIndustryCertifications } from "@prisma/client";

export interface ExtendedViewCPLCourses extends ViewCPLCourses {
  IndustryCertifications?: ViewCPLIndustryCertifications[];
}

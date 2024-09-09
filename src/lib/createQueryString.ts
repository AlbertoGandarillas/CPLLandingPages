export interface QueryParams {
  college?: string | null;
  creditRecommendation?: string | null;
  topCode?: string | null;
  industryCertification?: string | null;
  cidNumber?: string | null;
  learningMode?: string | null;
}

export function createQueryString(params: QueryParams): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      // Checks for non-null, non-undefined, and non-empty strings
      query.append(key, value.toString()); // Ensure conversion to string for URLSearchParams compatibility
    }
  });

  return query.toString();
}

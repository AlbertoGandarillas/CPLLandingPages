export interface QueryParams {
  college?: string | null;
  industryCertification?: string | null;
  cplType?: string | null;
  learningMode?: string | null;
  criteria?: string | null;
  topCode?: string | null;
  cidNumber?: string | null;
  searchTerm?: string | null;
  page?: string | null;
  indCert?: string | null;
  excludeColleges?: string | null;
  catalogYearId?: string | null;
}

export function createQueryString(params: QueryParams): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      query.append(key, value.toString());
    }
  });

  return query.toString();
}

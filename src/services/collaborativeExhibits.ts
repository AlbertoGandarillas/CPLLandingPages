interface CollaborativeExhibit {
  id: number;
  Title: string;
  CreditRecommendation: string;
  AceID: string;
  Status: string;
  outline_id: number;
  CriteriaID: number;
  college: string;
  Course: string;
  VersionNumber: string;
  CollegeID: number;
  ModelOfLearning: number;
  CPLType: number;
  articulations: Array<{
    id: number;
    Status: string;
    CreditRecommendation: string;
    Course: string;
    college: string;
    Slug: string;
  }>;
  collaborativeTypes: Array<{
    id: number;
    Description: string;
    CollaborativeID: number;
  }>;
}

interface FetchExhibitsParams {
  ccc?: "0" | "1";
  status?: "Not Articulated" | "Articulated" | "Inprogress";
  searchTerm?: string;
  collegeID?: number;
  modelOfLearning?: number;
  cplType?: number;
  page?: number;
  pageSize?: number;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface ExhibitsResponse {
  data: CollaborativeExhibit[];
  pagination: PaginationInfo;
}

export const collaborativeExhibitsApi = {
  getExhibits: async ({
    ccc,
    status,
    searchTerm,
    collegeID,
    modelOfLearning,
    cplType,
    page = 1,
    pageSize = 9,
  }: FetchExhibitsParams = {}): Promise<ExhibitsResponse> => {
    try {
      const params = new URLSearchParams();

      if (ccc) {
        params.append("ccc", ccc);
      }

      if (status) {
        params.append("status", status);
      }

      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      if (collegeID) {
        params.append("collegeID", collegeID.toString());
      }
      if (modelOfLearning) {
        params.append("modelOfLearning", modelOfLearning.toString());
      }
      if (cplType) {
        params.append("cplType", cplType.toString());
      }

      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      const response = await fetch(
        `/api/collaborative-exhibits?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exhibits");
      }

      return response.json();
    } catch (error) {
      console.error("Error in getExhibits:", error);
      throw error;
    }
  },
};

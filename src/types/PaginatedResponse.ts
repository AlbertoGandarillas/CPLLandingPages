import { ExtendedViewCPLCourses } from "./ExtendedViewCPLCourses";

export interface PaginationMetadata {
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse {
  data: ExtendedViewCPLCourses[];
  metadata: PaginationMetadata;
}

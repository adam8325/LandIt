// aiservice/cvAndJobPostService.ts
import axios from "axios";

export interface UploadRequest {
  cvContent: string;
  jobPostingContent: string;
}

export interface AnalysisResponse {
  analysis: string;
}

const API_BASE = "http://localhost:5209/api"; // tilpas hvis din backend kører andet port/url

export async function analyzeCvAndJobPost(data: UploadRequest): Promise<AnalysisResponse> {
  const response = await axios.post<AnalysisResponse>(`${API_BASE}/CvAndJobPost/analyze`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

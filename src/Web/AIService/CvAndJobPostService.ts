// AiServices/cvUploadService.ts
const API_BASE_URL = 'https://localhost:7131/api';

export interface UploadCvRequest {
  cvContent?: string;
  cvFile?: File;
  jobPostingContent: string;
}

export interface AnalysisResponse {
  analysis: string;
}

export const cvUploadService = {
  async uploadCvAndJobPosting(request: UploadCvRequest): Promise<AnalysisResponse> {
  let response: Response;

  if (request.cvFile) {
    // Send som multipart/form-data
    const formData = new FormData();
    formData.append("cvFile", request.cvFile);
    formData.append("jobPostingContent", request.jobPostingContent);
    response = await fetch(`${API_BASE_URL}/CvAndJobPost/analyze/form`, {
      method: "POST",
      body: formData,
    });
  } else {
    // Send som JSON
    response = await fetch(`${API_BASE_URL}/CvAndJobPost/analyze/json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cvContent: request.cvContent,
        jobPostingContent: request.jobPostingContent,
      }),
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
}

};
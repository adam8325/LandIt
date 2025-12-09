import axios from "axios";
import type { ApplicationRequest, ApplicationResponse } from "../Models/ApplicationModels";

const API_BASE = import.meta.env.VITE_API_URL || "https://localhost:7131/api";
const API_URL = `${API_BASE}/Application/generate`;

export const applicationService = {
  async generateApplication(data: ApplicationRequest): Promise<ApplicationResponse> {
    const formData = new FormData();

    if (data.cvFile) formData.append("CvFile", data.cvFile);
    if (data.jobPostingFile) formData.append("JobPostingFile", data.jobPostingFile);
    if (data.cvText) formData.append("CvText", data.cvText);
    if (data.jobPostingText) formData.append("JobPostingText", data.jobPostingText);

    const response = await axios.post<ApplicationResponse>(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },
};

import axios from "axios";
import type { InterviewRequest, InterviewOutput } from "../Models/InterviewModels";

const BASE_URL = "https://localhost:7131/api/Interview/start";

export const interviewService = {
    async generateQuestions(data: InterviewRequest):
    Promise<InterviewOutput> {
        const formData = new FormData();

        if (data.cvFile) formData.append("CvFile", data.cvFile);
        if (data.jobPostingFile) formData.append("JobPostingFile", data.jobPostingFile);
        if (data.cvText) formData.append("CvText", data.cvText);
        if (data.jobPostingText) formData.append("JobPostingText", data.jobPostingText);

        const response = await axios.post<InterviewOutput>(BASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    },

}

 export const evaluateAnswers = async (answers: { question: string; answer: string }[]) => {
    const { data } = await axios.post(`${BASE_URL}/evaluate`, answers);
    return data;
    };
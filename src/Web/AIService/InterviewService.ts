import axios from "axios";
import type { InterviewEvaluationRequest, InterviewEvaluationResult, InterviewStartRequest, InterviewStartResponse } from "../Models/InterviewModels";

const INTERVIEW_START_URL = "https://localhost:7131/api/Interview/start";
const INTERVIEW_EVALUATE_URL = "https://localhost:7131/api/Interview/evaluate";
const INTERVIEW_TRANSCRIBE_URL = "https://localhost:7131/api/Interview/transcribe";

export const interviewService = {
    async generateQuestions(data: InterviewStartRequest):
    Promise<InterviewStartResponse> {
        const formData = new FormData();

        if (data.cvFile) formData.append("CvFile", data.cvFile);
        if (data.jobPostingFile) formData.append("JobPostingFile", data.jobPostingFile);
        if (data.cvText) formData.append("CvText", data.cvText);
        if (data.jobPostingText) formData.append("JobPostingText", data.jobPostingText);

        const response = await axios.post<InterviewStartResponse>(INTERVIEW_START_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    },

    async evaluateAnswers(data: InterviewEvaluationRequest[]):
    Promise<InterviewEvaluationResult> {
        const response = await axios.post<InterviewEvaluationResult>(INTERVIEW_EVALUATE_URL, data);
        return response.data;
    },

    async transcribeVoice(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("audioFile", file);

    const response = await axios.post<{ text: string }>(INTERVIEW_TRANSCRIBE_URL,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data.text;
}

}


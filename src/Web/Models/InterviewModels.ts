export interface InterviewRequest {
  cvText?: string;
  jobPostingText?: string;
  cvFile?: File | null;
  jobPostingFile?: File | null;
}

export interface InterviewOutput {
  introduction: string;
  questions: string[];
  elevatorPitch: string;
  salaryEstimate: string;
}

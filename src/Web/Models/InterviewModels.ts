export interface InterviewStartRequest {
  cvText?: string;
  jobPostingText?: string;
  cvFile?: File | null;
  jobPostingFile?: File | null;
}

export interface InterviewStartResponse {
  introduction: string;
  questions: string[];
  elevatorPitch: string;
  salaryEstimate: string;
}

export interface InterviewEvaluationRequest {
  question: string; 
  answer: string;
}

  export interface InterviewEvaluation {
  question: string;
  answer: string;
  rating: number;
  feedback: string;
}

export interface InterviewEvaluationResult {
  evaluations: InterviewEvaluation[];
  overallFeedback: string;
  averageRating: number;
}
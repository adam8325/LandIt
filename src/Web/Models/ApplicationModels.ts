export interface ApplicationRequest {
  cvText?: string;
  jobPostingText?: string;
  cvFile?: File | null;
  jobPostingFile?: File | null;
}

export interface ApplicationResponse {
  applicationText: string;
  emailDraft: string;
  matchScore: number;
}

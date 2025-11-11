import axios from "axios";
import type { InterviewRequest } from "../Models/InterviewModels";

const BASE_URL = "http://localhost:7131/api/Interview";

export const generateQuestions = async (InterviewData: InterviewRequest) => {
  const { data } = await axios.post(`${BASE_URL}/start`, InterviewData);
  return data;
};

export const evaluateAnswers = async (answers: { question: string; answer: string }[]) => {
  const { data } = await axios.post(`${BASE_URL}/evaluate`, answers);
  return data;
};

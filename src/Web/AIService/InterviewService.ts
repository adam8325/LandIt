import axios from "axios";

const BASE_URL = "http://localhost:7131/api/Interview";

export const generateQuestions = async (cvText: string, jobPostingText: string) => {
  const { data } = await axios.post(`${BASE_URL}/start`, { cvText, jobPostingText });
  return data;
};

export const evaluateAnswers = async (answers: { question: string; answer: string }[]) => {
  const { data } = await axios.post(`${BASE_URL}/evaluate`, answers);
  return data;
};

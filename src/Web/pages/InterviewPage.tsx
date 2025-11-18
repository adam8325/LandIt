import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { interviewService } from "../AIService/InterviewService";
import { useFileInput } from "../Hooks/useFileInput";
import { FileInputSection } from "../Components/FileInputSection";
import InterviewSimulation from "../Components/InterviewSimulation";
import type { InterviewEvaluationResult } from "../Models/InterviewModels";

export default function InterviewPage() {   
  // File input hooks
  const cvInput = useFileInput();
  const jobInput = useFileInput();

  // Interview state
  const [questions, setQuestions] = useState<Array<string>>([]);
  const [answers, setAnswers] = useState<Array<string>>([]);
  const [interviewEvaluations, setInterviewEvaluations] = useState<InterviewEvaluationResult>({
    evaluations: [],
    overallFeedback: "",
    averageRating: 0
  });
  
  // Output state
  const [salaryOutput, setSalaryOutput] = useState<string>("");
  const [elevatorOutput, setElevatorOutput] = useState<string>("");
  const [introductionOutput, setIntroductionOutput] = useState<string>("");
  
  // UI state
  const [evaluationCompleted, setEvaluationCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsCompleted(false);

      const response = await interviewService.generateQuestions({
        cvText: cvInput.text || undefined,
        cvFile: cvInput.file || undefined,
        jobPostingText: jobInput.text,
        jobPostingFile: jobInput.file ?? undefined,
      });

      setQuestions(response.questions);
      setIntroductionOutput(response.introduction);
      setElevatorOutput(response.elevatorPitch);
      setSalaryOutput(response.salaryEstimate);
      setIsCompleted(true);
    } catch (err) {
      setError("Der opstod en fejl under generering af spørgsmål");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterview = async () => {
    setEvaluationCompleted(false);
    setIsLoading(true);
    try {
      const payload = questions.map((q, i) => ({
        question: q,
        answer: answers[i] ?? ""
      }));
      const response = await interviewService.evaluateAnswers(payload);
      setInterviewEvaluations(response);
      setEvaluationCompleted(true);
    } catch (err) {
      setError("Der opstod en fejl under evaluering af interviewet");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetInterview = () => {
    cvInput.reset();
    jobInput.reset();
    setQuestions([]);
    setAnswers([]);
    setInterviewEvaluations({ evaluations: [], overallFeedback: "", averageRating: 0 });
    setEvaluationCompleted(false);
    setIsCompleted(false);
    setIntroductionOutput("");
    setSalaryOutput("");
    setElevatorOutput("");
    setError(null);
  };

  const isSubmitDisabled = 
    (!(cvInput.text.trim() || cvInput.file)) || 
    (!(jobInput.text.trim() || jobInput.file)) || 
    isLoading;

  return (
    <div className="bg-slate-950 py-6 px-8 w-full min-h-screen">
      <div className="w-3/4 flex flex-col items-center justify-center text-center text-white gap-10 mx-auto">
        <div className="grid grid-cols-3 w-full">
          <Link
            to="/"
            className="place-self-start mr-auto btn py-1 px-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 hover:border hover:border-blue-400 hover:bg-sky-900 transition-colors"
          >
            <span className="text-white">Hjem</span>
          </Link>
          <section className="flex flex-col items-center justify-center">
            <h1 className="font-bold mb-2 text-4xl pb-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              {!isCompleted ? "Øv dig til samtalen" : "Interview Simulator"}
            </h1>
            <p className="text-gray-300 text-sm">
              {!isCompleted ? "Tilføj dit CV og jobopslaget for at starte et interview" : introductionOutput}
            </p>
          </section>
        </div>

        {!isCompleted ? (
          <>
            <div className="w-full flex flex-col sm:flex-row items-center gap-10">
              <FileInputSection
                title="CV"
                description="Upload eller indsæt dit CV"
                text={cvInput.text}
                file={cvInput.file}
                inputRef={cvInput.inputRef}
                isLoading={isLoading}
                onTextChange={cvInput.setText}
                onFileUpload={cvInput.handleFileUpload}
                onTriggerUpload={cvInput.triggerFileUpload}
                onRemoveFile={cvInput.removeFile}
                placeholder="Indsæt dit CV-indhold"
              />
              <FileInputSection
                title="Jobopslag"
                description="Upload eller indsæt jobopslag"
                text={jobInput.text}
                file={jobInput.file}
                inputRef={jobInput.inputRef}
                isLoading={isLoading}
                onTextChange={jobInput.setText}
                onFileUpload={jobInput.handleFileUpload}
                onTriggerUpload={jobInput.triggerFileUpload}
                onRemoveFile={jobInput.removeFile}
                placeholder="Indsæt jobbeskrivelsen"
              />
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className={`group flex-1 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border border-blue-400 bg-sky-100 hover:bg-sky-900 transition-colors ${
                  isSubmitDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {isLoading && <Loader2 className="animate-spin h-5 w-5 text-blue-700" />}
                {isCompleted && !isLoading && <Check className="h-4 w-4 text-blue-500" />}
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent text-shadow-md/10 group-hover:text-white">
                  {isLoading ? "Genererer spørgsmål" : isCompleted ? "Kom i gang!" : "Start interview"}
                </span>
              </button>
            </div>
          </>
        ) : (
          <InterviewSimulation
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
            onNewTry={resetInterview}
            introduction={introductionOutput}
            salaryOutput={salaryOutput}
            elevatorOutput={elevatorOutput}
            isLoading={isLoading}
            onEvaluate={handleInterview}
            evaluations={interviewEvaluations}
            evaluationCompleted={evaluationCompleted}
          />
        )}
      </div>
    </div>
  );
}
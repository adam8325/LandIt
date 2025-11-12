import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import AnimatedSalary from "./AnimatedSalary";
import { scrollbarStyle } from "./ScrollbarStyle";
import type { InterviewEvaluationResult } from "../Models/InterviewModels";

interface InterviewSimulationProps {
  questions: string[];
  answers: string[];
  setAnswers: (answers: string[]) => void;
  introduction: string;
  salaryOutput: string;
  elevatorOutput: string;
  onEvaluate: () => void;
  evaluations: InterviewEvaluationResult;
  evaluationCompleted: boolean;
}

export default function InterviewSimulation({
  questions,
  introduction,
  salaryOutput,
  elevatorOutput,
  onEvaluate,
  answers,
  setAnswers,
  evaluations,
  evaluationCompleted,
}: InterviewSimulationProps) {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(elevatorOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };


  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="flex items-center justify-between gap-10 w-full h-full rounded-lg text-white">
      {/* Left side */}
      <section className="flex flex-col items-center rounded-lg w-1/3 h-140 bg-slate-900 p-4">
        <div className="text-center flex flex-col items-center gap-10">
          <h4 className="text-lg sm:text-2xl font-semibold">Forventet Løn</h4>
          <AnimatedSalary salary={salaryOutput} />
        </div>
        <div className="w-full flex flex-col gap-4">
          <h4 className="text-lg sm:text-2xl font-semibold">Elevator pitch</h4>
          <textarea
            className={`w-full h-60 resize-none p-2 bg-slate-950 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 ${scrollbarStyle}`}
            value={elevatorOutput}
            readOnly
          />
          <button
            onClick={handleCopy}
            className="py-1 px-2 sm:py-2 sm:px-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 cursor-pointer flex items-center justify-center gap-2 font-semibold text-white text-xs sm:text-sm rounded-sm sm:rounded-md"
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {isCopied ? "Kopieret" : "Kopiér"}
          </button>
        </div>
      </section>

      {/* Right side */}
      <section className="flex flex-col gap-4 rounded-lg w-2/3 h-140 bg-slate-900 p-4">
        <h4 className="mb-2 text-lg px-4">{introduction}</h4>

        <div className="flex flex-col flex-grow">
          <label className="text-sm font-semibold text-blue-400 mb-2">
            {currentQuestion}
          </label>

          <textarea
            className={`w-full h-40 p-2 bg-slate-950 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 ${scrollbarStyle}`}
            placeholder="Skriv dit svar her..."
            value={answers[currentIndex] || ""}
            onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[currentIndex] = e.target.value;
                setAnswers(newAnswers);
            }}
          />

          {/* Placeholder for future voice recording button */}
          <button className="mt-3 py-1 px-3 rounded-md bg-blue-700 text-white text-xs font-semibold hover:bg-blue-600">
            🎤 Indtal svar (kommende feature)
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="cursor-pointer py-2 px-4 bg-slate-800 rounded-md text-sm disabled:opacity-40"
          >
            Forrige
          </button>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              className="cursor-pointer py-2 px-4 bg-blue-600 rounded-md text-sm hover:bg-blue-700"
            >
              Næste
            </button>
          ) : (
            <button
              onClick={onEvaluate}
              className="cursor-pointer py-2 px-4 bg-green-600 rounded-md text-sm hover:bg-green-700"
            >
              Evaluér Interview
            </button>
          )}
        </div>

        {evaluationCompleted && (
          <div className="mt-6 border-t border-gray-600 pt-4">
            <p className="font-semibold text-lg">Samlet vurdering</p>
            <p className="text-sm text-gray-400">{evaluations.overallFeedback}</p>
            <p className="text-yellow-400 mt-2">
              ⭐ {evaluations.averageRating}/5
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

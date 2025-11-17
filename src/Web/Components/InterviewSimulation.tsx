import React, { useState } from "react";
import { Copy, Check, Mic, Square } from "lucide-react";
import AnimatedSalary from "./AnimatedSalary";
import { scrollbarStyle } from "./ScrollbarStyle";
import type { InterviewEvaluationResult } from "../Models/InterviewModels";
import { useVoiceRecorder } from "../Hooks/useVoiceRecorder";
import { interviewService } from "../AIService/InterviewService";

interface InterviewSimulationProps {
  questions: string[];
  answers: string[];
  setAnswers: (answers: string[]) => void;
  onNewTry: () => void;
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
    onNewTry,
    salaryOutput,
    elevatorOutput,
    onEvaluate,
    answers,
    setAnswers,
    evaluations,
    evaluationCompleted,
  }: InterviewSimulationProps) {

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex];

  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();  

  async function handleStopRecording() {
  const audioFile = await stopRecording();

  const text = await interviewService.transcribeVoice(audioFile);

  const newAnswers = [...answers];
  newAnswers[currentIndex] = text;
  setAnswers(newAnswers);
}

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

  const handleNewTry = () => {
    onNewTry()
  }


  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="flex items-center justify-between gap-10 w-full h-full rounded-lg text-white">
      {/* Left side */}
      <section className="flex flex-col items-center rounded-lg w-1/3 h-140 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 border border-cyan-950 p-4 gap-7">
        <div className="text-center flex flex-col items-center gap-4">
          <h4 className="text-lg sm:text-2xl font-semibold">Forventet Løn</h4>
          <AnimatedSalary salary={salaryOutput} />
        </div>
        <div className="w-full flex flex-col gap-4">
          <h4 className="text-lg sm:text-2xl font-semibold">Elevator pitch</h4>
          <textarea
            className={`w-full h-80 resize-none p-2 bg-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 ${scrollbarStyle}`}
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
      <section className="flex flex-col gap-4 rounded-lg w-2/3 h-140 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 border border-cyan-950 p-4">
      
        {!evaluationCompleted ? 
        (
          <>
            <div className="flex flex-col gap-4 h-4/13">
              <h4 className="text-lg sm:text-2xl font-semibold text-left">Spørgsmål {currentIndex + 1} / {questions.length}</h4>
              <label className="text-md text-left font-semibold text-blue-400">
                {currentQuestion}
              </label> 
            </div>
            <div className="h-8/13 flex flex-col justify-center gap-2">
              <textarea
                className={`w-full resize-none h-70 p-2 bg-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 ${scrollbarStyle}`}
                placeholder="Skriv dit svar her..."
                value={answers[currentIndex] || ""}
                onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[currentIndex] = e.target.value;
                    setAnswers(newAnswers);
                }}
              />
              {/* Voice recording button */}
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
                >
                  <Mic className="w-5 h-5 animate-pulse" />
                  Start optagelse
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md cursor-pointer"
                >
                  <Square className="w-5 h-5" />
                  Stop & transskriber
                </button>
              )}
            </div>

          {/* Navigation */}
          <div className="flex justify-between h-1/13">
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
                className="py-1 px-2 sm:py-2 sm:px-3  bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 cursor-pointer flex items-center gap-2 font-semibold text-white text-xs sm:text-sm rounded-sm sm:rounded-md hover:bg-[linear-gradient(90deg,#06b6d4,#6366f1)] hover:text-white"
              >
                Næste
              </button>
            ) : (
              <button
                onClick={onEvaluate}
                className="py-1 px-2 sm:py-2 sm:px-3  bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 cursor-pointer flex items-center gap-2 font-semibold text-white text-xs sm:text-sm rounded-sm sm:rounded-md hover:bg-[linear-gradient(90deg,#06b6d4,#6366f1)] hover:text-white"
              >
                Evaluér Interview
              </button>
            )}
          </div>
          </>
        )
        : 
        (
          <div className="flex flex-col gap-4 px-2">
            <div className="grid grid-cols-3 items-center">
              <p></p>
              <p className="font-semibold text-lg sm:text-2xl ">Samlet vurdering</p>
              <p className="text-yellow-400 ml-auto">
                ⭐ {evaluations.averageRating}/5
              </p>
            </div>              
              <p className="text-md text-gray-400">{evaluations.overallFeedback}</p>
              <button onClick={handleNewTry} className="py-1 px-2 sm:py-2 sm:px-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 cursor-pointer flex items-center justify-center gap-2 font-semibold text-white text-xs sm:text-sm rounded-sm sm:rounded-md"
              >Prøv igen</button>
              
          </div>
        )}
        
      </section>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Copy, Check, Mic, Square, Loader2 } from "lucide-react";
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
  isLoading: boolean;
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
  isLoading,
  onEvaluate,
  answers,
  setAnswers,
  evaluations,
  evaluationCompleted,
}: InterviewSimulationProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // NEW: Pure question detail view
  const [showQuestionDetail, setShowQuestionDetail] = useState(false);
  const [focusedQuestionIndex, setFocusedQuestionIndex] = useState<number | null>(null);

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
    onNewTry();
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  // Auto-scroll for question detail
  useEffect(() => {
    if (showQuestionDetail && focusedQuestionIndex !== null) {
      const el = document.getElementById(`detail-${focusedQuestionIndex}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showQuestionDetail, focusedQuestionIndex]);

  return (
    <div className="flex items-center justify-between gap-10 w-full h-full rounded-lg text-white">

      {/* LEFT SIDE */}
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
            className="py-1 px-2 sm:py-2 sm:px-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 cursor-pointer flex 
            items-center justify-center gap-2 font-semibold text-white text-xs sm:text-sm rounded-sm sm:rounded-md"
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {isCopied ? "Kopieret" : "Kopiér"}
          </button>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="flex flex-col gap-4 rounded-lg w-2/3 h-140 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 border border-cyan-950 p-4">

        {/* 1) INTERVIEW VIEW */}
        {!evaluationCompleted && !showQuestionDetail && (
          <>
            <div className="flex flex-col gap-4 h-4/13">
              <h4 className="text-lg sm:text-2xl font-semibold text-left">
                Spørgsmål {currentIndex + 1} / {questions.length}
              </h4>
              <label className="text-md text-left font-semibold text-blue-400">
                {questions[currentIndex]}
              </label>
            </div>

            <div className="h-8/13 flex flex-col justify-center gap-2">
              <textarea
                className={`w-full resize-none h-70 p-2 bg-slate-800 rounded-lg text-xs focus:outline-none 
                focus:ring-1 focus:ring-blue-400 ${scrollbarStyle}`}
                placeholder="Skriv dit svar her..."
                value={answers[currentIndex] || ""}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentIndex] = e.target.value;
                  setAnswers(newAnswers);
                }}
              />

              {/* Voice recording */}
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isLoading}
                  className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r 
                  from-blue-400 via-blue-500 to-blue-600 font-semibold text-white text-xs sm:text-sm rounded-md"
                >
                  <Mic className="w-5 h-5 animate-pulse" /> Indtal svar
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r 
                  from-blue-400 via-blue-500 to-blue-600 font-semibold text-white text-xs sm:text-sm rounded-md"
                >
                  <Square className="w-5 h-5 text-red-500 animate-pulse" fill="currentColor" />
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
                  disabled={!answers[currentIndex]}
                  className="cursor-pointer py-2 px-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-md 
                  text-white disabled:opacity-50"
                >
                  Næste
                </button>
              ) : (
                <button
                  onClick={onEvaluate}
                  disabled={!answers[currentIndex]}
                  className="cursor-pointer py-2 px-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-md 
                  text-white disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="animate-spin h-5 w-5 text-blue-700" />}
                  {isLoading ? "Evaluering igang..." : "Evaluér Interview"}
                </button>
              )}
            </div>
          </>
        )}

        {/* 2) QUESTION DETAIL VIEW */}
        {evaluationCompleted && showQuestionDetail && (
          <div className="flex flex-col h-full gap-6" id={`detail-${focusedQuestionIndex}`}>
            <h4 className="text-lg sm:text-2xl font-semibold text-left">
              Spørgsmål {focusedQuestionIndex! + 1} / {questions.length}
            </h4>

            <p className="text-md font-semibold text-blue-400">
              {questions[focusedQuestionIndex!]}
            </p>

            <textarea
              readOnly
              className={`w-full resize-none h-70 p-2 bg-slate-800 rounded-lg text-xs 
              focus:outline-none border border-gray-700 ${scrollbarStyle}`}
              value={answers[focusedQuestionIndex!] || ""}
            />

            {/* Buttons bottom */}
            <div className="mt-auto flex gap-4">
              <button
                onClick={() => setShowQuestionDetail(false)}
                className="cursor-pointer py-2 px-3 bg-blue-600 rounded-md text-white"
              >
                Se evaluering
              </button>

              <button
                onClick={handleNewTry}
                className="cursor-pointer py-2 px-3 bg-gray-700 rounded-md text-white"
              >
                Prøv igen
              </button>
            </div>
          </div>
        )}

        {/* 3) EVALUATION OVERVIEW */}
        {evaluationCompleted && !showQuestionDetail && (
          <div className="flex flex-col gap-6">
            <h4 className="text-lg sm:text-2xl font-semibold text-center">Evaluering af dine svar</h4>

            <div className={`flex flex-col gap-6 h-70 overflow-y-auto pr-3 p-2 border border-gray-700 
              rounded-md ${scrollbarStyle}`}>
              {evaluations.evaluations.map((ev, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[0.1fr_1fr_0.1fr] items-center"
                >
                  <button
                    onClick={() => {
                      setFocusedQuestionIndex(i);
                      setShowQuestionDetail(true);
                    }}
                    className="cursor-pointer text-xs font-semibold text-white bg-gradient-to-b 
                    from-gray-800 via-transparent to-gray-800 rounded-sm mr-6 py-1 hover:bg-gray-700"
                  >
                    {i + 1}/{questions.length}
                  </button>

                  <p className="text-xs text-left text-gray-200">{ev.feedback}</p>
                  <p className="text-xs text-yellow-400 ml-auto">⭐ {ev.rating}/5</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 items-center px-2 justify-between">
              <p></p>
              <p className="font-semibold text-lg sm:text-2xl text-center">Samlet vurdering</p>
              <p className="text-yellow-400 text-center text-xl ml-auto">
                ⭐ {evaluations.averageRating}/5
              </p>                        
            </div>
             <p className="text-gray-300 text-sm text-center">
                {evaluations.overallFeedback}
              </p>   
            <button
                onClick={handleNewTry}
                className="cursor-pointer py-2 px-4 bg-blue-600 rounded-md text-white"
              >
                Prøv igen
            </button>

          </div>
            
        )}
      </section>
    </div>
  );
}

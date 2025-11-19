import React, { useEffect, useState } from "react";
import { Copy, Check, Mic, Square, Loader2 } from "lucide-react";
import AnimatedSalary from "./AnimatedSalary";
import { scrollbarStyle } from "./Ui/ScrollbarStyle";
import type { InterviewEvaluationResult } from "../Models/InterviewModels";
import { useVoiceRecorder } from "../Hooks/useVoiceRecorder";
import { interviewService } from "../AIService/InterviewService";
import StarRating from "./Ui/StarRating";
import ButtonStyles from "./Ui/ButtonStyles";

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
    <div className="flex sm:flex-row flex-col items-center justify-between gap-10 w-full h-full rounded-lg text-white">

      {/* LEFT SIDE */}
      <section className="order-2 flex flex-col items-center rounded-lg w-full sm:w-1/3 h-140 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 border border-cyan-950 p-4 gap-7">
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
          <ButtonStyles
            onClick={handleCopy}
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {isCopied ? "Kopieret" : "Kopiér"}
          </ButtonStyles>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="order-1 flex flex-col gap-4 rounded-lg w-full sm:w-2/3 h-140 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 border border-cyan-950 p-4">

        {/* 1) INTERVIEW VIEW */}
        {!evaluationCompleted && !showQuestionDetail && (
          <>
            <div className="flex flex-col gap-4 h-4/13">
              <h4 className="text-lg sm:text-2xl font-semibold text-left">
                Spørgsmål {currentIndex + 1} / {questions.length}
              </h4>
              <label className="text-sm sm:text-[16px] text-left font-semibold text-blue-400">
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
                <ButtonStyles
                  onClick={startRecording}
                  disabled={isLoading}
                >
                  <Mic className="w-5 h-5 animate-pulse" /> Indtal svar
                </ButtonStyles>
              ) : (
                <ButtonStyles
                  onClick={handleStopRecording}
                >
                  <Square className="w-5 h-5 text-red-500 animate-pulse" fill="currentColor" />
                  Stop & transskriber
                </ButtonStyles>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between h-1/13">
              <ButtonStyles
                onClick={handlePrev}
                disabled={currentIndex === 0}
                variant="secondary"
              >
                Forrige
              </ButtonStyles>

              {!isLastQuestion ? (
                <ButtonStyles
                  onClick={handleNext}
                  disabled={!answers[currentIndex]?.trim()}
                >
                  Næste
                </ButtonStyles>
              ) : (
                <ButtonStyles
                  onClick={onEvaluate}
                  disabled={!answers[currentIndex]?.trim()}
                >
                  {isLoading && <Loader2 className="animate-spin h-5 w-5 text-blue-700" />}
                  {isLoading ? "Evaluering igang..." : "Evaluér Interview"}
                </ButtonStyles>
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

            <p className="text-md text-left font-semibold text-blue-400">
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
              <ButtonStyles
                onClick={() => setShowQuestionDetail(false)}
              >
                Evaluering
              </ButtonStyles>

              <ButtonStyles
                onClick={handleNewTry}
                variant= "secondary"
              >
                Prøv igen
              </ButtonStyles>
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
                  className="grid grid-cols-[0.1fr_1fr_0.1fr] items-start"
                >
                  <button
                    onClick={() => {
                      setFocusedQuestionIndex(i);
                      setShowQuestionDetail(true);
                    }}
                    className="cursor-pointer text-[11px] sm:text-xs font-semibold text-white bg-gradient-to-b 
                    from-gray-800 via-transparent to-gray-800 rounded-sm mr-6 py-1 hover:bg-gray-700"
                  >
                    {i + 1}/{questions.length}
                  </button>

                  <p className="text-[11px] sm:text-xs text-left text-gray-200 mr-1">{ev.feedback}</p>
                  <StarRating size={10} rating={ev.rating} />
                </div>
              ))}
            </div>

            <div className="sm:grid grid-cols-3 grid grid-cols-[0.3fr_1fr_0.3fr] items-center px-2 justify-between">
              <p className="truncate"></p>
              <p className="font-semibold text-md sm:text-2xl text-center whitespace-nowrap">Samlet vurdering</p>
               <StarRating size={18} rating={evaluations.averageRating} className="ml-auto" />                                
            </div>
             <p className="text-gray-300 text-xs sm:text-sm text-center">
                {evaluations.overallFeedback}
              </p>   
            <ButtonStyles                
                onClick={handleNewTry}
              >
                Prøv igen
            </ButtonStyles>

          </div>
            
        )}
      </section>
    </div>
  );
}

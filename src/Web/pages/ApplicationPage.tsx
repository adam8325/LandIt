// pages/ApplicationPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Download, Check, Loader2 } from "lucide-react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { applicationService } from "../AIService/ApplicationService";
import { scrollbarStyle } from "../Components/ScrollbarStyle";
import { useFileInput } from "../Hooks/useFileInput";
import { FileInputSection } from "../Components/FileInputSection";

export default function ApplicationPage() {
  // File input hooks
  const cvInput = useFileInput();
  const jobInput = useFileInput();

  // Output state
  const [applicationOutput, setApplicationOutput] = useState<string>("");
  const [matchOutput, setMatchOutput] = useState<number>(0);
  const [mailOutput, setMailOutput] = useState<string>("");
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMailCopied, setIsMailCopied] = useState<boolean>(false);
  const [isApplicationCopied, setIsApplicationCopied] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsMailCopied(false);
      setIsApplicationCopied(false);
      setIsCompleted(false);

      const response = await applicationService.generateApplication({
        cvText: cvInput.text || undefined,
        cvFile: cvInput.file || undefined,
        jobPostingText: jobInput.text,
        jobPostingFile: jobInput.file ?? undefined,
      });

      setApplicationOutput(response.applicationText);
      setMailOutput(response.emailDraft);
      setMatchOutput(response.matchScore);
      setIsCompleted(true);
    } catch (err) {
      setError("Der opstod en fejl under generering af ansøgning");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyApplicationOutput = () => {
    if (applicationOutput) {
      setIsApplicationCopied(true);
      navigator.clipboard.writeText(applicationOutput);
    }
  };

  const copyMailOutput = () => {
    if (mailOutput) {
      setIsMailCopied(true);
      navigator.clipboard.writeText(mailOutput);
    }
  };

  const downloadOutput = () => {
    if (!applicationOutput) return;
    const blob = new Blob([applicationOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewTry = () => {
    cvInput.reset();
    jobInput.reset();
    setApplicationOutput("");
    setMatchOutput(0);
    setMailOutput("");
    setIsCompleted(false);
    setError(null);
  };

  const isSubmitDisabled = 
    (!(cvInput.text.trim() || cvInput.file)) || 
    (!(jobInput.text.trim() || jobInput.file)) || 
    isLoading;

  return (
    <div className="bg-slate-950 py-4 sm:py-6 px-6 sm:px-8 min-h-screen w-full">
      <div className="sm:w-3/4 flex flex-col items-center justify-center text-center text-white gap-10 sm:mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 w-full">
          <Link
            to="/"
            className="place-self-start mr-auto btn py-1 px-2 rounded-lg font-semibold text-xs flex items-center justify-center hover:border hover:border-blue-400 hover:bg-sky-900 transition-colors"
          >
            <span className="text-white mb-4">Hjem</span>
          </Link>
          <section className="flex flex-col items-center justify-center">
            <h1 className="font-bold mb-2 sm:text-4xl text-2xl pb-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Generér ansøgning
            </h1>
            <p className="text-gray-300 text-sm">
              Tilføj dit CV og jobopslaget for at generere en professionel ansøgning
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
                  {isCompleted ? "Færdig!" : "Generér ansøgning"}
                </span>
              </button>
            </div>
          </>
          )
        : 
        (
          <div className="flex sm:flex-row flex-col items-center justify-between gap-10 w-full h-full rounded-lg">
              <section className="order-2 flex flex-col items-center rounded-lg w-full sm:w-1/3 h-140 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 border border-cyan-950 p-4">
                  <div className="w-full h-2/5 flex flex-col items-center gap-8">
                      <h4 className="text-lg sm:text-2xl font-semibold">Match score</h4>
                      <div className="w-30 h-30 relative">
                          <CircularProgressbar
                          value={matchOutput}
                          styles={buildStyles({
                              pathColor: `rgba(6, 182, 212, ${matchOutput / 100})`,
                              textColor: '#5479c2ff',
                              trailColor: '#f1f5f9',                                         
                          })}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                              {matchOutput}%
                          </div>
                      </div>
                      
                  </div>
                  <div className="w-full h-3/5 flex flex-col gap-4">
                      <h4 className="text-lg sm:text-2xl font-semibold">Email udkast</h4>
                      <textarea 
                      className={`w-full h-70 p-2 bg-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400  placeholder:text-xs sm:placeholder:text-sm resize-none 
                      ${scrollbarStyle} ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}                        
                      value={mailOutput}        
                      disabled={isLoading}
                      />
                      <button
                          onClick={copyMailOutput}
                          className='py-1 px-2 sm:py-2 sm:px-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 cursor-pointer flex items-center justify-center gap-2 font-semibold text-white text-xs sm:text-sm rounded-sm sm:rounded-md hover:bg-[linear-gradient(90deg,#06b6d4,#6366f1)] hover:text-white'>
                          {isMailCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {isMailCopied ? "Kopieret" : "Kopiér"}
                      </button>
                  </div>
              
              </section>
              <section className="order-1 flex flex-col gap-4 rounded-lg w-full sm:w-2/3 h-140 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 border border-cyan-900 p-4">
                  <div className="text-left">
                      <h4 className="text-lg sm:text-2xl font-semibold">Genereret ansøgning</h4>
                  </div>                            
                  <textarea 
                      className={`w-full h-110 p-2 bg-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-xs sm:placeholder:text-sm resize-none 
                      ${scrollbarStyle} ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}             
                      value={applicationOutput}
                      disabled={isLoading}
                  />
                  <div className='flex items-center justify-between gap-2'>
                      <div className="flex items-center gap-4">
                          <button
                          onClick={copyApplicationOutput}
                          className='py-1 px-2 sm:py-2 sm:px-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 cursor-pointer flex items-center gap-2 font-semibold text-white text-xs sm:text-sm rounded-sm sm:rounded-md hover:bg-[linear-gradient(90deg,#06b6d4,#6366f1)] hover:text-white'>
                          {isApplicationCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {isApplicationCopied ? "Kopieret" : "Kopiér"}
                          </button>
                          <button
                              onClick={downloadOutput}
                              className='py-1 px-2 sm:py-2 sm:px-3  bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 cursor-pointer flex items-center gap-2 font-semibold text-white text-xs sm:text-sm rounded-sm sm:rounded-md 
                              hover:bg-[linear-gradient(90deg,#06b6d4,#6366f1)] hover:text-white'>
                              <Download className="h-4 w-4" />
                              Download
                          </button>
                      </div>
                      
                      <button onClick={handleNewTry} className="py-1 px-2 sm:py-2 sm:px-3  bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 cursor-pointer flex items-center gap-2 font-semibold text-white text-xs sm:text-sm rounded-sm sm:rounded-md 
                              hover:bg-[linear-gradient(90deg,#06b6d4,#6366f1)] hover:text-white"
                      >Prøv igen
                      </button>
                  </div>
              </section>
          </div>
        )}          
      </div>
    </div>
  );
}
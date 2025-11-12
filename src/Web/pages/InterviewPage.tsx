    import React, { useRef, useState } from "react";
    import { Link } from "react-router-dom";
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
    import { faFileLines } from '@fortawesome/free-regular-svg-icons'
    import {Check, Loader2, X} from "lucide-react";
    import {interviewService} from "../AIService/InterviewService";
    import { scrollbarStyle } from "../components/ScrollbarStyle";
    import type { InterviewEvaluationResult } from "../Models/InterviewModels";
    import InterviewSimulation from "../components/InterviewSimulation";
    export default function InterviewPage() {

        const [questions, setQuestions] = useState<Array<string>>([]);
        const [answers, setAnswers] = useState<Array<string>>([]);
        const [interviewEvaluations, setInterviewEvaluations] = useState<InterviewEvaluationResult>( {
            evaluations: [],
            overallFeedback: "",
            averageRating: 0
        }            
        );

        const [salaryOutput, setSalaryOutput] = useState<string>("");
        const [elevatorOutput, setElevatorOutput] = useState<string>("");
        const [introductionOutput, setIntroductionOutput] = useState<string>("");
        const [evaluationCompleted, setEvaluationCompleted] = useState<boolean>(false);

        const [option, setOption] = useState<"upload" | "text">("upload");
        const [cvText, setCvText] = useState("");
        const [cvFile, setCvFile] = useState<File | null>(null);

        const [jobPostingText, setJobPostingText] = useState("");
        const [jobFile, setJobFile] = useState<File | null>(null);

        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [isCompleted, setIsCompleted] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

        const cvInputRef = useRef<HTMLInputElement>(null);
        const jobInputRef = useRef<HTMLInputElement>(null);


        const handleSubmit = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setIsCompleted(false);

                const response = await interviewService.generateQuestions({
                cvText: option === "text" ? cvText : undefined,
                cvFile: option === "upload" ? cvFile : undefined,
                jobPostingText,
                jobPostingFile: jobFile ?? undefined,
                });
                console.log('Interview Response:', response);
                
                setQuestions(response.questions);
                setIntroductionOutput(response.introduction);
                setElevatorOutput(response.elevatorPitch);
                setSalaryOutput(response.salaryEstimate);
                setIsCompleted(true);
            } catch (err) {
                setError("Der opstod en fejl under generering af ansøgning");
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
                console.log("Evaluate result:", response);
                setInterviewEvaluations(response);
                setEvaluationCompleted(true);
                setIsLoading(false);

            } catch (err) {
                setError("Der opstod en fejl under evaluering af interviewet");
                console.error(err);
            }
        }

        const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                
                if (allowedTypes.includes(file.type)) {
                    console.log('Fil uploadet:', file.name);
                    setCvFile(file);
                    setError(null);
                    setIsCompleted(false); // Reset completion state
                } else {
                    alert('Kun PDF, DOC og DOCX filer er tilladt');
                    setCvFile(null);
                }
            }
        };

        const handleJobUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                
                if (allowedTypes.includes(file.type)) {
                    console.log('Fil uploadet:', file.name);
                    setJobFile(file);
                    setError(null);
                    setIsCompleted(false); // Reset completion state
                } else {
                    alert('Kun PDF, DOC og DOCX filer er tilladt');
                    setJobFile(null);
                }
            }
        };

        const triggerCvFileUpload = () => {
            cvInputRef.current?.click();
        };

        const triggerJobFileUpload = () => {
            jobInputRef.current?.click();
        };

        const removeCvFile = () => {
            setCvFile(null);
        }

        const removeJobFile = () => {
            setJobFile(null);
        }
    

        return (
            <div className="bg-slate-950 p-8 h-full w-full">
                <div className="w-3/4 flex flex-col items-center justify-center text-center text-white gap-10 mx-auto">
                    <div className="grid grid-cols-3 w-full">
                        <Link to="/" className="mr-auto btn py-1 px-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-2
                            hover:border hover:border-blue-400 hover:bg-sky-900 transition-colors">
                               <span className="text-white">Hjem</span> 
                        </Link>
                        <section className="flex flex-col items-center justify-center">
                            <h1 className="font-bold mb-2 text-4xl pb-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                {!isCompleted ? "Øv dig til samtalen" : "Interview Simulator"}
                            </h1>

                            <p className="text-gray-300 text-sm">
                                {!isCompleted ? "Tilføj dit CV og jobopslaget for at starte et interview" : "Øv dig på dine interview-skills med AI"}
                            </p>
                        </section>
                        <p></p>
                    </div>  
                
                {!isCompleted ? (
                    <>                                 

                    <div className="w-full flex flex-col sm:flex-row items-center gap-10">
                        <section className="w-1/2 flex flex-col bg-slate-900 px-4 py-2 text-center gap-2 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faFileLines} className="text-blue-500 text-xs" />
                                        <h3 className="text-left font-semibold text-md sm:text-xl">CV</h3>
                                    </div>                            
                                    <p className="text-gray-500 text-xs sm:text-sm">Upload eller indsæt dit CV</p>
                                </div>                            
                            </div>                        
                            <div>
                                <button 
                                    className={`w-full border-1 border-dashed rounded-lg py-6 border-gray-700 flex flex-col gap-2 items-center ${
                                        isLoading || cvText !== "" ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-sky-700"
                                    }`}
                                    onClick={triggerCvFileUpload}
                                    disabled={isLoading || cvText !== ""}
                                >
                                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="text-2xl text-gray-500"/>
                                    <p className="font-semibold text-sm sm:text-md">
                                        Klik for at uploade CV
                                    </p>
                                    <div className="p-2 flex items-center justify-center gap-2">
                                        <p className="text-gray-500 text-xs sm:text-sm">{ cvFile ? cvFile.name : "Understøttede formater: PDF, DOC, DOCX"}</p>
                                        {cvFile && <button onClick={(e) => {e.stopPropagation(); removeCvFile()}} className="text-white cursor-pointer bg-gray-500 rounded-full w-5 h-5 flex items-center justify-center">
                                            <X className="w-3 h-3" />
                                        </button>}
                                    </div>
                                    
                                </button>
                                <input
                                    ref={cvInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleCvUpload}
                                    style={{ display: 'none' }}
                                    disabled={isLoading}
                                />
                            </div>      

                            <div className="flex items-center">
                                <div className="flex-grow h-[1px] bg-gradient-to-r from-blue-400 to-blue-600"></div>
                                <span className="mx-4 text-gray-600">eller</span>
                                <div className="flex-grow h-[1px] bg-gradient-to-r from-blue-600 to-blue-400"></div>
                            </div>            
                            
                            <div>
                                <textarea 
                                    className={`w-full h-70 p-2 bg-slate-950 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-xs sm:placeholder:text-sm resize-none 
                                    ${scrollbarStyle} ${
                                        isLoading || cvFile !== null ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    placeholder="Indsæt dit CV-indhold"
                                    value={cvText}
                                    onChange={(e) => setCvText(e.target.value)}
                                    disabled={isLoading || cvFile !== null}
                                />
                            </div> 
                            
                        </section>

                        <section className="w-1/2 flex flex-col bg-slate-900 px-4 py-2 text-center gap-2 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faFileLines} className="text-blue-500 text-xs" />
                                        <h3 className="text-left font-semibold text-md sm:text-xl">Jobopslag</h3>
                                    </div>                            
                                    <p className="text-gray-500 text-xs sm:text-sm">Upload eller indsæt jobopslag</p>
                                </div>                            
                            </div>
                            <div>
                                <button 
                                    className={`w-full border-1 border-dashed rounded-lg py-6 border-gray-700 flex flex-col gap-2 items-center ${
                                        isLoading || jobPostingText !== "" ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-sky-700"
                                    }`}
                                    onClick={triggerJobFileUpload}
                                    disabled={isLoading || jobPostingText !== ""}
                                >
                                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="text-2xl text-gray-500"/>
                                    <p className="font-semibold text-sm sm:text-md">
                                        Klik for at uploade jobopslag
                                    </p>
                                    <div className="p-2 flex items-center justify-center gap-2">
                                        <p className="text-gray-500 text-xs sm:text-sm">{ jobFile ? jobFile.name : "Understøttede formater: PDF, DOC, DOCX"}</p>
                                        {jobFile && <button onClick={(e) => {e.stopPropagation(); removeJobFile()}} className="text-white cursor-pointer bg-gray-500 rounded-full w-5 h-5 flex items-center justify-center">
                                            <X className="w-3 h-3" />
                                        </button>}
                                    </div>
                                </button>
                                <input
                                    ref={jobInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleJobUpload}
                                    style={{ display: 'none' }}
                                    disabled={isLoading}
                                />
                            </div> 

                            <div className="flex items-center">
                                <div className="flex-grow h-[1px] bg-gradient-to-r from-blue-400 to-blue-600"></div>
                                <span className="mx-4 text-gray-600">eller</span>
                                <div className="flex-grow h-[1px] bg-gradient-to-r from-blue-600 to-blue-400"></div>
                            </div>

                            <div>
                                <textarea 
                                    className={`w-full h-70 p-2 bg-slate-950 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-xs sm:placeholder:text-sm resize-none 
                                    ${scrollbarStyle} ${
                                        isLoading || jobFile !== null ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    placeholder="Indsæt jobbeskrivelsen"
                                    value={jobPostingText}
                                    onChange={(e) => setJobPostingText(e.target.value)}
                                    disabled={isLoading || jobFile !== null}
                                />
                            </div>
                        </section>

                    </div>
                    
                    
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="mt-6 flex gap-4">
                        <button 
                            onClick={handleSubmit}
                            disabled={(!(cvText.trim() || cvFile)) || (!(jobPostingText.trim() || jobFile)) || isLoading}
                            className={`group flex-1 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2
                            border border-blue-400 bg-sky-100 hover:bg-sky-900 transition-colors
                            ${(!(cvText.trim() || cvFile)) || (!(jobPostingText.trim() || jobFile)) || isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                        >
                            {isLoading && <Loader2 className="animate-spin h-5 w-5 text-blue-700" />}
                            {isCompleted && !isLoading && <Check className="h-4 w-4 text-blue-500" />}

                             <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent text-shadow-md/10 group-hover:text-white">
                                {isLoading? "Genererer spørgsmål" : isCompleted ? "Kom i gang!" : "Start interview"}
                            </span>
                            
                        </button>
                    </div>
                    </>

                )
                : (
                    <InterviewSimulation
                        questions={questions}
                        answers={answers}
                        setAnswers={setAnswers}
                        introduction={introductionOutput}
                        salaryOutput={salaryOutput}
                        elevatorOutput={elevatorOutput}
                        onEvaluate={handleInterview}
                        evaluations={interviewEvaluations}
                        evaluationCompleted={evaluationCompleted}
                        />
                )}
                </div>
                
            </div>
        );
    }
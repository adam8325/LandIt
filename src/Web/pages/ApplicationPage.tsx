    import React, { useRef, useState } from "react";
    import { Link } from "react-router-dom";
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
    import { faFileLines } from '@fortawesome/free-regular-svg-icons'
    import {Copy, Download} from "lucide-react";
    import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
    import {applicationService} from "../AIService/ApplicationService";

    //   onSessionCreated: (newSessionId: string) => void;
    // };

    export default function ApplicationPage() {

        const [option, setOption] = useState<"upload" | "text">("upload");
        const [applicationOutput, setApplicationOutput] = useState<string>("");
        const [matchOutput, setMatchOutput] = useState<number>(0);
        const [mailOutput, setMailOutput] = useState<string>("");

        const [cvText, setCvText] = useState("");
        const [cvFile, setCvFile] = useState<File | null>(null);

        const [jobPostingText, setJobPostingText] = useState("");
        const [jobFile, setJobFile] = useState<File | null>(null);

        const [isLoading, setIsLoading] = useState(false);
        const [isCompleted, setIsCompleted] = useState(false);
        const [error, setError] = useState<string | null>(null);

        const cvInputRef = useRef<HTMLInputElement>(null);
        const jobInputRef = useRef<HTMLInputElement>(null);

        const handleSubmit = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await applicationService.generateApplication({
                cvText: option === "text" ? cvText : undefined,
                cvFile: option === "upload" ? cvFile : undefined,
                jobPostingText,
                jobPostingFile: jobFile ?? undefined,
                });
                console.log('AI Response:', response);
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

        const copyApplicationOutput = () => {
            if (applicationOutput) {
                navigator.clipboard.writeText(applicationOutput);
            }
        }

        const copyMailOutput = () => {
            if (mailOutput) {
                navigator.clipboard.writeText(mailOutput);
            }
        }

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
        }

    

        return (
            <div className="bg-stone-100 p-8 h-full w-full">
                <div className="w-3/4 flex flex-col items-center justify-center text-center gap-8 mx-auto">
                    <div className="flex justify-between items-start w-full">
                        <Link to="/" className="btn">← Hjem</Link>
                        <section className="flex flex-col items-center">
                            <h1 className="font-bold mb-2 text-4xl">Generer ansøgning</h1>
                            <p className="text-gray-500 text-sm">Tilføj dit CV og jobopslaget for at generere en professionel ansøgning</p>
                        </section>
                        <p></p>
                    </div>                

                    <div className="w-full flex flex-col sm:flex-row items-center gap-10">
                        <section className="w-1/2 flex flex-col bg-white px-4 py-2 text-center gap-2 border border-stone-100 rounded-lg">
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
                                    className={`w-full border-2 border-dotted rounded-lg py-6 border-stone-300 flex flex-col gap-2 items-center ${
                                        isLoading || cvText !== "" ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-sky-50"
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
                                        {cvFile && <button onClick={(e) => {e.stopPropagation(); removeCvFile()}} className="text-red-400 cursor-pointer bg-red-100 rounded-md px-2">x</button>}
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
                                    className={`w-full h-70 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-xs sm:placeholder:text-sm resize-none ${
                                        isLoading || cvFile !== null ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    placeholder="Indsæt dit CV-indhold"
                                    value={cvText}
                                    onChange={(e) => setCvText(e.target.value)}
                                    disabled={isLoading || cvFile !== null}
                                />
                            </div> 
                            
                        </section>

                        <section className="w-1/2 flex flex-col bg-white px-4 py-2 text-center gap-2 border border-stone-100 rounded-lg">
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
                                    className={`w-full border-2 border-dotted rounded-lg py-6 border-stone-300 flex flex-col gap-2 items-center ${
                                        isLoading || jobPostingText !== "" ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-sky-50"
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
                                        {jobFile && <button onClick={(e) => {e.stopPropagation(); removeJobFile()}} className="text-red-400 cursor-pointer bg-red-100 rounded-md px-2">x</button>}
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
                                    className={`w-full h-70 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-xs sm:placeholder:text-sm resize-none ${
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
                            disabled={(!(cvText.trim() || cvFile)) || (!(jobPostingText.trim() || jobFile))}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center 
                            bg-cyan-700 text-white hover:bg-cyan-800 
                            ${(!(cvText.trim() || cvFile)) || (!(jobPostingText.trim() || jobFile))
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                        >
                            Generer ansøgning
                        </button>
                    </div>

                    {isCompleted && (
                        <div className="flex items-center justify-between gap-10 w-full h-full rounded-lg ">
                            <section className="flex flex-col items-center rounded-lg w-1/3 h-140 bg-white p-4">
                            <div className="w-full h-2/5 flex flex-col items-center gap-8">
                                <h4 className="text-lg sm:text-2xl font-semibold">Match score</h4>
                                <div className="w-30 h-30 relative">
                                    <CircularProgressbar
                                    value={matchOutput}
                                    styles={buildStyles({
                                        pathColor: `rgba(6, 182, 212, ${matchOutput / 100})`,
                                        textColor: '#6b7280',
                                        trailColor: '#f1f5f9',                                         
                                    })}
                                />
                                   <div className="absolute inset-0 flex items-center justify-center text-black font-semibold">
                                        {matchOutput}%
                                    </div>
                                </div>
                                
                            </div>
                            <div className="w-full h-3/5 flex flex-col gap-2">
                                <h4 className="text-lg sm:text-2xl font-semibold">Email udkast</h4>
                                <textarea 
                                className={`w-full h-70 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-xs sm:placeholder:text-sm resize-none ${
                                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                                }`}                        
                                value={mailOutput}        
                                onChange={(e) => setCvText(e.target.value)}
                                disabled={isLoading}
                                />
                                <button
                                    onClick={copyMailOutput}
                                    className='py-1 px-2 sm:py-2 sm:px-3 bg-[linear-gradient(135deg,hsl(250_50%_96%),hsl(280_50%_98%))] cursor-pointer flex items-center justify-center gap-2 font-semibold text-black text-xs sm:text-sm rounded-sm sm:rounded-md hover:bg-[linear-gradient(90deg,#06b6d4,#6366f1)] hover:text-white'>
                                    <Copy className="h-4 w-4" />
                                    Kopiér
                                </button>
                            </div>
                            
                            </section>
                            <section className="flex flex-col gap-2 rounded-lg w-2/3 h-140 bg-white p-4">
                            <div className="text-left">
                                <h4 className="text-lg sm:text-2xl font-semibold">Genereret ansøgning</h4>
                            </div>                            
                            <textarea 
                                className={`w-full h-110 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-xs sm:placeholder:text-sm resize-none ${
                                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                                }`}             
                                value={applicationOutput}
                                onChange={(e) => setCvText(e.target.value)}
                                disabled={isLoading}
                            />
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={copyApplicationOutput}
                                    className='py-1 px-2 sm:py-2 sm:px-3 bg-[linear-gradient(135deg,hsl(250_50%_96%),hsl(280_50%_98%))] cursor-pointer flex items-center gap-2 font-semibold text-black text-xs sm:text-sm rounded-sm sm:rounded-md hover:bg-[linear-gradient(90deg,#06b6d4,#6366f1)] hover:text-white'>
                                    <Copy className="h-4 w-4" />
                                    Kopiér
                                </button>
                                <button
                                    onClick={downloadOutput}
                                    className='py-1 px-2 sm:py-2 sm:px-3  bg-[linear-gradient(135deg,hsl(250_50%_96%),hsl(280_50%_98%))] cursor-pointer flex items-center gap-2 font-semibold text-black text-xs sm:text-sm rounded-sm sm:rounded-md 
                                    hover:bg-[linear-gradient(90deg,#06b6d4,#6366f1)] hover:text-white'>
                                    <Download className="h-4 w-4" />
                                    Download
                                </button>
                            </div>
                            </section>
                        </div>
                    )}

                </div>
                
            </div>
        );
    }
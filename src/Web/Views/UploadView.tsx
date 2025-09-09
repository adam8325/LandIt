import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faFileLines } from '@fortawesome/free-regular-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { cvUploadService } from '../AIService/CvAndJobPostService';

export default function UploadView() {
    const [option, setOption] = useState<"upload" | "text">("upload");
    const [cvText, setCvText] = useState("");
    const [jobPostingText, setJobPostingText] = useState("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (allowedTypes.includes(file.type)) {
                console.log('Fil uploadet:', file.name);
                setUploadedFile(file);
                setError(null);
                setIsCompleted(false); // Reset completion state
            } else {
                alert('Kun PDF, DOC og DOCX filer er tilladt');
                setUploadedFile(null);
            }
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (!jobPostingText.trim()) {
            setError("Jobopslag er påkrævet");
            return;
        }

        if (option === "upload" && !uploadedFile) {
            setError("Upload en CV-fil eller skift til tekst-indput");
            return;
        }

        if (option === "text" && !cvText.trim()) {
            setError("CV-indhold er påkrævet");
            return;
        }

        setIsLoading(true);
        setError(null);
        setIsCompleted(false);

        try {
            const response = await cvUploadService.uploadCvAndJobPosting({
                cvContent: option === "text" ? cvText : undefined,
                cvFile: option === "upload" ? uploadedFile! : undefined,
                jobPostingContent: jobPostingText
            });

            // Analysis is successful - don't show the result, just mark as completed
            setIsCompleted(true);
            console.log('Analysis completed:', response.analysis); // Keep for debugging
        } catch (err) {
            setError(err instanceof Error ? err.message : "Der opstod en fejl");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setCvText("");
        setJobPostingText("");
        setUploadedFile(null);
        setError(null);
        setIsCompleted(false);
        setOption("upload");
    };

    const proceedToNextStep = () => {
        // TODO: Navigate to next view/step
        console.log("Proceeding to step 2 - motivation writing");
    };

    const getButtonContent = () => {
        if (isLoading) {
            return (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Analyserer dokumenter...
                </>
            );
        }
        
        if (isCompleted) {
            return (
                <>
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Analyse fuldført
                </>
            );
        }
        
        return 'Analyser dokumenter';
    };

    const getButtonClass = () => {
        if (isLoading) {
            return 'bg-blue-400 text-white cursor-wait';
        }
        
        if (isCompleted) {
            return 'bg-green-50 text-green-800 border border-green-200 rounded-lg';
        }
        
        return 'bg-blue-500 text-white hover:bg-blue-600';
    };

    return (
        <div className="mt-4 bg-white p-4 flex flex-col items-center justify-center text-center gap-2 border border-stone-100 rounded-lg h-full w-full">
            <div className="w-full">
                <section className="my-2 mb-6">
                    <h1 className="font-bold mb-2">Upload dine dokumenter</h1>
                    <p className="text-gray-500 text-xs">Tilføj dit CV og jobopslaget for at få personlige forslag</p>
                </section>
                
                <section className="flex flex-col bg-white px-4 py-2 text-center gap-2 border border-stone-100 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faFileLines} className="text-blue-500 text-xs" />
                                <h3 className="text-left font-semibold">CV</h3>
                            </div>                            
                            <p className="text-gray-500 text-xs">Upload din CV-fil eller indsæt dit CV-indhold</p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setOption("upload")} 
                                disabled={isLoading}
                                className={`flex items-center gap-2 cursor-pointer border border-stone-100 rounded-lg py-1 px-2 text-xs ${
                                    option === "upload" ? "bg-blue-500 text-white" : "bg-transparent"
                                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            > 
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className={`text-xs ${option === "upload" ? "text-white" : "text-gray-500"}`} />
                                Upload fil
                            </button>
                            <button 
                                onClick={() => setOption("text")} 
                                disabled={isLoading}
                                className={`flex items-center gap-2 cursor-pointer border border-stone-100 rounded-lg py-1 px-2 text-xs ${
                                    option === "text" ? "bg-blue-500 text-white" : "bg-transparent"
                                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            > 
                                <FontAwesomeIcon icon={faCopy} className={`text-xs ${option === "text" ? "text-white" : "text-gray-600"}`} />
                                Indsæt tekst
                            </button>
                        </div>   
                    </div>
                    {option === "upload" ? 
                    <div>
                        <button 
                            className={`w-full border-2 border-dotted rounded-lg py-6 border-stone-300 flex flex-col gap-2 items-center ${
                                isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-sky-50"
                            }`}
                            onClick={triggerFileUpload}
                            disabled={isLoading}
                        >
                            <FontAwesomeIcon icon={faArrowUpFromBracket} className="text-2xl text-gray-500"/>
                            <p className="font-semibold mb-2 text-sm">
                                {uploadedFile ? uploadedFile.name : "Klik for at uploade dit CV"}
                            </p>
                            <p className="text-gray-500 text-xs">Understøttede formater: PDF, DOC, DOCX</p>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            disabled={isLoading}
                        />
                    </div>
                    
                    : 
                    <div>
                        <textarea 
                            className={`w-full h-30 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            placeholder="Indsæt dit CV-indhold"
                            value={cvText}
                            onChange={(e) => setCvText(e.target.value)}
                            disabled={isLoading}
                        />
                    </div> 
                    }
                </section>

                <section className="mt-4 bg-white px-4 py-2 text-center gap-2 border border-stone-100 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faFileLines} className="text-blue-500 text-xs" />
                            <h3 className="text-left font-semibold">Jobopslag</h3>
                        </div>    
                    </div>
                    <div className="mt-2">
                        <textarea 
                            className={`w-full h-30 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            placeholder="Indsæt jobbeskrivelsen"
                            value={jobPostingText}
                            onChange={(e) => setJobPostingText(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </section>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}
                
                <div className="mt-6 flex gap-4">
                    <button 
                        onClick={handleSubmit}
                        disabled={isLoading || isCompleted}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center ${getButtonClass()} ${
                            isCompleted ? 'cursor-default' : ''
                        }`}
                    >
                        {getButtonContent()}
                    </button>
                </div>
            </div>
        </div>
    );
}
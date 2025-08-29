import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faFileLines } from '@fortawesome/free-regular-svg-icons'

export default function UploadView() {

    const [option, setOption] = React.useState<"upload" | "text">("upload")

    return (
        <div className="mt-4 bg-white p-4 flex flex-col items-center justify-center text-center gap-2 border border-stone-100 rounded-lg h-full w-full">
            <div className="w-full">
                <section className="my-2 mb-6">
                    <h1 className="font-bold mb-2">Upload dine dokumenter</h1>
                    <p className="text-gray-500 text-xs">Tilføj dit CV og jobopslaget for at få personlige forslag</p>
                </section>
                
                <section className="bg-white px-4 py-2 text-center gap-2 border border-stone-100 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faFileLines} className="text-blue-500 text-xs" />
                                <h3 className="text-left font-semibold">CV</h3>
                            </div>                            
                            <p className="text-gray-500 text-xs">Upload din CV-fil eller indsæt dit CV-indhold</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setOption("upload")} className={`flex items-center gap-2 cursor-pointer border border-stone-100 rounded-lg py-1 px-2 text-xs ${option === "upload"? "bg-blue-500 text-white" : "bg-transparent"}`}> 
                                <FontAwesomeIcon icon={faArrowUpFromBracket} className={`text-gray-500 text-xs ${option === "upload"? "bg-blue-500 text-white" : "bg-transparent"}`} />Upload fil</button>
                            <button onClick={() => setOption("text")} className={`flex items-center gap-2 cursor-pointer border border-stone-100 rounded-lg py-1 px-2 text-xs ${option === "text" ? "bg-blue-500 text-white" : "bg-transparent"}`}> 
                                <FontAwesomeIcon icon={faCopy} className={`text-gray-600 text-xs ${option === "text" ? "bg-blue-500 text-white" : "bg-transparent"}`} />
                            Indsæt tekst</button>
                        </div>   
                    </div>
                    <div className="mt-2">
                        <textarea 
                        className="w-full h-30 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none"
                        placeholder="Indsæt dit CV-indhold"
                        />
                    </div>
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
                        className="w-full h-30 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none"
                        placeholder="Indsæt jobbeskrivelsen"
                        />
                    </div>
                    
                </section>
            </div>
        </div>
    )
}


import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-regular-svg-icons'


export default function QuestionsView() {
    return (
        <div>
            <section className="mt-4 bg-white px-4 py-2 text-center gap-2 border border-stone-100 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faFileLines} className="text-blue-500 text-xs" />
                            <h3 className="text-left font-semibold">Hvad motiverer dig for dette job?</h3>
                        </div>    
                    </div>
                    <div className="mt-2">
                        <textarea 
                        className="w-full h-30 p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none"
                        placeholder="Indsæt jobbeskrivelsen"
                        />
                    </div>
                    
                </section>
        </div>
    )
}
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-regular-svg-icons'
import { Sparkles, Target, TrendingUp } from 'lucide-react';


export default function QuestionsView() {
    return (
        <div className="mt-4 bg-white p-4 flex flex-col items-center justify-center text-center gap-2 border border-stone-100 rounded-lg h-full w-full">
            <div className="w-full">
                <section className="my-2 mb-6">
                    <h1 className="font-bold mb-2">Besvar Nøglespørgsmål</h1>
                    <p className="text-gray-500 text-xs">Giv gennemtænkte svar på disse vigtige ansøgningsspørgsmål</p>
                </section>
                
                <section className="flex flex-col gap-2 mt-4 bg-white px-4 py-4 text-center border border-stone-100 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1">
                                    <Target className="text-blue-500 w-4 h-4" />
                                    <h3 className="text-left font-semibold">Motivation & Match</h3>
                                </div>                            
                                <p className="text-gray-500 text-xs">Hvorfor søger du jobbet, og hvorfor passer du godt til det?</p>
                            </div>                       
                        </div>
                        <div className="mt-3">
                            <textarea 
                            className="w-full h-30 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none"
                            placeholder="..."
                            />
                        </div>                   
                        <button className="flex items-center justify-center gap-2 w-full border border-stone-300 rounded-lg p-2 text-xs font-semibold cursor-pointer hover:bg-sky-50"><Sparkles className="w-3 h-3" />Generer idéer</button>
    
                </section>
                <section className="flex flex-col gap-2 mt-4 bg-white px-4 py-4 text-center border border-stone-100 rounded-lg">
                            <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="text-blue-500 text-xs w-4 h-4" />
                                    <h3 className="text-left font-semibold">Erfaring & Styrker</h3>
                                </div>                            
                                <p className="text-gray-500 text-xs">Hvilke projekter, erfaringer eller resultater viser, at du kan løse opgaverne?</p>
                            </div>                       
                        </div>
                        <div className="mt-3">
                            <textarea 
                            className="w-full h-30 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none"
                            placeholder="..."
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 w-full border border-stone-300 rounded-lg p-2 text-xs font-semibold cursor-pointer hover:bg-sky-50"><Sparkles className="w-3 h-3" />Generer idéer</button>
                        
                </section>
            </div>
        </div>
    )
}
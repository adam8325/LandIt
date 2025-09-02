import React from "react";
import { Sparkles, Target, TrendingUp, Linkedin, Globe, Palette, Briefcase, FileText } from 'lucide-react';


export default function TemplateView() {
    return (
        <div className="mt-4 bg-white p-4 flex flex-col items-center justify-center text-center gap-2 border border-stone-100 rounded-lg h-full w-full">
            <div className="w-full">
                <section className="my-2 mb-6">
                    <h1 className="font-bold mb-2">Vælg Din Ansøgningsstil</h1>
                    <p className="text-gray-500 text-xs">Vælg en skabelon og tilpas din ansøgning</p>
                </section>
                <section className="flex items-center justify-between gap-2">
                    <button className="px-2 py-6 border border-stone-300 rounded-lg cursor-pointer hover:bg-sky-50 flex flex-col items-center gap-2">
                        <Briefcase className="rounded-full w-8 h-8 p-2 bg-blue-500 text-white" />
                        <h3 className="font-semibold text-xs">Professionel & Moderne</h3>
                        <p className="text-[0.625rem]">Rent, struktureret format perfekt til virksomhedsmiljøer</p>
                    </button>
                    <button className="px-2 py-6 border border-stone-300 rounded-lg cursor-pointer hover:bg-sky-50 flex flex-col items-center gap-2">
                        <Palette className="rounded-full w-8 h-8 p-2 bg-orange-400 text-white"/>
                        <h3 className="font-semibold text-xs">Kreativ & Personlig</h3>
                        <p className="text-[0.625rem]">Vis personlighed med en mere engagerende, kreativ tilgang</p>                        
                    </button>
                    <button className="px-2 py-6 border border-stone-300 rounded-lg cursor-pointer hover:bg-sky-50 flex flex-col items-center gap-2">
                        <FileText className="rounded-full w-8 h-8 p-2 bg-green-500 text-white"/>
                        <h3 className="font-semibold text-xs">Teknisk & Detaljeret</h3>        
                        <p className="text-[0.625rem]">Fokus på færdigheder, projekter og tekniske præstationer</p>              
                    </button>
                </section>
                
                <section className="flex flex-col gap-2 mt-4 bg-white px-4 py-4 text-center border border-stone-100 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1">
                                    <Target className="text-blue-500 w-4 h-4" />
                                    <h3 className="text-left font-semibold">Email Udkast</h3>
                                </div>                            
                                <p className="text-gray-500 text-xs">Professionel email til at ledsage din ansøgning</p>
                            </div>          
                            <button className="gradient-border">
                                <div className="gradient-border-content flex items-center justify-center gap-2 p-2 text-xs font-semibold cursor-pointer transition-colors duration-200">
                                    <Sparkles className="w-3 h-3" />
                                    Generer idéer
                                </div>
                            </button>            
                        </div>
                        <div className="mt-3">
                            <textarea 
                            className="w-full h-30 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none"
                            placeholder="..."
                            />
                        </div>                   
                </section>
                <section className="flex flex-col gap-2 mt-4 bg-white px-4 py-4 text-center border border-stone-100 rounded-lg">
                            <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="text-blue-500 text-xs w-4 h-4" />
                                    <h3 className="text-left font-semibold">Professionelle Links</h3>
                                </div>                            
                                <p className="text-gray-500 text-xs">Tilføj links for at vise din professionelle tilstedeværelse</p>
                            </div>                       
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2 text-left">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Linkedin className="w-4 h-4"/>
                                    <p className="text-xs font-semibold">LinkedIn Profil</p>
                                </div>                                
                                <textarea 
                                className="w-full h-8 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none overflow-hidden"
                                placeholder="https://linkedin.com/in/username"
                                />
                            </div>                            
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4"/>
                                    <p className="text-xs font-semibold">Portfolio/Hjemmeside</p>
                                </div>                                
                                <textarea 
                                className="w-full h-8 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none overflow-hidden"
                                placeholder="https://yourportfolio.com"
                                />
                            </div>                            
                        </div>
                </section>
            </div>
        </div>
    )
}
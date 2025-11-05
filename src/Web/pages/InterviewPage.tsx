
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Target, TrendingUp } from 'lucide-react';

// type InterviewPageProps = { sessionId: string | null };

export default function InterviewPage() {
    const [motivation, setMotivation] = useState("");
    const [experience, setExperience] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async () => {
       
        // setLoading(true);
        // setError(null);
        // try {
        //     await ideasService.updateIdeas({ motivation, experience });
        // } catch (err) {
        //     setError("Kunne ikke gemme svar");
        // } finally {
        //     setLoading(false);
        // }
    };

    const handleGenerate = async (type: "motivation" | "experience") => {
       
        // setLoading(true);
        // setError(null);
        // try {
        //     const res = await ideasService.generateIdeas(type);
        //     // Formater alle ideer som '- idé' med linjeskift
        //     const formatted = res.ideas.map(idea => `- ${idea}`).join("\n\n");
        //     if (type === "motivation") setMotivation(formatted);
        //     if (type === "experience") setExperience(formatted);
        // } catch (err) {
        //     setError("Kunne ikke generere idéer");
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <div className="mt-4 bg-white p-4 flex flex-col items-center justify-center text-center gap-2 border border-stone-100 rounded-lg h-full w-full">
            <div className="w-full">
                 <Link to="/" className="btn mt-4">← Back to Home</Link>
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
                        <button className="gradient-border" disabled={loading} onClick={() => handleGenerate("motivation")}> 
                            <div className="gradient-border-content flex items-center justify-center gap-2 p-2 text-xs font-semibold cursor-pointer transition-colors duration-200">
                                <Sparkles className="w-3 h-3" />
                                Generer idéer
                            </div>
                        </button>
                    </div>
                    <div className="mt-3">
                        <textarea
                            className="w-full h-40 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none"
                            placeholder="..."
                            value={motivation}
                            onChange={e => setMotivation(e.target.value)}
                            onBlur={handleUpdate}
                            disabled={loading}
                        />
                    </div>
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
                        <button className="gradient-border" disabled={loading} onClick={() => handleGenerate("experience")}> 
                            <div className="gradient-border-content flex items-center justify-center gap-2 p-2 text-xs font-semibold cursor-pointer transition-colors duration-200">
                                <Sparkles className="w-3 h-3" />
                                Generer idéer
                            </div>
                        </button>
                    </div>
                    <div className="mt-3">
                        <textarea
                            className="w-full h-40 p-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-xs resize-none"
                            placeholder="..."
                            value={experience}
                            onChange={e => setExperience(e.target.value)}
                            onBlur={handleUpdate}
                            disabled={loading}
                        />
                    </div>
                </section>
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
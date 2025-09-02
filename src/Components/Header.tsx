import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Signature, Globe } from 'lucide-react';

import React from 'react'

export default function Header() {

    const [language, setLanguage] = React.useState<"da" | "en">("da")


    return (
        <div>
            <header className="flex items-center justify-between mb-5">
                <section className="">
                    <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">LandIt</h1>
                    <h2 className="text-sm text-gray-500">Få personlig hjælp til jobansøgninger med AI-drevne forslag</h2>
                </section>
                <div className="bg-gray-100 p-2 rounded-lg flex gap-2 items-center">
                    <Globe className='text-gray-500 w-3 h-3'/>
                    <button onClick={() => setLanguage("da")} className={`text-xs px-2 py-1 rounded cursor-pointer ${language === "da" ? "bg-blue-500 text-white" : "bg-transparent"}`}>DA</button>
                    <button onClick={() => setLanguage("en")} className={`text-xs px-2 py-1 rounded cursor-pointer ${language === "en" ? "bg-blue-500 text-white" : "bg-transparent"}`}>EN</button>
                </div>
            </header>
        </div>
    )
}
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { faFileZipper } from '@fortawesome/free-regular-svg-icons'

import React from 'react'

export default function Stepper() {

    const [step, setStep] = React.useState<"upload" | "questions" | "template">()


    return (
        <div>            
            <div className="flex items-center justify-between mt-4 bg-white p-4 border border-stone-100 rounded-lg flex gap-1 items-center">
                <section className='flex flex-col gap-2 items-center text-center'>
                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="text-gray-500 bg-gray-100 w-6 h-6 border rounded-full border-gray-300 p-2" />
                    <p className='text-xs font-semibold'>Upload Dokumenter</p>
                </section>
                <section className='flex flex-col gap-2 items-center text-center'>
                    <FontAwesomeIcon icon={faMessage} className="text-gray-500 bg-gray-100 w-6 h-6 border rounded-full border-gray-300 p-2" />
                    <p className='text-xs font-semibold'>Besvar Spørgsmål</p>
                </section>
                <section className='flex flex-col gap-2 items-center text-center'>
                    <FontAwesomeIcon icon={faFileZipper} className="text-gray-500 bg-gray-100 w-6 h-6 border rounded-full border-gray-300 p-2" />
                    <p className='text-xs font-semibold'>Vælg Skabelon</p>
                </section>                
                
            </div>            
        </div>
    )
}
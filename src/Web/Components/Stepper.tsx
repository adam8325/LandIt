import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket} from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { faFileZipper } from '@fortawesome/free-regular-svg-icons'
import { CheckCircle } from 'lucide-react';

import React from 'react'

interface StepperProps {
    currentStep: number; // 0 = upload, 1 = questions, 2 = template
}

export default function Stepper({ currentStep }: StepperProps) {
    const steps = [
        {
            icon: faArrowUpFromBracket,
            label: 'Upload Dokumenter',
            key: 'upload'
        },
        {
            icon: faMessage,
            label: 'Besvar Spørgsmål', 
            key: 'questions'    
        },
        {
            icon: faFileZipper,
            label: 'Vælg Skabelon',
            key: 'template'
        }
    ];

    const getStepStyles = (stepIndex: number) => {
        if (stepIndex < currentStep) {
            // Completed step - green background with check icon
            return {
                iconClass: "gradient-circle",
                showCheck: true
            };
        } else if (stepIndex === currentStep) {
            // Current step - blue background
            return {
                iconClass: "text-white bg-blue-500 w-9 h-9 border rounded-full border-blue-500 p-2",
                showCheck: false
            };
        } else {
            // Future step - gray background
            return {
                iconClass: "text-gray-500 bg-gray-100 w-9 h-9 border rounded-full border-gray-300 p-2",
                showCheck: false
            };
        }
    };

    const getDividerStyles = (dividerIndex: number) => {
        // Divider after step dividerIndex should be green if that step is completed
        if (dividerIndex < currentStep) {
            return "gradient-divider";
        } else {
            return "border flex-1 border-stone-200";
        }
    };

    return (
        <div>            
            <div className="flex items-center justify-between mt-4 bg-white p-4 border border-stone-100 rounded-lg flex gap-1 items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step.key}>
                        <section className='flex flex-col gap-2 items-center text-center'>
                            {getStepStyles(index).showCheck ? (
                        <div className={getStepStyles(index).iconClass}>
                            <div className="gradient-circle-content">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    ) : (
                            <FontAwesomeIcon 
                                icon={step.icon} 
                                className={getStepStyles(index).iconClass} 
                            />
                             )}
                            <p className='text-xs font-semibold'>{step.label}</p>
                        </section>
                        {index < steps.length - 1 && (
                            <div className={getDividerStyles(index)}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>            
        </div>
    )
}
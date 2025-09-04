import React from 'react'

interface PageTurnButtonsProps {
    onNext: () => void;
    onPrevious: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    isLastView: boolean;
}

export default function PageTurnButtons({ onNext, onPrevious, canGoNext, canGoPrevious, isLastView }: PageTurnButtonsProps) {


    return (
        <div className='flex justify-between mt-4'>
            <button 
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className={`p-2 rounded-lg border-stone-100 text-xs font-semibold ${
                    canGoPrevious 
                        ? 'cursor-pointer hover:bg-gray-100' 
                        : 'cursor-not-allowed text-gray-400'
                }`}
            >
                Forrige
            </button>
            <button 
                onClick={onNext}
                disabled={!canGoNext}
                className={`p-2 text-xs font-semibold rounded-lg border border-stone-100 text-white cursor-pointer bg-gradient-to-r from-blue-400 via-blue-500 to-violet-400 hover:opacity-90`}
            >
                {isLastView ? 'Generer Ansøgning' : 'Næste trin'}
            </button>
        </div>
    )
}
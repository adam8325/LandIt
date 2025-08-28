import { useState } from 'react'
import Header from "./Components/Header"
import Stepper from "./Components/Stepper"
import PageTurnButtons from "./Components/PageTurnButtons"
import UploadView from "./Views/UploadView"
import QuestionsView from "./Views/QuestionsView"

function App() {
  // State to track which view is currently active
  const [currentView, setCurrentView] = useState(0);
  
  // Array of views to make navigation easy
  const views = [
    <UploadView />,
    <QuestionsView />
  ];

  // Function to go to next view
  const goToNext = () => {
    if (currentView < views.length - 1) {
      setCurrentView(currentView + 1);
    }
  };

  // Function to go to previous view
  const goToPrevious = () => {
    if (currentView > 0) {
      setCurrentView(currentView - 1);
    }
  };

  return (
    <div className='p-10 w-screen flex flex-col items-center gap-4'>
      <div className='w-3/5 h-full border border-stone-200 bg-slate-50 rounded-sm p-2'>
        <Header/>
        <Stepper/>
        <section>
          {views[currentView]}
        </section> 
        <PageTurnButtons 
          onNext={goToNext}
          onPrevious={goToPrevious}
          canGoNext={currentView < views.length - 1}
          canGoPrevious={currentView > 0}
        />               
      </div>     
    </div>
  )
}

export default App
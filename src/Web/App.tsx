import { useState } from 'react'
import Header from "./Components/Header"
import Stepper from "./Components/Stepper"
import PageTurnButtons from "./Components/PageTurnButtons"
import UploadView from "./Views/UploadView"
import QuestionsView from "./Views/QuestionsView"
import TemplateView from "./Views/TemplateView"

function App() {
  // State to track which view is currently active
  const [currentView, setCurrentView] = useState(0);
  
  // State to track session ID across all views
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Function to handle session creation from UploadView
  const handleSessionCreated = (newSessionId: string) => {
    setSessionId(newSessionId);
  };

  // Function to go to next view
  const goToNext = () => {
    if (currentView < 2) { // 0, 1, 2 are our views
      setCurrentView(currentView + 1);
    }
  };

  // Function to go to previous view
  const goToPrevious = () => {
    if (currentView > 0) {
      setCurrentView(currentView - 1);
    }
  };

  // Function to render current view with proper props
  const renderCurrentView = () => {
    switch (currentView) {
      case 0:
        return <UploadView onSessionCreated={handleSessionCreated} />;
      case 1:
        return <QuestionsView sessionId={sessionId} />;
      case 2:
        return <TemplateView sessionId={sessionId} />;
      default:
        return <UploadView onSessionCreated={handleSessionCreated} />;
    }
  };

  return (
    <div className='p-10 w-screen flex flex-col items-center gap-4'>
      <div className='w-3/5 h-full border border-stone-200 bg-slate-50 rounded-sm p-4'>
        <Header/>
        <Stepper currentStep={currentView} />
        <section>
          {renderCurrentView()}
        </section> 
        <PageTurnButtons 
          onNext={goToNext}
          onPrevious={goToPrevious}
          canGoNext={currentView < 2 && (currentView === 0 ? sessionId !== null : true)}
          canGoPrevious={currentView > 0}
          isLastView={currentView === 2} 
        />               
      </div>     
    </div>
  )
}

export default App
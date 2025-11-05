import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ApplicationPage from "./pages/ApplicationPage";
import ElevatorPage from "./pages/ElevatorPage";
import InterviewPage from "./pages/InterviewPage";

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/application" element={<ApplicationPage />} />
        <Route path="/elevator" element={<ElevatorPage />} />
        <Route path="/interview" element={<InterviewPage />} />
      </Routes>
    </Router>
    </div>
    
  );
}

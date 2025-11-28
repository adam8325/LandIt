import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ApplicationPage from "./Pages/ApplicationPage";
import InterviewPage from "./Pages/InterviewPage";

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/application" element={<ApplicationPage />} />
        <Route path="/interview" element={<InterviewPage />} />
      </Routes>
    </Router>
    </div>
    
  );
}

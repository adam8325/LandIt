import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ApplicationPage from "./pages/ApplicationPage";
import InterviewPage from "./pages/InterviewPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
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

import { Link } from "react-router-dom";
import SparklesPreview from "../components/SparklesPreview";
import { Link2, Search, Zap, TrendingUp, Rocket } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-12 p-4">
      <SparklesPreview />

      <div className="flex flex-col items-center gap-4 text-white">
        <h2 className="text-3xl">Din AI-assistent til drømmejobbet</h2>
        <h3>Alt du behøver for at skille dig ud i ansøgningsprocessen</h3>
      </div>

      <div className="flex justify-between items-center gap-10">        
        <Link to="/application" className="group">
          <div className="p-4 w-64 h-50 rounded-2xl shadow-md bg-white flex flex-col items-center justify-evenly text-xl font-semibold transition-all duration-200 group-hover:shadow-lg group-hover:scale-105 border-3 hover:border-blue-800">
            <div className="w-full flex items-center gap-5">
              <Rocket className="text-blue-500 w-6 h-6" />
              <h4 className="text-lg">Til Ansøgningen</h4>
            </div>        
            <p className="text-gray-500 text-[16px] text-center">Få en professionel ansøgning og e-mail-udkast - med værdifuld indsigt i, hvor godt du matcher jobbet.</p>
          </div>
        </Link>

        {/* <Link to="/elevator" className="group">
          <div className="p-4 w-64 h-50 rounded-2xl shadow-md bg-white flex flex-col items-center justify-evenly text-xl font-semibold transition-all duration-200 group-hover:shadow-lg group-hover:scale-105 border-3 hover:border-blue-800">
            <div className="w-full flex items-center gap-5">
              
              <h4 className="text-lg">Elevator Pitch</h4>
            </div>     
            <p className="text-gray-500 text-[16px] text-center">Generer en kort, kraftfuld personlig præsentation</p>
          </div>
        </Link> */}

        <Link to="/interview" className="group">
          <div className="p-4 w-64 h-50 rounded-2xl shadow-md bg-white flex flex-col items-center justify-evenly text-xl font-semibold transition-all duration-200 group-hover:shadow-lg group-hover:scale-105 border-3 hover:border-blue-800">
            <div className="w-full flex items-center gap-5">
              <Zap className="text-blue-500 w-6 h-6" />
              <h4 className="text-lg">Til Samtalen</h4>
            </div>
            <p className="text-gray-500 text-[16px] text-center">Få en skræddersyet elevator-pitch og lønberegner og øv dig på realistiske interviewspørgsmål med AI</p>
          </div>
        </Link>
      </div>      
    </div>
  );
}

import { Link } from "react-router-dom";
import SparklesPreview from "../components/SparklesPreview";
import { Link2, Search, Zap, TrendingUp, Rocket } from "lucide-react";

export default function HomePage() {
  return (
    <div className="pb-10 px-4 sm:pt-10">
      <SparklesPreview />

      <div className="flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center text-center gap-4 text-white">
          <h2 className="sm:text-3xl text-2xl">Din AI-assistent til drømmejobbet</h2>
          <h3 className="sm:text-xl text-md">Alt du behøver for at skille dig ud i ansøgningsprocessen</h3>
        </div>

        <div className="flex sm:flex-row flex-col justify-between items-center gap-10">        
          <Link to="/application" className="group">
            <div className="p-4 w-64 h-50 rounded-xl shadow-md bg-gradient-to-b from-gray-950 via-transparent to-gray-900 border border-cyan-500 flex flex-col items-center justify-evenly text-xl font-semibold transition-all duration-200 group-hover:shadow-lg group-hover:scale-105 border-1 hover:border-blue-500">
              <div className="w-full flex items-center justify-between">
                <Rocket className="text-blue-500 w-6 h-6" />
                <h4 className="text-lg text-white">Ansøgningen</h4>
                <p></p>
              </div>        
              <p className="text-gray-300 text-[16px] text-center">Få en professionel ansøgning og e-mail-udkast - med værdifuld indsigt i, hvor godt du matcher jobbet.</p>
            </div>
          </Link>

          <Link to="/interview" className="group">
            <div className="p-4 w-64 h-50 rounded-xl shadow-md bg-gradient-to-b from-gray-950 via-transparent to-gray-900 border border-cyan-500 flex flex-col items-center justify-evenly text-xl font-semibold transition-all duration-200 group-hover:shadow-lg group-hover:scale-105 border-1 hover:border-blue-500">
              <div className="w-full flex items-center justify-between">
                <Zap className="text-blue-500 w-6 h-6" />
                <h4 className="text-lg text-white">Samtalen</h4>
                <p></p>
              </div>
              <p className="text-gray-300 text-[16px] text-center">Øv dig på realistiske interviewspørgsmål, få en skræddersyet elevator-pitch og tjek din forventede løn.</p>
            </div>
          </Link>
        </div>  
      </div>
    
    </div>
  );
}

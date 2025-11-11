// components/AnimatedSalary.tsx
import CountUp  from "react-countup";

interface AnimatedSalaryProps {
  salary: string; // e.g. "40000-45000" or "45000"
  duration?: number;
}

export default function AnimatedSalary({ salary, duration = 2.5 }: AnimatedSalaryProps) {
  // Remove dots and spaces, keep numbers and dash
  const clean = salary.replace(/\s/g, "").replace(/\./g, "");
  const parts = clean.split("-").map(p => parseInt(p, 10)).filter(n => !isNaN(n));

  // Handle empty or invalid input
  if (parts.length === 0) return <span>-</span>;

  return (
    <div className="text-2xl font-semibold flex items-center gap-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
      {parts.length === 1 ? (
        <CountUp
          end={parts[0]}
          duration={duration}
        />
      ) : (
        <>
          <CountUp
            end={parts[0]}
            duration={duration}
          />
          <span>-</span>
          <CountUp
            end={parts[1]}
            duration={duration}
          />
        </>
      )}
      <span className="ml-1">kr</span>
    </div>
  );
}

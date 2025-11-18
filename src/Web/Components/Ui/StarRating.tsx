interface StarRatingProps {
  rating: number;
  size?: number; 
}

export default function StarRating({ rating, size = 16 }: StarRatingProps) {
  const percentage = (rating / 5) * 100;

  return (
    <div className="relative inline-block text-gray-600" style={{ fontSize: size }}>
      {/* Grå baggrundsstjerner */}
      <div className="flex gap-1">
        {Array(5).fill(0).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>

      {/* Blå overlay-stjerner */}
      <div
        className="absolute top-0 left-0 overflow-hidden text-blue-500"
        style={{ width: `${percentage}%` }}
      >
        <div className="flex gap-1">
          {Array(5).fill(0).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
      </div>
    </div>
  );
}

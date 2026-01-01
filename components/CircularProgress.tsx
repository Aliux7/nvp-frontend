"use client";

type CircularProgressProps = {
  value: number;
  size?: number;
  stroke?: number;
};

export default function CircularProgress({
  value,
  size = 28,
  stroke = 4,
}: CircularProgressProps) {
  const center = size / 2;
  const radius = center - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
    >
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#E5E7EB"
        strokeWidth={stroke}
        fill="none"
      />

      {/* Progress circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#2563EB"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-300 ease-out"
      />
    </svg>
  );
}

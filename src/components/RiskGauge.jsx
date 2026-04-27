export default function RiskGauge({ value = 0, label = 'Confidence Score', size = 180 }) {
  const r = 70;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const circumference = Math.PI * r; // half circle
  const progress = (value / 100) * circumference;

  const color = value >= 75 ? '#ef4444' : value >= 50 ? '#f97316' : value >= 30 ? '#eab308' : '#10b981';
  const label2 = value >= 75 ? 'CRITICAL RISK' : value >= 50 ? 'HIGH RISK' : value >= 30 ? 'MODERATE' : 'LOW RISK';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round"
        />
        {/* Progress */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dasharray 1s ease' }}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = Math.PI - (tick / 100) * Math.PI;
          const x1 = cx + (r - 14) * Math.cos(angle);
          const y1 = cy - (r - 14) * Math.sin(angle);
          const x2 = cx + (r - 6) * Math.cos(angle);
          const y2 = cy - (r - 6) * Math.sin(angle);
          return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />;
        })}
        {/* Value */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill={color} fontSize="28" fontWeight="bold"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
          {value}%
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" letterSpacing="2">
          {label2}
        </text>
      </svg>
      <div className="text-xs text-slate-400 mt-1 font-medium">{label}</div>
    </div>
  );
}

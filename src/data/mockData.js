export const kpis = {
  totalShipments: 1284,
  delayed: 47,
  autoRerouted: 23,
  carbonSaved: '18.4t',
  supplierRisk: 72,
  operationalScore: 87,
  activeAlerts: 6,
  predictedRiskEvents: 9,
};

export const alerts = [
  { id: 'a1', type: 'CYCLONE', severity: 'CRITICAL', message: 'Cyclone Michaung approaching Chennai Port — 8h delay predicted', timestamp: '2 min ago', route: 'Mumbai → Chennai' },
  { id: 'a2', type: 'TRAFFIC', severity: 'HIGH',     message: 'NH-44 congestion spike detected near Nagpur hub', timestamp: '11 min ago', route: 'Delhi → Hyderabad' },
  { id: 'a3', type: 'STRIKE', severity: 'HIGH',      message: 'Dock workers strike reported at JNPT Mumbai', timestamp: '34 min ago', route: 'JNPT → Pune' },
  { id: 'a4', type: 'WEATHER', severity: 'MEDIUM',   message: 'Dense fog advisory — visibility < 50m on NH-58', timestamp: '1 hr ago', route: 'Delhi → Dehradun' },
  { id: 'a5', type: 'CUSTOMS', severity: 'MEDIUM',   message: 'Customs clearance backlog at Chennai ICD — +4h', timestamp: '2 hr ago', route: 'Chennai → Bangalore' },
  { id: 'a6', type: 'FUEL',   severity: 'LOW',       message: 'Fuel shortage reported at Kolkata depot', timestamp: '3 hr ago', route: 'Kolkata → Bhubaneswar' },
];

export const shipments = [
  { id: 'SHP-101', from: 'Mumbai',  to: 'Chennai',      eta: '14:30', status: 'CRITICAL', risk: 91, truck: 'TN-09-AB-1234' },
  { id: 'SHP-102', from: 'Delhi',   to: 'Hyderabad',    eta: '18:00', status: 'DELAYED',  risk: 68, truck: 'DL-01-CD-5678' },
  { id: 'SHP-103', from: 'JNPT',    to: 'Pune',         eta: '16:45', status: 'REROUTED', risk: 55, truck: 'MH-12-EF-9012' },
  { id: 'SHP-104', from: 'Kolkata', to: 'Bhubaneswar',  eta: '20:15', status: 'ON_TIME',  risk: 22, truck: 'WB-06-GH-3456' },
  { id: 'SHP-105', from: 'Chennai', to: 'Bangalore',    eta: '15:00', status: 'DELAYED',  risk: 74, truck: 'KA-05-IJ-7890' },
];

export const etaForecast = [
  { time: '06:00', baseline: 0,   predicted: 0   },
  { time: '08:00', baseline: 0.5, predicted: 1.2 },
  { time: '10:00', baseline: 1,   predicted: 2.8 },
  { time: '12:00', baseline: 1.5, predicted: 5.1 },
  { time: '14:00', baseline: 2,   predicted: 8.3 },
  { time: '16:00', baseline: 2.5, predicted: 7.6 },
  { time: '18:00', baseline: 3,   predicted: 4.2 },
  { time: '20:00', baseline: 3.5, predicted: 2.1 },
];

export const riskFactors = [
  { label: 'Weather Risk',    value: 87, color: '#ef4444' },
  { label: 'Port Congestion', value: 74, color: '#f97316' },
  { label: 'Traffic Delay',   value: 61, color: '#eab308' },
  { label: 'Labor Strike',    value: 45, color: '#a855f7' },
  { label: 'Customs Delay',   value: 38, color: '#06b6d4' },
  { label: 'Fuel Risk',       value: 22, color: '#10b981' },
];

export const routeOptions = [
  {
    id: 'A', label: 'Fastest Route',    icon: '⚡',
    via: 'NH-48 → Krishnagiri → Vellore',
    eta: '6h 20m', etaSaved: '−2h 10m',
    cost: '₹18,400', costDelta: '+₹2,100',
    co2: '142 kg',  co2Delta: '+12 kg',
    reliability: 88, color: 'cyan',
  },
  {
    id: 'B', label: 'Cheapest Route',   icon: '💰',
    via: 'NH-44 → Kurnool → Nellore',
    eta: '9h 05m', etaSaved: '+0h 35m',
    cost: '₹14,200', costDelta: '−₹2,100',
    co2: '138 kg',  co2Delta: '+8 kg',
    reliability: 72, color: 'emerald',
  },
  {
    id: 'C', label: 'Carbon-Friendly',  icon: '🌿',
    via: 'Rail+Road → Jolarpettai → Katpadi',
    eta: '8h 40m', etaSaved: '+0h 10m',
    cost: '₹15,800', costDelta: '−₹500',
    co2: '98 kg',   co2Delta: '−32 kg',
    reliability: 81, color: 'green',
  },
  {
    id: 'D', label: 'Safest Route',     icon: '🛡️',
    via: 'NH-48 → Hosur → Electronic City',
    eta: '7h 15m', etaSaved: '−1h 15m',
    cost: '₹16,900', costDelta: '+₹600',
    co2: '128 kg',  co2Delta: '−2 kg',
    reliability: 96, color: 'blue',
  },
];

export const simulationScenarios = [
  { id: 's1', label: 'Chennai Port Blocked', icon: '⚓', delayHours: 8,  costIncrease: '₹4.2L', affectedShipments: 34 },
  { id: 's2', label: 'Cyclone Activity',      icon: '🌀', delayHours: 12, costIncrease: '₹7.8L', affectedShipments: 67 },
  { id: 's3', label: 'Supplier Failure',      icon: '🏭', delayHours: 24, costIncrease: '₹12.1L',affectedShipments: 89 },
  { id: 's4', label: 'NH-44 Road Closure',    icon: '🚧', delayHours: 5,  costIncrease: '₹1.9L', affectedShipments: 21 },
  { id: 's5', label: 'Dock Workers Strike',   icon: '✊', delayHours: 18, costIncrease: '₹9.3L', affectedShipments: 52 },
];

export const heatmapZones = [
  { id: 'z1', name: 'Chennai Port',   risk: 'HIGH',   reason: 'Cyclone + Strike',       x: 72, y: 78 },
  { id: 'z2', name: 'JNPT Mumbai',    risk: 'HIGH',   reason: 'Dock Strike',             x: 18, y: 62 },
  { id: 'z3', name: 'Delhi NCR',      risk: 'MEDIUM', reason: 'Dense Fog',               x: 38, y: 18 },
  { id: 'z4', name: 'Nagpur Hub',     risk: 'MEDIUM', reason: 'Traffic Congestion',      x: 42, y: 52 },
  { id: 'z5', name: 'Kolkata Port',   risk: 'LOW',    reason: 'Fuel Shortage',           x: 78, y: 38 },
  { id: 'z6', name: 'Bangalore Hub',  risk: 'LOW',    reason: 'Minor Customs Delay',     x: 52, y: 82 },
  { id: 'z7', name: 'Hyderabad Hub',  risk: 'MEDIUM', reason: 'Traffic + Weather',       x: 55, y: 65 },
  { id: 'z8', name: 'Pune Warehouse', risk: 'LOW',    reason: 'Normal Operations',       x: 24, y: 60 },
];

export const suppliers = [
  { name: 'TataTrans Logistics', score: 91, reliability: 94, delays: 3,  consistency: 92 },
  { name: 'BlueDart Express',    score: 85, reliability: 88, delays: 7,  consistency: 84 },
  { name: 'Mahindra Logistics',  score: 78, reliability: 80, delays: 12, consistency: 76 },
  { name: 'Delhivery Ltd',       score: 72, reliability: 74, delays: 18, consistency: 70 },
  { name: 'Gati KWE',            score: 61, reliability: 63, delays: 27, consistency: 58 },
];

export const operationalTrend = [
  { day: 'Mon', score: 82 }, { day: 'Tue', score: 79 }, { day: 'Wed', score: 85 },
  { day: 'Thu', score: 88 }, { day: 'Fri', score: 74 }, { day: 'Sat', score: 71 },
  { day: 'Sun', score: 87 },
];

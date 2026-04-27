// Rule-based route engine — generates realistic route options for any city pair.
// When Google Maps API key is provided, replace computeRoutes() with real API calls.

export const CITIES = [
  'Mumbai', 'Delhi', 'Chennai', 'Bangalore', 'Hyderabad',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Nagpur', 'Lucknow', 'Bhopal', 'Indore', 'Coimbatore',
  'Kochi', 'Visakhapatnam', 'Bhubaneswar', 'Patna', 'Chandigarh',
  'JNPT', 'Dehradun', 'Amritsar', 'Vadodara', 'Nashik',
];

// Approximate road distances (km) between city pairs — used to derive ETAs & costs
const DISTANCE_TABLE = {
  'Mumbai-Chennai':    1338, 'Mumbai-Delhi':       1422, 'Mumbai-Bangalore':    984,
  'Mumbai-Hyderabad':  711, 'Mumbai-Kolkata':     1968, 'Mumbai-Pune':          149,
  'Mumbai-Ahmedabad':  524, 'Mumbai-Nagpur':       838, 'Mumbai-JNPT':           30,
  'Delhi-Chennai':    2194, 'Delhi-Bangalore':    2150, 'Delhi-Hyderabad':     1568,
  'Delhi-Kolkata':    1472, 'Delhi-Jaipur':        281, 'Delhi-Lucknow':        555,
  'Delhi-Chandigarh':  248, 'Delhi-Amritsar':      449, 'Delhi-Bhopal':         779,
  'Chennai-Bangalore':  346, 'Chennai-Hyderabad':  626, 'Chennai-Kolkata':     1659,
  'Chennai-Coimbatore': 497, 'Chennai-Kochi':       683, 'Chennai-Visakhapatnam': 793,
  'Bangalore-Hyderabad': 568, 'Bangalore-Kochi':   545, 'Bangalore-Coimbatore': 360,
  'Hyderabad-Kolkata':  1192, 'Hyderabad-Nagpur':   503, 'Hyderabad-Visakhapatnam': 625,
  'Kolkata-Bhubaneswar': 441, 'Kolkata-Patna':      576, 'Kolkata-Visakhapatnam': 1070,
  'Pune-Bangalore':     836, 'Pune-Hyderabad':      559, 'Pune-Nagpur':          706,
  'Ahmedabad-Jaipur':   659, 'Ahmedabad-Surat':     265, 'Ahmedabad-Vadodara':   109,
  'Nagpur-Bhopal':      356, 'Nagpur-Hyderabad':    503, 'Nagpur-Indore':        468,
  'Jaipur-Lucknow':     573, 'Jaipur-Bhopal':       601, 'Lucknow-Patna':        528,
};

function getDistance(from, to) {
  const key1 = `${from}-${to}`;
  const key2 = `${to}-${from}`;
  return DISTANCE_TABLE[key1] || DISTANCE_TABLE[key2] || estimateDistance(from, to);
}

// Fallback: rough estimate based on city index spread
function estimateDistance(from, to) {
  const i = CITIES.indexOf(from);
  const j = CITIES.indexOf(to);
  if (i === -1 || j === -1) return 800;
  return 200 + Math.abs(i - j) * 120;
}

// Known disruption zones — will be replaced by live API data
const DISRUPTION_ZONES = ['Chennai', 'JNPT', 'Mumbai'];

function isDisrupted(city) {
  return DISRUPTION_ZONES.includes(city);
}

function getRiskReason(from, to) {
  if (isDisrupted(to) || isDisrupted(from)) {
    if (to === 'Chennai' || from === 'Chennai') return { type: 'CYCLONE', label: 'Cyclone Michaung', delay: 8 };
    if (to === 'JNPT'    || from === 'JNPT')    return { type: 'STRIKE',  label: 'Dock Workers Strike', delay: 5 };
    if (to === 'Mumbai'  || from === 'Mumbai')   return { type: 'STRIKE',  label: 'JNPT Strike Spillover', delay: 3 };
  }
  return null;
}

// Derive intermediate waypoints for display
function getViaPoints(from, to, strategy) {
  const midpoints = {
    fastest:  ['NH-48 Expressway', 'Toll Plaza 7'],
    cheapest: ['State Highway', 'Bypass Road'],
    carbon:   ['Rail Corridor', 'Intermodal Hub'],
    safest:   ['NH-44 Main', 'Verified Checkpoint'],
  };
  const pts = midpoints[strategy] || midpoints.fastest;
  return `${pts[0]} → ${pts[1]}`;
}

// Core engine: generate 4 route options for any city pair
export function computeRoutes(from, to) {
  if (!from || !to || from === to) return null;

  const distKm   = getDistance(from, to);
  const disruption = getRiskReason(from, to);

  // Base travel time in hours at avg 60 km/h
  const baseHours = distKm / 60;
  // Cost base: ₹12/km for truck
  const baseCost  = Math.round(distKm * 12);
  // CO2 base: 0.12 kg/km
  const baseCO2   = Math.round(distKm * 0.12);

  const disruptionDelay = disruption ? disruption.delay : 0;

  const fmt = (h) => {
    const hrs  = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
  };
  const fmtCost = (n) => `₹${n.toLocaleString('en-IN')}`;
  const fmtCO2  = (n) => `${n} kg`;
  const delta   = (n, base, unit = '') => {
    const d = n - base;
    return d === 0 ? '—' : `${d > 0 ? '+' : '−'}${unit}${Math.abs(d).toLocaleString('en-IN')}`;
  };

  // Fastest: +15% cost, −20% time (expressway), +10% CO2
  const fastHours = baseHours * 0.8;
  const fastCost  = Math.round(baseCost * 1.15);
  const fastCO2   = Math.round(baseCO2  * 1.10);

  // Cheapest: −15% cost, +25% time (state roads), +5% CO2
  const cheapHours = baseHours * 1.25;
  const cheapCost  = Math.round(baseCost * 0.85);
  const cheapCO2   = Math.round(baseCO2  * 1.05);

  // Carbon: −25% CO2 (rail+road), +20% time, −5% cost
  const carbonHours = baseHours * 1.20;
  const carbonCost  = Math.round(baseCost * 0.95);
  const carbonCO2   = Math.round(baseCO2  * 0.75);

  // Safest: +5% time, +5% cost, same CO2 (verified highways)
  const safeHours = baseHours * 1.05;
  const safeCost  = Math.round(baseCost * 1.05);
  const safeCO2   = Math.round(baseCO2  * 1.00);

  return {
    disruption,
    distKm,
    originalETA: fmt(baseHours + disruptionDelay),
    routes: [
      {
        id: 'A', label: 'Fastest Route',   icon: '⚡', color: 'cyan',
        via:         getViaPoints(from, to, 'fastest'),
        eta:         fmt(fastHours),
        etaSaved:    `−${fmt(baseHours + disruptionDelay - fastHours)}`,
        cost:        fmtCost(fastCost),
        costDelta:   delta(fastCost, baseCost, '₹'),
        co2:         fmtCO2(fastCO2),
        co2Delta:    delta(fastCO2, baseCO2, '') + ' kg',
        reliability: 88,
      },
      {
        id: 'B', label: 'Cheapest Route',  icon: '💰', color: 'emerald',
        via:         getViaPoints(from, to, 'cheapest'),
        eta:         fmt(cheapHours),
        etaSaved:    delta(cheapHours, baseHours + disruptionDelay, '') + 'h',
        cost:        fmtCost(cheapCost),
        costDelta:   '−₹' + Math.abs(cheapCost - baseCost).toLocaleString('en-IN'),
        co2:         fmtCO2(cheapCO2),
        co2Delta:    delta(cheapCO2, baseCO2, '') + ' kg',
        reliability: 72,
      },
      {
        id: 'C', label: 'Carbon-Friendly', icon: '🌿', color: 'green',
        via:         getViaPoints(from, to, 'carbon'),
        eta:         fmt(carbonHours),
        etaSaved:    delta(carbonHours, baseHours + disruptionDelay, '') + 'h',
        cost:        fmtCost(carbonCost),
        costDelta:   '−₹' + Math.abs(carbonCost - baseCost).toLocaleString('en-IN'),
        co2:         fmtCO2(carbonCO2),
        co2Delta:    '−' + Math.abs(carbonCO2 - baseCO2) + ' kg',
        reliability: 81,
      },
      {
        id: 'D', label: 'Safest Route',    icon: '🛡️', color: 'blue',
        via:         getViaPoints(from, to, 'safest'),
        eta:         fmt(safeHours),
        etaSaved:    `−${fmt(baseHours + disruptionDelay - safeHours)}`,
        cost:        fmtCost(safeCost),
        costDelta:   '+₹' + Math.abs(safeCost - baseCost).toLocaleString('en-IN'),
        co2:         fmtCO2(safeCO2),
        co2Delta:    '—',
        reliability: 96,
      },
    ],
  };
}

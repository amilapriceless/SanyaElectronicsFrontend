import React, { useState, useMemo } from 'react';
import {
  Zap,
  Thermometer,
  Wind,
  Sun,
  Home,
  Sliders,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
  Settings,
  Sparkles,
} from 'lucide-react';

const ACCalculator = () => {
  // Collapsible toggle for mobile viewports
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);

  // 1. User Input States
  const [roomSize, setRoomSize] = useState(160); // sq ft
  const [useCustomBtu, setUseCustomBtu] = useState(false);
  const [customBtu, setCustomBtu] = useState(12000);
  const [acType, setAcType] = useState('inverter'); // 'inverter' | 'non-inverter'
  const [tempCategory, setTempCategory] = useState(3); // 1: Cold, 2: Moderate, 3: Eco
  const [dailyHours, setDailyHours] = useState(8); // hrs/day
  const [unitRate, setUnitRate] = useState(42); // LKR per kWh

  // 2. Room Size to BTU & Tonnage Mapping
  const autoBtuAndTonnage = useMemo(() => {
    if (roomSize <= 120) return { btu: 9000, tonnage: '0.75 Ton' };
    if (roomSize <= 170) return { btu: 12000, tonnage: '1.0 Ton' };
    if (roomSize <= 260) return { btu: 18000, tonnage: '1.5 Ton' };
    return { btu: 24000, tonnage: '2.0 Ton' };
  }, [roomSize]);

  const effectiveBtu = useCustomBtu ? Number(customBtu) || 9000 : autoBtuAndTonnage.btu;
  const effectiveTonnage = useCustomBtu
    ? `${(effectiveBtu / 12000).toFixed(1)} Ton`
    : autoBtuAndTonnage.tonnage;

  // 3. Compressor Run Factor Matrix & Energy Calculations
  const calculations = useMemo(() => {
    const isInverter = acType === 'inverter';
    const eer = isInverter ? 11.5 : 10.0;

    // Run factor matrix
    let runFactor = 0.52;
    if (isInverter) {
      if (tempCategory === 1) runFactor = 0.78;
      else if (tempCategory === 2) runFactor = 0.52;
      else runFactor = 0.35; // Eco 24-26°C
    } else {
      if (tempCategory === 1) runFactor = 0.92;
      else if (tempCategory === 2) runFactor = 0.75;
      else runFactor = 0.60; // Eco 24-26°C
    }

    const powerKw = effectiveBtu / (eer * 1000);
    const dailyKwh = powerKw * dailyHours * runFactor;
    const monthlyKwh = dailyKwh * 30;
    const monthlyCost = monthlyKwh * unitRate;

    return {
      eer,
      runFactor,
      powerKw,
      dailyKwh,
      monthlyKwh,
      monthlyCost,
    };
  }, [acType, tempCategory, effectiveBtu, dailyHours, unitRate]);

  // Fan rotation duration in seconds based on runFactor
  const fanAnimDuration = Math.max(0.6, (1.5 / calculations.runFactor).toFixed(2));

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden mb-8 transition-all duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                AC Sizing & Electricity Cost Calculator
              </h2>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Estimate required tonnage, power load (kW), and monthly electricity bill in LKR
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileCollapsed((prev) => !prev)}
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          aria-label={isMobileCollapsed ? 'Expand calculator' : 'Collapse calculator'}
        >
          {isMobileCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Body Layout */}
      <div className={`p-6 sm:p-8 ${isMobileCollapsed ? 'hidden md:block' : 'block'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Room Size Slider */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Home className="w-4 h-4 text-cyan-400" />
                  Room Size (sq ft)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-cyan-400 font-mono">
                    {roomSize} sq ft
                  </span>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-lg font-bold border border-slate-700">
                    {autoBtuAndTonnage.tonnage}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="50"
                max="500"
                step="5"
                value={roomSize}
                disabled={useCustomBtu}
                onChange={(e) => setRoomSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-40"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>50 sq ft (Small)</span>
                <span>250 sq ft (Medium)</span>
                <span>500 sq ft (Large)</span>
              </div>

              {/* Custom BTU Override Toggle */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={useCustomBtu}
                    onChange={(e) => setUseCustomBtu(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>Manual BTU Override</span>
                </label>
                {useCustomBtu && (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={customBtu}
                      step="1000"
                      onChange={(e) => setCustomBtu(Number(e.target.value))}
                      className="w-24 bg-slate-950 border border-cyan-500/40 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                    <span className="text-[11px] text-slate-400">BTU</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. AC Type Toggle (Inverter vs Non-Inverter) */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Compressor Technology Type
                </label>
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  EER: {calculations.eer}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAcType('inverter')}
                  className={`min-h-[48px] p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    acType === 'inverter'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Inverter (Energy Saving)
                </button>

                <button
                  type="button"
                  onClick={() => setAcType('non-inverter')}
                  className={`min-h-[48px] p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    acType === 'non-inverter'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Non-Inverter (Standard)
                </button>
              </div>
            </div>

            {/* 3. Temperature Preset Buttons */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                Target Temperature Preset
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { cat: 1, label: 'Cold (16–21°C)', sub: 'Max Cooling', icon: Wind, color: 'text-blue-400' },
                  { cat: 2, label: 'Moderate (22–23°C)', sub: 'Balanced', icon: Activity, color: 'text-amber-400' },
                  { cat: 3, label: 'Eco (24–26°C)', sub: 'High Savings', icon: Sun, color: 'text-emerald-400' },
                ].map((item) => {
                  const isSelected = tempCategory === item.cat;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.cat}
                      type="button"
                      onClick={() => setTempCategory(item.cat)}
                      className={`min-h-[56px] p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                        <span className="text-[11px] font-extrabold text-white">{item.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium pl-5">{item.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Daily Usage Hours & Electricity Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Hours Slider */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Daily Usage
                  </label>
                  <span className="text-xs font-black text-cyan-400 font-mono">
                    {dailyHours} hrs / day
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Electricity Rate Input */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Electricity Rate (LKR / kWh)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">LKR</span>
                  <input
                    type="number"
                    min="1"
                    value={unitRate}
                    onChange={(e) => setUnitRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Animated Visuals & Real-Time Metrics */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            {/* Dynamic Graphical Display (Indoor vs Outdoor Heat Dissipation) */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 relative overflow-hidden space-y-5">
              {/* Top Badges */}
              <div className="flex items-center justify-between text-xs">
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Power Load: {calculations.powerKw.toFixed(2)} kW
                </span>

                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                  Run Duty: {(calculations.runFactor * 100).toFixed(0)}%
                </span>
              </div>

              {/* Graphical Air Conditioning Animation Canvas */}
              <div className="relative bg-slate-950 rounded-2xl p-5 border border-slate-800/80 grid grid-cols-2 gap-4 items-center">
                {/* Indoor Unit (Cool Air Flow) */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 relative">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2">
                    <Wind
                      className="w-6 h-6 animate-spin"
                      style={{ animationDuration: `${fanAnimDuration}s` }}
                    />
                  </div>
                  <span className="text-xs font-black text-white">Indoor Unit</span>
                  <span className="text-[10px] text-cyan-400 font-medium">Cool Air Discharge</span>
                </div>

                {/* Outdoor Unit (Heat Dissipation) */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 relative">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-2">
                    <Sun
                      className="w-6 h-6 animate-spin"
                      style={{ animationDuration: `${fanAnimDuration}s` }}
                    />
                  </div>
                  <span className="text-xs font-black text-white">Outdoor Unit</span>
                  <span className="text-[10px] text-amber-400 font-medium">Heat Dissipation</span>
                </div>

                {/* Animated Flow Dots in Background */}
                <div className="col-span-2 flex items-center justify-center gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Compressor Speed: <strong className="text-white">{acType === 'inverter' ? 'Variable Speed (Inverter)' : 'Fixed Speed (On/Off)'}</strong>
                  </span>
                </div>
              </div>

              {/* Recommended Tonnage Highlight Card */}
              <div className="bg-gradient-to-r from-cyan-950/80 to-slate-900 p-4 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                    Recommended AC Capacity
                  </span>
                  <span className="text-xl font-black text-white">
                    {effectiveTonnage} <span className="text-xs text-slate-400 font-normal">({effectiveBtu.toLocaleString()} BTU)</span>
                  </span>
                </div>
                <span className="text-xs font-extrabold text-cyan-300 bg-cyan-500/20 px-3 py-1.5 rounded-xl border border-cyan-400/30">
                  Matched
                </span>
              </div>
            </div>

            {/* Real-Time Output Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Daily Units */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Daily Usage
                </span>
                <span className="text-xl font-black text-cyan-400 mt-1 block">
                  {calculations.dailyKwh.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500">kWh / day</span>
              </div>

              {/* Monthly Units */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Monthly Units
                </span>
                <span className="text-xl font-black text-white mt-1 block">
                  {calculations.monthlyKwh.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-500">kWh / month</span>
              </div>

              {/* Estimated Monthly Cost */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-cyan-500/40 shadow-lg">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-cyan-400" />
                  Monthly Bill
                </span>
                <span className="text-xl font-black text-cyan-300 mt-1 block truncate">
                  LKR {calculations.monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-slate-400">Est. @ {unitRate} LKR/kWh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ACCalculator;

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { BACKTEST_REPORTS, SHOOTOUT_DATA } from "../data/backtest_reports";
import { TrendingUp, Shield, Zap, Info, Clock, Target, BarChart3 } from "lucide-react";

export function StrategyLab() {
  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-10 text-gray-100">
      {/* Header Section */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-gellix">Strategy Laboratory</h1>
          <p className="text-gray-400 max-w-2xl">
            Comparative performance analysis of all active trading core versions. 
            Evaluating the trade-offs between volatility capture and drawdown protection.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-500 uppercase tracking-widest">v1.0.3 Live Analysis</span>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {BACKTEST_REPORTS.map((report) => (
          <div key={report.version} className="relative group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-emerald-500/30 hover:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-500 px-2.5 py-1 rounded-full bg-emerald-500/10 uppercase tracking-tighter">
                Version {report.version}
              </span>
              <div className="text-gray-500 group-hover:text-emerald-500 transition-colors">
                {report.version === "1.0.0" ? <Clock size={18} /> : report.version === "1.0.2" ? <Shield size={18} /> : <Zap size={18} />}
              </div>
            </div>
            
            <div className="space-y-1 mb-6">
              <div className="text-3xl font-bold text-white">+{report.pnl}% <span className="text-sm font-normal text-gray-500 underline decoration-emerald-500/50 underline-offset-4">PnL</span></div>
              <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{report.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Win Rate</div>
                <div className="text-sm font-semibold text-gray-200">{report.winRate}%</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Drawdown</div>
                <div className="text-sm font-semibold text-red-400">-{report.drawdown}%</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Trades</div>
                <div className="text-sm font-semibold text-gray-200">{report.trades}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Week Shootout Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-900/50 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <BarChart3 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Random Week Shootout</h2>
              <p className="text-sm text-gray-500 italic">PnL % Comparison across varied market regimes</p>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SHOOTOUT_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="window" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <ReferenceLine y={0} stroke="#4b5563" />
                <Bar name="v1.0.0 (Baseline)" dataKey="v100" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar name="v1.0.2 (Tuned)" dataKey="v102" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar name="v1.0.3 (Hybrid)" dataKey="v103" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verdict Details */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-gray-800 bg-emerald-950/20 p-8 border-emerald-500/20">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <TrendingUp size={18} /> Competitive Advantage
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex gap-3">
                <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold">1</div>
                <p><span className="text-white font-semibold underline decoration-emerald-500/30">v1.0.2</span> offers the best drawdown protection during crashes, reducing losses by 54% vs v1.0.0.</p>
              </li>
              <li className="flex gap-3">
                <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold">2</div>
                <p><span className="text-white font-semibold underline decoration-emerald-500/30">v1.0.3</span> is the optimized hybrid, capturing 4x more profit in choppy sideways markets than earlier versions.</p>
              </li>
              <li className="flex gap-3">
                <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold">3</div>
                <p><span className="text-white font-semibold underline decoration-emerald-500/30">v1.0.0</span> remains purely high-beta, essential for testing "unfiltered" bull market movements.</p>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 flex-1">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Info size={18} className="text-gray-500" /> Lab Notes
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Version 1.0.3's <strong>Triple Guard</strong> system includes an EMA 50 slope filter, volatility ceiling, and an hourly emergency exit protocol.
            </p>
            <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700">
               <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-bold">Active Experiment</div>
               <div className="flex items-center justify-between">
                 <span className="text-xs font-medium text-gray-200">2-Candle Confirmations</span>
                 <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">STABLE</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

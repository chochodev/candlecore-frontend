import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { botAPI } from '../../lib/api';
import { Zap, Shield, ChevronRight, BarChart3, ArrowUpDown } from 'lucide-react';

interface StrategyReport {
  version: string;
  timestamp: string;
  description: string;
  benchmarks: Array<{
    symbol: string;
    total_pnl_pct: number;
    win_rate: number;
    max_drawdown_pct: number;
    total_trades: number;
  }>;
}

export default function LabIndex() {
  const [reports, setReports] = useState<StrategyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await botAPI.getReports();
        setReports(data.sort((a, b) => b.version.localeCompare(a.version)));
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleSelection = (version: string) => {
    setSelectedVersions((prev) =>
      prev.includes(version) ? prev.filter((v) => v !== version) : [...prev, version]
    );
  };

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-10 text-gray-100">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-gellix">Strategy Archive</h1>
          <p className="text-gray-400 max-w-2xl">
            Live historical performance audits across all development cycles. 
            Select up to 3 versions to begin deep-dive comparative analysis.
          </p>
        </div>
        {selectedVersions.length > 0 && (
          <Link
            to={`/lab/compare?v=${selectedVersions.join(',')}`}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Compare {selectedVersions.length} Versions <ChevronRight size={18} />
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-950/50">
              <th className="p-4 w-12 text-center">
                <div className="h-4 w-4 rounded border border-gray-700" />
              </th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Version</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Top Symbol</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-1">Total PnL <ArrowUpDown size={12} /></div>
              </th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Win Rate</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Drawdown</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="p-6 h-16 bg-gray-800/10" />
                </tr>
              ))
            ) : (
              reports.map((report) => {
                const topBenchmark = report.benchmarks?.[0] || { symbol: 'N/A', total_pnl_pct: 0, win_rate: 0, max_drawdown_pct: 0, total_trades: 0 };
                const isSelected = selectedVersions.includes(report.version);
                
                return (
                  <tr 
                    key={report.version} 
                    className={`transition-colors hover:bg-white/2 cursor-pointer ${isSelected ? 'bg-white/4' : ''}`}
                    onClick={() => toggleSelection(report.version)}
                  >
                    <td className="p-4 text-center">
                      <div className={`h-4 w-4 rounded border transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500 flex items-center justify-center' : 'border-gray-700'}`}>
                        {isSelected && <div className="h-2 w-2 bg-white rounded-full" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${report.version === '1.0.3' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {report.version === '1.0.0' ? <Zap size={14} /> : report.version === '1.0.2' ? <Shield size={14} /> : <BarChart3 size={14} />}
                        </div>
                        <span className="font-bold text-white tracking-tight">v{report.version}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell uppercase text-sm font-medium text-gray-400">{topBenchmark.symbol}</td>
                    <td className="p-4">
                      <span className={`font-mono font-bold ${topBenchmark.total_pnl_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {topBenchmark.total_pnl_pct >= 0 ? '+' : ''}{topBenchmark.total_pnl_pct.toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-gray-400 font-mono">{topBenchmark.win_rate.toFixed(1)}%</td>
                    <td className="p-4 hidden lg:table-cell text-sm text-red-500/80 font-mono">-{topBenchmark.max_drawdown_pct.toFixed(2)}%</td>
                    <td className="p-4">
                       <Link 
                          to={`/lab/compare?v=${report.version}`}
                          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors block w-fit"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ChevronRight size={18} />
                       </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

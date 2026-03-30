import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { botAPI } from "../../lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChevronLeft, TrendingUp, Shield, Zap, BarChart3, ZapOff } from "lucide-react";

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
    sharpe_ratio: number;
  }>;
}

export default function Compare() {
  const [searchParams] = useSearchParams();
  const versionsToCompare = searchParams.get("v")?.split(",") || [];
  const [reports, setReports] = useState<StrategyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const allReports = await botAPI.getReports();
        const filtered = allReports.filter((r: StrategyReport) => versionsToCompare.includes(r.version));
        setReports(filtered);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams]);

  const chartData = useMemo(() => {
    if (reports.length === 0) return [];

    // Group benchmarks by symbol for multi-comparison if needed, but for now let's just do top benchmark
    // const mainSymbol = reports[0]?.benchmarks?.[0]?.symbol || 'btc';

    return [
      {
        name: "PnL %",
        ...Object.fromEntries(reports.map((r) => [`v${r.version}`, r.benchmarks?.[0]?.total_pnl_pct || 0])),
      },
      { name: "Win %", ...Object.fromEntries(reports.map((r) => [`v${r.version}`, r.benchmarks?.[0]?.win_rate || 0])) },
      {
        name: "Max DD %",
        ...Object.fromEntries(reports.map((r) => [`v${r.version}`, r.benchmarks?.[0]?.max_drawdown_pct || 0])),
      },
    ];
  }, [reports]);

  const getSWOT = (report: StrategyReport) => {
    const main = report.benchmarks?.[0] || { total_pnl_pct: 0, win_rate: 0, max_drawdown_pct: 0, total_trades: 0 };

    const strengths = [];
    if (main.total_pnl_pct > 50) strengths.push("Exceptional PnL acceleration");
    if (main.win_rate > 35) strengths.push("Strong signal accuracy");
    if (main.max_drawdown_pct < 4) strengths.push("Elite capital preservation");
    if (report.version === "1.0.3") strengths.push("Ensemble signal corroboration");

    const weaknesses = [];
    if (main.total_trades > 1800) weaknesses.push("Significant over-trading/noise sensitivity");
    if (main.win_rate < 33) weaknesses.push("Sub-optimal signal quality");
    if (main.max_drawdown_pct > 5) weaknesses.push("Vulnerable to peak volatility");
    if (report.version === "1.0.0") weaknesses.push("Zero crash protection logic");

    return { strengths, weaknesses };
  };

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  if (loading)
    return <div className="animate-pulse p-20 text-center font-gellix text-gray-500">Loading audit data...</div>;

  return (
    <div className="min-h-screen bg-transparent p-6 text-gray-100 md:p-10">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/lab"
            className="rounded-xl border border-gray-800 bg-gray-900 p-2 text-gray-400 transition-colors hover:text-white"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="mb-2 font-gellix text-3xl font-bold tracking-tight text-white">Side-by-Side Audit</h1>
            <p className="text-gray-400">
              Comparing development versions: {reports.map((r) => `v${r.version}`).join(", ")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowChart(!showChart)}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all ${showChart ? "bg-gray-800 text-white" : "bg-emerald-500 text-white hover:scale-105 active:scale-95"}`}
        >
          <BarChart3 size={18} /> {showChart ? "View Details" : "View Analytics"}
        </button>
      </div>

      {showChart ? (
        <div className="mb-10 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 p-8">
          <h2 className="mb-8 flex items-center gap-3 text-xl text-[10px] font-bold tracking-tighter text-white uppercase">
            <TrendingUp size={16} className="text-emerald-500" /> Relative Performance Analysis (Benchmarked against top
            symbol)
          </h2>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", borderRadius: "12px" }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                <ReferenceLine y={0} stroke="#4b5563" />
                {reports.map((r, i) => (
                  <Bar
                    key={r.version}
                    name={`v${r.version}`}
                    dataKey={`v${r.version}`}
                    fill={colors[i % colors.length]}
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, i) => {
            const { strengths, weaknesses } = getSWOT(report);
            const main = report.benchmarks?.[0] || {
              total_pnl_pct: 0,
              win_rate: 0,
              max_drawdown_pct: 0,
              total_trades: 0,
            };

            return (
              <div
                key={report.version}
                className="group relative flex flex-col gap-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-6 transition-all hover:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold tracking-tighter text-emerald-500 uppercase ring-1 ring-emerald-500/20">
                    Version {report.version}
                  </span>
                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-2 text-gray-500">
                    {report.version === "1.0.3" ? (
                      <Zap size={16} className="text-amber-500" />
                    ) : (
                      <Shield size={16} className="text-blue-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl font-bold tracking-tighter text-white">
                    {main.total_pnl_pct >= 0 ? "+" : ""}
                    {main.total_pnl_pct.toFixed(1)}%
                  </div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">{report.description}</p>
                </div>

                {/* SWOT Section */}
                <div className="space-y-6 border-t border-gray-800 pt-4">
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                      <TrendingUp size={12} /> Strategic Advantages
                    </h4>
                    <ul className="space-y-2">
                      {strengths.map((s, j) => (
                        <li key={j} className="flex gap-2 text-xs text-gray-300">
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-[8px] font-bold tracking-tight text-emerald-500">
                            ✓
                          </div>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-red-400 uppercase">
                      <ZapOff size={12} /> Performance Gaps
                    </h4>
                    <ul className="space-y-2">
                      {weaknesses.map((w, j) => (
                        <li key={j} className="flex gap-2 text-xs text-gray-400 italic">
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-red-500/10 text-[8px] font-bold tracking-tight text-red-500">
                            !
                          </div>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-auto grid grid-cols-2 gap-4 border-t border-gray-800 pt-6">
                  <div className="rounded-xl border border-gray-800/50 bg-gray-950/50 p-3">
                    <div className="mb-1 text-[10px] font-bold text-gray-600 uppercase">Win Rate</div>
                    <div className="text-sm font-bold text-white">{main.win_rate.toFixed(1)}%</div>
                  </div>
                  <div className="rounded-xl border border-gray-800/50 bg-gray-950/50 p-3">
                    <div className="mb-1 text-[10px] font-bold text-gray-600 uppercase">Sharpe</div>
                    <div className="text-sm font-bold text-white">{main.sharpe_ratio?.toFixed(2) || "N/A"}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

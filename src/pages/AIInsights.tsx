import { motion } from 'motion/react';
import { BrainCircuit, ShieldAlert, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AI_PREDICTIONS = [
  { machine: 'CNC-Milling-01', risk: 85, daysToFailure: 2, issue: 'Spindle Bearing Wear', status: 'Critical' },
  { machine: 'Injection-Mold-04', risk: 42, daysToFailure: 14, issue: 'Hydraulic Pressure Drop', status: 'Warning' },
  { machine: 'Assembly-Robot-A', risk: 12, daysToFailure: 45, issue: 'None', status: 'Healthy' }
];

const DEMAND_FORECAST = [
  { month: 'Jan', actual: 4000, forecast: 4100 },
  { month: 'Feb', actual: 3000, forecast: 3200 },
  { month: 'Mar', actual: 2000, forecast: 2500 },
  { month: 'Apr', actual: 2780, forecast: 2900 },
  { month: 'May', actual: 1890, forecast: 2100 },
  { month: 'Jun', actual: 2390, forecast: 2800 },
  { month: 'Jul', actual: null, forecast: 3400 },
  { month: 'Aug', actual: null, forecast: 3800 },
];

export default function AIInsights() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="text-indigo-400" /> AI Intelligence Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">Powered by Python FastAPI & Scikit-Learn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Maintenance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" /> Predictive Maintenance
          </h3>
          <div className="space-y-4">
            {AI_PREDICTIONS.map((pred, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 rounded-lg p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="font-mono text-sm text-slate-300 font-bold">{pred.machine}</div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded border ${
                    pred.status === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    pred.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {pred.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex-1">
                    <div className="text-slate-500 text-xs mb-2">Failure Risk Probability</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${pred.risk > 50 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${pred.risk}%` }} />
                      </div>
                      <span className="text-white font-mono font-bold">{pred.risk}%</span>
                    </div>
                  </div>
                  <div className="text-right border-l border-slate-800 pl-6">
                    <div className="text-slate-500 text-xs mb-1">Est. Time to Failure</div>
                    <div className="text-white font-mono text-lg">{pred.daysToFailure} <span className="text-sm text-slate-500">Days</span></div>
                  </div>
                </div>
                {pred.issue !== 'None' && (
                  <div className="mt-4 text-xs text-rose-400 bg-rose-500/5 px-3 py-2 rounded border border-rose-500/10 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Detected Anomaly: {pred.issue}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demand Forecasting */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Demand Forecasting (ARIMA)
          </h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMAND_FORECAST} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" name="Actual Sales" />
                <Area type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" name="AI Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-slate-800 text-sm text-slate-300 flex items-start gap-3">
            <BrainCircuit className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p>AI predicts a <strong>22% increase</strong> in demand for Q3 based on historical ERP data and seasonal trends. Recommendation: Increase raw steel procurement by 15% next month.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

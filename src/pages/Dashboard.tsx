import { motion } from 'motion/react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Cpu, AlertTriangle, TrendingUp } from 'lucide-react';

const MOCK_DATA = [
  { time: '00:00', oee: 85, output: 120 },
  { time: '04:00', oee: 88, output: 132 },
  { time: '08:00', oee: 92, output: 145 },
  { time: '12:00', oee: 89, output: 138 },
  { time: '16:00', oee: 94, output: 150 },
  { time: '20:00', oee: 90, output: 142 },
];

export default function Dashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Global Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Equipment Effectiveness" value="91.2%" icon={<Activity />} trend="+2.4%" />
        <StatCard title="Active Machines" value="24 / 25" icon={<Cpu />} trend="Optimal" trendColor="text-emerald-400" />
        <StatCard title="Critical Alerts" value="2" icon={<AlertTriangle />} trend="Requires Action" trendColor="text-rose-400" />
        <StatCard title="Production Output" value="1,492" icon={<TrendingUp />} trend="+12% vs yesterday" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-6">Production Output vs OEE</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA}>
                <defs>
                  <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="output" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorOutput)" />
                <Line type="monotone" dataKey="oee" stroke="#10b981" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-6">Recent Events</h2>
          <div className="space-y-4">
            {[
              { time: '10 mins ago', event: 'Machine CNC-01 temperature normalized', type: 'success' },
              { time: '1 hour ago', event: 'Work Order #492 completed', type: 'info' },
              { time: '2 hours ago', event: 'Low inventory: Raw Steel', type: 'warning' },
              { time: '5 hours ago', event: 'Maintenance predicted for Assembly-A', type: 'error' },
            ].map((e, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${e.type === 'success' ? 'bg-emerald-500' : e.type === 'warning' ? 'bg-amber-500' : e.type === 'error' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                <div>
                  <div className="text-sm text-slate-200">{e.event}</div>
                  <div className="text-xs text-slate-500">{e.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, trend, trendColor = "text-indigo-400" }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-400 text-sm font-medium">{title}</div>
        <div className="text-slate-500">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className={`text-xs font-medium ${trendColor}`}>{trend}</div>
    </div>
  );
}

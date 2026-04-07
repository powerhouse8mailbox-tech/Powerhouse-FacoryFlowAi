import { motion } from 'motion/react';
import { Cpu, Thermometer, Activity } from 'lucide-react';

const MOCK_MACHINES = [
  { id: 'CNC-01', type: 'Milling', status: 'running', temp: 65.2, vibration: 2.1, oee: 94 },
  { id: 'CNC-02', type: 'Turning', status: 'running', temp: 68.5, vibration: 2.4, oee: 91 },
  { id: 'ROB-01', type: 'Assembly', status: 'stopped', temp: 35.0, vibration: 0.0, oee: 0 },
  { id: 'MOLD-01', type: 'Injection', status: 'warning', temp: 92.1, vibration: 4.5, oee: 76 },
];

export default function Machines() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Machine Monitoring</h1>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Add Machine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {MOCK_MACHINES.map(m => (
          <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-lg font-bold text-white">{m.id}</div>
                <div className="text-xs text-slate-500">{m.type}</div>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                m.status === 'running' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                m.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {m.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 flex-1">
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
                <div className="text-slate-500 text-xs mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3"/> Temp</div>
                <div className="text-white font-mono">{m.temp}°C</div>
              </div>
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
                <div className="text-slate-500 text-xs mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Vib</div>
                <div className="text-white font-mono">{m.vibration} mm/s</div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">OEE</span>
                <span className="text-white font-mono">{m.oee}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${m.oee > 85 ? 'bg-indigo-500' : m.oee > 50 ? 'bg-amber-500' : 'bg-slate-600'}`} style={{ width: `${m.oee}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

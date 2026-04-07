import { motion } from 'motion/react';
import { ClipboardList, Clock, CheckCircle2, Factory } from 'lucide-react';

const MOCK_WORK_ORDERS = [
  { id: 'WO-1042', product: 'Steel Bracket Type A', planned: 500, completed: 450, status: 'in_progress', machine: 'CNC-01' },
  { id: 'WO-1043', product: 'Aluminum Housing', planned: 200, completed: 200, status: 'completed', machine: 'CNC-02' },
  { id: 'WO-1044', product: 'Titanium Fasteners', planned: 1000, completed: 0, status: 'planned', machine: 'CNC-01' },
  { id: 'WO-1045', product: 'Polymer Casing', planned: 300, completed: 120, status: 'in_progress', machine: 'MOLD-01' },
];

export default function Production() {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'in_progress': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Production (MES)</h1>
          <p className="text-slate-400 text-sm mt-1">Manufacturing Execution System</p>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          New Work Order
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-indigo-400" />
          <h2 className="text-white font-medium">Active Work Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">WO Number</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Machine</th>
                <th className="px-6 py-4 font-medium">Progress</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-800/50">
              {MOCK_WORK_ORDERS.map((wo) => {
                const progress = Math.min(100, Math.round((wo.completed / wo.planned) * 100));
                return (
                  <tr key={wo.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-300">{wo.id}</td>
                    <td className="px-6 py-4 text-slate-200">{wo.product}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Factory className="w-4 h-4" />
                        <span className="font-mono text-xs">{wo.machine}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-slate-400 font-mono text-xs w-16 text-right">
                          {wo.completed}/{wo.planned}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(wo.status)}`}>
                        {wo.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

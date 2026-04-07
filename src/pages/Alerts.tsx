import { motion } from 'motion/react';
import { AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

const MOCK_ALERTS = [
  { id: 1, type: 'critical', title: 'AI Predictive Maintenance Alert', message: 'Machine CNC-01 showing abnormal vibration patterns. 85% probability of spindle failure within 48 hours.', time: '10 mins ago', source: 'AI Engine' },
  { id: 2, type: 'warning', title: 'Low Inventory Warning', message: 'Raw Steel Sheets (RAW-STL-01) dropped below minimum stock level (150 < 200). Auto-procurement PO-9921 created.', time: '1 hour ago', source: 'ERP System' },
  { id: 3, type: 'info', title: 'Work Order Completed', message: 'WO-1043 (Aluminum Housing) completed successfully on CNC-02. 200 units added to inventory.', time: '2 hours ago', source: 'MES System' },
  { id: 4, type: 'critical', title: 'Temperature Spike', message: 'Machine MOLD-01 exceeded safe operating temperature (92.1°C > 90.0°C). Cooling cycle initiated.', time: '3 hours ago', source: 'SCADA System' },
];

export default function Alerts() {
  const getAlertStyles = (type: string) => {
    switch(type) {
      case 'critical': return { icon: <ShieldAlert className="w-5 h-5 text-rose-400" />, bg: 'bg-rose-500/5 border-rose-500/20' };
      case 'warning': return { icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-500/5 border-amber-500/20' };
      case 'info': return { icon: <Info className="w-5 h-5 text-indigo-400" />, bg: 'bg-indigo-500/5 border-indigo-500/20' };
      default: return { icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/5 border-emerald-500/20' };
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Alerts</h1>
          <p className="text-slate-400 text-sm mt-1">Unified notifications from SCADA, MES, ERP, and AI</p>
        </div>
        <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_ALERTS.map(alert => {
          const styles = getAlertStyles(alert.type);
          return (
            <div key={alert.id} className={`p-5 rounded-xl border ${styles.bg} flex gap-4 items-start transition-colors hover:bg-slate-800/50`}>
              <div className="mt-1 shrink-0">
                {styles.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h3 className="text-white font-medium truncate">{alert.title}</h3>
                  <span className="text-xs text-slate-500 whitespace-nowrap">{alert.time}</span>
                </div>
                <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                  {alert.message}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    Source: {alert.source}
                  </span>
                  {alert.type === 'critical' && (
                    <button className="text-[10px] font-medium text-rose-400 hover:text-rose-300 uppercase tracking-wider bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 transition-colors">
                      Take Action
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

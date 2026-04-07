import { motion } from 'motion/react';
import { Package, ShoppingCart, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const MOCK_INVENTORY = [
  { id: 'RAW-STL-01', name: 'Raw Steel Sheets', type: 'raw_material', quantity: 150, min_stock: 200, location: 'Warehouse A', unit: 'kg' },
  { id: 'RAW-ALU-02', name: 'Aluminum Ingots', type: 'raw_material', quantity: 850, min_stock: 300, location: 'Warehouse A', unit: 'kg' },
  { id: 'FG-BRK-01', name: 'Steel Bracket Type A', type: 'finished_good', quantity: 1240, min_stock: 500, location: 'Warehouse B', unit: 'pcs' },
  { id: 'FG-HSG-02', name: 'Aluminum Housing', type: 'finished_good', quantity: 45, min_stock: 100, location: 'Warehouse B', unit: 'pcs' },
];

export default function Inventory() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inventory (ERP)</h1>
          <p className="text-slate-400 text-sm mt-1">Enterprise Resource Planning Integration</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Receive Goods
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Create PO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {MOCK_INVENTORY.map(item => {
          const isLowStock = item.quantity <= item.min_stock;
          return (
            <div key={item.id} className={`bg-slate-900 border rounded-xl p-5 flex flex-col ${isLowStock ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-slate-800'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <Package className={`w-5 h-5 ${item.type === 'raw_material' ? 'text-amber-400' : 'text-emerald-400'}`} />
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                  item.type === 'raw_material' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {item.type.replace('_', ' ')}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-lg font-bold text-white mb-1">{item.name}</div>
                <div className="text-xs font-mono text-slate-500">{item.id} • {item.location}</div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-end justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Current Stock</div>
                  <div className={`text-2xl font-mono font-bold flex items-baseline gap-1 ${isLowStock ? 'text-rose-400' : 'text-white'}`}>
                    {item.quantity.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">{item.unit}</span>
                  </div>
                </div>
                {isLowStock && (
                  <div className="flex items-center gap-1 text-xs text-rose-400 font-medium bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                    <ShoppingCart className="w-3 h-3" /> Reorder
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

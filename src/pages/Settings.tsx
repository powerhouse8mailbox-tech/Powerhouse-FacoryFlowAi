import { motion } from 'motion/react';
import { CreditCard, Users, Building, Key, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Tenant Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your organization, billing, and access control.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Navigation/Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-xl border border-indigo-500/30">
                SI
              </div>
              <div>
                <h2 className="text-white font-medium">Stark Industries</h2>
                <p className="text-xs text-slate-500 font-mono">Tenant ID: t-001</p>
              </div>
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg text-sm font-medium transition-colors">
                <Building className="w-4 h-4" /> Organization Profile
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg text-sm font-medium transition-colors">
                <Users className="w-4 h-4" /> User Management
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg text-sm font-medium transition-colors">
                <CreditCard className="w-4 h-4" /> Billing & Plan
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg text-sm font-medium transition-colors">
                <Key className="w-4 h-4" /> API Keys
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Current Subscription</h3>
            
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500 text-white mb-2">
                    Enterprise Plan
                  </div>
                  <div className="text-3xl font-bold text-white">$3,999<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                </div>
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Change Plan
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-indigo-500/20">
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unlimited Machines</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Custom AI Models</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unlimited Data Retention</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dedicated Account Manager</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-white mb-4">Organization Details</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Company Name</label>
                  <input type="text" defaultValue="Stark Industries" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Industry</label>
                  <input type="text" defaultValue="Aerospace & Defense" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Contact Email</label>
                <input type="email" defaultValue="admin@starkindustries.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="pt-4 flex justify-end">
                <button type="button" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

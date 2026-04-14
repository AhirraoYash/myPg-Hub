import { useState } from 'react';
import { 
  IndianRupee, 
  BedDouble, 
  UserPlus, 
  AlertCircle, 
  ChevronRight, 
  Bell,
  Users,
  LogOut,
  Clock,
  Receipt,
  X,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const recentActivities = [
  { id: 1, title: 'Rent Received', desc: '₹8,500 from Rahul (Room 102)', time: '2 hours ago', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 2, title: 'New Complaint', desc: 'Plumbing issue in Room 203', time: '5 hours ago', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  { id: 3, title: 'Tenant Onboarded', desc: 'Amit moved into Room 201', time: 'Yesterday', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100' },
];

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function StatCard({ title, value, subtitle, icon: Icon, theme, to }: any) {
  const themes = {
    blue: { light: 'bg-blue-50', icon: 'text-blue-300', value: 'text-blue-600' },
    emerald: { light: 'bg-emerald-50', icon: 'text-emerald-300', value: 'text-emerald-600' },
    red: { light: 'bg-red-50', icon: 'text-red-300', value: 'text-red-600' },
    amber: { light: 'bg-amber-50', icon: 'text-amber-300', value: 'text-amber-600' },
  };
  const t = themes[theme as keyof typeof themes];

  const CardWrapper = to ? Link : 'div';

  return (
    <CardWrapper to={to} className={`bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group block ${to ? 'active:scale-95 transition-transform cursor-pointer hover:border-blue-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]' : ''}`}>
      <div className={`absolute -right-3 -top-3 w-16 h-16 ${t.light} rounded-full flex items-center justify-center opacity-50 transition-transform group-hover:scale-110`}>
        <Icon className={`w-6 h-6 ${t.icon} absolute bottom-3 left-3`} />
      </div>
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1 relative z-10">{title}</p>
      <div className="relative z-10">
        <h2 className={`text-2xl font-extrabold ${t.value} mb-0.5 tracking-tight`}>{value}</h2>
        <p className="text-gray-400 text-[9px] font-semibold">{subtitle}</p>
      </div>
    </CardWrapper>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function ManagerDashboardScreen() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseReason, setExpenseReason] = useState('Water Tanker');
  const [expenseDesc, setExpenseDesc] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa]">
      
      {/* Header */}
      <header className="px-6 pt-14 pb-4 flex justify-between items-center bg-[#f8f9fa] z-10 sticky top-0">
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">Manager Portal</p>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">Ravi Patel</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <Link to="/manager/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm active:scale-95 transition-transform">
            <img src="https://picsum.photos/seed/manager/100/100" alt="Profile" className="w-full h-full object-cover" />
          </Link>
        </div>
      </header>

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto pb-28 hide-scrollbar">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6 pt-2"
        >
          
          {/* Manager Metrics */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 px-6">
            <StatCard title="Total Tenants" value="42" subtitle="Active in property" icon={Users} theme="blue" to="/manager/tenants" />
            <StatCard title="Occupancy" value="84%" subtitle="42/50 Beds filled" icon={BedDouble} theme="emerald" />
            <StatCard title="Total Earnings" value="₹45k" subtitle="Salary + Incentives" icon={IndianRupee} theme="amber" />
            <StatCard title="Pending Issues" value="4" subtitle="Requires attention" icon={AlertCircle} theme="red" to="/manager/complaints" />
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="px-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 tracking-wide">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/manager/add-tenant" className="bg-blue-600 text-white rounded-[1.25rem] p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_4px_20px_rgb(37,99,235,0.25)]">
                <UserPlus className="w-6 h-6" />
                <span className="text-xs font-bold">Add Tenant</span>
              </Link>
              <button onClick={() => setIsExpenseModalOpen(true)} className="bg-amber-50 text-amber-600 border border-amber-100 rounded-[1.25rem] p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                <Receipt className="w-6 h-6" />
                <span className="text-xs font-bold">Request Funds</span>
              </button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="px-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 tracking-wide">Recent Activity</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">View All</button>
            </div>
            <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div 
                    key={activity.id} 
                    className={`flex items-center gap-4 p-4 active:bg-gray-50 transition-colors block ${
                      index !== recentActivities.length - 1 ? 'border-b border-gray-50' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-extrabold text-gray-900">{activity.title}</h4>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{activity.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {activity.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* Request Funds Modal */}
      <AnimatePresence>
        {isExpenseModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full sm:w-[400px] rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900">Request Funds</h2>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Send expense request to owner</p>
                  </div>
                </div>
                <button onClick={() => setIsExpenseModalOpen(false)} className="p-2 bg-gray-50 rounded-full active:scale-95">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Amount Needed</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <input 
                      type="number" 
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Category</label>
                  <select 
                    value={expenseReason}
                    onChange={(e) => setExpenseReason(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 appearance-none"
                  >
                    <option value="Water Tanker">Water Tanker</option>
                    <option value="Cleaning Supplies">Cleaning Supplies (Soap, etc.)</option>
                    <option value="Maintenance/Repairs">Maintenance / Repairs</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Description (Optional)</label>
                  <textarea 
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                    placeholder="E.g., Need 2 water tankers for today..."
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none" 
                  />
                </div>
                
                <button 
                  onClick={() => {
                    console.log('Requesting funds:', { amount: expenseAmount, reason: expenseReason, desc: expenseDesc });
                    setIsExpenseModalOpen(false);
                    setExpenseAmount('');
                    setExpenseDesc('');
                  }}
                  disabled={!expenseAmount}
                  className="w-full py-4 mt-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(245,158,11,0.25)] transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Request to Owner
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

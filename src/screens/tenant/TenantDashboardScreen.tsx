import { Bell, Wrench, ReceiptText, Folder, ArrowRight, LogOut, Bed, Users, Wifi, AlertCircle, ChevronRight, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function TenantHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center mb-8">
      <button 
        onClick={() => navigate('/tenant/profile')}
        className="flex items-center gap-3 text-left active:scale-95 transition-transform group"
      >
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm relative">
          <img 
            src="https://picsum.photos/seed/rahul/200/200" 
            alt="Rahul" 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-4 h-4 rounded-full bg-white/30 backdrop-blur-sm" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">Welcome back,</p>
          <h1 className="text-xl font-extrabold text-gray-900">Hi, Rahul 👋</h1>
        </div>
      </button>
      <button className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform relative">
        <Bell className="w-5 h-5 text-gray-700" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
    </div>
  );
}

function TenantOverview() {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[1.5rem] shadow-[0_8px_30px_rgb(79,70,229,0.2)] p-6 mb-8 relative overflow-hidden text-white">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider mb-1">
              Sunrise PG - Building A
            </p>
            <h2 className="text-2xl font-black">
              Room 102 • Bed B
            </h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-xs font-bold">Active</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider mb-1">
              Pending Dues
            </p>
            <h3 className="text-2xl font-black text-white">
              ₹12,450
            </h3>
          </div>
          <motion.button 
            onClick={() => navigate('/tenant/accounts')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-indigo-600 px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2"
          >
            Pay Now
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function NoticeBoard() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-gray-900">Recent Updates</h3>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</button>
      </div>
      <div className="bg-blue-50 rounded-[1.25rem] p-4 border border-blue-100 flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-blue-900">Water Supply Interruption</h4>
          <p className="text-xs font-medium text-blue-800/80 mt-1 leading-relaxed">
            Water supply will be interrupted tomorrow from 2 PM to 4 PM for tank cleaning.
          </p>
          <span className="text-[10px] font-bold text-blue-600/60 uppercase tracking-wider mt-2 block">2 hours ago</span>
        </div>
      </div>
    </div>
  );
}

function ActiveIssues() {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-extrabold text-gray-900 mb-4">Active Requests</h3>
      <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-orange-200 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-gray-900">AC Not Cooling</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-xs font-bold text-orange-600">In Progress</span>
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
      </div>
    </div>
  );
}

function TenantQuickActions() {
  const navigate = useNavigate();
  
  const actions = [
    { icon: ReceiptText, label: 'Account', color: 'text-blue-500', bg: 'bg-blue-50', path: '/tenant/accounts' },
    { icon: Wrench, label: 'Complaints', color: 'text-orange-500', bg: 'bg-orange-50', path: '/tenant/complaints/new' },
    { icon: Users, label: 'Gate Pass', color: 'text-emerald-500', bg: 'bg-emerald-50', path: '/tenant/gate-pass' },
    { icon: Bed, label: 'My Room', color: 'text-indigo-500', bg: 'bg-indigo-50', path: '/tenant/room' },
    { icon: Folder, label: 'Documents', color: 'text-purple-500', bg: 'bg-purple-50', path: '/tenant/documents' },
    { icon: Wifi, label: 'Internet', color: 'text-cyan-500', bg: 'bg-cyan-50', path: '#' },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-sm font-extrabold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, idx) => (
          <motion.button 
            key={idx}
            onClick={() => action.path !== '#' && navigate(action.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 border border-gray-100 flex flex-col items-center gap-3 text-center transition-colors hover:border-gray-200"
          >
            <div className={`w-12 h-12 rounded-full ${action.bg} flex items-center justify-center`}>
              <action.icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <span className="text-xs font-extrabold text-gray-900">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function TenantDashboardScreen({ onLogout }: { onLogout?: () => void }) {
  const navigate = useNavigate();
  
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
    <div className="min-h-screen bg-[#f8f9fa] px-6 pt-14 pb-8 overflow-y-auto hide-scrollbar relative">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="max-w-md mx-auto"
      >
        <motion.div variants={itemVariants}>
          <TenantHeader />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <TenantOverview />
        </motion.div>

        <motion.div variants={itemVariants}>
          <NoticeBoard />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ActiveIssues />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TenantQuickActions />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-4 flex flex-col gap-3">
          <button 
            onClick={() => navigate('/tenant/move-out')}
            className="w-full py-4 rounded-xl font-bold text-sm text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            Initiate Move-Out Request
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full py-4 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

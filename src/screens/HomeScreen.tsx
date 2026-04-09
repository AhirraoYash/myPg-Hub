import { 
  IndianRupee, 
  BedDouble, 
  UserPlus, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  Bell,
  Users,
  LogOut,
  Wallet,
  Megaphone,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

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

function ActionItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-14 h-14 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-center justify-center group-active:scale-95 transition-all group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:border-blue-100">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">{label}</span>
    </div>
  );
}

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

export default function HomeScreen() {
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
          <p className="text-sm font-bold text-gray-500 mb-0.5">Good Morning,</p>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Kartik Modi</h1>
        </div>
        <button className="relative p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto pb-28 hide-scrollbar">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6 pt-2"
        >
          
          {/* SaaS Dashboard Metrics (2x2 Grid) */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 px-6">
            <StatCard title="Total Tenants" value="42" subtitle="Active in property" icon={Users} theme="blue" to="/tenants?filter=All" />
            <StatCard title="Occupancy" value="84%" subtitle="42/50 Beds filled" icon={BedDouble} theme="emerald" />
            <StatCard title="Pending Rent" value="₹45k" subtitle="From 8 tenants" icon={IndianRupee} theme="red" to="/tenants?filter=Pending+Rent" />
            <StatCard title="Notice Period" value="3" subtitle="Leaving in 30 days" icon={LogOut} theme="amber" to="/tenants?filter=Notice" />
          </motion.div>

          {/* Smart Alerts (Proactive SaaS Feature) */}
          <motion.div variants={itemVariants} className="px-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 tracking-wide">Smart Alerts</h3>
            <div className="flex flex-col gap-3">
              <Link to="/verify-kyc" className="bg-amber-50/50 border border-amber-100 rounded-[1.25rem] p-4 flex items-center gap-4 active:scale-[0.98] transition-transform">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-extrabold text-amber-900">2 Pending KYCs</h4>
                  <p className="text-xs font-medium text-amber-700/80 mt-0.5">Requires your approval</p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </Link>
              
              <Link to="/agreements" className="bg-red-50/50 border border-red-100 rounded-[1.25rem] p-4 flex items-center gap-4 active:scale-[0.98] transition-transform">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-extrabold text-red-900">3 Agreements Expiring</h4>
                  <p className="text-xs font-medium text-red-700/80 mt-0.5">Expiring in next 15 days</p>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Actions (Grid) */}
          <motion.div variants={itemVariants} className="px-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-wide">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              <Link to="/add-tenant" className="block">
                <ActionItem icon={UserPlus} label="Add Tenant" />
              </Link>
              <Link to="/record-payment" className="block">
                <ActionItem icon={Wallet} label="Record Pay" />
              </Link>
              <Link to="/verify-kyc" className="block">
                <ActionItem icon={ShieldCheck} label="Verify KYC" />
              </Link>
              <Link to="/complaints" className="block">
                <ActionItem icon={AlertCircle} label="Complaints" />
              </Link>
              <Link to="/agreements" className="block">
                <ActionItem icon={FileText} label="Agreements" />
              </Link>
              <button className="block w-full">
                <ActionItem icon={Megaphone} label="Broadcast" />
              </button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="px-6 pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-900 tracking-wide">Recent Activity</h3>
              <button className="text-xs font-bold text-blue-600 active:opacity-70 flex items-center hover:underline">
                View All <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
            
            <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <Link 
                    to="/tenant/1"
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
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

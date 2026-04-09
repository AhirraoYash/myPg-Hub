import { 
  Building, 
  Users, 
  MessageCircle, 
  CreditCard, 
  Crown, 
  Shield, 
  HelpCircle, 
  ChevronRight, 
  LogOut, 
  Phone 
} from 'lucide-react';
import { motion } from 'motion/react';

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function Header() {
  return (
    <header className="px-6 pt-14 pb-4 flex justify-center items-center bg-[#f8f9fa] z-10 sticky top-0">
      <h1 className="text-lg font-extrabold text-gray-900 tracking-tight text-center">
        Settings
      </h1>
    </header>
  );
}

function ProfileHeader() {
  return (
    <div className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 mb-6">
      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
        <img 
          src="https://picsum.photos/seed/kartik/200/200" 
          alt="Kartik Modi" 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer" 
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-extrabold text-gray-900">Kartik Modi</h2>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-blue-100">
            Super Admin
          </span>
        </div>
        <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
          <Phone className="w-3 h-3" /> +91 98765 43210
        </p>
      </div>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
        {title}
      </h3>
      <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}

function SettingsItem({ 
  icon: Icon, 
  label, 
  rightElement, 
  isLast = false 
}: { 
  icon: any, 
  label: string, 
  rightElement?: React.ReactNode, 
  isLast?: boolean 
}) {
  return (
    <div className={`flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer ${!isLast ? 'border-b border-gray-50' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <span className="text-sm font-bold text-gray-800">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightElement}
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function SettingsScreen() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <Header />
      
      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto pb-28 hide-scrollbar bg-[#f8f9fa] px-6 pt-2">
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
        >
          {/* Profile Header */}
          <motion.div variants={itemVariants}>
            <ProfileHeader />
          </motion.div>
          
          {/* Group 1: Property Management */}
          <motion.div variants={itemVariants}>
            <SettingsGroup title="Property Management">
              <SettingsItem icon={Building} label="Manage Properties & Buildings" />
              <SettingsItem icon={Users} label="Staff Roles & Permissions" isLast />
            </SettingsGroup>
          </motion.div>

          {/* Group 2: Integrations & Billing */}
          <motion.div variants={itemVariants}>
            <SettingsGroup title="Integrations & Billing">
              <SettingsItem 
                icon={MessageCircle} 
                label="WhatsApp API Settings" 
                rightElement={
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                    Connected
                  </span>
                } 
              />
              <SettingsItem 
                icon={CreditCard} 
                label="Payment Gateway" 
                rightElement={<span className="text-xs font-semibold text-gray-400">Razorpay</span>} 
              />
              <SettingsItem 
                icon={Crown} 
                label="Subscription Plan" 
                rightElement={<span className="text-xs font-semibold text-amber-500">Pro Tier</span>} 
                isLast 
              />
            </SettingsGroup>
          </motion.div>

          {/* Group 3: General */}
          <motion.div variants={itemVariants}>
            <SettingsGroup title="General">
              <SettingsItem icon={Shield} label="Privacy & Security" />
              <SettingsItem icon={HelpCircle} label="Help & Support" isLast />
            </SettingsGroup>
          </motion.div>

          {/* Footer: Log Out */}
          <motion.div variants={itemVariants} className="mt-8 mb-6 flex justify-center">
            <button className="flex items-center gap-2 text-red-500 font-bold text-sm active:scale-95 transition-transform hover:text-red-600 px-4 py-2 rounded-full hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </motion.div>

        </motion.div>
      </main>
    </>
  );
}

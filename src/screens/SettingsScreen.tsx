import { useState } from 'react';
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
  Phone,
  Edit2,
  X,
  Camera,
  User,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function Header() {
  return (
    <header className="px-6 pt-14 pb-4 flex justify-between items-center bg-[#f8f9fa] z-10 sticky top-0">
      <div className="w-8 h-8"></div> {/* Spacer for centering */}
      <div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight text-center">
          Settings
        </h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5 text-center">App Preferences</p>
      </div>
      <Logo className="w-8 h-8" primaryColor="#3b82f6" secondaryColor="#2563eb" />
    </header>
  );
}

function ProfileHeader({ onClick }: { onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 mb-6 cursor-pointer active:scale-[0.98] transition-transform hover:border-blue-200 group"
    >
      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm shrink-0 relative">
        <img 
          src="https://picsum.photos/seed/kartik/200/200" 
          alt="Kartik Modi" 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2 className="w-4 h-4 text-white" />
        </div>
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
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
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
  isLast = false,
  onClick
}: { 
  icon: any, 
  label: string, 
  rightElement?: React.ReactNode, 
  isLast?: boolean,
  onClick?: () => void
}) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer ${!isLast ? 'border-b border-gray-50' : ''}`}
    >
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

export default function SettingsScreen({ onLogout }: { onLogout?: () => void }) {
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
            <ProfileHeader onClick={() => setIsProfileModalOpen(true)} />
          </motion.div>
          
          {/* Group 1: Property Management */}
          <motion.div variants={itemVariants}>
            <SettingsGroup title="Property Management">
              <SettingsItem 
                icon={Building} 
                label="Manage Properties & Buildings" 
                onClick={() => navigate('/manage-property')}
              />
              <SettingsItem 
                icon={Users} 
                label="Staff Roles & Permissions" 
                onClick={() => navigate('/team')}
                isLast 
              />
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
              <SettingsItem 
                icon={Shield} 
                label="Privacy & Security" 
                onClick={() => navigate('/privacy')}
              />
              <SettingsItem 
                icon={HelpCircle} 
                label="Help & Support" 
                onClick={() => navigate('/support')}
                isLast 
              />
            </SettingsGroup>
          </motion.div>

          {/* Footer: Log Out */}
          <motion.div variants={itemVariants} className="mt-8 mb-6 flex justify-center">
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-red-500 font-bold text-sm active:scale-95 transition-transform hover:text-red-600 px-4 py-2 rounded-full hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </motion.div>

        </motion.div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
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
              className="bg-white w-full sm:w-[400px] rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-extrabold text-gray-900">Edit Profile</h2>
                </div>
                <button onClick={() => setIsProfileModalOpen(false)} className="p-2 bg-gray-50 rounded-full active:scale-95">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
                      <img 
                        src="https://picsum.photos/seed/kartik/200/200" 
                        alt="Kartik Modi" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm active:scale-95 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="text" defaultValue="Kartik Modi" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="email" defaultValue="kartik@mypghub.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

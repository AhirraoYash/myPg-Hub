import { ArrowLeft, Shield, Lock, Key, Eye, FileText, ChevronRight, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

function Header({ onBack }: { onBack: () => void }) {
  return (
    <header className="px-6 pt-14 pb-4 flex items-center bg-[#f8f9fa] z-10 sticky top-0">
      <button 
        onClick={onBack}
        className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform absolute left-6"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>
      <div className="w-full text-center">
        <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
          Privacy & Security
        </h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Account Protection</p>
      </div>
      <div className="absolute right-6">
        <Logo className="w-8 h-8" primaryColor="#3b82f6" secondaryColor="#2563eb" />
      </div>
    </header>
  );
}

function SecurityOption({ icon: Icon, title, description, isLast = false, rightElement }: any) {
  return (
    <div className={`flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer ${!isLast ? 'border-b border-gray-50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <p className="text-xs font-medium text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {rightElement}
        {!rightElement && <ChevronRight className="w-4 h-4 text-gray-300" />}
      </div>
    </div>
  );
}

export default function PrivacySecurityScreen() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fa] relative h-full">
      <Header onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto pb-10 hide-scrollbar px-6 pt-2">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
          
          {/* Account Security */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Account Security</h3>
            <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <SecurityOption 
                icon={Key} 
                title="Change Password" 
                description="Update your account password" 
              />
              <SecurityOption 
                icon={Smartphone} 
                title="Two-Factor Authentication" 
                description="Add an extra layer of security" 
                rightElement={
                  <div className="w-10 h-6 bg-blue-600 rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                }
              />
              <SecurityOption 
                icon={Lock} 
                title="Active Sessions" 
                description="Manage devices logged into your account" 
                isLast
              />
            </div>
          </motion.div>

          {/* Data Privacy */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Data Privacy</h3>
            <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <SecurityOption 
                icon={Eye} 
                title="Profile Visibility" 
                description="Control who can see your details" 
              />
              <SecurityOption 
                icon={Shield} 
                title="Data Sharing" 
                description="Manage how your data is used" 
              />
              <SecurityOption 
                icon={FileText} 
                title="Download My Data" 
                description="Get a copy of your personal data" 
                isLast
              />
            </div>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Legal</h3>
            <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <SecurityOption 
                icon={FileText} 
                title="Privacy Policy" 
                description="Read our privacy commitments" 
              />
              <SecurityOption 
                icon={FileText} 
                title="Terms of Service" 
                description="Read our terms and conditions" 
                isLast
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-4">
            <button className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors active:scale-[0.98] border border-red-100">
              Delete Account
            </button>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

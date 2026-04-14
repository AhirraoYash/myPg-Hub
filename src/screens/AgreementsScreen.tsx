import { useState, useMemo } from 'react';
import { ArrowLeft, FileText, MessageCircle, Plus, FileSignature, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const MOCK_AGREEMENTS = [
  { id: 1, tenant: 'Arjun', room: 'Room 101', dates: '1 Jan 2026 - 31 Dec 2026', status: 'Active' },
  { id: 2, tenant: 'Suresh Verma', room: 'Room 205', dates: '1 May 2026 - 30 Apr 2027', status: 'Pending Signature' },
  { id: 3, tenant: 'Rahul Sharma', room: 'Room 302', dates: '1 Jun 2025 - 31 May 2026', status: 'Expiring Soon' },
  { id: 4, tenant: 'Amit Kumar', room: 'Room 105', dates: '15 Feb 2026 - 14 Feb 2027', status: 'Active' },
  { id: 5, tenant: 'Priya Singh', room: 'Room 201', dates: '10 Mar 2026 - 09 Mar 2027', status: 'Pending Signature' },
];

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

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
        <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
          Rental Agreements
        </h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Manage Contracts</p>
      </div>
    </header>
  );
}

function StatusFilter({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = ['Active', 'Pending Signature', 'Expiring Soon'];
  
  return (
    <div className="px-6 mb-5 mt-2">
      <div className="bg-gray-200/60 p-1 rounded-full flex items-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[10px] sm:text-xs font-bold rounded-full transition-all ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-[0_2px_10px_rgb(0,0,0,0.04)]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

function AgreementCard({ agreement }: { agreement: any }) {
  const isActive = agreement.status === 'Active';
  const isPending = agreement.status === 'Pending Signature';
  const isExpiring = agreement.status === 'Expiring Soon';

  let badgeColor = '';
  if (isActive) badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200/50';
  if (isPending) badgeColor = 'bg-amber-50 text-amber-600 border-amber-200/50';
  if (isExpiring) badgeColor = 'bg-red-50 text-red-600 border-red-200/50';

  return (
    <div className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm">
            {agreement.tenant} <span className="text-gray-400 font-medium text-xs ml-1">• {agreement.room}</span>
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">{agreement.dates}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeColor}`}>
            {agreement.status}
          </span>
        </div>
      </div>
      
      <div className="h-px w-full bg-gray-50"></div>
      
      {isPending ? (
        <button className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
          <MessageCircle className="w-4 h-4" /> Send Reminder
        </button>
      ) : (
        <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
          <FileText className="w-4 h-4" /> View PDF
        </button>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function AgreementsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredAgreements = useMemo(() => {
    return MOCK_AGREEMENTS.filter(agr => agr.status === activeTab);
  }, [activeTab]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <>
      <Header onBack={() => navigate(-1)} />

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center active:scale-95 transition-transform z-30 hover:bg-blue-700"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto pb-28 hide-scrollbar bg-[#f8f9fa]">
        <StatusFilter activeTab={activeTab} setActiveTab={setActiveTab} />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 px-6 pb-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredAgreements.length > 0 ? (
              filteredAgreements.map((agreement) => (
                <motion.div 
                  layout
                  variants={itemVariants} 
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  key={agreement.id}
                >
                  <AgreementCard agreement={agreement} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileSignature className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold">No Agreements Found</h3>
                <p className="text-sm text-gray-500 mt-1">There are no agreements in {activeTab.toLowerCase()} status.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Add Agreement Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
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
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900">New Agreement</h2>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Generate a rental contract</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-gray-50 rounded-full active:scale-95">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Select Tenant</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                    <option value="">Select a tenant...</option>
                    <option value="1">Rahul Verma (Room 101)</option>
                    <option value="2">Amit Kumar (Room 102)</option>
                  </select>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Start Date</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">End Date</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Monthly Rent (₹)</label>
                  <input type="number" placeholder="e.g. 8500" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Generate Agreement
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

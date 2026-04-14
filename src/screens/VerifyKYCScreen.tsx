import { useState, useMemo } from 'react';
import { ArrowLeft, FileText, X, CheckCircle2, XCircle, Image as ImageIcon, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const MOCK_KYC = [
  { id: 1, name: 'Suresh Verma', room: 'Room 101', type: 'Aadhaar Card', date: 'Submitted Today, 09:00 AM', status: 'Pending Review', aadhaar: 'XXXX XXXX 1234' },
  { id: 2, name: 'Neha Gupta', room: 'Room 202', type: 'Aadhaar Card', date: 'Submitted Yesterday', status: 'Pending Review', aadhaar: 'XXXX XXXX 5678' },
  { id: 3, name: 'Rahul Sharma', room: 'Room 102', type: 'Aadhaar Card', date: 'Submitted 2 Days Ago', status: 'Verified', aadhaar: 'XXXX XXXX 9012' },
  { id: 4, name: 'Amit Kumar', room: 'Room 201', type: 'Aadhaar Card', date: 'Submitted 3 Days Ago', status: 'Issues', aadhaar: 'XXXX XXXX 3456' },
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
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
          Tenant Verification
        </h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Review KYC Documents</p>
      </div>
    </header>
  );
}

function StatusFilter({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = ['Pending Review', 'Verified', 'Issues'];
  
  return (
    <div className="px-6 mb-5 mt-2">
      <div className="bg-gray-200/60 p-1 rounded-full flex items-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[11px] font-bold rounded-full transition-all ${
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

function KYCTenantCard({ tenant, onReview }: { tenant: any, onReview: () => void }) {
  return (
    <div className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
          <span className="text-sm font-extrabold text-blue-600">{tenant.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-extrabold text-gray-900 text-sm">{tenant.name}</h3>
          <p className="text-xs font-medium text-gray-500 mt-0.5">{tenant.room}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center border border-gray-100">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs font-bold text-gray-700">{tenant.type}</p>
            <p className="text-[10px] font-medium text-gray-400 mt-0.5">{tenant.date}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onReview}
        className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors active:scale-95"
      >
        Review ID
      </button>
    </div>
  );
}

function VerificationModal({ tenant, onClose }: { tenant: any, onClose: () => void }) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-50 bg-[#f8f9fa] flex flex-col"
    >
      {/* Modal Header */}
      <div className="px-6 pt-14 pb-4 flex justify-between items-center bg-white border-b border-gray-100 shadow-sm shrink-0">
        <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Review Aadhaar</h2>
        <button onClick={onClose} className="p-2 bg-gray-50 rounded-full active:scale-95 transition-transform">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-32 hide-scrollbar">
        {/* Section 1: Info */}
        <div className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">{tenant.name}</h3>
            <p className="text-sm font-bold text-gray-500 mt-0.5">{tenant.aadhaar}</p>
          </div>
        </div>

        {/* Section 2: Images */}
        <div className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4">
          <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">Uploaded ID Image</h3>
          
          <div className="flex flex-col gap-3">
            <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl h-40 flex flex-col items-center justify-center gap-2">
              <ImageIcon className="w-8 h-8 text-gray-300" />
              <span className="text-xs font-bold text-gray-400">Front Side</span>
            </div>
            <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl h-40 flex flex-col items-center justify-center gap-2">
              <ImageIcon className="w-8 h-8 text-gray-300" />
              <span className="text-xs font-bold text-gray-400">Back Side</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-4 pb-8 sm:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex gap-3 z-10">
        <button 
          onClick={onClose}
          className="flex-1 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <XCircle className="w-4 h-4" /> Reject
        </button>
        <button 
          onClick={onClose}
          className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" /> Approve
        </button>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function VerifyKYCScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pending Review');
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null);

  const filteredTenants = useMemo(() => {
    return MOCK_KYC.filter(t => t.status === activeTab);
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

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto pb-10 hide-scrollbar bg-[#f8f9fa]">
        <StatusFilter activeTab={activeTab} setActiveTab={setActiveTab} />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 px-6 pb-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredTenants.length > 0 ? (
              filteredTenants.map((tenant) => (
                <motion.div 
                  layout
                  variants={itemVariants} 
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  key={tenant.id}
                >
                  <KYCTenantCard 
                    tenant={tenant} 
                    onReview={() => setSelectedTenant(tenant)} 
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold">No Records Found</h3>
                <p className="text-sm text-gray-500 mt-1">There are no tenants in {activeTab.toLowerCase()} status.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Full Screen Verification Modal */}
      <AnimatePresence>
        {selectedTenant && (
          <VerificationModal 
            tenant={selectedTenant} 
            onClose={() => setSelectedTenant(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

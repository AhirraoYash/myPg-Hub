import { useState } from 'react';
import { ArrowLeft, Calendar, AlertTriangle, Plus, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

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
        <h1 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent tracking-tight">
          Initiate Move-Out
        </h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Notice & Settlement</p>
      </div>
    </header>
  );
}

function TenantSummaryCard() {
  return (
    <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 border border-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
            <span className="text-lg font-extrabold text-blue-600">R</span>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Rahul Sharma</h2>
            <p className="text-xs font-bold text-gray-500">Room 102 • Bed A</p>
          </div>
        </div>
      </div>
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex justify-between items-center">
        <span className="text-xs font-bold text-emerald-800">Security Deposit Held</span>
        <span className="text-sm font-extrabold text-emerald-600">+₹10,000</span>
      </div>
    </div>
  );
}

function NoticePeriodCard() {
  const [sendNotice, setSendNotice] = useState(true);
  
  return (
    <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 border border-gray-100 flex flex-col gap-5">
      <div>
        <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 block ml-1">Scheduled Exit Date</label>
        <div className="relative">
          <Calendar className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="date" 
            defaultValue="2026-04-30" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-xs font-bold text-gray-700">Send Official WhatsApp Notice</span>
        </div>
        <button 
          onClick={() => setSendNotice(!sendNotice)}
          className={`w-11 h-6 rounded-full transition-colors relative ${sendNotice ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <motion.div 
            layout
            className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm"
            animate={{ left: sendNotice ? '24px' : '4px' }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-amber-800 leading-relaxed">
          Bed will automatically be marked <span className="font-extrabold">Vacant</span> on this date. Access will be revoked.
        </p>
      </div>
    </div>
  );
}

function SettlementCalculator() {
  const [deductions, setDeductions] = useState([
    { id: 1, name: 'Pending Rent (April)', amount: 2500 },
    { id: 2, name: 'Broken Chair (Damage)', amount: 500 }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const securityDeposit = 10000;
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  const finalRefund = securityDeposit - totalDeductions;

  const handleAddDeduction = () => {
    if (newName && newAmount) {
      setDeductions([...deductions, { id: Date.now(), name: newName, amount: Number(newAmount) }]);
      setIsModalOpen(false);
      setNewName('');
      setNewAmount('');
    }
  };

  return (
    <>
      <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 border border-gray-100 flex flex-col gap-4">
        <h3 className="text-sm font-extrabold text-gray-900">Settlement Ledger</h3>
        
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500">Security Deposit</span>
            <span className="text-sm font-extrabold text-emerald-600">+₹{securityDeposit.toLocaleString()}</span>
          </div>
          {deductions.map(deduction => (
            <div key={deduction.id} className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">{deduction.name}</span>
              <span className="text-sm font-extrabold text-red-500">-₹{deduction.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors w-max mt-1 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Deduction
        </button>

        <div className="h-px bg-gray-200 my-2 border-dashed border-t border-gray-300"></div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
          <span className="text-sm font-extrabold text-gray-900">Final Refund Amount</span>
          <span className="text-xl font-black text-gray-900">₹{finalRefund.toLocaleString()}</span>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
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
              className="bg-white w-full sm:w-[400px] rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-extrabold text-gray-900">Add Deduction</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 rounded-full active:scale-95">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Deduction Reason</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Broken Chair" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 500" 
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  />
                </div>
                
                <button 
                  onClick={handleAddDeduction}
                  className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all active:scale-95"
                >
                  Add to Ledger
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 pb-8 sm:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
      <motion.button 
        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all"
      >
        Schedule Move-Out
      </motion.button>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function NoticeAndSettlementScreen() {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative">
      <Header onBack={() => navigate(-1)} />
      
      <main className="flex-1 overflow-y-auto pb-32 hide-scrollbar px-6 pt-2">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5"
        >
          <motion.div variants={itemVariants}>
            <TenantSummaryCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <NoticePeriodCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SettlementCalculator />
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

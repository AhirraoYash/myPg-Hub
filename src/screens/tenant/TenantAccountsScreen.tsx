import { useState } from 'react';
import { ArrowLeft, Download, CheckCircle2, ChevronRight, Zap, Droplets, Wrench, AlertCircle, CreditCard, Smartphone, Building2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function Header() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-4 mb-8">
      <button 
        onClick={() => navigate(-1)}
        className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>
      <div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Payments & Dues</h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Manage your transactions</p>
      </div>
    </div>
  );
}

function CurrentDuesCard({ onPay }: { onPay: () => void }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8 overflow-hidden">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-blue-100 uppercase tracking-wider">
              Total Amount Payable
            </p>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider animate-pulse">
              Due in 2 Days
            </span>
          </div>
          <h3 className="text-4xl font-black text-white mb-6">
            ₹12,450
          </h3>
          
          <motion.button 
            onClick={onPay}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            Pay Now
          </motion.button>
        </div>
      </div>

      {/* Breakdown Toggle */}
      <button 
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">View Breakdown</span>
        <motion.div animate={{ rotate: showBreakdown ? 90 : 0 }}>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>

      {/* Detailed Breakdown */}
      <AnimatePresence>
        {showBreakdown && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-bold">Base Rent</span>
                </div>
                <span className="text-sm font-extrabold text-gray-900">₹10,000</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">Electricity (120 units)</span>
                </div>
                <span className="text-sm font-extrabold text-gray-900">₹1,200</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Droplets className="w-4 h-4" />
                  <span className="text-sm font-bold">Water Charges</span>
                </div>
                <span className="text-sm font-extrabold text-gray-900">₹250</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Wrench className="w-4 h-4" />
                  <span className="text-sm font-bold">Maintenance</span>
                </div>
                <span className="text-sm font-extrabold text-gray-900">₹1,000</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TransactionHistory() {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const transactions = [
    { id: 1, month: 'April 2026 Rent', amount: '12,450', date: 'Due 05 Apr 2026', status: 'pending' },
    { id: 2, month: 'March 2026 Rent', amount: '11,200', date: '05 Mar 2026', status: 'paid' },
    { id: 3, month: 'February 2026 Rent', amount: '10,800', date: '02 Feb 2026', status: 'paid' },
    { id: 4, month: 'January 2026 Rent', amount: '10,500', date: '04 Jan 2026', status: 'paid' },
    { id: 5, month: 'Security Deposit', amount: '20,000', date: '01 Jan 2026', status: 'paid' },
  ];

  const filteredTransactions = transactions.filter(tx => filter === 'all' || tx.status === filter);

  const handleDownload = (id: number) => {
    setDownloadingId(id);
    setTimeout(() => setDownloadingId(null), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-gray-900">Payment History</h3>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          {(['all', 'paid', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md transition-all ${
                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.map((tx, idx) => (
            <motion.div 
              key={tx.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 border border-gray-100 flex items-center justify-between"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-extrabold text-gray-900">{tx.month}</span>
                <span className="text-xs font-bold text-gray-500">{tx.date}</span>
                <div className="flex items-center gap-1 mt-1">
                  {tx.status === 'paid' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Paid</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Pending</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="text-base font-black text-gray-900">₹{tx.amount}</span>
                {tx.status === 'paid' ? (
                  <button 
                    onClick={() => handleDownload(tx.id)}
                    disabled={downloadingId === tx.id}
                    className="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors active:scale-95 disabled:opacity-50"
                  >
                    {downloadingId === tx.id ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    Pay
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function TenantAccountsScreen() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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
    <div className="h-full flex flex-col relative bg-[#f8f9fa] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 pt-14 pb-24 hide-scrollbar">
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="max-w-md mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Header />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CurrentDuesCard onPay={() => setShowPaymentModal(true)} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TransactionHistory />
          </motion.div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 pb-8 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.1)]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-gray-900">Select Payment Method</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button className="flex items-center gap-4 p-4 rounded-[1.25rem] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all group bg-white hover:shadow-md active:scale-[0.98]">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-extrabold text-gray-900">UPI Apps</p>
                    <p className="text-xs font-bold text-gray-500">GPay, PhonePe, Paytm</p>
                  </div>
                </button>

                <button className="flex items-center gap-4 p-4 rounded-[1.25rem] border border-gray-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all group bg-white hover:shadow-md active:scale-[0.98]">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-extrabold text-gray-900">Credit / Debit Card</p>
                    <p className="text-xs font-bold text-gray-500">Visa, Mastercard, RuPay</p>
                  </div>
                </button>

                <button className="flex items-center gap-4 p-4 rounded-[1.25rem] border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group bg-white hover:shadow-md active:scale-[0.98]">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-extrabold text-gray-900">Net Banking</p>
                    <p className="text-xs font-bold text-gray-500">All Indian Banks</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

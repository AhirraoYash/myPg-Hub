import {
  ArrowLeft,
  MoreVertical,
  Phone,
  MessageCircle,
  IndianRupee,
  CheckCircle2,
  Send,
  ReceiptText
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function TenantProfileScreen() {
  const navigate = useNavigate();

  // Hardcoded sample data for transaction history
  const transactions = [
    {
      id: 1,
      title: 'May Rent & Electricity',
      amount: '₹8,500',
      status: 'Unpaid',
      statusColor: 'bg-red-50 text-red-600 border-red-100',
      isPaid: false
    },
    {
      id: 2,
      title: 'April Rent',
      amount: '₹8,000',
      status: 'Paid on 5 Apr',
      statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      isPaid: true
    },
    {
      id: 3,
      title: 'Security Deposit',
      amount: '₹15,000',
      status: 'Paid on 1 Jan',
      statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      isPaid: true
    }
  ];

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
    <>
      {/* Header */}
      <header className="px-6 pt-14 pb-4 flex justify-between items-center bg-[#f8f9fa] z-10 sticky top-0">
        <button 
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">
          Tenant Details
        </h1>
        <button className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform">
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-10 hide-scrollbar">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          
          {/* Profile Summary Card */}
          <motion.div variants={itemVariants} className="px-6 pt-2">
            <div className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ring-4 ring-gray-50 shrink-0">
                  <img 
                    src="https://i.pravatar.cc/150?img=12" 
                    alt="Rahul Sharma" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Rahul Sharma</h2>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Room 201 • Bed A</p>
                  <p className="text-sm text-gray-600 font-semibold flex items-center gap-1.5 mt-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> +91 98765 43210
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 py-2 rounded-full text-xs font-bold border border-emerald-100/50">
                <CheckCircle2 className="w-4 h-4" /> Aadhaar KYC Verified
              </div>
            </div>
          </motion.div>

          {/* Quick Contact Row */}
          <motion.div variants={itemVariants} className="px-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3.5 rounded-[1rem] font-bold text-sm active:scale-95 transition-all">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
            <button className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-3.5 rounded-[1rem] font-bold text-sm active:scale-95 transition-all">
              <Phone className="w-4 h-4" /> Call
            </button>
          </motion.div>

          {/* Financial Overview (Billing Section) */}
          <motion.div variants={itemVariants} className="px-6 pb-6">
            <h3 className="text-lg font-extrabold text-gray-900 mb-4 tracking-tight">Billing & Payments</h3>
            
            {/* Pending Dues Card */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 relative overflow-hidden mb-5 group">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-red-100 rounded-full flex items-center justify-center opacity-40 transition-transform group-hover:scale-110">
                <IndianRupee className="w-16 h-16 text-red-200 absolute bottom-8 left-8" />
              </div>
              
              <div className="relative z-10">
                <p className="text-red-800/70 text-xs font-bold mb-1 uppercase tracking-wider">Total Pending Dues</p>
                <h2 className="text-4xl font-extrabold text-red-600 mb-5 tracking-tight">₹8,500</h2>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgb(37,99,235,0.25)] active:scale-95 transition-all">
                  <Send className="w-4 h-4" /> Send Payment Link
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              {transactions.map((tx, index) => (
                <div 
                  key={tx.id} 
                  className={`p-4 active:bg-gray-50 transition-colors flex items-center justify-between gap-4 ${
                    index !== transactions.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.isPaid ? 'bg-gray-50' : 'bg-red-50'}`}>
                      <ReceiptText className={`w-4 h-4 ${tx.isPaid ? 'text-gray-400' : 'text-red-400'}`} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{tx.title}</p>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold mt-1 border ${tx.statusColor}`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-gray-900">{tx.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </main>
    </>
  );
}

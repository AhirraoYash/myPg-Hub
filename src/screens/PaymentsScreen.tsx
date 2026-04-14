import { useState, useMemo } from 'react';
import { Filter, MessageCircle, Receipt, Search, Download, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const MOCK_INVOICES = [
  { id: 1, tenant: 'Rahul Sharma', room: 'Room 102', month: 'May 2026 Rent', amount: '₹8,500', status: 'Pending' },
  { id: 2, tenant: 'Amit Kumar', room: 'Room 201', month: 'May 2026 Rent', amount: '₹7,000', status: 'Overdue' },
  { id: 3, tenant: 'Priya Singh', room: 'Room 305', month: 'May 2026 Rent', amount: '₹9,500', status: 'Pending' },
  { id: 4, tenant: 'Vikram Singh', room: 'Room 105', month: 'May 2026 Rent', amount: '₹9,000', status: 'Paid' },
  { id: 5, tenant: 'Suraj Patel', room: 'Room 304', month: 'April 2026 Rent', amount: '₹8,500', status: 'Paid' },
  { id: 6, tenant: 'Neha Gupta', room: 'Room 202', month: 'April 2026 Rent', amount: '₹12,000', status: 'Paid' },
];

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function Header() {
  return (
    <header className="px-6 pt-14 pb-2 flex justify-between items-center bg-[#f8f9fa] z-10 sticky top-0">
      <button className="relative active:scale-95 transition-transform p-2 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 flex items-center justify-center w-10 h-10">
        <Download className="w-5 h-5 text-gray-700" />
      </button>
      
      <div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight text-center">
          Payments & Billing
        </h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5 text-center">Track Revenue</p>
      </div>
      
      <button className="relative active:scale-95 transition-transform p-2 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 flex items-center justify-center w-10 h-10">
        <Filter className="w-5 h-5 text-gray-700" />
      </button>
    </header>
  );
}

function MonthSelector() {
  return (
    <div className="px-6 py-3 flex justify-between items-center bg-[#f8f9fa] z-10 sticky top-[72px]">
      <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full transition-colors active:scale-95">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="font-bold text-gray-800 text-sm tracking-wide">May 2026</span>
      <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full transition-colors active:scale-95">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function FinancialSummary() {
  return (
    <div className="px-6 grid grid-cols-2 gap-3 mb-5 pt-2">
      {/* Card 1: Total Pending */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100/50 relative overflow-hidden">
        <p className="text-red-800/70 text-[10px] font-bold mb-1 uppercase tracking-wider">Total Pending</p>
        <h2 className="text-2xl font-extrabold text-red-600 mb-1 tracking-tight">₹24,500</h2>
        <p className="text-red-500/80 text-[10px] font-bold">12 Invoices</p>
      </div>
      
      {/* Card 2: Collected This Month */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100/50 relative overflow-hidden">
        <p className="text-emerald-800/70 text-[10px] font-bold mb-1 uppercase tracking-wider">Collected This Month</p>
        <h2 className="text-2xl font-extrabold text-emerald-600 mb-1 tracking-tight">₹1.45L</h2>
        <p className="text-emerald-500/80 text-[10px] font-bold">45 Invoices</p>
      </div>
    </div>
  );
}

function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (q: string) => void }) {
  return (
    <div className="px-6 mb-4">
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search tenant or room..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] placeholder:text-gray-400 placeholder:font-medium"
        />
      </div>
    </div>
  );
}

function FilterTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = ['Pending', 'Paid', 'Overdue'];
  
  return (
    <div className="px-6 mb-4">
      <div className="bg-gray-200/60 p-1 rounded-full flex items-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all ${
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

function InvoiceCard({ invoice }: { invoice: any }) {
  const isPending = invoice.status === 'Pending';
  const isOverdue = invoice.status === 'Overdue';
  const isPaid = invoice.status === 'Paid';

  let badgeColor = '';
  if (isPending) badgeColor = 'bg-amber-50 text-amber-600 border-amber-200/50';
  if (isOverdue) badgeColor = 'bg-red-50 text-red-600 border-red-200/50';
  if (isPaid) badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200/50';

  return (
    <div className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm">
            {invoice.tenant} <span className="text-gray-400 font-medium text-xs ml-1">• {invoice.room}</span>
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">{invoice.month}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="font-extrabold text-gray-900">{invoice.amount}</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeColor}`}>
            {invoice.status}
          </span>
        </div>
      </div>
      
      <div className="h-px w-full bg-gray-50"></div>
      
      {(isPending || isOverdue) ? (
        <button className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
          <MessageCircle className="w-4 h-4" /> Send WhatsApp Reminder
        </button>
      ) : (
        <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
          <Receipt className="w-4 h-4" /> View Receipt
        </button>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function PaymentsScreen() {
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Optimized filtering logic using useMemo
  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter(inv => {
      const matchesTab = inv.status === activeTab;
      const matchesSearch = inv.tenant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            inv.room.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

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
      <Header />
      <MonthSelector />

      {/* Floating Action Button */}
      <Link 
        to="/record-payment"
        className="absolute bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center active:scale-95 transition-transform z-30 hover:bg-blue-700"
      >
        <Plus className="w-6 h-6" />
      </Link>

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto pb-28 hide-scrollbar bg-[#f8f9fa]">
        <FinancialSummary />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Bulk Action Button (Only for Pending/Overdue) */}
        <AnimatePresence>
          {(activeTab === 'Pending' || activeTab === 'Overdue') && filteredInvoices.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 mb-4 flex justify-end"
            >
              <button className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-emerald-100 transition-colors active:scale-95 shadow-sm">
                <MessageCircle className="w-3.5 h-3.5" /> Remind All ({filteredInvoices.length})
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 px-6 pb-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <motion.div 
                  layout
                  variants={itemVariants} 
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  key={invoice.id}
                >
                  <InvoiceCard invoice={invoice} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold">No Invoices Found</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {searchQuery ? `No results for "${searchQuery}"` : `There are no ${activeTab.toLowerCase()} invoices.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </>
  );
}

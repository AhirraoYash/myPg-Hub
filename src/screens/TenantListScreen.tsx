import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Filter, ChevronRight, User, Clock, AlertTriangle, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const MOCK_TENANTS = [
  { id: '1', name: 'Rahul Verma', room: 'Room 101', status: 'Active', rentStatus: 'Paid', joinDate: '12 Jan 2026' },
  { id: '2', name: 'Amit Kumar', room: 'Room 102', status: 'Notice', rentStatus: 'Pending', joinDate: '05 Feb 2026', noticeDate: '30 Apr 2026', pendingAmount: '₹8,500' },
  { id: '3', name: 'Vikram S.', room: 'Room 201', status: 'Active', rentStatus: 'Paid', joinDate: '10 Dec 2025' },
  { id: '4', name: 'Suraj M.', room: 'Room 201', status: 'Notice', rentStatus: 'Paid', joinDate: '15 Nov 2025', noticeDate: '15 May 2026' },
  { id: '5', name: 'Karan D.', room: 'Room 203', status: 'Active', rentStatus: 'Pending', joinDate: '20 Jan 2026', pendingAmount: '₹9,000' },
  { id: '6', name: 'Raj Singh', room: 'Room 102', status: 'Active', rentStatus: 'Paid', joinDate: '01 Mar 2026' },
];

const FILTERS = ['All', 'Active', 'Notice', 'Pending Rent'];

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
      <h1 className="text-lg font-extrabold text-gray-900 tracking-tight w-full text-center">
        Tenants Directory
      </h1>
    </header>
  );
}

function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (q: string) => void }) {
  return (
    <div className="px-6 mb-4">
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or room..." 
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-12 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StatusFilter({ activeFilter, onSelectFilter }: { activeFilter: string, onSelectFilter: (f: string) => void }) {
  return (
    <div className="px-6 pb-2 overflow-x-auto hide-scrollbar flex gap-2 bg-[#f8f9fa] sticky top-[80px] z-10 relative">
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#f8f9fa] to-transparent pointer-events-none z-10"></div>
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onSelectFilter(filter)}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
            activeFilter === filter
              ? 'bg-blue-600 text-white shadow-[0_4px_15px_rgb(37,99,235,0.25)]'
              : 'bg-white text-gray-600 shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-100 hover:bg-gray-50'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

function TenantCard({ tenant }: { tenant: any }) {
  const isNotice = tenant.status === 'Notice';
  const isPendingRent = tenant.rentStatus === 'Pending';

  return (
    <Link to={`/tenant/${tenant.id}`} className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-3 active:scale-[0.98] transition-transform group hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(37,99,235,0.08)] block">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-100 transition-colors">
            <span className="text-sm font-extrabold text-blue-600">{tenant.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm">{tenant.name}</h3>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{tenant.room}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-1">
        {isNotice ? (
          <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Leaving On</p>
              <p className="text-xs font-bold text-amber-900">{tenant.noticeDate}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Joined</p>
              <p className="text-xs font-bold text-gray-700">{tenant.joinDate}</p>
            </div>
          </div>
        )}

        {isPendingRent ? (
          <div className="bg-red-50 rounded-xl p-2.5 border border-red-100 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-red-500 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-red-600 uppercase tracking-wider">Due</p>
              <p className="text-xs font-bold text-red-900">{tenant.pendingAmount}</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Rent</p>
              <p className="text-xs font-bold text-emerald-900">Paid</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function TenantListScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';
  
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  // Update filter if URL changes
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && FILTERS.includes(filterParam)) {
      setActiveFilter(filterParam);
    }
  }, [searchParams]);

  const filteredTenants = useMemo(() => {
    return MOCK_TENANTS.filter(tenant => {
      // Status Filter
      if (activeFilter === 'Notice' && tenant.status !== 'Notice') return false;
      if (activeFilter === 'Active' && tenant.status !== 'Active') return false;
      if (activeFilter === 'Pending Rent' && tenant.rentStatus !== 'Pending') return false;

      // Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return tenant.name.toLowerCase().includes(query) || tenant.room.toLowerCase().includes(query);
      }

      return true;
    });
  }, [activeFilter, searchQuery]);

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
      
      <main className="flex-1 overflow-y-auto pb-10 hide-scrollbar bg-[#f8f9fa]">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <StatusFilter activeFilter={activeFilter} onSelectFilter={setActiveFilter} />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 px-6 pt-4 pb-6"
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
                  <TenantCard tenant={tenant} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold">No Tenants Found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </>
  );
}

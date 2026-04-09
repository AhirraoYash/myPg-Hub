import { useState, useMemo } from 'react';
import { Bell, User, Plus, Users, Search, MoreVertical, Wrench, Filter, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const MOCK_DATA = [
  {
    id: 'ground',
    title: 'GROUND FLOOR',
    stats: { total: 5, occupied: 3, vacant: 2 },
    rooms: [
      {
        id: '101',
        number: 'Room 101',
        type: '2-Seater',
        price: '₹8,500/mo',
        beds: [
          { id: '101A', status: 'occupied', tenant: 'Rahul Verma', joinDate: 'Jan 2026' },
          { id: '101B', status: 'vacant' }
        ]
      },
      {
        id: '102',
        number: 'Room 102',
        type: '3-Seater',
        price: '₹7,000/mo',
        beds: [
          { id: '102A', status: 'occupied', tenant: 'Amit Kumar', joinDate: 'Feb 2026' },
          { id: '102B', status: 'occupied', tenant: 'Raj Singh', joinDate: 'Mar 2026' },
          { id: '102C', status: 'vacant' }
        ]
      }
    ]
  },
  {
    id: 'first',
    title: '1ST FLOOR',
    stats: { total: 5, occupied: 4, maintenance: 1 },
    rooms: [
      {
        id: '201',
        number: 'Room 201',
        type: '2-Seater',
        price: '₹9,000/mo',
        beds: [
          { id: '201A', status: 'occupied', tenant: 'Vikram S.', joinDate: 'Dec 2025' },
          { id: '201B', status: 'occupied', tenant: 'Suraj M.', joinDate: 'Nov 2025' }
        ]
      },
      {
        id: '202',
        number: 'Room 202',
        type: '1-Seater',
        price: '₹12,000/mo',
        beds: [
          { id: '202A', status: 'vacant' }
        ]
      },
      {
        id: '203',
        number: 'Room 203',
        type: '2-Seater',
        price: '₹9,000/mo',
        beds: [
          { id: '203A', status: 'occupied', tenant: 'Karan D.', joinDate: 'Jan 2026' },
          { id: '203B', status: 'maintenance', issue: 'AC Repair' }
        ]
      }
    ]
  }
];

const FILTERS = ['All', 'Ground Floor', '1st Floor', '2nd Floor'];

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function Header() {
  return (
    <header className="px-6 pt-14 pb-4 flex justify-between items-center bg-[#f8f9fa] z-10 sticky top-0">
      <div className="w-10 h-10"></div>
      <h1 className="text-lg font-extrabold text-gray-900 tracking-tight text-center">
        Property Layout
      </h1>
      <button className="relative active:scale-95 transition-transform p-2 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 flex items-center justify-center w-10 h-10">
        <Bell className="w-5 h-5 text-gray-700" />
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
    </header>
  );
}

function PropertyOverview() {
  return (
    <div className="px-6 mb-5">
      <div className="bg-gray-900 rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex justify-between items-end relative z-10">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Capacity</p>
            <div className="flex items-baseline gap-1">
              <h2 className="text-3xl font-extrabold tracking-tight">50</h2>
              <span className="text-gray-400 text-sm font-medium">beds</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex flex-col items-end gap-1.5 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52,211,153,0.5)]"></span>
                <span className="text-emerald-50">6 Vacant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgb(248,113,113,0.5)]"></span>
                <span className="text-red-50">2 Maint.</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-5 h-2 bg-gray-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-blue-500" style={{ width: '84%' }}></div>
          <div className="h-full bg-emerald-400" style={{ width: '12%' }}></div>
          <div className="h-full bg-red-400" style={{ width: '4%' }}></div>
        </div>
      </div>
    </div>
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
          placeholder="Search rooms or tenants..." 
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-12 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function FloorFilter({ activeFilter, onSelectFilter }: { activeFilter: string, onSelectFilter: (f: string) => void }) {
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

function BedItem({ bed }: { bed: any }) {
  if (bed.status === 'vacant') {
    return (
      <Link to="/add-tenant" className="bg-emerald-50/40 border border-dashed border-emerald-200 rounded-xl p-3 flex items-center justify-between active:scale-[0.98] transition-transform hover:bg-emerald-50 group">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4 text-emerald-600" strokeWidth={3} />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 block">Available Bed</span>
            <span className="text-[10px] font-semibold text-emerald-600/70 uppercase tracking-wider">Ready to occupy</span>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-emerald-100 text-[10px] font-bold text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          Add Tenant
        </div>
      </Link>
    );
  }

  if (bed.status === 'maintenance') {
    return (
      <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 flex items-center justify-between opacity-90">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <span className="text-xs font-bold text-red-700 block">Under Maintenance</span>
            <span className="text-[10px] font-semibold text-red-600/70 uppercase tracking-wider">{bed.issue || 'Fixing'}</span>
          </div>
        </div>
        <button className="text-[10px] font-bold text-red-600 hover:underline">
          Resolve
        </button>
      </div>
    );
  }

  // Occupied
  return (
    <Link to="/tenant/1" className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between active:scale-[0.98] transition-all hover:border-blue-200 hover:shadow-[0_4px_15px_rgb(37,99,235,0.08)] group shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors border border-blue-100">
          <span className="text-xs font-extrabold text-blue-600">{bed.tenant.charAt(0)}</span>
        </div>
        <div>
          <span className="text-xs font-bold text-gray-900 block">{bed.tenant}</span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Since {bed.joinDate}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
    </Link>
  );
}

function RoomCard({ room }: { room: any }) {
  const occupiedCount = room.beds.filter((b: any) => b.status === 'occupied').length;
  const totalBeds = room.beds.length;
  const isFull = occupiedCount === totalBeds;

  return (
    <div className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-extrabold text-gray-900">{room.number}</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-wider">
              {room.type}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <span>{room.price}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className={`${isFull ? 'text-emerald-600' : 'text-amber-600'}`}>
              {occupiedCount}/{totalBeds} Filled
            </span>
          </div>
        </div>
        <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors active:scale-95">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex flex-col gap-2">
        {room.beds.map((bed: any) => (
          <BedItem key={bed.id} bed={bed} />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function RoomsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredData = useMemo(() => {
    return MOCK_DATA.map(floor => {
      // Floor filter
      if (activeFilter !== 'All' && 
          !(activeFilter === 'Ground Floor' && floor.id === 'ground') &&
          !(activeFilter === '1st Floor' && floor.id === 'first')) {
        return null;
      }

      // Search filter
      const filteredRooms = floor.rooms.filter(room => {
        const matchesRoom = room.number.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTenant = room.beds.some(bed => bed.tenant?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesRoom || matchesTenant;
      });

      if (filteredRooms.length === 0) return null;

      return { ...floor, rooms: filteredRooms };
    }).filter(Boolean);
  }, [activeFilter, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      
      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto pb-28 hide-scrollbar bg-[#f8f9fa]">
        <PropertyOverview />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FloorFilter activeFilter={activeFilter} onSelectFilter={setActiveFilter} />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6 px-6 pt-4 pb-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredData.length > 0 ? (
              filteredData.map((floor: any) => (
                <motion.div 
                  layout
                  variants={itemVariants} 
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  key={floor.id} 
                  className="flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center ml-1">
                    <h2 className="text-[11px] font-extrabold text-gray-400 tracking-widest uppercase">
                      {floor.title}
                    </h2>
                    <span className="text-[10px] font-bold text-gray-400">
                      {floor.rooms.length} Rooms
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {floor.rooms.map((room: any) => (
                      <RoomCard key={room.id} room={room} />
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold">No Results Found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Floating Action Button */}
      <button className="absolute bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center active:scale-95 transition-transform z-30 hover:bg-blue-700">
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
}

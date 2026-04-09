import { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Building, 
  DoorOpen, 
  User, 
  IndianRupee, 
  Banknote, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

type Tenant = { id: string; name: string; pending: number; month: string };
type RoomData = Record<string, Tenant[]>;
type FloorData = Record<string, RoomData>;

const MOCK_DATA: FloorData = {
  'Ground Floor': {
    'Room 101': [
      { id: 't1', name: 'Rahul Sharma', pending: 8500, month: 'May 2026 Rent' },
      { id: 't2', name: 'Suresh Verma', pending: 0, month: 'May 2026 Rent' }
    ],
    'Room 102': [
      { id: 't3', name: 'Amit Kumar', pending: 7000, month: 'May 2026 Rent' }
    ]
  },
  '1st Floor': {
    'Room 201': [
      { id: 't4', name: 'Vikram Singh', pending: 9000, month: 'May 2026 Rent' }
    ],
    'Room 202': [
      { id: 't5', name: 'Priya Singh', pending: 9500, month: 'May 2026 Rent' }
    ]
  }
};

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
        Record Payment
      </h1>
    </header>
  );
}

function CardContainer({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4">
      <h2 className="text-sm font-extrabold text-gray-900 tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function SelectField({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  options, 
  placeholder,
  disabled = false
}: { 
  label: string; 
  icon: any; 
  value: string; 
  onChange: (val: string) => void; 
  options: { label: string; value: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
      <div className="relative flex items-center">
        <div className={`absolute left-3.5 ${disabled ? 'text-gray-300' : 'text-gray-400'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm font-semibold outline-none transition-all appearance-none cursor-pointer
            ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}
          `}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className={`absolute right-3.5 pointer-events-none ${disabled ? 'text-gray-300' : 'text-gray-400'}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

function PendingAmountCard({ tenant }: { tenant: Tenant }) {
  const hasDues = tenant.pending > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border relative overflow-hidden ${
        hasDues ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-100' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100'
      }`}
    >
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full flex items-center justify-center opacity-40 ${
        hasDues ? 'bg-red-100' : 'bg-emerald-100'
      }`}>
        {hasDues ? (
          <IndianRupee className={`w-12 h-12 absolute bottom-6 left-6 ${hasDues ? 'text-red-200' : 'text-emerald-200'}`} />
        ) : (
          <CheckCircle2 className="w-12 h-12 text-emerald-200 absolute bottom-6 left-6" />
        )}
      </div>
      
      <div className="relative z-10">
        <p className={`text-xs font-bold mb-1 uppercase tracking-wider ${hasDues ? 'text-red-800/70' : 'text-emerald-800/70'}`}>
          {hasDues ? 'Pending Amount' : 'No Pending Dues'}
        </p>
        <h2 className={`text-3xl font-extrabold mb-2 tracking-tight ${hasDues ? 'text-red-600' : 'text-emerald-600'}`}>
          ₹{tenant.pending.toLocaleString()}
        </h2>
        <p className={`text-xs font-bold ${hasDues ? 'text-red-500/80' : 'text-emerald-500/80'}`}>
          For {tenant.month}
        </p>
      </div>
    </motion.div>
  );
}

function BottomFooter({ disabled, amount }: { disabled: boolean, amount: number }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-4 pb-8 sm:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
      <button 
        disabled={disabled}
        className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          disabled 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_20px_rgb(37,99,235,0.25)] active:scale-95'
        }`}
      >
        <CheckCircle2 className="w-5 h-5" />
        Confirm Cash Payment {amount > 0 ? `(₹${amount.toLocaleString()})` : ''}
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function RecordPaymentScreen() {
  const navigate = useNavigate();

  // Form State
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [tenantId, setTenantId] = useState('');

  // Derived Data (Optimized with useMemo)
  const floors = useMemo(() => Object.keys(MOCK_DATA).map(f => ({ label: f, value: f })), []);
  
  const rooms = useMemo(() => {
    if (!floor) return [];
    return Object.keys(MOCK_DATA[floor] || {}).map(r => ({ label: r, value: r }));
  }, [floor]);

  const tenants = useMemo(() => {
    if (!floor || !room) return [];
    return (MOCK_DATA[floor][room] || []).map(t => ({ label: t.name, value: t.id }));
  }, [floor, room]);

  const selectedTenant = useMemo(() => {
    if (!floor || !room || !tenantId) return null;
    return MOCK_DATA[floor][room].find(t => t.id === tenantId) || null;
  }, [floor, room, tenantId]);

  // Handlers to reset dependent fields
  const handleFloorChange = (val: string) => {
    setFloor(val);
    setRoom('');
    setTenantId('');
  };

  const handleRoomChange = (val: string) => {
    setRoom(val);
    setTenantId('');
  };

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
      <Header onBack={() => navigate(-1)} />

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto pb-32 hide-scrollbar bg-[#f8f9fa]">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5 px-6 pt-4 pb-6"
        >
          {/* Selection Form */}
          <motion.div variants={itemVariants}>
            <CardContainer title="Select Tenant">
              <SelectField 
                label="Floor" 
                icon={Building} 
                placeholder="Select Floor"
                options={floors}
                value={floor}
                onChange={handleFloorChange}
              />
              <SelectField 
                label="Room" 
                icon={DoorOpen} 
                placeholder="Select Room"
                options={rooms}
                value={room}
                onChange={handleRoomChange}
                disabled={!floor}
              />
              <SelectField 
                label="Tenant" 
                icon={User} 
                placeholder="Select Tenant"
                options={tenants}
                value={tenantId}
                onChange={setTenantId}
                disabled={!room}
              />
            </CardContainer>
          </motion.div>

          {/* Pending Amount Display */}
          <AnimatePresence mode="wait">
            {selectedTenant && (
              <motion.div key="pending-amount" variants={itemVariants}>
                <PendingAmountCard tenant={selectedTenant} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Method (Fixed to Cash as requested) */}
          <AnimatePresence mode="wait">
            {selectedTenant && selectedTenant.pending > 0 && (
              <motion.div key="payment-method" variants={itemVariants}>
                <CardContainer title="Payment Method">
                  <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-blue-500 bg-blue-50/50 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Banknote className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-blue-900 text-sm">Cash Payment</h3>
                      <p className="text-xs font-bold text-blue-600/70 mt-0.5">Handed over in person</p>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContainer>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </main>

      <BottomFooter 
        disabled={!selectedTenant || selectedTenant.pending === 0} 
        amount={selectedTenant?.pending || 0} 
      />
    </>
  );
}

import { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  ChevronDown,
  Utensils,
  Snowflake,
  Shirt,
  CloudUpload,
  IndianRupee,
  User
} from 'lucide-react';
import { motion } from 'motion/react';
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
      <h1 className="text-lg font-extrabold text-gray-900 tracking-tight w-full text-center">
        Add New Tenant
      </h1>
    </header>
  );
}

function SegmentToggle() {
  return (
    <div className="px-6 pt-2 pb-4">
      <div className="bg-gray-200/60 p-1 rounded-full flex items-center">
        <button className="flex-1 py-2.5 text-sm font-bold text-gray-500 rounded-full transition-all">
          Share QR
        </button>
        <button className="flex-1 py-2.5 text-sm font-bold text-gray-900 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.04)] transition-all">
          Manual Form
        </button>
      </div>
    </div>
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

function InputField({ label, placeholder, icon: Icon, defaultValue }: { label: string, placeholder: string, icon?: any, defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input 
          type="text" 
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, placeholder }: { label: string, placeholder: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
      <div className="relative flex items-center">
        <select 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled hidden>{placeholder}</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </select>
        <div className="absolute right-3.5 text-gray-400 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

function FacilityToggle({ icon: Icon, label, isActive: initialActive = false }: { icon: any, label: string, isActive?: boolean }) {
  const [isActive, setIsActive] = useState(initialActive);
  
  return (
    <button 
      onClick={() => setIsActive(!isActive)}
      className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border active:scale-95 transition-all ${
        isActive 
          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-[0_4px_15px_rgb(37,99,235,0.08)]' 
          : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-[11px] font-bold tracking-tight">{label}</span>
    </button>
  );
}

// ----------------------------------------------------------------------
// Section Components
// ----------------------------------------------------------------------

function PersonalDetailsCard() {
  return (
    <CardContainer title="Personal Details">
      <InputField label="Full Name" placeholder="e.g. Rahul Sharma" icon={User} />
      <InputField label="Phone Number" placeholder="+91 00000 00000" icon={Phone} />
      <InputField label="Emergency Contact" placeholder="+91 00000 00000" icon={Phone} />
    </CardContainer>
  );
}

function RoomDetailsCard() {
  return (
    <CardContainer title="Room & PG Details">
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Floor" placeholder="1st Floor" />
        <SelectField label="Room" placeholder="Room 102" />
      </div>
      <SelectField label="Select Bed" placeholder="Bed B" />
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Monthly Rent" placeholder="₹8,500" defaultValue="₹8,500" icon={IndianRupee} />
        <InputField label="Security Deposit" placeholder="₹10,000" defaultValue="₹10,000" icon={IndianRupee} />
      </div>
    </CardContainer>
  );
}

function FacilitiesCard() {
  return (
    <CardContainer title="Facilities Included">
      <div className="grid grid-cols-3 gap-3">
        <FacilityToggle icon={Utensils} label="Food / Mess" isActive={true} />
        <FacilityToggle icon={Snowflake} label="AC" isActive={true} />
        <FacilityToggle icon={Shirt} label="Laundry" />
      </div>
    </CardContainer>
  );
}

function KYCCard() {
  return (
    <CardContainer title="KYC & Documents">
      <InputField label="Aadhaar / ID Number" placeholder="XXXX XXXX XXXX" />
      
      <div className="mt-2">
        <label className="text-xs font-bold text-gray-500 ml-1 mb-1.5 block">Document Upload</label>
        <button className="w-full border-dashed border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-all group">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CloudUpload className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs font-bold text-blue-700">Tap to upload ID (Front & Back)</span>
        </button>
      </div>
    </CardContainer>
  );
}

function BottomFooter() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-4 pb-8 sm:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center shadow-[0_4px_20px_rgb(37,99,235,0.25)] active:scale-95 transition-all">
        Save & Onboard Tenant
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function AddTenantScreen() {
  const navigate = useNavigate();

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
      <SegmentToggle />

      {/* Main Scrollable Form Area */}
      <main className="flex-1 overflow-y-auto pb-32 hide-scrollbar">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5 px-6 pb-6"
        >
          <motion.div variants={itemVariants}>
            <PersonalDetailsCard />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <RoomDetailsCard />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <FacilitiesCard />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <KYCCard />
          </motion.div>
        </motion.div>
      </main>

      <BottomFooter />
    </>
  );
}

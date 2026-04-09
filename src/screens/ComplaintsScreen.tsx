import { useState, useMemo } from 'react';
import { ArrowLeft, Droplet, Zap, Wifi, Wrench, Clock, X, Image as ImageIcon, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const MOCK_COMPLAINTS = [
  { 
    id: 1, 
    title: 'Leaking Tap in Bathroom', 
    category: 'Plumbing', 
    tenant: 'Sonia', 
    room: 'Room 203', 
    time: 'Today, 10:30 AM', 
    status: 'Open',
    urgency: 'High',
    description: 'The tap in the attached bathroom is leaking continuously since last night. It is wasting a lot of water and making noise.',
    photo: 'https://picsum.photos/seed/tap/400/300'
  },
  { 
    id: 2, 
    title: 'AC Not Cooling', 
    category: 'Electricity', 
    tenant: 'Rahul', 
    room: 'Room 102', 
    time: 'Yesterday, 4:15 PM', 
    status: 'In Progress',
    urgency: 'Medium',
    description: 'The AC turns on but only blows warm air. The compressor seems to be making a weird clicking sound.',
    photo: null
  },
  { 
    id: 3, 
    title: 'WiFi Disconnecting', 
    category: 'WiFi', 
    tenant: 'Amit', 
    room: 'Room 201', 
    time: 'Today, 09:00 AM', 
    status: 'Open',
    urgency: 'Low',
    description: 'The WiFi keeps dropping every 10 minutes. I have an online exam tomorrow, please fix this ASAP.',
    photo: null
  },
  { 
    id: 4, 
    title: 'Broken Door Handle', 
    category: 'Maintenance', 
    tenant: 'Priya', 
    room: 'Room 305', 
    time: '2 Days Ago', 
    status: 'Resolved',
    urgency: 'Medium',
    description: 'The main door handle is loose and might come off completely.',
    photo: 'https://picsum.photos/seed/door/400/300',
    remark: 'Replaced the handle with a new brass one.'
  },
  { 
    id: 5, 
    title: 'No Hot Water', 
    category: 'Plumbing', 
    tenant: 'Vikram', 
    room: 'Room 105', 
    time: '3 Days Ago', 
    status: 'Resolved',
    urgency: 'High',
    description: 'Geyser is not turning on at all. No indicator light.',
    photo: null,
    remark: 'Electrician fixed the blown fuse in the geyser plug.'
  },
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
      <h1 className="text-lg font-extrabold text-gray-900 tracking-tight w-full text-center">
        Complaints & Issues
      </h1>
    </header>
  );
}

function StatusFilter({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = ['Open', 'In Progress', 'Resolved'];
  
  return (
    <div className="px-6 mb-5 mt-2">
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

function ComplaintCard({ complaint, onSelect }: { complaint: any, onSelect: () => void }) {
  // Determine Category Icon & Colors
  let Icon = Wrench;
  let iconBg = 'bg-gray-100';
  let iconColor = 'text-gray-600';

  if (complaint.category === 'Plumbing') {
    Icon = Droplet;
    iconBg = 'bg-blue-50';
    iconColor = 'text-blue-500';
  } else if (complaint.category === 'Electricity') {
    Icon = Zap;
    iconBg = 'bg-amber-50';
    iconColor = 'text-amber-500';
  } else if (complaint.category === 'WiFi') {
    Icon = Wifi;
    iconBg = 'bg-slate-100';
    iconColor = 'text-slate-600';
  } else if (complaint.category === 'Maintenance') {
    Icon = Wrench;
    iconBg = 'bg-purple-50';
    iconColor = 'text-purple-500';
  }

  // Determine Status Badge Colors
  let badgeColor = '';
  if (complaint.status === 'Open') badgeColor = 'bg-red-50 text-red-600 border-red-200/50';
  if (complaint.status === 'In Progress') badgeColor = 'bg-amber-50 text-amber-600 border-amber-200/50';
  if (complaint.status === 'Resolved') badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200/50';

  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4 cursor-pointer active:scale-[0.98] transition-all hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(37,99,235,0.08)] group"
    >
      {/* Top Row */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg} group-hover:scale-105 transition-transform`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 pt-0.5">
          <h3 className="font-extrabold text-gray-900 text-sm leading-tight">{complaint.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{complaint.category}</p>
            {complaint.urgency === 'High' && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">
                <AlertCircle className="w-2.5 h-2.5" /> High
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="flex justify-between items-center bg-gray-50/50 rounded-xl p-3 border border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-white shadow-sm">
            <span className="text-[10px] font-bold text-gray-500">{complaint.tenant.charAt(0)}</span>
          </div>
          <p className="text-xs font-bold text-gray-700">
            {complaint.tenant} <span className="text-gray-400 font-medium ml-0.5">• {complaint.room}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="text-[10px] font-semibold">{complaint.time}</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between items-center pt-1">
        <span className={`text-[9px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${badgeColor}`}>
          {complaint.status}
        </span>
        <button className="px-4 py-2 bg-gray-50 group-hover:bg-blue-50 text-gray-600 group-hover:text-blue-600 rounded-xl text-xs font-bold transition-colors border border-gray-100 group-hover:border-blue-100 shadow-sm">
          View Details
        </button>
      </div>
    </div>
  );
}

function ComplaintDetailModal({ complaint, onClose }: { complaint: any, onClose: () => void }) {
  const [remark, setRemark] = useState('');

  let Icon = Wrench;
  let iconBg = 'bg-gray-100';
  let iconColor = 'text-gray-600';

  if (complaint.category === 'Plumbing') {
    Icon = Droplet; iconBg = 'bg-blue-50'; iconColor = 'text-blue-500';
  } else if (complaint.category === 'Electricity') {
    Icon = Zap; iconBg = 'bg-amber-50'; iconColor = 'text-amber-500';
  } else if (complaint.category === 'WiFi') {
    Icon = Wifi; iconBg = 'bg-slate-100'; iconColor = 'text-slate-600';
  } else if (complaint.category === 'Maintenance') {
    Icon = Wrench; iconBg = 'bg-purple-50'; iconColor = 'text-purple-500';
  }

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
        <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Issue Details</h2>
        <button onClick={onClose} className="p-2 bg-gray-50 rounded-full active:scale-95 transition-transform">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-40 hide-scrollbar">
        
        {/* Header Info */}
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`w-7 h-7 ${iconColor}`} />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{complaint.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                complaint.status === 'Open' ? 'bg-red-50 text-red-600 border-red-200' :
                complaint.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                {complaint.status}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{complaint.category}</span>
            </div>
          </div>
        </div>

        {/* Tenant Info */}
        <div className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <span className="text-sm font-extrabold text-blue-600">{complaint.tenant.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{complaint.tenant}</p>
              <p className="text-xs font-medium text-gray-500">{complaint.room}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reported</p>
            <p className="text-xs font-bold text-gray-700">{complaint.time}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 ml-1">Description</h4>
          <div className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">{complaint.description}</p>
          </div>
        </div>

        {/* Photo Attachment */}
        <div>
          <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 ml-1">Attached Photo</h4>
          {complaint.photo ? (
            <div className="bg-white rounded-[1.25rem] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <img 
                src={complaint.photo} 
                alt="Complaint" 
                className="w-full h-48 object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[1.25rem] h-24 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
              <ImageIcon className="w-6 h-6 text-gray-300" />
              <span className="text-xs font-bold text-gray-400">No photo attached</span>
            </div>
          )}
        </div>

        {/* Resolution / Remarks Section */}
        {complaint.status === 'Resolved' ? (
          <div>
            <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Resolution Remark
            </h4>
            <div className="bg-emerald-50 rounded-[1.25rem] p-4 border border-emerald-100">
              <p className="text-sm text-emerald-800 font-medium">{complaint.remark}</p>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 ml-1">Add Remark</h4>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              <textarea 
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Type your resolution remark or update here..."
                className="w-full bg-white border border-gray-200 rounded-[1.25rem] py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm min-h-[100px] resize-none"
              ></textarea>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {complaint.status !== 'Resolved' && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-4 pb-8 sm:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex gap-3 z-10">
          {complaint.status === 'Open' && (
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <Clock className="w-4 h-4" /> Mark In Progress
            </button>
          )}
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgb(16,185,129,0.25)] transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark Resolved
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function ComplaintsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Open');
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);

  // Optimized filtering
  const filteredComplaints = useMemo(() => {
    return MOCK_COMPLAINTS.filter(comp => comp.status === activeTab);
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
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint) => (
                <motion.div 
                  layout
                  variants={itemVariants} 
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  key={complaint.id}
                >
                  <ComplaintCard 
                    complaint={complaint} 
                    onSelect={() => setSelectedComplaint(complaint)} 
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
                  <Wrench className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold">No {activeTab} Complaints</h3>
                <p className="text-sm text-gray-500 mt-1">Everything is running smoothly!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Full Screen Complaint Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <ComplaintDetailModal 
            complaint={selectedComplaint} 
            onClose={() => setSelectedComplaint(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

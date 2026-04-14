import { useState, useMemo, useRef } from 'react';
import { ArrowLeft, Droplet, Zap, Wifi, Wrench, Clock, X, Image as ImageIcon, CheckCircle2, AlertCircle, MessageSquare, Plus } from 'lucide-react';
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
      <div className="w-full text-center">
        <h1 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent tracking-tight">
          Complaints & Issues
        </h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Manage Requests</p>
      </div>
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
  const [cost, setCost] = useState('');
  const [actionType, setActionType] = useState<'progress' | 'resolve' | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmitAction = () => {
    // Implement actual submission logic here
    console.log(`Action: ${actionType}, Remark: ${remark}, Photo: ${uploadedPhoto ? 'Yes' : 'No'}, Cost: ${cost}`);
    setActionType(null);
    onClose();
  };

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
        {complaint.status === 'Resolved' && (
          <div>
            <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Resolution Remark
            </h4>
            <div className="bg-emerald-50 rounded-[1.25rem] p-4 border border-emerald-100">
              <p className="text-sm text-emerald-800 font-medium">{complaint.remark}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {complaint.status !== 'Resolved' && !actionType && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-4 pb-8 sm:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex gap-3 z-10">
          {complaint.status === 'Open' && (
            <button 
              onClick={() => setActionType('progress')}
              className="flex-1 py-4 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <Clock className="w-4 h-4" /> Mark In Progress
            </button>
          )}
          <button 
            onClick={() => setActionType('resolve')}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgb(16,185,129,0.25)] transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark Resolved
          </button>
        </div>
      )}

      {/* Action Popup (In Progress / Resolve) */}
      <AnimatePresence>
        {actionType && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActionType(null)}
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
                <h3 className="text-lg font-extrabold text-gray-900">
                  {actionType === 'progress' ? 'Mark as In Progress' : 'Mark as Resolved'}
                </h3>
                <button 
                  onClick={() => setActionType(null)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Upload Photo (Optional)
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                  />
                  {uploadedPhoto ? (
                    <div className="relative rounded-xl overflow-hidden h-32 border border-gray-200">
                      <img src={uploadedPhoto} alt="Uploaded" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setUploadedPhoto(null)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-red-600 hover:bg-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-xs font-bold">Tap to upload photo</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    {actionType === 'progress' ? 'Initial Remark (Optional)' : 'Final Resolution Remark'}
                  </label>
                  <textarea 
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder={actionType === 'progress' ? "e.g., Plumber called, arriving at 4 PM..." : "e.g., Replaced the broken pipe..."}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px] resize-none"
                  ></textarea>
                </div>

                {actionType === 'resolve' && (
                  <div>
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                      Resolution Cost (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleSubmitAction}
                  disabled={actionType === 'resolve' && !remark.trim()}
                  className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    actionType === 'progress' 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_20px_rgb(245,158,11,0.25)]' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_20px_rgb(16,185,129,0.25)] disabled:bg-gray-300 disabled:shadow-none'
                  }`}
                >
                  {actionType === 'progress' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  Submit Update
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
      <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar bg-[#f8f9fa] relative">
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

      {/* FAB for Adding Complaint */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(37,99,235,0.4)] active:scale-95 transition-transform z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Full Screen Complaint Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <ComplaintDetailModal 
            complaint={selectedComplaint} 
            onClose={() => setSelectedComplaint(null)} 
          />
        )}
      </AnimatePresence>

      {/* Add Complaint Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
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
              className="bg-white w-full sm:w-[400px] rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-extrabold text-gray-900">Log Complaint</h2>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-gray-50 rounded-full active:scale-95">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Title</label>
                  <input type="text" placeholder="e.g. Broken AC" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Category</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                      <option>Plumbing</option>
                      <option>Electricity</option>
                      <option>WiFi</option>
                      <option>Maintenance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Urgency</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Room / Tenant</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                    <option>Room 101 - Rahul</option>
                    <option>Room 102 - Amit</option>
                    <option>Room 201 - Vikram</option>
                    <option>Common Area</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Description</label>
                  <textarea 
                    placeholder="Describe the issue in detail..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[100px] resize-none"
                  ></textarea>
                </div>
                
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all active:scale-95"
                >
                  Submit Complaint
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

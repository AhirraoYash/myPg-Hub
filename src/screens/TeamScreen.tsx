import { useState, useMemo, useRef, useEffect } from 'react';
import { Phone, MessageSquare, Plus, Shield, Wrench, Sparkles, X, CheckCircle2, Wallet, UserPlus, UploadCloud, FileText, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../components/Logo';

const MOCK_STAFF = [
  { id: 1, name: 'Rajesh Kumar', role: 'Property Manager', phone: '+91 9876543210', salary: '25,000', status: 'On Duty', category: 'Management' },
  { id: 2, name: 'Sunita Devi', role: 'Housekeeping', phone: '+91 9876543211', salary: '12,000', status: 'On Duty', category: 'Cleaning' },
  { id: 3, name: 'Abdul Khan', role: 'Electrician', phone: '+91 9876543212', salary: '18,000', status: 'Off Duty', category: 'Maintenance' },
  { id: 4, name: 'Ramesh Singh', role: 'Security Guard', phone: '+91 9876543213', salary: '15,000', status: 'On Duty', category: 'Security' },
];

export default function TeamScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [payStaff, setPayStaff] = useState<any | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [staffDoc, setStaffDoc] = useState<string | null>(null);
  
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<any | null>(null);

  const tabs = ['All', 'Management', 'Cleaning', 'Maintenance', 'Security'];

  const filteredStaff = useMemo(() => {
    if (activeTab === 'All') return MOCK_STAFF;
    return MOCK_STAFF.filter(s => s.category === activeTab);
  }, [activeTab]);

  const handlePay = (staff: any) => {
    setPayStaff(staff);
  };

  const confirmPayment = () => {
    setPayStaff(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingStaff(null);
    setStaffDoc(null);
  };

  const handleDocUpload = () => {
    // Mock upload
    setStaffDoc('aadhaar_card_front.jpg');
  };

  const confirmDelete = () => {
    setStaffToDelete(null);
    // Handle actual deletion here
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fa] relative h-full">
      {/* Header */}
      <header className="px-6 pt-14 pb-4 flex justify-between items-center bg-white sticky top-0 z-10 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">Team</h1>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Manage staff & payroll</p>
        </div>
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8" primaryColor="#3b82f6" secondaryColor="#2563eb" />
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgb(37,99,235,0.3)] active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Staff List */}
      <main className="flex-1 overflow-y-auto px-6 pb-24 hide-scrollbar">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="flex flex-col gap-4"
        >
          {filteredStaff.map(staff => {
            let Icon = Shield;
            let iconBg = 'bg-purple-50';
            let iconColor = 'text-purple-600';

            if (staff.category === 'Cleaning') { Icon = Sparkles; iconBg = 'bg-blue-50'; iconColor = 'text-blue-600'; }
            if (staff.category === 'Maintenance') { Icon = Wrench; iconBg = 'bg-amber-50'; iconColor = 'text-amber-600'; }
            if (staff.category === 'Security') { Icon = Shield; iconBg = 'bg-emerald-50'; iconColor = 'text-emerald-600'; }

            return (
              <motion.div 
                key={staff.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm">{staff.name}</h3>
                      <p className="text-xs font-bold text-gray-500">{staff.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${
                      staff.status === 'On Duty' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                      {staff.status}
                    </span>
                    <div className="relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === staff.id ? null : staff.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {openMenuId === staff.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden z-20"
                            >
                              <div className="p-1 flex flex-col">
                                <button 
                                  onClick={() => { setOpenMenuId(null); setEditingStaff(staff); }}
                                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-gray-400" /> Edit
                                </button>
                                <button 
                                  onClick={() => { setOpenMenuId(null); setStaffToDelete(staff); }}
                                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" /> Remove
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monthly Salary</p>
                    <p className="text-sm font-extrabold text-gray-900">₹{staff.salary}</p>
                  </div>
                  <button 
                    onClick={() => handlePay(staff)}
                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors active:scale-95 flex items-center gap-1.5 shadow-sm"
                  >
                    <Wallet className="w-3.5 h-3.5" /> Pay Now
                  </button>
                </div>

                <div className="flex gap-2">
                  <a 
                    href={`tel:${staff.phone}`}
                    className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors active:scale-95"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a 
                    href={`sms:${staff.phone}`}
                    className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Add/Edit Staff Modal */}
      <AnimatePresence>
        {(isAddModalOpen || editingStaff) && (
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
              className="bg-white w-full sm:w-[360px] rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    {editingStaff ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  </div>
                  <h2 className="text-lg font-extrabold text-gray-900">{editingStaff ? 'Edit Staff' : 'Add Staff'}</h2>
                </div>
                <button onClick={closeAddModal} className="p-2 bg-gray-50 rounded-full active:scale-95">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Full Name</label>
                  <input type="text" defaultValue={editingStaff?.name} placeholder="e.g. Ramesh Singh" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Mobile Number</label>
                  <input type="tel" defaultValue={editingStaff?.phone} placeholder="+91 00000 00000" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Role</label>
                    <select defaultValue={editingStaff?.role || 'Manager'} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                      <option value="Property Manager">Property Manager</option>
                      <option value="Housekeeping">Housekeeping</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Security Guard">Security Guard</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">Salary (₹)</label>
                    <input type="text" defaultValue={editingStaff?.salary?.replace(/,/g, '')} placeholder="15000" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>

                {/* Document Upload Section */}
                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-1.5 block ml-1">ID Document (Aadhaar/PAN)</label>
                  {staffDoc ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-bold text-blue-900">{staffDoc}</span>
                      </div>
                      <button 
                        onClick={() => setStaffDoc(null)}
                        className="p-1 hover:bg-blue-100 rounded-full text-blue-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={handleDocUpload}
                      className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <UploadCloud className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">Tap to upload document</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">JPG, PNG or PDF (Max 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={closeAddModal}
                  className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all active:scale-95"
                >
                  {editingStaff ? 'Save Changes' : 'Add Team Member'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pay Staff Modal */}
      <AnimatePresence>
        {payStaff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">Pay Salary</h2>
              <p className="text-sm font-medium text-gray-500 mb-6">
                You are about to pay <strong className="text-gray-900">{payStaff.name}</strong> their monthly salary of <strong className="text-gray-900">₹{payStaff.salary}</strong>.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setPayStaff(null)}
                  className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmPayment}
                  className="flex-1 py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(0,0,0,0.15)] transition-all active:scale-95"
                >
                  Confirm Pay
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-24 left-6 right-6 bg-gray-900 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 z-50"
          >
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold">Payment Successful</p>
              <p className="text-[10px] font-medium text-gray-300">Salary has been credited to staff account.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {staffToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 shadow-2xl w-full max-w-sm flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-600">
                <Trash2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Remove Staff?</h2>
              <p className="text-sm font-medium text-gray-500 mb-6">
                 Are you sure you want to remove {staffToDelete.name}? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setStaffToDelete(null)}
                  className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-colors active:scale-95 border border-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(220,38,38,0.25)] transition-all active:scale-95"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

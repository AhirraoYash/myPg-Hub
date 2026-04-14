import { useState } from 'react';
import { ArrowLeft, Camera, User, Phone, Mail, CheckCircle2, Briefcase, IndianRupee, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function ManagerProfileScreen({ onLogout }: { onLogout?: () => void }) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Ravi Patel',
    phone: '9876543210',
    email: 'ravi.manager@example.com',
    role: 'Property Manager',
    joinDate: '15 Jan 2025'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col relative bg-[#f8f9fa] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 pt-14 pb-24 hide-scrollbar">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Manager Profile</h1>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Manage your details</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-2">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src="https://picsum.photos/seed/manager/200/200" 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-bold text-gray-500 mt-3 uppercase tracking-wider">Tap to change photo</p>
            </div>

            {/* Employment Details */}
            <div className="bg-blue-50 rounded-[1.25rem] p-5 border border-blue-100 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">{formData.role}</h3>
                  <p className="text-xs font-bold text-gray-500">Joined {formData.joinDate}</p>
                </div>
              </div>
              <div className="h-px w-full bg-blue-200/50 my-1"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">Total Earnings</h3>
                  <p className="text-xs font-bold text-emerald-600">₹45,000</p>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-gray-100 flex flex-col gap-5">
              <h3 className="text-sm font-extrabold text-gray-900 mb-1">Personal Details</h3>
              
              <div>
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <input 
                    type="tel"
                    value={formData.phone}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-500 cursor-not-allowed"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 mt-1.5 ml-1">Contact owner to change registered number</p>
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all disabled:opacity-70 mt-2"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Saved Successfully
                </>
              ) : (
                'Save Changes'
              )}
            </motion.button>

            {onLogout && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onLogout}
                className="w-full bg-red-50 text-red-600 border border-red-100 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-2"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </motion.button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

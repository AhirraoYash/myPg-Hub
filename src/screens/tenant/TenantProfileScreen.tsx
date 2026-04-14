import { useState } from 'react';
import { ArrowLeft, Camera, User, Phone, Mail, ShieldAlert, Heart, CheckCircle2, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TenantProfileScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isReadOnly = !!id; // If there's an ID in the URL, it's being viewed by a manager/owner

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Rahul Kumar',
    phone: '9876543210',
    email: 'rahul.k@example.com',
    emergencyName: 'Ramesh Kumar',
    emergencyPhone: '9123456789',
    bloodGroup: 'O+'
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
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {isReadOnly ? 'Tenant Info' : 'Personal Info'}
              </h1>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">
                {isReadOnly ? 'View tenant details' : 'Manage your details'}
              </p>
            </div>
          </div>
        </div>

        {isReadOnly && (
          <div className="flex gap-3 mb-6">
            <a 
              href={`tel:${formData.phone}`}
              className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Phone className="w-4 h-4" /> Call
            </a>
            <a 
              href={`https://wa.me/91${formData.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-50 text-emerald-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="https://picsum.photos/seed/rahul/200/200" 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              {!isReadOnly && (
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            {!isReadOnly && <p className="text-xs font-bold text-gray-500 mt-3 uppercase tracking-wider">Tap to change photo</p>}
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
                  readOnly={isReadOnly}
                  className={`w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${isReadOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
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
              {!isReadOnly && <p className="text-[10px] font-bold text-gray-400 mt-1.5 ml-1">Contact admin to change registered number</p>}
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
                  readOnly={isReadOnly}
                  className={`w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${isReadOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Blood Group</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Heart className="w-4 h-4 text-gray-400" />
                </div>
                <select 
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                  disabled={isReadOnly}
                  className={`w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none ${isReadOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-gray-100 flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-extrabold text-gray-900">Emergency Contact</h3>
            </div>
            
            <div>
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Contact Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({...formData, emergencyName: e.target.value})}
                  readOnly={isReadOnly}
                  className={`w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${isReadOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Contact Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value.replace(/\D/g, '')})}
                  maxLength={10}
                  readOnly={isReadOnly}
                  className={`w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${isReadOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
                />
              </div>
            </div>
          </div>

          {!isReadOnly && (
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
          )}
        </form>
      </div>
      </div>
    </div>
  );
}

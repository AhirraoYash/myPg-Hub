import { useState } from 'react';
import { ArrowLeft, Users, Moon, Clock, CheckCircle2, QrCode, Calendar, User, Phone, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

type PassType = 'guest' | 'night' | 'late';

export default function TenantGatePassScreen() {
  const navigate = useNavigate();
  const [passType, setPassType] = useState<PassType>('guest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ guestName: '', guestPhone: '', date: '', time: '', reason: '' });
      }, 3000);
    }, 1500);
  };

  const passTypes = [
    { id: 'guest', label: 'Guest Entry', icon: Users, desc: 'Few hours visit' },
    { id: 'night', label: 'Night Stay', icon: Moon, desc: 'Overnight guest' },
    { id: 'late', label: 'Late Entry', icon: Clock, desc: 'Coming late' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-6 pt-14 pb-24 overflow-y-auto hide-scrollbar relative">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Entry Pass</h1>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Manage visitors & late entry</p>
            </div>
          </div>
          <button className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform text-emerald-600">
            <QrCode className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Type Selector */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {passTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setPassType(type.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-[1.25rem] border transition-all ${
                passType === type.id 
                  ? 'bg-blue-600 border-blue-600 shadow-[0_8px_20px_rgb(37,99,235,0.25)]' 
                  : 'bg-white border-gray-100 shadow-[0_4px_15px_rgb(0,0,0,0.02)] hover:border-blue-200'
              }`}
            >
              <type.icon className={`w-6 h-6 mb-2 ${passType === type.id ? 'text-white' : 'text-gray-500'}`} />
              <span className={`text-xs font-extrabold ${passType === type.id ? 'text-white' : 'text-gray-900'}`}>
                {type.label}
              </span>
              <span className={`text-[9px] font-bold mt-1 text-center ${passType === type.id ? 'text-blue-100' : 'text-gray-400'}`}>
                {type.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Pass Generated!</h2>
              <p className="text-sm font-medium text-gray-500 mb-6">
                Your gate pass request has been approved. Show the QR code at the security desk.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Create Another Pass
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-gray-100 flex flex-col gap-5">
                
                {(passType === 'guest' || passType === 'night') && (
                  <>
                    <div>
                      <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Guest Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <input 
                          type="text"
                          required
                          value={formData.guestName}
                          onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                          placeholder="Enter guest's full name"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Guest Phone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 text-gray-400" />
                        </div>
                        <input 
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.guestPhone}
                          onChange={(e) => setFormData({...formData, guestPhone: e.target.value.replace(/\D/g, '')})}
                          placeholder="10-digit mobile number"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>
                      <input 
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-9 pr-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">
                      {passType === 'late' ? 'Expected Time' : 'Arrival Time'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <input 
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-9 pr-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Reason / Note</label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <FileText className="w-4 h-4 text-gray-400" />
                    </div>
                    <textarea 
                      required
                      rows={3}
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      placeholder="Brief description..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
                
                {passType === 'night' && (
                  <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                    <p className="text-xs font-bold text-orange-800">
                      Note: Night stay guests must provide a valid ID proof at the security gate.
                    </p>
                  </div>
                )}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Generate Pass'
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Active Passes Section */}
        {!isSuccess && (
          <div className="mt-8">
            <h3 className="text-sm font-extrabold text-gray-900 mb-4">Active Passes</h3>
            <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900">Amit Sharma</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Approved</span>
                    <span className="text-xs font-bold text-gray-500">Today, 5:00 PM</span>
                  </div>
                </div>
              </div>
              <button className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                <QrCode className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

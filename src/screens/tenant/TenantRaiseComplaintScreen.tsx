import { useState } from 'react';
import { ArrowLeft, Upload, AlertCircle, CheckCircle2, Phone, MessageCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function TenantRaiseComplaintScreen() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isPriority, setIsPriority] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description) return;
    
    // Simulate API call
    setIsSubmitted(true);
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-6 pt-14 pb-24 overflow-y-auto hide-scrollbar relative">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">Help & Support</h1>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Report issues instantly</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100 flex flex-col items-center text-center mt-10"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Complaint Submitted</h2>
              <p className="text-sm font-medium text-gray-500">
                Our team has been notified and will resolve this shortly.
              </p>
            </motion.div>
          ) : (
              <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
            >
              <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-gray-100 flex flex-col gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                      Category
                    </label>
                    {category && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all appearance-none"
                      required
                    >
                      <option value="" disabled>Select an issue type</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="cleaning">Cleaning / Housekeeping</option>
                      <option value="internet">Internet / Wi-Fi</option>
                      <option value="furniture">Furniture / Appliance</option>
                      <option value="other">Other</option>
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                      Description
                    </label>
                    {description.length > 10 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all min-h-[140px] resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Attach Photo (Optional)
                  </label>
                  <button type="button" className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600 transition-colors">Tap to upload image</span>
                  </button>
                </div>
              </div>

              {/* Priority Checkbox */}
              <div 
                className={`flex items-center gap-4 p-4 border rounded-[1.25rem] cursor-pointer transition-colors ${
                  isPriority ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100 hover:border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                }`}
                onClick={() => setIsPriority(!isPriority)}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors shrink-0 ${
                  isPriority ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'
                }`}>
                  {isPriority && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className={`text-sm font-extrabold ${isPriority ? 'text-orange-900' : 'text-gray-900'}`}>Mark as High Priority</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isPriority ? 'text-orange-700/60' : 'text-gray-500'}`}>
                    For urgent but non-emergency issues
                  </p>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="bg-red-50 rounded-[1.25rem] p-5 border border-red-100">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-extrabold text-red-900">Emergency Issue?</h4>
                    <p className="text-xs font-medium text-red-800/80 mt-1 leading-relaxed">
                      For major leaks, power outages, or security issues, please contact the manager directly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a 
                    href="tel:+919876543210" 
                    className="flex-1 bg-white border border-red-200 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-red-50 active:scale-95 transition-all"
                  >
                    <Phone className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-700">Call Now</span>
                  </a>
                  <a 
                    href="https://wa.me/919876543210" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 bg-[#25D366]/10 border border-[#25D366]/20 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-[#25D366]/20 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span className="text-xs font-bold text-[#128C7E]">WhatsApp</span>
                  </a>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!category || !description}
                className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all mt-2 ${
                  category && description 
                    ? 'bg-blue-600 text-white shadow-[0_4px_20px_rgb(37,99,235,0.25)]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit Complaint
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

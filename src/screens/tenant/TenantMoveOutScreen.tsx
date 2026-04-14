import { useState } from 'react';
import { ArrowLeft, Calendar, AlertCircle, CheckCircle2, Building2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function TenantMoveOutScreen() {
  const navigate = useNavigate();
  const [moveOutDate, setMoveOutDate] = useState('');
  const [reason, setReason] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveOutDate || !reason || !accountNumber || !ifsc) return;
    
    setIsSubmitted(true);
    setTimeout(() => {
      navigate(-1);
    }, 3000);
  };

  // Calculate minimum date (e.g., 30 days from today for notice period)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 30);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-6 pt-14 pb-24 overflow-y-auto hide-scrollbar relative">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Move-Out Request</h1>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Plan your departure</p>
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
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Request Initiated</h2>
              <p className="text-sm font-medium text-gray-500 mb-6">
                Your move-out request has been sent to the property manager. They will contact you shortly for the exit inspection.
              </p>
              <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 text-left">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Scheduled Move-out</p>
                <p className="text-sm font-extrabold text-gray-900">{new Date(moveOutDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              {/* Notice Period Info */}
              <div className="bg-orange-50 rounded-[1.25rem] p-5 border border-orange-100 flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-extrabold text-orange-900">30-Day Notice Required</h4>
                  <p className="text-xs font-medium text-orange-800/80 mt-1 leading-relaxed">
                    As per your agreement, a minimum 30-day notice is required. Your security deposit will be refunded within 7 days of moving out.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Move Out Details */}
                <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-gray-100 flex flex-col gap-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-extrabold text-gray-900">Move-Out Details</h3>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                      Expected Move-Out Date
                    </label>
                    <input 
                      type="date"
                      min={minDateString}
                      value={moveOutDate}
                      onChange={(e) => setMoveOutDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                      Reason for Leaving
                    </label>
                    <div className="relative">
                      <select 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all appearance-none"
                        required
                      >
                        <option value="" disabled>Select a reason</option>
                        <option value="job_change">Job Change / Relocation</option>
                        <option value="college_finished">College / Course Finished</option>
                        <option value="rent_issue">Rent / Budget Issues</option>
                        <option value="facility_issue">Facility / Service Issues</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refund Details */}
                <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-gray-100 flex flex-col gap-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-extrabold text-gray-900">Refund Bank Details</h3>
                  </div>
                  <p className="text-xs font-medium text-gray-500 -mt-4 ml-7">For security deposit settlement</p>

                  <div>
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                      Account Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                      </div>
                      <input 
                        type="text"
                        placeholder="Enter account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-11 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                      IFSC Code
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. HDFC0001234"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      maxLength={11}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all uppercase"
                      required
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!moveOutDate || !reason || !accountNumber || !ifsc}
                  className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all mt-2 ${
                    moveOutDate && reason && accountNumber && ifsc
                      ? 'bg-red-600 text-white shadow-[0_4px_20px_rgb(220,38,38,0.25)]' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Move-Out Request
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

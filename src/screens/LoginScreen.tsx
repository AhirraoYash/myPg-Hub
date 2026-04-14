import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Phone, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

export default function LoginScreen({ onLogin }: { onLogin: (role: 'owner' | 'manager' | 'tenant') => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'owner' | 'manager' | 'tenant'>('owner');
  
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only numbers
    
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-advance
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length < 4) return;
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedRole);
    }, 1000);
  };

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpRefs[0].current?.focus();
      }, 100);
    }
  }, [step]);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-50 to-[#f8f9fa] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>

      <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
        
        {/* Animated Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-24 h-24 mb-6"
          >
            <div className="absolute inset-0 bg-blue-100 rounded-[2rem] rotate-3 scale-105"></div>
            <div className="absolute inset-0 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(37,99,235,0.1)] flex items-center justify-center border border-blue-50">
              <Logo className="w-10 h-10" primaryColor="#3b82f6" secondaryColor="#2563eb" />
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-[#f8f9fa] flex items-center justify-center"
            >
              <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
            </motion.div>
          </motion.div>

          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-gray-900 tracking-tight text-center"
          >
            PropManage
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-gray-500 mt-2 text-center"
          >
            Smart PG & Hostel Management
          </motion.p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative">
          <AnimatePresence mode="wait">
            
            {step === 'phone' ? (
              <motion.form 
                key="phone"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handlePhoneSubmit}
                className="flex flex-col gap-5"
              >
                <div>
                  <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900 border-r border-gray-200 pr-2">+91</span>
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10 digit number"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-[5.5rem] pr-4 text-lg font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:bg-white"
                      autoFocus
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={phone.length < 10 || isLoading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all active:scale-[0.98] mt-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get OTP'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="mt-4">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 block text-center">Login As</label>
                  <div className="bg-gray-100 p-1 rounded-xl flex items-center">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('owner')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedRole === 'owner' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Owner
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('manager')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedRole === 'manager' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('tenant')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedRole === 'tenant' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Tenant
                    </button>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="otp"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleOtpSubmit}
                className="flex flex-col gap-5"
              >
                <div>
                  <div className="flex justify-between items-end mb-2 ml-1">
                    <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                      Enter OTP
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setStep('phone')}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                    >
                      Change Number
                    </button>
                  </div>
                  
                  <div className="flex justify-between gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl text-center text-2xl font-extrabold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:bg-white shadow-sm"
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-gray-500 mt-3 text-center">
                    Sent to +91 {phone}
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={otp.join('').length < 4 || isLoading}
                  className="w-full py-4 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgb(0,0,0,0.15)] transition-all active:scale-[0.98] mt-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
                </button>
              </motion.form>
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center mt-8 gap-4">
          <p className="text-[10px] font-medium text-gray-400 text-center">
            By logging in, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle, FileQuestion, ChevronRight, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

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
          Help & Support
        </h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Get Assistance</p>
      </div>
      <div className="absolute right-6">
        <Logo className="w-8 h-8" primaryColor="#3b82f6" secondaryColor="#2563eb" />
      </div>
    </header>
  );
}

function SupportCard({ icon: Icon, title, description, color, bgColor, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-extrabold text-gray-900">{title}</h3>
        <p className="text-xs font-medium text-gray-500 mt-0.5">{description}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-300" />
    </div>
  );
}

function FAQItem({ question, isLast = false }: { question: string, isLast?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-4 active:bg-gray-50 transition-colors cursor-pointer ${!isLast ? 'border-b border-gray-50' : ''}`}>
      <span className="text-sm font-bold text-gray-800">{question}</span>
      <ChevronRight className="w-4 h-4 text-gray-300" />
    </div>
  );
}

export default function HelpSupportScreen() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919561471440', '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+919561471440';
  };

  const handleEmail = () => {
    window.location.href = 'mailto:support@propmanage.com';
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fa] relative h-full">
      <Header onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto pb-10 hide-scrollbar px-6 pt-2">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
          
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">How can we help you?</h2>
            <p className="text-sm font-medium text-gray-500">
              Our support team is available 24/7 to assist you with any issues or queries.
            </p>
          </motion.div>

          {/* Contact Options */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-2">Contact Us</h3>
            
            <SupportCard 
              icon={MessageCircle} 
              title="WhatsApp Support" 
              description="Fastest response time" 
              color="text-emerald-600"
              bgColor="bg-emerald-50"
              onClick={handleWhatsApp}
            />
            
            <SupportCard 
              icon={Phone} 
              title="Call Us" 
              description="+91 95614 71440" 
              color="text-blue-600"
              bgColor="bg-blue-50"
              onClick={handleCall}
            />
            
            <SupportCard 
              icon={Mail} 
              title="Email Support" 
              description="support@propmanage.com" 
              color="text-purple-600"
              bgColor="bg-purple-50"
              onClick={handleEmail}
            />
          </motion.div>

          {/* FAQs */}
          <motion.div variants={itemVariants} className="mt-2">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Frequently Asked Questions</h3>
            <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <FAQItem question="How do I add a new property?" />
              <FAQItem question="How to collect rent online?" />
              <FAQItem question="Can I add multiple staff members?" />
              <FAQItem question="How to generate monthly reports?" />
              <FAQItem question="What happens if a tenant leaves?" isLast />
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

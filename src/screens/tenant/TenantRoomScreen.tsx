import { ArrowLeft, Bed, Phone, MessageCircle, Wifi, Wind, Monitor, Droplets, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function TenantRoomScreen() {
  const navigate = useNavigate();

  const roommates = [
    { id: 1, name: 'Amit Kumar', role: 'Student', phone: '+919876543211', avatar: 'AK' },
    // Assuming 2 sharing, user is the other one.
  ];

  const amenities = [
    { icon: Wind, label: 'Air Conditioning' },
    { icon: Wifi, label: 'High-Speed Wi-Fi' },
    { icon: Monitor, label: 'Smart TV' },
    { icon: Droplets, label: 'Attached Washroom' },
  ];

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
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Room Details</h1>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Your stay information</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[1.25rem] shadow-[0_8px_30px_rgb(79,70,229,0.2)] p-6 mb-8 relative overflow-hidden text-white"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-indigo-100 uppercase tracking-wider mb-1">Room Number</p>
              <h2 className="text-4xl font-black mb-2">402</h2>
              <div className="flex items-center gap-2 text-xs font-bold bg-white/20 w-max px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Bed className="w-4 h-4" />
                <span>2 Sharing • AC</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-sm font-extrabold text-gray-900 mb-4">My Roommates</h3>
          <div className="flex flex-col gap-4">
            {roommates.map((mate) => (
              <div key={mate.id} className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg">
                    {mate.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">{mate.name}</h4>
                    <p className="text-xs font-bold text-gray-500">{mate.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`tel:${mate.phone}`} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Phone className="w-4 h-4" />
                  </a>
                  <a href={`https://wa.me/${mate.phone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#25D366]/10 hover:text-[#25D366] transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
            {roommates.length === 0 && (
              <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-gray-100 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-gray-900">No Roommates Yet</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">You currently have this room to yourself.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-extrabold text-gray-900 mb-4">Room Amenities</h3>
          <div className="grid grid-cols-2 gap-4">
            {amenities.map((amenity, idx) => (
              <div key={idx} className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 border border-gray-100 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <amenity.icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-xs font-bold text-gray-700">{amenity.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

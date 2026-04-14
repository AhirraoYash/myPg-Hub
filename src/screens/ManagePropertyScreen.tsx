import { useState } from 'react';
import { ArrowLeft, Plus, Building2, Layers, Wifi, Wind, Coffee, Shield, Zap, Image as ImageIcon, Trash2, Sparkles, Bed, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const INITIAL_PROPERTY = {
  name: 'MyPG Hub - Koramangala',
  address: '123, 4th Cross, 5th Block, Koramangala, Bangalore',
  type: 'Premium PG',
  floors: [
    {
      id: 1,
      level: 1,
      rooms: [
        { id: '101', number: '101', beds: 2 },
        { id: '102', number: '102', beds: 3 },
      ]
    },
    {
      id: 2,
      level: 2,
      rooms: [
        { id: '201', number: '201', beds: 2 },
      ]
    }
  ],
  photos: [
    'https://picsum.photos/seed/pg1/400/300',
    'https://picsum.photos/seed/pg2/400/300',
    'https://picsum.photos/seed/pg3/400/300',
  ],
  services: [
    { id: 'wifi', name: 'High-Speed WiFi', icon: Wifi, active: true },
    { id: 'ac', name: 'Air Conditioning', icon: Wind, active: true },
    { id: 'meals', name: '3 Meals/Day', icon: Coffee, active: true },
    { id: 'security', name: '24/7 Security', icon: Shield, active: true },
    { id: 'power', name: 'Power Backup', icon: Zap, active: true },
  ]
};

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
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
          Manage Property
        </h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Configure Building</p>
      </div>
      <div className="absolute right-6">
        <Logo className="w-8 h-8" primaryColor="#3b82f6" secondaryColor="#2563eb" />
      </div>
    </header>
  );
}

// ----------------------------------------------------------------------
// Main Screen Component
// ----------------------------------------------------------------------

export default function ManagePropertyScreen() {
  const navigate = useNavigate();
  const [property, setProperty] = useState(INITIAL_PROPERTY);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');

  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [bulkRoomCount, setBulkRoomCount] = useState('1');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{floorId: number, roomId: string} | null>(null);

  const toggleService = (id: string) => {
    setProperty(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, active: !s.active } : s)
    }));
  };

  const addFloor = () => {
    setProperty(prev => {
      const nextLevel = prev.floors.length + 1;
      return {
        ...prev,
        floors: [
          ...prev.floors,
          { id: Date.now(), level: nextLevel, rooms: [] }
        ]
      };
    });
  };

  const addRoomsToFloor = (floorId: number, floorLevel: number, count: number) => {
    if (count < 1) return;
    setProperty(prev => ({
      ...prev,
      floors: prev.floors.map(f => {
        if (f.id === floorId) {
          const newRooms = [];
          const currentCount = f.rooms.length;
          for (let i = 1; i <= count; i++) {
            const roomNumber = `${floorLevel}${String(currentCount + i).padStart(2, '0')}`;
            newRooms.push({ id: `${Date.now()}-${i}`, number: roomNumber, beds: 2 });
          }
          return {
            ...f,
            rooms: [...f.rooms, ...newRooms]
          };
        }
        return f;
      })
    }));
    setBulkRoomCount('1');
  };

  const deleteRoom = () => {
    if (!roomToDelete) return;
    setProperty(prev => ({
      ...prev,
      floors: prev.floors.map(f => {
        if (f.id === roomToDelete.floorId) {
          return {
            ...f,
            rooms: f.rooms.filter(r => r.id !== roomToDelete.roomId)
          };
        }
        return f;
      })
    }));
    setRoomToDelete(null);
  };

  const updateRoomBeds = (floorId: number, roomId: string, delta: number) => {
    setProperty(prev => ({
      ...prev,
      floors: prev.floors.map(f => {
        if (f.id === floorId) {
          return {
            ...f,
            rooms: f.rooms.map(r => {
              if (r.id === roomId) {
                const newBeds = Math.max(1, r.beds + delta);
                return { ...r, beds: newBeds };
              }
              return r;
            })
          };
        }
        return f;
      })
    }));
  };

  const updateRoomDetails = (floorId: number, roomId: string, details: any) => {
    setProperty(prev => ({
      ...prev,
      floors: prev.floors.map(f => {
        if (f.id === floorId) {
          return {
            ...f,
            rooms: f.rooms.map(r => {
              if (r.id === roomId) {
                return { ...r, ...details };
              }
              return r;
            })
          };
        }
        return f;
      })
    }));
  };

  const handleAddCustomService = () => {
    if (newServiceName.trim()) {
      setProperty(prev => ({
        ...prev,
        services: [
          ...prev.services,
          {
            id: `custom-${Date.now()}`,
            name: newServiceName.trim(),
            icon: Sparkles, // Default icon for custom services
            active: true
          }
        ]
      }));
      setNewServiceName('');
      setIsAddingService(false);
    }
  };

  const removePhoto = (index: number) => {
    setProperty(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const totalFloors = property.floors.length;
  const totalRooms = property.floors.reduce((acc, f) => acc + f.rooms.length, 0);
  const totalBeds = property.floors.reduce((acc, f) => acc + f.rooms.reduce((sum, r) => sum + r.beds, 0), 0);

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fa] relative h-full">
      <Header onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto pb-10 hide-scrollbar">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6 px-6 pt-2"
        >
          {/* Section 1: Basic Details */}
          <motion.div variants={itemVariants} className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-extrabold text-gray-900 tracking-wide">Property Details</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Property Name</label>
                <input 
                  type="text" 
                  value={property.name}
                  onChange={(e) => setProperty({...property, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Full Address</label>
                <textarea 
                  value={property.address}
                  onChange={(e) => setProperty({...property, address: e.target.value})}
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" 
                />
              </div>
            </div>
          </motion.div>

          {/* Section 2: Building Structure */}
          <motion.div variants={itemVariants} className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-extrabold text-gray-900 tracking-wide">Building Structure</h2>
              </div>
            </div>

            <div className="flex gap-3 mb-5">
              <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                <p className="text-xl font-black text-gray-900">{totalFloors}</p>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-1">Floors</p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                <p className="text-xl font-black text-gray-900">{totalRooms}</p>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-1">Rooms</p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                <p className="text-xl font-black text-gray-900">{totalBeds}</p>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-1">Beds</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {property.floors.map(floor => {
                const floorRooms = floor.rooms.length;
                const floorBeds = floor.rooms.reduce((sum, r) => sum + r.beds, 0);
                return (
                  <div 
                    key={floor.id} 
                    onClick={() => setSelectedFloorId(floor.id)}
                    className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex justify-between items-center active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                        <span className="text-sm font-black text-gray-900">{floor.level}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Floor {floor.level}</h3>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">{floorRooms} Rooms • {floorBeds} Beds</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-blue-600">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={addFloor}
              className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New Floor
            </button>
          </motion.div>

          {/* Section 3: Services & Amenities */}
          <motion.div variants={itemVariants} className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-extrabold text-gray-900 tracking-wide">Services Provided</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {property.services.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                      service.active 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {service.name}
                  </button>
                );
              })}
              
              {isAddingService ? (
                <div className="flex items-center gap-2 bg-gray-50 border border-blue-200 rounded-full px-2 py-1">
                  <input 
                    type="text" 
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="Service name..."
                    className="bg-transparent text-xs font-bold text-gray-900 focus:outline-none w-24 px-2"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomService()}
                  />
                  <button 
                    onClick={handleAddCustomService}
                    className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingService(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all border-dashed"
                >
                  <Plus className="w-4 h-4" /> Add Custom
                </button>
              )}
            </div>
          </motion.div>

          {/* Section 4: Property Photos */}
          <motion.div variants={itemVariants} className="bg-white rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-extrabold text-gray-900 tracking-wide">Property Photos</h2>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {/* Add Photo Button */}
              <button className="w-32 h-32 shrink-0 border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors active:scale-95">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Add Photo</span>
              </button>

              {/* Existing Photos */}
              <AnimatePresence>
                {property.photos.map((photo, index) => (
                  <motion.div 
                    key={photo}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-32 h-32 shrink-0 relative rounded-2xl overflow-hidden group"
                  >
                    <img src={photo} alt={`Property ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => removePhoto(index)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 active:scale-95 transition-transform shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div variants={itemVariants} className="mt-4">
            <button 
              onClick={() => setShowSaveConfirm(true)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all active:scale-[0.98]"
            >
              Save Changes
            </button>
          </motion.div>

        </motion.div>
      </main>

      {/* Manage Floor Modal */}
      <AnimatePresence>
        {selectedFloorId !== null && (
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
              className="bg-white w-full sm:w-[400px] rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl max-h-[90vh] flex flex-col"
            >
              {(() => {
                const floor = property.floors.find(f => f.id === selectedFloorId);
                if (!floor) return null;

                return (
                  <>
                    <div className="flex justify-between items-center mb-6 shrink-0">
                      <div>
                        <h2 className="text-lg font-extrabold text-gray-900">Manage Floor {floor.level}</h2>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">{floor.rooms.length} Rooms Total</p>
                      </div>
                      <button onClick={() => setSelectedFloorId(null)} className="p-2 bg-gray-50 rounded-full active:scale-95">
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Quick Add Multiple Rooms */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 shrink-0">
                      <label className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider mb-2 block">Quick Add Rooms</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          min="1"
                          max="20"
                          value={bulkRoomCount}
                          onChange={(e) => setBulkRoomCount(e.target.value)}
                          className="w-20 bg-white border border-blue-200 rounded-lg py-2 px-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button 
                          onClick={() => addRoomsToFloor(floor.id, floor.level, parseInt(bulkRoomCount) || 1)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm transition-colors active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add Rooms
                        </button>
                      </div>
                    </div>

                    {/* Room List */}
                    <div className="flex-1 overflow-y-auto hide-scrollbar min-h-[200px]">
                      <div className="grid grid-cols-2 gap-3 pb-4">
                        {floor.rooms.map(room => (
                          <div 
                            key={room.id} 
                            onClick={() => setSelectedRoomId(room.id)}
                            className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-3 shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all active:scale-[0.98]"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-extrabold text-gray-900">Room {room.number}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setRoomToDelete({floorId: floor.id, roomId: room.id}); }}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1.5 border border-gray-100">
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateRoomBeds(floor.id, room.id, -1); }} 
                                className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-gray-900 active:scale-95 transition-transform"
                              >
                                -
                              </button>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-gray-800 w-3 text-center">{room.beds}</span>
                                <Bed className="w-3.5 h-3.5 text-gray-400" />
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateRoomBeds(floor.id, room.id, 1); }} 
                                className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-gray-900 active:scale-95 transition-transform"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                        {floor.rooms.length === 0 && (
                          <div className="col-span-2 text-center py-8 text-sm font-medium text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            No rooms on this floor yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage Room Modal */}
      <AnimatePresence>
        {selectedRoomId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full sm:w-[400px] rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl max-h-[90vh] flex flex-col"
            >
              {(() => {
                let currentFloor = null;
                let currentRoom = null;
                for (const f of property.floors) {
                  const r = f.rooms.find(rm => rm.id === selectedRoomId);
                  if (r) {
                    currentFloor = f;
                    currentRoom = r;
                    break;
                  }
                }
                if (!currentRoom || !currentFloor) return null;

                return (
                  <>
                    <div className="flex justify-between items-center mb-6 shrink-0">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedRoomId(null)} className="p-2 bg-gray-50 rounded-full active:scale-95 border border-gray-100">
                          <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <div>
                          <h2 className="text-lg font-extrabold text-gray-900">Room {currentRoom.number}</h2>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">Floor {currentFloor.level}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-6 pb-4">
                      {/* Room Details */}
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Room Number</label>
                          <input 
                            type="text" 
                            value={currentRoom.number}
                            onChange={(e) => updateRoomDetails(currentFloor.id, currentRoom.id, { number: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Beds</label>
                            <div className="flex items-center justify-between bg-gray-50 rounded-xl py-2 px-3 border border-gray-200 h-[46px]">
                              <button onClick={() => updateRoomBeds(currentFloor.id, currentRoom.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-gray-900 active:scale-95 transition-transform">-</button>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-black text-gray-800">{currentRoom.beds}</span>
                                <Bed className="w-4 h-4 text-gray-400" />
                              </div>
                              <button onClick={() => updateRoomBeds(currentFloor.id, currentRoom.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-gray-900 active:scale-95 transition-transform">+</button>
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Monthly Rent</label>
                            <input 
                              type="text" 
                              placeholder="e.g. ₹8,500"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-[46px]" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Room Amenities */}
                      <div>
                        <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-3 ml-1">Room Amenities</h3>
                        <div className="flex flex-col gap-2">
                          {['Attached Washroom', 'Balcony', 'Air Conditioning', 'Window'].map(amenity => (
                            <label key={amenity} className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors active:scale-[0.99]">
                              <span className="text-sm font-bold text-gray-700">{amenity}</span>
                              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 mt-auto shrink-0">
                      <button 
                        onClick={() => setSelectedRoomId(null)}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all active:scale-[0.98]"
                      >
                        Save Room Details
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Confirmation Modal */}
      <AnimatePresence>
        {showSaveConfirm && (
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
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Save Changes?</h2>
              <p className="text-sm font-medium text-gray-500 mb-6">
                Are you sure you want to save all the changes made to this property's details, structure, and rooms?
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowSaveConfirm(false)}
                  className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-colors active:scale-95 border border-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowSaveConfirm(false);
                    navigate(-1);
                  }}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(37,99,235,0.25)] transition-all active:scale-95"
                >
                  Confirm Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Room Confirmation Modal */}
      <AnimatePresence>
        {roomToDelete && (
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
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Delete Room?</h2>
              <p className="text-sm font-medium text-gray-500 mb-6">
                Are you sure you want to delete this room? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setRoomToDelete(null)}
                  className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-colors active:scale-95 border border-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={deleteRoom}
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(220,38,38,0.25)] transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

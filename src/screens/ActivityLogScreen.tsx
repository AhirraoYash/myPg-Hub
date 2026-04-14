import { useState } from 'react';
import { ArrowLeft, IndianRupee, AlertCircle, UserPlus, FileText, Wrench, Clock, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const ACTIVITIES = [
  { id: 1, title: 'Rent Received', desc: '₹8,500 from Rahul (Room 102)', time: '2 hours ago', date: 'Today', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100', category: 'Payment' },
  { id: 2, title: 'New Complaint', desc: 'Plumbing issue in Room 203', time: '5 hours ago', date: 'Today', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', category: 'Complaint' },
  { id: 3, title: 'Tenant Onboarded', desc: 'Amit moved into Room 201', time: 'Yesterday', date: 'Yesterday', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100', category: 'Tenant' },
  { id: 4, title: 'Agreement Signed', desc: 'Raj Singh signed new agreement', time: '2 days ago', date: 'Previous', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100', category: 'Agreement' },
  { id: 5, title: 'Maintenance Resolved', desc: 'AC fixed in Room 101', time: '3 days ago', date: 'Previous', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-100', category: 'Maintenance' },
];

export default function ActivityLogScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filteredActivities = ACTIVITIES.filter(a => filter === 'All' || a.category === filter);

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fa] relative h-full">
      <header className="px-6 pt-14 pb-4 flex items-center bg-white sticky top-0 z-10 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-gray-50 rounded-full active:scale-95 transition-transform absolute left-6">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="w-full text-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">Activity Log</h1>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Recent Actions</p>
        </div>
      </header>

      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['All', 'Payment', 'Complaint', 'Tenant', 'Agreement', 'Maintenance'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === f ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar">
        <div className="flex flex-col gap-4">
          {filteredActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center shrink-0 mt-1`}>
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-extrabold text-gray-900">{activity.title}</h4>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">{activity.desc}</p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-gray-400">
                    <Clock className="w-3 h-3" /> {activity.time}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getComplaints, updateComplaintStatus, Complaint } from '@/api/complaints';

const URGENCY_COLORS: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-blue-100 text-blue-700',
};

const STATUS_COLORS: Record<string, string> = {
  Open: 'bg-orange-100 text-orange-700',
  In_Progress: 'bg-blue-100 text-blue-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
  Closed: 'bg-gray-100 text-gray-500',
};

function ComplaintCard({ complaint, onUpdate }: { complaint: Complaint; onUpdate: (id: string, status: string) => void }) {
  const [urgBg, urgText] = (URGENCY_COLORS[complaint.urgency] ?? 'bg-gray-100 text-gray-700').split(' ');
  const [stBg, stText] = (STATUS_COLORS[complaint.status] ?? 'bg-gray-100 text-gray-700').split(' ');
  const name = complaint.tenant ? `${complaint.tenant.first_name} ${complaint.tenant.last_name}` : 'Tenant';

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <Text className="text-sm font-black text-gray-900">{complaint.title}</Text>
          <Text className="text-xs text-gray-500 mt-0.5">{name}</Text>
        </View>
        <View className="items-end gap-1.5">
          <View className={`px-2 py-0.5 rounded-md ${urgBg}`}><Text className={`text-[10px] font-black ${urgText}`}>{complaint.urgency}</Text></View>
          <View className={`px-2 py-0.5 rounded-md ${stBg}`}><Text className={`text-[10px] font-black ${stText}`}>{complaint.status.replace('_', ' ')}</Text></View>
        </View>
      </View>
      <Text className="text-xs text-gray-400 mb-3 leading-relaxed">{complaint.description}</Text>
      <View className="flex-row gap-2 flex-wrap">
        <View className="bg-gray-100 px-2.5 py-1 rounded-lg">
          <Text className="text-[10px] font-bold text-gray-600">{complaint.category}</Text>
        </View>
        {complaint.status === 'Open' && (
          <TouchableOpacity onPress={() => onUpdate(complaint._id, 'In_Progress')} className="bg-blue-600 px-2.5 py-1 rounded-lg">
            <Text className="text-[10px] font-black text-white">Start</Text>
          </TouchableOpacity>
        )}
        {complaint.status === 'In_Progress' && (
          <TouchableOpacity onPress={() => onUpdate(complaint._id, 'Resolved')} className="bg-emerald-600 px-2.5 py-1 rounded-lg">
            <Text className="text-[10px] font-black text-white">Resolve</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function ManagerComplaintsScreen() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'Open' | 'In_Progress' | 'Resolved'>('Open');

  const fetchComplaints = async () => {
    try {
      const res = await getComplaints();
      setComplaints(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleUpdate = async (id: string, status: string) => {
    try {
      await updateComplaintStatus(id, status);
      fetchComplaints();
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to update status');
    }
  };

  const filtered = complaints.filter(c => c.status === tab);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-black text-gray-900">Complaints</Text>
          <Text className="text-xs text-gray-400 font-semibold">{complaints.length} total</Text>
        </View>
      </View>

      <View className="mx-6 mb-4 bg-gray-100 rounded-xl p-1 flex-row">
        {(['Open', 'In_Progress', 'Resolved'] as const).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg items-center ${tab === t ? 'bg-white' : ''}`}>
            <Text className={`text-xs font-black ${tab === t ? 'text-blue-600' : 'text-gray-500'}`}>{t.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading
        ? <ActivityIndicator className="mt-12" color="#3b82f6" size="large" />
        : (
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchComplaints(); }} tintColor="#3b82f6" />}>
            <View className="pb-12">
              {filtered.length === 0
                ? <View className="items-center py-16">
                    <Ionicons name="checkmark-circle-outline" size={48} color="#d1fae5" />
                    <Text className="text-gray-400 font-bold mt-4">No {tab.replace('_', ' ')} complaints</Text>
                  </View>
                : filtered.map(c => <ComplaintCard key={c._id} complaint={c} onUpdate={handleUpdate} />)
              }
            </View>
          </ScrollView>
        )
      }
    </SafeAreaView>
  );
}

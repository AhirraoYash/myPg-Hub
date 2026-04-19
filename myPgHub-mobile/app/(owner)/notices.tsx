import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  listNotices, generateSettlement, completeMoveOut, MoveOutNotice,
} from '@/api/moveout';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Notice_Given: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Inspection_Pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Settlement_Generated: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Completed: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

function NoticeCard({
  notice, onGenerateSettlement, onComplete,
}: {
  notice: MoveOutNotice;
  onGenerateSettlement: () => void;
  onComplete: () => void;
}) {
  const s = STATUS_COLORS[notice.status] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };
  const name = notice.tenant
    ? `${notice.tenant.first_name} ${notice.tenant.last_name}`
    : 'Tenant';
  const noticeDate = new Date(notice.notice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const moveOutDate = new Date(notice.expected_move_out_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <View
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-sm font-black text-gray-900">{name}</Text>
          {notice.room_number && (
            <Text className="text-xs text-gray-400 mt-0.5">
              Room {notice.room_number} · Bed {notice.bed_identifier ?? '—'}
            </Text>
          )}
        </View>
        <View className={`px-2.5 py-1 rounded-lg ${s.bg}`}>
          <Text className={`text-[10px] font-black ${s.text}`}>
            {notice.status.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-3">
        <View>
          <Text className="text-[10px] font-bold text-gray-400">NOTICE DATE</Text>
          <Text className="text-xs font-black text-gray-900 mt-0.5">{noticeDate}</Text>
        </View>
        <Ionicons name="arrow-forward" size={14} color="#d1d5db" />
        <View>
          <Text className="text-[10px] font-bold text-gray-400">MOVE OUT</Text>
          <Text className="text-xs font-black text-gray-900 mt-0.5">{moveOutDate}</Text>
        </View>
      </View>

      {notice.settlement && (
        <View className="bg-gray-50 rounded-xl p-3 mb-3 gap-1">
          <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Settlement</Text>
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-600">Deposit</Text>
            <Text className="text-xs font-bold text-gray-900">₹{notice.settlement.deposit_amount?.toLocaleString('en-IN')}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-600">Deductions</Text>
            <Text className="text-xs font-bold text-red-600">-₹{notice.settlement.deductions?.toLocaleString('en-IN')}</Text>
          </View>
          <View className="flex-row justify-between border-t border-gray-200 mt-1 pt-1">
            <Text className="text-xs font-black text-gray-900">Refund</Text>
            <Text className="text-xs font-black text-emerald-600">₹{notice.settlement.refund_amount?.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      )}

      <View className="flex-row gap-2">
        {notice.status === 'Inspection_Pending' && (
          <TouchableOpacity
            onPress={onGenerateSettlement}
            className="flex-1 bg-purple-600 py-2.5 rounded-xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-[11px] font-black text-white">Generate Settlement</Text>
          </TouchableOpacity>
        )}
        {notice.status === 'Settlement_Generated' && (
          <TouchableOpacity
            onPress={onComplete}
            className="flex-1 bg-emerald-600 py-2.5 rounded-xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-[11px] font-black text-white">Complete Move-Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function NoticesScreen() {
  const router = useRouter();
  const [notices, setNotices] = useState<MoveOutNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const fetchNotices = async () => {
    try {
      const res = await listNotices({ limit: 30 });
      setNotices(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleGenerateSettlement = async (notice_id: string) => {
    try {
      await generateSettlement(notice_id);
      fetchNotices();
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to generate settlement');
    }
  };

  const handleComplete = async (notice_id: string) => {
    Alert.alert(
      'Complete Move-Out',
      'This will permanently vacate the bed. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          style: 'destructive',
          onPress: async () => {
            try {
              await completeMoveOut(notice_id);
              fetchNotices();
            } catch (err: any) {
              Alert.alert('Error', err?.message ?? 'Failed to complete move-out');
            }
          },
        },
      ]
    );
  };

  const filtered = notices.filter(n =>
    activeTab === 'active'
      ? n.status !== 'Completed'
      : n.status === 'Completed'
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-black text-gray-900">Move-Out Notices</Text>
          <Text className="text-xs text-gray-400 font-semibold">{notices.length} total</Text>
        </View>
      </View>

      <View className="mx-6 mb-4 bg-gray-100 rounded-xl p-1 flex-row">
        {[['active', 'Active'], ['completed', 'Completed']].map(([k, l]) => (
          <TouchableOpacity key={k} onPress={() => setActiveTab(k as any)}
            className={`flex-1 py-2 rounded-lg items-center ${activeTab === k ? 'bg-white' : ''}`}>
            <Text className={`text-xs font-black ${activeTab === k ? 'text-blue-600' : 'text-gray-500'}`}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading
        ? <ActivityIndicator className="mt-12" color="#3b82f6" size="large" />
        : (
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchNotices(); }} tintColor="#3b82f6" />}>
            <View className="pb-12">
              {filtered.length === 0
                ? <View className="items-center py-16">
                    <Ionicons name="exit-outline" size={48} color="#e5e7eb" />
                    <Text className="text-gray-400 font-bold mt-4">No {activeTab} notices</Text>
                  </View>
                : filtered.map(n => (
                  <NoticeCard
                    key={n._id}
                    notice={n}
                    onGenerateSettlement={() => handleGenerateSettlement(n._id)}
                    onComplete={() => handleComplete(n._id)}
                  />
                ))
              }
            </View>
          </ScrollView>
        )
      }
    </SafeAreaView>
  );
}

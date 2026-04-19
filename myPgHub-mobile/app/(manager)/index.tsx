import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getDashboard, DashboardData } from '@/api/dashboard';
import { getComplaints, Complaint } from '@/api/complaints';

export default function ManagerDashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [openComplaints, setOpenComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [dash, comp] = await Promise.all([
        getDashboard(),
        getComplaints({ status: 'Open' }),
      ]);
      setData(dash.data);
      setOpenComplaints(comp.data.slice(0, 5));
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#3b82f6" />}
      >
        <View className="px-6 pt-6 pb-12 gap-6">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Manager</Text>
              <Text className="text-2xl font-black text-gray-900">{user?.first_name} {user?.last_name}</Text>
            </View>
            <TouchableOpacity onPress={logout} className="p-2.5 bg-white rounded-full border border-gray-100"
              style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <Ionicons name="log-out-outline" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {loading
            ? <ActivityIndicator color="#3b82f6" size="large" className="mt-12" />
            : (
              <>
                {/* Stats */}
                <View className="flex-row gap-3">
                  <View className="bg-white rounded-2xl p-4 flex-1 border border-gray-100"
                    style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                    <Text className="text-2xl font-black text-blue-600">{data?.total_tenants ?? 0}</Text>
                    <Text className="text-xs text-gray-400 font-bold mt-1">Total Tenants</Text>
                  </View>
                  <View className="bg-white rounded-2xl p-4 flex-1 border border-gray-100"
                    style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                    <Text className="text-2xl font-black text-emerald-600">
                      {data ? `${Math.round(data.occupancy_rate * 100)}%` : '—'}
                    </Text>
                    <Text className="text-xs text-gray-400 font-bold mt-1">Occupancy</Text>
                  </View>
                  <View className="bg-white rounded-2xl p-4 flex-1 border border-gray-100"
                    style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                    <Text className="text-2xl font-black text-orange-600">{data?.open_complaints ?? 0}</Text>
                    <Text className="text-xs text-gray-400 font-bold mt-1">Open Issues</Text>
                  </View>
                </View>

                {/* Quick Actions */}
                <View>
                  <Text className="text-sm font-black text-gray-900 mb-4">Quick Actions</Text>
                  <View className="flex-row gap-3 mb-3">
                    {[
                      { icon: 'person-add-outline', label: 'Add Tenant', path: '/(manager)/add-tenant', color: '#3b82f6', bg: 'bg-blue-50' },
                      { icon: 'wallet-outline', label: 'Record Pay', path: '/(manager)/record-payment', color: '#10b981', bg: 'bg-emerald-50' },
                      { icon: 'alert-circle-outline', label: 'Complaints', path: '/(manager)/complaints', color: '#f97316', bg: 'bg-orange-50' },
                    ].map(a => (
                      <TouchableOpacity key={a.label} onPress={() => router.push(a.path as any)}
                        className="bg-white rounded-2xl p-4 items-center gap-3 flex-1 border border-gray-100"
                        activeOpacity={0.75}
                        style={{ shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
                        <View className={`w-12 h-12 rounded-full ${a.bg} items-center justify-center`}>
                          <Ionicons name={a.icon as any} size={22} color={a.color} />
                        </View>
                        <Text className="text-[10px] font-black text-gray-700 text-center">{a.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Open Complaints */}
                {openComplaints.length > 0 && (
                  <View>
                    <Text className="text-sm font-black text-gray-900 mb-3">Open Complaints</Text>
                    <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                      {openComplaints.map((c, i) => (
                        <View key={c._id}
                          className={`p-4 flex-row items-center gap-3 ${i < openComplaints.length - 1 ? 'border-b border-gray-50' : ''}`}>
                          <View className={`w-2 h-2 rounded-full mt-0.5 ${c.urgency === 'High' ? 'bg-red-500' : c.urgency === 'Medium' ? 'bg-amber-500' : 'bg-blue-400'}`} />
                          <View className="flex-1">
                            <Text className="text-sm font-bold text-gray-900">{c.title}</Text>
                            <Text className="text-xs text-gray-400 mt-0.5">{c.category} · {c.urgency}</Text>
                          </View>
                          <View className="bg-orange-100 px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] font-black text-orange-700">Open</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

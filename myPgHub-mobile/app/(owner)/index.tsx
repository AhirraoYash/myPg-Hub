import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getDashboard, DashboardData } from '@/api/dashboard';
import { getPayments, Payment } from '@/api/finance';

function StatCard({ label, value, sub, icon, color, onPress }: {
  label: string; value: string; sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string; onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      className="bg-white rounded-2xl p-4 border border-gray-100 flex-1 overflow-hidden"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}
    >
      <Text className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1">{label}</Text>
      <Text className={`text-2xl font-black mb-0.5 ${color}`}>{value}</Text>
      <Text className="text-gray-400 text-[9px] font-semibold">{sub}</Text>
      <Ionicons name={icon} size={32} color={color.includes('blue') ? '#dbeafe' : color.includes('emerald') ? '#d1fae5' : color.includes('red') ? '#fee2e2' : '#fef3c7'} style={{ position: 'absolute', right: 8, bottom: 8 }} />
    </TouchableOpacity>
  );
}

function ActivityItem({ payment }: { payment: Payment }) {
  const name = payment.tenant
    ? `${payment.tenant.first_name} ${payment.tenant.last_name}`
    : 'Unknown';
  const month = payment.invoice?.billing_month ?? '';
  const timeAgo = (() => {
    const diff = Date.now() - new Date(payment.created_at).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();
  return (
    <View className="flex-row items-center gap-4 p-4 border-b border-gray-50">
      <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center">
        <Ionicons name="cash" size={18} color="#059669" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-black text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</Text>
        <Text className="text-xs text-gray-500 mt-0.5">{name} · {month}</Text>
      </View>
      <Text className="text-[10px] font-bold text-gray-400">{timeAgo}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [dash, pays] = await Promise.all([
        getDashboard(),
        getPayments({ limit: 3, page: 1 }),
      ]);
      setData(dash.data);
      setRecentPayments(pays.data.slice(0, 3));
    } catch {
      // show error state silently
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning,';
    if (h < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  const occupancyPct = data
    ? `${Math.round(data.occupancy_rate * 100)}%`
    : '—';
  const occupancySub = data
    ? `${data.occupied_beds}/${data.total_beds} beds`
    : 'Loading...';

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4 flex-row justify-between items-center">
          <View>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{greeting()}</Text>
            <Text className="text-2xl font-black text-blue-600">
              {user ? `${user.first_name} ${user.last_name}` : 'Owner'}
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Ionicons name="notifications-outline" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {loading
          ? <ActivityIndicator className="mt-16" color="#3b82f6" size="large" />
          : (
            <View className="gap-6 pb-8">
              {/* Stat Grid */}
              <View className="px-6">
                <View className="flex-row gap-3 mb-3">
                  <StatCard
                    label="Total Tenants" value={String(data?.total_tenants ?? 0)}
                    sub="Active in property" icon="people" color="text-blue-600"
                    onPress={() => router.push('/(owner)/tenants')}
                  />
                  <StatCard
                    label="Occupancy" value={occupancyPct}
                    sub={occupancySub} icon="bed" color="text-emerald-600"
                  />
                </View>
                <View className="flex-row gap-3">
                  <StatCard
                    label="Pending Rent"
                    value={`₹${((data?.summary?.unpaid_amount ?? 0) / 1000).toFixed(0)}k`}
                    sub={`${data?.open_complaints ?? 0} complaints open`}
                    icon="cash" color="text-red-600"
                  />
                  <StatCard
                    label="Notice Period" value={String(data?.notice_period_tenants ?? 0)}
                    sub="Leaving soon" icon="exit" color="text-amber-600"
                    onPress={() => router.push('/(owner)/notices')}
                  />
                </View>
              </View>

              {/* Quick Actions */}
              <View className="px-6">
                <Text className="text-sm font-black text-gray-900 mb-4 tracking-wide">Quick Actions</Text>
                <View className="flex-row flex-wrap gap-3">
                  {[
                    { icon: 'person-add-outline', label: 'Add Tenant', path: '/(owner)/add-tenant' },
                    { icon: 'wallet-outline', label: 'Record Pay', path: '/(owner)/record-payment' },
                    { icon: 'shield-checkmark-outline', label: 'Verify KYC', path: '/(owner)/verify-kyc' },
                    { icon: 'alert-circle-outline', label: 'Complaints', path: '/(owner)/complaints' },
                    { icon: 'document-text-outline', label: 'Agreements', path: '/(owner)/agreements' },
                    { icon: 'exit-outline', label: 'Move-Outs', path: '/(owner)/notices' },
                  ].map((a) => (
                    <TouchableOpacity
                      key={a.label}
                      onPress={() => router.push(a.path as any)}
                      activeOpacity={0.75}
                      className="bg-white rounded-2xl p-4 items-center gap-2 border border-gray-100 w-[30%]"
                      style={{ shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
                    >
                      <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center">
                        <Ionicons name={a.icon as any} size={22} color="#3b82f6" />
                      </View>
                      <Text className="text-[10px] font-black text-gray-600 text-center">{a.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Recent Activity */}
              <View className="px-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-sm font-black text-gray-900 tracking-wide">Recent Payments</Text>
                  <TouchableOpacity onPress={() => router.push('/(owner)/payments')}>
                    <Text className="text-xs font-bold text-blue-600">View All</Text>
                  </TouchableOpacity>
                </View>
                <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                  style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
                  {recentPayments.length === 0
                    ? <View className="py-8 items-center">
                        <Text className="text-gray-400 text-sm">No payments yet</Text>
                      </View>
                    : recentPayments.map(p => <ActivityItem key={p._id} payment={p} />)
                  }
                </View>
              </View>
            </View>
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
}

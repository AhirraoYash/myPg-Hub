import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getInvoices, Invoice } from '@/api/finance';
import { getComplaints, Complaint } from '@/api/complaints';

function ActionButton({ icon, label, color, bg, onPress }: {
  icon: string; label: string; color: string; bg: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}
      className="bg-white rounded-2xl p-4 items-center gap-3 border border-gray-100 flex-1"
      style={{ shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
      <View className={`w-12 h-12 rounded-full ${bg} items-center justify-center`}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text className="text-xs font-black text-gray-900 text-center">{label}</Text>
    </TouchableOpacity>
  );
}

export default function TenantDashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [unpaidInvoice, setUnpaidInvoice] = useState<Invoice | null>(null);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [invRes, compRes] = await Promise.all([
        getInvoices({ status: 'Unpaid' }),
        getComplaints({ status: 'Open' }),
      ]);
      setUnpaidInvoice(invRes.data[0] ?? null);
      setActiveComplaint(compRes.data[0] ?? null);
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#6366f1" />}
      >
        {loading
          ? <ActivityIndicator className="mt-24" color="#6366f1" size="large" />
          : (
            <View className="px-6 pt-6 pb-12 gap-6">
              {/* Header */}
              <View className="flex-row justify-between items-center">
                <TouchableOpacity onPress={() => router.push('/(tenant)/profile')} className="flex-row items-center gap-3" activeOpacity={0.8}>
                  <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center">
                    <Text className="text-lg font-black text-indigo-600">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm text-gray-500">{greeting()},</Text>
                    <Text className="text-xl font-black text-gray-900">Hi, {user?.first_name} 👋</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100"
                  style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
                  <Ionicons name="notifications-outline" size={20} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* Dues Card */}
              <View className="bg-indigo-600 rounded-3xl p-6"
                style={{ shadowColor: '#6366f1', shadowOpacity: 0.25, shadowRadius: 20, elevation: 6 }}>
                <Text className="text-xs font-black text-indigo-200 uppercase tracking-wider mb-1">Pending Dues</Text>
                <Text className="text-3xl font-black text-white mb-4">
                  {unpaidInvoice ? `₹${unpaidInvoice.amount_due.toLocaleString('en-IN')}` : '₹0'}
                </Text>
                {unpaidInvoice ? (
                  <TouchableOpacity
                    onPress={() => router.push('/(tenant)/accounts')}
                    className="bg-white py-3 px-5 rounded-xl self-start flex-row items-center gap-2"
                    activeOpacity={0.85}
                  >
                    <Text className="text-indigo-600 font-black text-sm">Pay Now</Text>
                    <Ionicons name="arrow-forward" size={14} color="#6366f1" />
                  </TouchableOpacity>
                ) : (
                  <View className="bg-white/20 py-2 px-4 rounded-xl self-start">
                    <Text className="text-white font-black text-sm">All Clear ✓</Text>
                  </View>
                )}
              </View>

              {/* Active Complaint */}
              {activeComplaint && (
                <View className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
                    <Ionicons name="construct-outline" size={18} color="#f97316" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-black text-gray-900">{activeComplaint.title}</Text>
                    <View className="flex-row items-center gap-1.5 mt-1">
                      <View className="w-2 h-2 bg-orange-500 rounded-full" />
                      <Text className="text-xs font-bold text-orange-600">
                        {activeComplaint.status.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                </View>
              )}

              {/* Quick Actions */}
              <View>
                <Text className="text-sm font-black text-gray-900 mb-4">Quick Actions</Text>
                <View className="flex-row gap-3 mb-3">
                  <ActionButton icon="receipt-outline" label="Accounts" color="#3b82f6" bg="bg-blue-50" onPress={() => router.push('/(tenant)/accounts')} />
                  <ActionButton icon="construct-outline" label="Complaints" color="#f97316" bg="bg-orange-50" onPress={() => router.push('/(tenant)/raise-complaint')} />
                  <ActionButton icon="people-outline" label="Gate Pass" color="#10b981" bg="bg-emerald-50" onPress={() => router.push('/(tenant)/gate-pass')} />
                </View>
                <View className="flex-row gap-3">
                  <ActionButton icon="bed-outline" label="My Room" color="#6366f1" bg="bg-indigo-50" onPress={() => router.push('/(tenant)/room')} />
                  <ActionButton icon="folder-outline" label="Documents" color="#8b5cf6" bg="bg-purple-50" onPress={() => router.push('/(tenant)/documents')} />
                  <ActionButton icon="exit-outline" label="Move Out" color="#ef4444" bg="bg-red-50" onPress={() => router.push('/(tenant)/move-out')} />
                </View>
              </View>

              {/* Logout */}
              <TouchableOpacity
                onPress={logout}
                className="py-4 rounded-xl border-2 border-gray-200 flex-row items-center justify-center gap-2"
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={16} color="#6b7280" />
                <Text className="text-sm font-black text-gray-500">Log Out</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
}

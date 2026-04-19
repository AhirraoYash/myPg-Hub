import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTenant, Tenant } from '@/api/tenants';
import { getInvoices, Invoice } from '@/api/finance';
import { getComplaints, Complaint } from '@/api/complaints';

export default function TenantProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      const [t, inv, comp] = await Promise.all([
        getTenant(id),
        getInvoices({ tenant_id: id, limit: 5 }),
        getComplaints(),
      ]);
      setTenant(t.data);
      setInvoices(inv.data);
      // Filter complaints by tenant_id manually since API doesn't support it
      setComplaints(comp.data.filter(c => c.tenant_id === id).slice(0, 3));
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center" edges={['top']}>
        <ActivityIndicator color="#3b82f6" size="large" />
      </SafeAreaView>
    );
  }

  if (!tenant) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center" edges={['top']}>
        <Text className="text-gray-400 font-bold">Tenant not found</Text>
      </SafeAreaView>
    );
  }

  const initials = `${tenant.first_name?.[0] ?? ''}${tenant.last_name?.[0] ?? ''}`.toUpperCase();
  const joiningDate = tenant.joining_date
    ? new Date(tenant.joining_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const unpaidTotal = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount_due, 0);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-black text-gray-900">Tenant Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#3b82f6" />}>
        <View className="px-6 pb-12 gap-5">

          {/* Profile Card */}
          <View className="bg-white rounded-3xl p-5 border border-gray-100 items-center"
            style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 16, elevation: 3 }}>
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
              <Text className="text-2xl font-black text-blue-600">{initials}</Text>
            </View>
            <Text className="text-xl font-black text-gray-900">{tenant.first_name} {tenant.last_name}</Text>
            <Text className="text-sm text-gray-500 mt-1">+91 {tenant.phone}</Text>
            {tenant.email && <Text className="text-xs text-gray-400 mt-0.5">{tenant.email}</Text>}
            <View className={`mt-3 px-3 py-1 rounded-full ${tenant.is_active ? 'bg-emerald-100' : 'bg-red-100'}`}>
              <Text className={`text-[10px] font-black ${tenant.is_active ? 'text-emerald-700' : 'text-red-700'}`}>
                {tenant.is_active ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>

          {/* Info */}
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
            {[
              { icon: 'bed-outline', label: 'Room', value: tenant.room ? `Room ${tenant.room.room_number}` : '—' },
              { icon: 'barcode-outline', label: 'Bed', value: tenant.bed ? tenant.bed.bed_identifier : '—' },
              { icon: 'cash-outline', label: 'Monthly Rent', value: tenant.bed ? `₹${tenant.bed.price?.toLocaleString('en-IN')}` : '—' },
              { icon: 'calendar-outline', label: 'Joined On', value: joiningDate },
              { icon: 'wallet-outline', label: 'Outstanding', value: `₹${unpaidTotal.toLocaleString('en-IN')}` },
            ].map((row, i, arr) => (
              <View key={row.label} className={`flex-row items-center px-4 py-4 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <View className="w-9 h-9 bg-gray-50 rounded-xl items-center justify-center mr-3">
                  <Ionicons name={row.icon as any} size={18} color="#6b7280" />
                </View>
                <Text className="text-sm text-gray-500 flex-1">{row.label}</Text>
                <Text className="text-sm font-black text-gray-900">{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push('/(owner)/record-payment')}
              className="flex-1 bg-blue-600 py-3 rounded-xl items-center flex-row justify-center gap-2"
              activeOpacity={0.8}
            >
              <Ionicons name="cash-outline" size={16} color="white" />
              <Text className="text-xs font-black text-white">Record Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(owner)/notices')}
              className="flex-1 bg-red-50 border border-red-100 py-3 rounded-xl items-center flex-row justify-center gap-2"
              activeOpacity={0.8}
            >
              <Ionicons name="exit-outline" size={16} color="#ef4444" />
              <Text className="text-xs font-black text-red-600">Move Out</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Invoices */}
          {invoices.length > 0 && (
            <View>
              <Text className="text-sm font-black text-gray-900 mb-3">Recent Invoices</Text>
              <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                {invoices.slice(0, 4).map((inv, i) => {
                  const colors: Record<string, string> = {
                    Paid: 'text-emerald-600', Unpaid: 'text-red-600',
                    Partial: 'text-amber-600', Payment_Under_Review: 'text-blue-600',
                  };
                  return (
                    <View key={inv._id} className={`flex-row items-center px-4 py-3 ${i < Math.min(invoices.length - 1, 3) ? 'border-b border-gray-50' : ''}`}>
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-gray-900">{inv.billing_month}</Text>
                        <Text className="text-xs text-gray-400">₹{inv.total_amount.toLocaleString('en-IN')}</Text>
                      </View>
                      <Text className={`text-xs font-black ${colors[inv.status] ?? 'text-gray-600'}`}>
                        {inv.status.replace(/_/g, ' ')}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getInvoices, getPayments, Invoice, Payment } from '@/api/finance';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Paid: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Unpaid: { bg: 'bg-red-100', text: 'text-red-700' },
  Partial: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Payment_Under_Review: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

export default function TenantAccountsScreen() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'invoices' | 'payments'>('invoices');

  const fetchData = async () => {
    try {
      const [inv, pays] = await Promise.all([
        getInvoices({ page: 1, limit: 20 }),
        getPayments({ page: 1, limit: 20 }),
      ]);
      setInvoices(inv.data);
      setPayments(pays.data);
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const totalDue = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount_due, 0);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-black text-gray-900">My Account</Text>
          <Text className="text-xs text-gray-400 font-semibold">Invoices & Payment History</Text>
        </View>
      </View>

      {/* Due Summary */}
      {totalDue > 0 && (
        <View className="mx-6 mb-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] font-black text-red-400 uppercase tracking-wider mb-1">Outstanding Amount</Text>
            <Text className="text-2xl font-black text-red-600">₹{totalDue.toLocaleString('en-IN')}</Text>
          </View>
          <Ionicons name="alert-circle" size={32} color="#fca5a5" />
        </View>
      )}

      {/* Tabs */}
      <View className="mx-6 mb-4 bg-gray-100 rounded-xl p-1 flex-row">
        {[['invoices', 'Invoices'], ['payments', 'Payments']].map(([key, label]) => (
          <TouchableOpacity key={key} onPress={() => setTab(key as any)}
            className={`flex-1 py-2 rounded-lg items-center ${tab === key ? 'bg-white' : ''}`}>
            <Text className={`text-xs font-black ${tab === key ? 'text-blue-600' : 'text-gray-500'}`}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading
        ? <ActivityIndicator className="mt-12" color="#6366f1" size="large" />
        : (
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#6366f1" />}>
            <View className="pb-12">
              {tab === 'invoices'
                ? invoices.length === 0
                  ? <View className="items-center py-16"><Ionicons name="receipt-outline" size={48} color="#e5e7eb" /><Text className="text-gray-400 font-bold mt-4">No invoices yet</Text></View>
                  : invoices.map(inv => {
                    const s = STATUS_COLORS[inv.status] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };
                    return (
                      <View key={inv._id} className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
                        style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                        <View className="flex-row justify-between items-center mb-2">
                          <Text className="text-sm font-black text-gray-900">{inv.billing_month}</Text>
                          <View className={`px-2.5 py-1 rounded-lg ${s.bg}`}>
                            <Text className={`text-[10px] font-black ${s.text}`}>{inv.status.replace(/_/g, ' ')}</Text>
                          </View>
                        </View>
                        <Text className="text-2xl font-black text-gray-900">₹{inv.total_amount.toLocaleString('en-IN')}</Text>
                        {inv.amount_due > 0 && (
                          <Text className="text-xs text-red-500 font-bold mt-1">Due: ₹{inv.amount_due.toLocaleString('en-IN')}</Text>
                        )}
                        <Text className="text-xs text-gray-400 mt-1">
                          Due {new Date(inv.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </Text>
                      </View>
                    );
                  })
                : payments.length === 0
                  ? <View className="items-center py-16"><Ionicons name="cash-outline" size={48} color="#e5e7eb" /><Text className="text-gray-400 font-bold mt-4">No payments yet</Text></View>
                  : payments.map(pay => (
                    <View key={pay._id} className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center gap-4"
                      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                      <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center">
                        <Ionicons name="checkmark-circle" size={20} color="#059669" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-black text-gray-900">₹{pay.amount.toLocaleString('en-IN')}</Text>
                        <Text className="text-xs text-gray-400 mt-0.5">{pay.payment_method} · {new Date(pay.created_at).toLocaleDateString('en-IN')}</Text>
                      </View>
                      <View className={`px-2.5 py-1 rounded-lg ${pay.status === 'Completed' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                        <Text className={`text-[10px] font-black ${pay.status === 'Completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {pay.status.replace(/_/g, ' ')}
                        </Text>
                      </View>
                    </View>
                  ))
              }
            </View>
          </ScrollView>
        )
      }
    </SafeAreaView>
  );
}

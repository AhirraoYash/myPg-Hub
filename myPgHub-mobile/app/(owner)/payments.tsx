import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getInvoices, getPayments, Invoice, Payment } from '@/api/finance';
import { verifyCashPayment } from '@/api/finance';

const STATUS_COLORS: Record<string, string> = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Unpaid: 'bg-red-100 text-red-700',
  Partial: 'bg-amber-100 text-amber-700',
  Payment_Under_Review: 'bg-blue-100 text-blue-700',
  Pending_Verification: 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Failed: 'bg-red-100 text-red-700',
};

function InvoiceCard({ invoice, onVerify }: { invoice: Invoice; onVerify?: () => void }) {
  const name = invoice.tenant
    ? `${invoice.tenant.first_name} ${invoice.tenant.last_name}`
    : 'Tenant';
  const badge = STATUS_COLORS[invoice.status] ?? 'bg-gray-100 text-gray-700';
  const overdue = new Date(invoice.due_date) < new Date() && invoice.status !== 'Paid';

  return (
    <View
      className={`bg-white rounded-2xl p-4 mb-3 border ${overdue ? 'border-red-100' : 'border-gray-100'}`}
      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-sm font-black text-gray-900">{name}</Text>
          <Text className="text-xs text-gray-400 font-semibold mt-0.5">{invoice.billing_month}</Text>
        </View>
        <View className={`px-2.5 py-1 rounded-lg ${badge.split(' ')[0]}`}>
          <Text className={`text-[10px] font-black ${badge.split(' ')[1]}`}>
            {invoice.status.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-black text-gray-900">
            ₹{invoice.total_amount.toLocaleString('en-IN')}
          </Text>
          {invoice.amount_due > 0 && (
            <Text className="text-xs text-red-500 font-bold mt-0.5">
              Due: ₹{invoice.amount_due.toLocaleString('en-IN')}
            </Text>
          )}
        </View>
        <View className="items-end">
          <Text className="text-[10px] text-gray-400 font-semibold">
            Due {new Date(invoice.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </Text>
          {overdue && <Text className="text-[10px] font-black text-red-500 mt-0.5">OVERDUE</Text>}
        </View>
      </View>

      {invoice.status === 'Payment_Under_Review' && onVerify && (
        <TouchableOpacity
          onPress={onVerify}
          className="mt-3 bg-blue-600 py-2.5 rounded-xl items-center"
          activeOpacity={0.8}
        >
          <Text className="text-xs font-black text-white">Verify Cash Payment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function PaymentsScreen() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unpaid' | 'review'>('all');

  const fetchData = async () => {
    try {
      const res = await getInvoices({ page: 1, limit: 30 });
      setInvoices(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = invoices.filter(inv => {
    if (activeTab === 'unpaid') return ['Unpaid', 'Partial'].includes(inv.status);
    if (activeTab === 'review') return inv.status === 'Payment_Under_Review';
    return true;
  });

  const totalUnpaid = invoices
    .filter(i => i.status !== 'Paid')
    .reduce((s, i) => s + i.amount_due, 0);

  const handleVerify = async (invoice: Invoice) => {
    // find the payment for this invoice
    try {
      const pays = await getPayments({ page: 1, limit: 10 });
      const pay = pays.data.find(p => (p.invoice_id as any) === invoice._id || (p.invoice_id as any)?._id === invoice._id);
      if (pay) { await verifyCashPayment(pay._id); fetchData(); }
    } catch { /* silent */ }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-black text-gray-900">Payments</Text>
          <Text className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Invoices & Collections</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(owner)/record-payment')}
          className="bg-blue-600 px-4 py-2 rounded-xl flex-row items-center gap-1.5"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color="white" />
          <Text className="text-xs font-black text-white">Record</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View className="mx-6 mb-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex-row items-center justify-between">
        <View>
          <Text className="text-[10px] font-black text-red-400 uppercase tracking-wider mb-1">Total Outstanding</Text>
          <Text className="text-2xl font-black text-red-600">₹{totalUnpaid.toLocaleString('en-IN')}</Text>
        </View>
        <Ionicons name="alert-circle" size={32} color="#fca5a5" />
      </View>

      {/* Tabs */}
      <View className="mx-6 mb-4 bg-gray-100 rounded-xl p-1 flex-row">
        {[['all', 'All'], ['unpaid', 'Unpaid'], ['review', 'Review']] .map(([key, label]) => (
          <TouchableOpacity
            key={key}
            onPress={() => setActiveTab(key as any)}
            className={`flex-1 py-2 rounded-lg items-center ${activeTab === key ? 'bg-white' : ''}`}
          >
            <Text className={`text-xs font-black ${activeTab === key ? 'text-blue-600' : 'text-gray-500'}`}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading
        ? <ActivityIndicator className="mt-12" color="#3b82f6" size="large" />
        : (
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#3b82f6" />}
          >
            <View className="pb-32">
              {filtered.length === 0
                ? (
                  <View className="items-center py-16">
                    <Ionicons name="receipt-outline" size={48} color="#e5e7eb" />
                    <Text className="text-gray-400 font-bold mt-4">No invoices here</Text>
                  </View>
                )
                : filtered.map(inv => (
                  <InvoiceCard
                    key={inv._id}
                    invoice={inv}
                    onVerify={inv.status === 'Payment_Under_Review' ? () => handleVerify(inv) : undefined}
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

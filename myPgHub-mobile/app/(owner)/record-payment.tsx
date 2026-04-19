import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getInvoices, recordPayment, Invoice } from '@/api/finance';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Bank_Transfer'] as const;
type PaymentMethod = typeof PAYMENT_METHODS[number];

export default function RecordPaymentScreen() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    method: 'Cash' as PaymentMethod,
    transaction_id: '',
    notes: '',
  });

  useEffect(() => {
    getInvoices({ status: 'Unpaid', limit: 30 })
      .then(res => setInvoices(res.data))
      .catch(() => {})
      .finally(() => setLoadingInvoices(false));
  }, []);

  const handleSubmit = async () => {
    if (!selectedInvoice) { Alert.alert('Select Invoice', 'Please select an invoice to pay.'); return; }
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      Alert.alert('Invalid Amount', 'Enter a valid payment amount.'); return;
    }
    setSubmitting(true);
    try {
      await recordPayment({
        invoice_id: selectedInvoice._id,
        tenant_id: selectedInvoice.tenant_id,
        amount: Number(form.amount),
        payment_method: form.method,
        transaction_id: form.transaction_id || undefined,
        notes: form.notes || undefined,
      });
      Alert.alert('Payment Recorded ✓', 'The payment has been recorded successfully.', [
        { text: 'Done', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to record payment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-black text-gray-900">Record Payment</Text>
            <Text className="text-xs text-gray-400 font-semibold">Mark an invoice as paid</Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="pt-2 pb-12 gap-4">

            {/* Select Invoice */}
            <View className="bg-white rounded-2xl p-4 border border-gray-100"
              style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3 ml-1">Select Invoice</Text>
              {loadingInvoices
                ? <ActivityIndicator color="#3b82f6" />
                : invoices.length === 0
                  ? <Text className="text-sm text-gray-400 text-center py-4">No unpaid invoices found</Text>
                  : invoices.map(inv => {
                    const name = inv.tenant ? `${inv.tenant.first_name} ${inv.tenant.last_name}` : 'Tenant';
                    const isSelected = selectedInvoice?._id === inv._id;
                    return (
                      <TouchableOpacity
                        key={inv._id}
                        onPress={() => {
                          setSelectedInvoice(inv);
                          setForm(f => ({ ...f, amount: String(inv.amount_due) }));
                        }}
                        className={`p-3 rounded-xl border mb-2 flex-row items-center justify-between ${isSelected ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                        activeOpacity={0.7}
                      >
                        <View>
                          <Text className={`text-sm font-black ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{name}</Text>
                          <Text className={`text-xs mt-0.5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>{inv.billing_month}</Text>
                        </View>
                        <View className="items-end">
                          <Text className={`text-base font-black ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>₹{inv.amount_due.toLocaleString('en-IN')}</Text>
                          {isSelected && <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />}
                        </View>
                      </TouchableOpacity>
                    );
                  })
              }
            </View>

            {/* Payment Details */}
            <View className="bg-white rounded-2xl p-4 border border-gray-100 gap-4"
              style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Payment Details</Text>

              <View>
                <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Amount (₹)</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-lg font-black text-gray-900"
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={form.amount}
                  onChangeText={v => setForm(f => ({ ...f, amount: v.replace(/[^0-9]/g, '') }))}
                />
              </View>

              <View>
                <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Payment Method</Text>
                <View className="flex-row gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <TouchableOpacity
                      key={m}
                      onPress={() => setForm(f => ({ ...f, method: m }))}
                      className={`flex-1 py-3 rounded-xl border items-center ${form.method === m ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                      activeOpacity={0.7}
                    >
                      <Text className={`text-xs font-black ${form.method === m ? 'text-white' : 'text-gray-700'}`}>
                        {m.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {form.method !== 'Cash' && (
                <View>
                  <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Transaction ID</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900"
                    placeholder="UPI / Bank reference number"
                    placeholderTextColor="#9ca3af"
                    value={form.transaction_id}
                    onChangeText={v => setForm(f => ({ ...f, transaction_id: v }))}
                  />
                </View>
              )}

              <View>
                <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Notes (Optional)</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900"
                  placeholder="Any additional notes..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  value={form.notes}
                  onChangeText={v => setForm(f => ({ ...f, notes: v }))}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting || !selectedInvoice}
              className={`py-4 rounded-2xl items-center flex-row justify-center gap-2 ${!selectedInvoice ? 'bg-gray-300' : 'bg-emerald-600'}`}
              activeOpacity={0.8}
              style={selectedInvoice ? { shadowColor: '#059669', shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 } : {}}
            >
              {submitting
                ? <ActivityIndicator color="white" />
                : <>
                    <Ionicons name="checkmark-circle-outline" size={18} color="white" />
                    <Text className="text-white font-black text-sm">Record Payment</Text>
                  </>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

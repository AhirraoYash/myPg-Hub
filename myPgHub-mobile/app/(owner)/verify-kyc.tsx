import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  RefreshControl, Alert, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getTenant, Tenant } from '@/api/tenants';
import { getInvoices, Invoice } from '@/api/finance';

export default function VerifyKYCScreen() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchTenants = async () => {
    try {
      // Get all tenants — KYC pending check
      const { listTenants } = await import('@/api/tenants');
      const res = await listTenants(1, 50);
      // Show only tenants without KYC verified
      setTenants(res.data.filter(t => !t.kyc_verified));
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchTenants(); }, []);

  const handleVerify = async (tenant: Tenant) => {
    Alert.alert(
      'Verify KYC',
      `Mark ${tenant.first_name} ${tenant.last_name}'s KYC as verified?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify ✓',
          onPress: async () => {
            try {
              const { verifyTenantKYC } = await import('@/api/tenants');
              await verifyTenantKYC(tenant.user_id ?? tenant._id);
              fetchTenants();
            } catch (err: any) {
              Alert.alert('Error', err?.message ?? 'Failed to verify KYC.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-black text-gray-900">Verify KYC</Text>
          <Text className="text-xs text-gray-400 font-semibold">{loading ? '...' : `${tenants.length} pending verification`}</Text>
        </View>
      </View>

      {loading
        ? <ActivityIndicator className="mt-12" color="#6366f1" size="large" />
        : (
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTenants(); }} tintColor="#6366f1" />}>
            <View className="pt-2 pb-12 gap-3">
              {tenants.length === 0
                ? (
                  <View className="items-center py-20">
                    <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-4">
                      <Ionicons name="shield-checkmark" size={40} color="#059669" />
                    </View>
                    <Text className="text-gray-900 font-black text-lg text-center">All KYC Verified!</Text>
                    <Text className="text-gray-400 font-medium text-sm text-center mt-2">No tenants pending KYC verification.</Text>
                  </View>
                )
                : tenants.map(t => {
                  const initials = `${t.first_name?.[0] ?? ''}${t.last_name?.[0] ?? ''}`.toUpperCase();
                  return (
                    <View key={t._id} className="bg-white rounded-2xl p-4 border border-gray-100 flex-row items-center gap-4"
                      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                      <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center">
                        <Text className="text-base font-black text-indigo-600">{initials}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-black text-gray-900">{t.first_name} {t.last_name}</Text>
                        <Text className="text-xs text-gray-400 mt-0.5">+91 {t.phone}</Text>
                        <View className="flex-row items-center gap-1.5 mt-1">
                          <View className="w-2 h-2 bg-amber-500 rounded-full" />
                          <Text className="text-[10px] font-black text-amber-600 uppercase tracking-wider">KYC Pending</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleVerify(t)}
                        className="bg-indigo-600 px-3 py-2 rounded-xl"
                        activeOpacity={0.8}
                      >
                        <Text className="text-[11px] font-black text-white">Verify</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              }
            </View>
          </ScrollView>
        )
      }
    </SafeAreaView>
  );
}

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { listTenants, Tenant } from '@/api/tenants';

function TenantCard({ tenant, onPress }: { tenant: Tenant; onPress: () => void }) {
  const initials = `${tenant.first_name?.[0] ?? ''}${tenant.last_name?.[0] ?? ''}`.toUpperCase();
  const room = tenant.room?.room_number ?? '—';
  const bed = tenant.bed?.bed_identifier ?? '—';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center gap-4"
      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
      <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center shrink-0">
        <Text className="text-base font-black text-blue-600">{initials}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-black text-gray-900">{tenant.first_name} {tenant.last_name}</Text>
        <Text className="text-xs text-gray-500 mt-0.5">+91 {tenant.phone}</Text>
        <Text className="text-xs text-gray-400 mt-0.5">Room {room} · Bed {bed}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
    </TouchableOpacity>
  );
}

export default function TenantListScreen() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filtered, setFiltered] = useState<Tenant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTenants = async () => {
    try {
      const res = await listTenants(1, 50);
      setTenants(res.data);
      setFiltered(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchTenants(); }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(tenants); return; }
    const q = search.toLowerCase();
    setFiltered(tenants.filter(t =>
      `${t.first_name} ${t.last_name}`.toLowerCase().includes(q) ||
      t.phone.includes(q)
    ));
  }, [search, tenants]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3">
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-2xl font-black text-gray-900">Tenants</Text>
            <Text className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{tenants.length} Active</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(owner)/add-tenant')}
            className="bg-blue-600 px-4 py-2 rounded-xl flex-row items-center gap-1.5"
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-xs font-black text-white">Add</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
          <Ionicons name="search" size={16} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-sm font-medium text-gray-900"
            placeholder="Search tenants..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading
        ? <ActivityIndicator className="mt-12" color="#3b82f6" size="large" />
        : (
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTenants(); }} tintColor="#3b82f6" />}
          >
            <View className="pb-32 pt-3">
              {filtered.length === 0
                ? (
                  <View className="items-center py-20">
                    <Ionicons name="person-outline" size={48} color="#e5e7eb" />
                    <Text className="text-gray-900 font-black mt-4">No Tenants Found</Text>
                  </View>
                )
                : filtered.map(t => (
                  <TenantCard
                    key={t.user_id ?? t._id}
                    tenant={t}
                    onPress={() => router.push(`/(owner)/tenant/${t.user_id ?? t._id}` as any)}
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

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  TextInput, Alert, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getProperty, updateProperty } from '@/api/properties';

const SERVICES = ['WiFi', 'AC', 'Meals', 'Security', 'Power Backup', 'Laundry', 'Parking', 'CCTV'];
const AMENITIES = ['Attached Washroom', 'Balcony', 'Air Conditioning', 'Window', 'Geyser'];

export default function ManagePropertyScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFloorModal, setShowFloorModal] = useState(false);
  const [floorId, setFloorId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    address: '',
    notice_period_days: '30',
    services: [] as string[],
  });

  useEffect(() => {
    getProperty()
      .then(res => {
        const p = res.data;
        setForm({
          name: p.name ?? '',
          address: p.address ?? '',
          notice_period_days: String(p.notice_period_days ?? 30),
          services: p.services ?? [],
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleService = (s: string) => {
    setForm(f => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProperty({
        name: form.name,
        address: form.address,
        notice_period_days: Number(form.notice_period_days),
        services: form.services,
      });
      Alert.alert('Saved ✓', 'Property details updated successfully.');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center" edges={['top']}>
        <ActivityIndicator color="#3b82f6" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-black text-gray-900">Manage Property</Text>
          <Text className="text-xs text-gray-400 font-semibold">Configure building settings</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="pt-2 pb-12 gap-5">

          {/* Property Details */}
          <View className="bg-white rounded-2xl p-5 border border-gray-100 gap-4"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
            <View className="flex-row items-center gap-3 mb-1">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                <Ionicons name="business-outline" size={20} color="#3b82f6" />
              </View>
              <Text className="text-sm font-black text-gray-900">Property Details</Text>
            </View>

            <View>
              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Property Name</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900"
                placeholder="e.g. MyPG Hub - Koramangala"
                placeholderTextColor="#9ca3af"
                value={form.name}
                onChangeText={v => setForm(f => ({ ...f, name: v }))}
              />
            </View>

            <View>
              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Address</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900"
                placeholder="Street, Area, City, State"
                placeholderTextColor="#9ca3af"
                value={form.address}
                onChangeText={v => setForm(f => ({ ...f, address: v }))}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View>
              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Notice Period (Days)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900"
                placeholder="30"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={form.notice_period_days}
                onChangeText={v => setForm(f => ({ ...f, notice_period_days: v.replace(/[^0-9]/g, '') }))}
              />
            </View>
          </View>

          {/* Services */}
          <View className="bg-white rounded-2xl p-5 border border-gray-100"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center">
                <Ionicons name="sparkles-outline" size={20} color="#10b981" />
              </View>
              <Text className="text-sm font-black text-gray-900">Services & Amenities</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {SERVICES.map(s => {
                const active = form.services.includes(s);
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => toggleService(s)}
                    className={`px-4 py-2 rounded-full border ${active ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-200'}`}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-xs font-black ${active ? 'text-white' : 'text-gray-600'}`}>{s}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Stats Info */}
          <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex-row items-center gap-3">
            <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
            <Text className="text-xs text-blue-700 font-medium flex-1 leading-relaxed">
              To add or remove rooms and beds, use the Rooms tab. Structural changes (floors/rooms) are managed from there.
            </Text>
          </View>

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="bg-blue-600 py-4 rounded-2xl items-center flex-row justify-center gap-2"
            activeOpacity={0.8}
            style={{ shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 }}
          >
            {saving
              ? <ActivityIndicator color="white" />
              : <>
                  <Ionicons name="save-outline" size={18} color="white" />
                  <Text className="text-white font-black text-sm">Save Changes</Text>
                </>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

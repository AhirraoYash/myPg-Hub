import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onboardTenant } from '@/api/tenants';
import { ApiError } from '@/api/client';

// Manager version — identical form to owner's add-tenant
export default function ManagerAddTenantScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', email: '', bed_id: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.first_name || !form.phone || !form.bed_id) {
      Alert.alert('Missing Fields', 'First name, phone, and Bed ID are required.');
      return;
    }
    if (form.phone.length < 10) {
      Alert.alert('Invalid Phone', 'Enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    try {
      await onboardTenant(form);
      Alert.alert('Success! 🎉', "Tenant onboarded. Their default PIN is the last 4 digits of their phone.", [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to onboard tenant.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'first_name', label: 'First Name *', placeholder: 'e.g. Rahul', keyboard: 'default' },
    { key: 'last_name', label: 'Last Name', placeholder: 'e.g. Sharma', keyboard: 'default' },
    { key: 'phone', label: 'Phone Number *', placeholder: '10 digit mobile', keyboard: 'phone-pad' },
    { key: 'email', label: 'Email (Optional)', placeholder: 'tenant@email.com', keyboard: 'email-address' },
    { key: 'bed_id', label: 'Bed ID *', placeholder: 'MongoDB _id of the bed', keyboard: 'default' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-black text-gray-900">Add Tenant</Text>
            <Text className="text-xs text-gray-400 font-semibold">Onboard a new resident</Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="pt-2 pb-12 gap-4">
            <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex-row gap-3">
              <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
              <Text className="text-xs text-blue-700 font-semibold flex-1 leading-relaxed">
                Default PIN = last 4 digits of their phone number.
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 border border-gray-100 gap-4"
              style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
              {fields.map(f => (
                <View key={f.key}>
                  <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">{f.label}</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900"
                    placeholder={f.placeholder}
                    placeholderTextColor="#9ca3af"
                    keyboardType={f.keyboard as any}
                    maxLength={f.key === 'phone' ? 10 : undefined}
                    value={(form as any)[f.key]}
                    onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                    autoCapitalize={f.keyboard === 'email-address' ? 'none' : 'words'}
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="bg-blue-600 py-4 rounded-2xl items-center flex-row justify-center gap-2"
              activeOpacity={0.8}
              style={{ shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 }}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <>
                    <Ionicons name="person-add" size={18} color="white" />
                    <Text className="text-white font-black text-sm">Onboard Tenant</Text>
                  </>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

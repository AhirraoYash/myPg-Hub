import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function GatePassScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ visitor_name: '', purpose: '', vehicle: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.visitor_name || !form.purpose) {
      Alert.alert('Missing Info', 'Visitor name and purpose are required.');
      return;
    }
    setLoading(true);
    // Gate pass submission (feature placeholder - backend endpoint TBD)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-black text-gray-900">Gate Pass</Text>
          <Text className="text-xs text-gray-400 font-semibold">Request visitor entry</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {submitted
          ? (
            <View className="items-center py-16 gap-4">
              <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center">
                <Ionicons name="checkmark-circle" size={48} color="#059669" />
              </View>
              <Text className="text-xl font-black text-gray-900">Pass Generated!</Text>
              <Text className="text-sm text-gray-400 text-center px-6 leading-relaxed">
                Show this confirmation to the security guard at the gate.
              </Text>
              <View className="bg-white rounded-2xl p-6 border-2 border-dashed border-emerald-300 w-full items-center mt-2"
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
                <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Visitor</Text>
                <Text className="text-xl font-black text-gray-900">{form.visitor_name}</Text>
                <Text className="text-sm text-gray-500 mt-1">{form.purpose}</Text>
                {form.vehicle && <Text className="text-xs text-gray-400 mt-1">Vehicle: {form.vehicle}</Text>}
                <View className="mt-3 bg-emerald-100 px-4 py-1.5 rounded-full">
                  <Text className="text-[10px] font-black text-emerald-700">VALID FOR TODAY ONLY</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => { setSubmitted(false); setForm({ visitor_name: '', purpose: '', vehicle: '' }); }}
                className="bg-blue-600 px-8 py-3.5 rounded-2xl mt-2">
                <Text className="text-white font-black">New Pass</Text>
              </TouchableOpacity>
            </View>
          )
          : (
            <View className="pt-2 pb-12 gap-4">
              <View className="bg-white rounded-2xl p-4 border border-gray-100 gap-4"
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
                {[
                  { key: 'visitor_name', label: 'Visitor Name *', placeholder: 'Full name of visitor', keyboard: 'default' },
                  { key: 'purpose', label: 'Purpose of Visit *', placeholder: 'e.g. Meeting, Delivery...', keyboard: 'default' },
                  { key: 'vehicle', label: 'Vehicle Number (Optional)', placeholder: 'e.g. MH12AB1234', keyboard: 'default' },
                ].map(f => (
                  <View key={f.key}>
                    <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">{f.label}</Text>
                    <TextInput
                      className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900"
                      placeholder={f.placeholder}
                      placeholderTextColor="#9ca3af"
                      keyboardType={f.keyboard as any}
                      value={(form as any)[f.key]}
                      onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                    />
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="bg-emerald-600 py-4 rounded-2xl items-center flex-row justify-center gap-2"
                activeOpacity={0.8}
                style={{ shadowColor: '#059669', shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 }}
              >
                {loading
                  ? <ActivityIndicator color="white" />
                  : <>
                      <Ionicons name="shield-checkmark-outline" size={18} color="white" />
                      <Text className="text-white font-black text-sm">Generate Gate Pass</Text>
                    </>
                }
              </TouchableOpacity>
            </View>
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
}

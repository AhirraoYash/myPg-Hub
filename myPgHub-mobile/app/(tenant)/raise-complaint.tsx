import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createComplaint } from '@/api/complaints';

const CATEGORIES = ['Plumbing', 'Electrical', 'Cleaning', 'WiFi', 'Other'];
const URGENCY = ['Low', 'Medium', 'High'];

export default function RaiseComplaintScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', category: 'Other', urgency: 'Medium',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      Alert.alert('Missing Fields', 'Title and description are required.');
      return;
    }
    setLoading(true);
    try {
      await createComplaint(form);
      Alert.alert('Complaint Submitted ✓', 'Your complaint has been registered. We will look into it shortly.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to submit complaint.');
    } finally {
      setLoading(false);
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
            <Text className="text-xl font-black text-gray-900">Raise a Complaint</Text>
            <Text className="text-xs text-gray-400 font-semibold">Report an issue in your room</Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="pb-12 pt-2 gap-4">
            <View className="bg-white rounded-2xl p-4 border border-gray-100 gap-4"
              style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>

              <View>
                <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Title *</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900"
                  placeholder="Brief description of the issue"
                  placeholderTextColor="#9ca3af"
                  value={form.title}
                  onChangeText={v => setForm(f => ({ ...f, title: v }))}
                />
              </View>

              <View>
                <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Details *</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900"
                  placeholder="Describe the issue in detail..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={form.description}
                  onChangeText={v => setForm(f => ({ ...f, description: v }))}
                  style={{ minHeight: 100 }}
                />
              </View>

              <View>
                <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Category</Text>
                <View className="flex-row flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setForm(f => ({ ...f, category: c }))}
                      className={`px-4 py-2 rounded-xl border ${form.category === c ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                    >
                      <Text className={`text-xs font-black ${form.category === c ? 'text-white' : 'text-gray-700'}`}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Urgency</Text>
                <View className="flex-row gap-2">
                  {URGENCY.map(u => {
                    const colors: Record<string, string> = {
                      Low: 'bg-blue-600 border-blue-600',
                      Medium: 'bg-amber-500 border-amber-500',
                      High: 'bg-red-600 border-red-600',
                    };
                    const isActive = form.urgency === u;
                    return (
                      <TouchableOpacity
                        key={u}
                        onPress={() => setForm(f => ({ ...f, urgency: u }))}
                        className={`flex-1 py-2.5 rounded-xl border items-center ${isActive ? colors[u] : 'bg-white border-gray-200'}`}
                      >
                        <Text className={`text-xs font-black ${isActive ? 'text-white' : 'text-gray-700'}`}>{u}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="bg-orange-500 py-4 rounded-2xl items-center flex-row justify-center gap-2"
              activeOpacity={0.8}
              style={{ shadowColor: '#f97316', shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 }}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <>
                    <Ionicons name="send" size={16} color="white" />
                    <Text className="text-white font-black text-sm">Submit Complaint</Text>
                  </>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

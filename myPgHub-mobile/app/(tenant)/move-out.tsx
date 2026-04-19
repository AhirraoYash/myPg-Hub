import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { submitMoveOutNotice } from '@/api/moveout';

export default function TenantMoveOutScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    Alert.alert(
      'Submit Move-Out Notice?',
      'Once submitted, your notice period will begin and your expected move-out date will be calculated automatically.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await submitMoveOutNotice();
              setSubmitted(true);
            } catch (err: any) {
              Alert.alert('Error', err?.message ?? 'Failed to submit notice. You may already have one pending.');
            } finally {
              setLoading(false);
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
          <Text className="text-xl font-black text-gray-900">Move-Out Request</Text>
          <Text className="text-xs text-gray-400 font-semibold">Initiate your departure</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="pt-4 pb-12 gap-5">
          {submitted ? (
            <View className="items-center py-12 gap-4">
              <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center">
                <Ionicons name="checkmark-circle" size={48} color="#059669" />
              </View>
              <Text className="text-xl font-black text-gray-900 text-center">Notice Submitted!</Text>
              <Text className="text-sm text-gray-500 text-center leading-relaxed px-4">
                Your move-out notice has been submitted. The management team will contact you with next steps and settlement details.
              </Text>
              <TouchableOpacity onPress={() => router.back()} className="bg-blue-600 px-8 py-3.5 rounded-2xl mt-2">
                <Text className="text-white font-black">Go Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Warning Card */}
              <View className="bg-amber-50 border border-amber-100 rounded-2xl p-5 gap-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center">
                    <Ionicons name="warning-outline" size={20} color="#d97706" />
                  </View>
                  <Text className="text-sm font-black text-amber-900">Before You Proceed</Text>
                </View>
                {[
                  'Your notice period will begin from today.',
                  'Your expected move-out date will be calculated based on the property notice period.',
                  'All pending dues must be cleared before move-out.',
                  'Your security deposit will be processed after room inspection.',
                ].map((item, i) => (
                  <View key={i} className="flex-row gap-2">
                    <Text className="text-amber-700 font-bold">•</Text>
                    <Text className="text-xs text-amber-800 font-medium flex-1 leading-relaxed">{item}</Text>
                  </View>
                ))}
              </View>

              {/* Steps */}
              <View className="bg-white rounded-2xl p-4 border border-gray-100 gap-4"
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
                <Text className="text-sm font-black text-gray-900">What Happens Next?</Text>
                {[
                  { step: '1', title: 'Notice Submitted', desc: 'Notice period starts today', icon: 'document-text-outline', color: '#3b82f6' },
                  { step: '2', title: 'Room Inspection', desc: 'Staff will inspect your room', icon: 'search-outline', color: '#f97316' },
                  { step: '3', title: 'Settlement', desc: 'Refund calculated & processed', icon: 'wallet-outline', color: '#10b981' },
                  { step: '4', title: 'Move Out', desc: 'Hand over keys & vacate', icon: 'key-outline', color: '#6366f1' },
                ].map(s => (
                  <View key={s.step} className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${s.color}20` }}>
                      <Ionicons name={s.icon as any} size={18} color={s.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-black text-gray-900">{s.title}</Text>
                      <Text className="text-xs text-gray-400">{s.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="bg-red-500 py-4 rounded-2xl items-center flex-row justify-center gap-2"
                activeOpacity={0.8}
                style={{ shadowColor: '#ef4444', shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 }}
              >
                {loading
                  ? <ActivityIndicator color="white" />
                  : <>
                      <Ionicons name="exit-outline" size={18} color="white" />
                      <Text className="text-white font-black text-sm">Submit Move-Out Notice</Text>
                    </>
                }
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

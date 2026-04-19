import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TenantDocumentsScreen() {
  const router = useRouter();

  const docs = [
    { icon: 'document-text-outline', label: 'Rental Agreement', sub: 'Signed on joining', color: '#3b82f6', bg: 'bg-blue-50' },
    { icon: 'shield-checkmark-outline', label: 'ID Proof (KYC)', sub: 'Aadhaar / Passport', color: '#10b981', bg: 'bg-emerald-50' },
    { icon: 'receipt-outline', label: 'Rent Receipts', sub: 'Download past receipts', color: '#8b5cf6', bg: 'bg-purple-50' },
    { icon: 'camera-outline', label: 'Move-In Photos', sub: 'Room condition on arrival', color: '#f97316', bg: 'bg-orange-50' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-black text-gray-900">Documents</Text>
          <Text className="text-xs text-gray-400 font-semibold">Your files & records</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="pt-2 pb-12 gap-3">
          <View className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex-row gap-3 mb-2">
            <Ionicons name="information-circle-outline" size={20} color="#d97706" />
            <Text className="text-xs text-amber-800 font-medium flex-1 leading-relaxed">
              Document uploads will be available in the next app update. Please contact your PG manager for physical documents.
            </Text>
          </View>

          {docs.map(doc => (
            <TouchableOpacity
              key={doc.label}
              className="bg-white rounded-2xl p-4 border border-gray-100 flex-row items-center gap-4"
              activeOpacity={0.75}
              style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}
            >
              <View className={`w-14 h-14 ${doc.bg} rounded-2xl items-center justify-center`}>
                <Ionicons name={doc.icon as any} size={26} color={doc.color} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-black text-gray-900">{doc.label}</Text>
                <Text className="text-xs text-gray-400 mt-0.5">{doc.sub}</Text>
              </View>
              <View className="bg-gray-100 px-2 py-1 rounded-lg">
                <Text className="text-[10px] font-black text-gray-500">SOON</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

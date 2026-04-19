import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function TenantProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : '?';

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-black text-gray-900">My Profile</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="pt-4 pb-12 gap-5">
          {/* Avatar */}
          <View className="bg-white rounded-3xl p-6 border border-gray-100 items-center"
            style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 16, elevation: 3 }}>
            <View className="w-24 h-24 bg-indigo-100 rounded-full items-center justify-center mb-3">
              <Text className="text-3xl font-black text-indigo-600">{initials}</Text>
            </View>
            <Text className="text-xl font-black text-gray-900">{user?.first_name} {user?.last_name}</Text>
            <Text className="text-sm text-gray-500 mt-1">+91 {user?.phone}</Text>
            {user?.email && <Text className="text-xs text-gray-400 mt-0.5">{user.email}</Text>}
            <View className="mt-3 bg-indigo-100 px-3 py-1 rounded-full">
              <Text className="text-[10px] font-black text-indigo-700 uppercase">{user?.role}</Text>
            </View>
          </View>

          {/* Info Rows */}
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
            {[
              { icon: 'person-outline', label: 'Name', value: `${user?.first_name} ${user?.last_name}` },
              { icon: 'call-outline', label: 'Phone', value: `+91 ${user?.phone}` },
              { icon: 'mail-outline', label: 'Email', value: user?.email ?? 'Not set' },
            ].map((row, i, arr) => (
              <View key={row.label} className={`flex-row items-center px-4 py-4 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <View className="w-9 h-9 bg-gray-50 rounded-xl items-center justify-center mr-3">
                  <Ionicons name={row.icon as any} size={18} color="#6b7280" />
                </View>
                <Text className="text-sm text-gray-500 flex-1">{row.label}</Text>
                <Text className="text-sm font-bold text-gray-900">{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={logout}
            className="bg-red-50 border border-red-100 rounded-2xl py-4 items-center flex-row justify-center gap-2"
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            <Text className="text-sm font-black text-red-500">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

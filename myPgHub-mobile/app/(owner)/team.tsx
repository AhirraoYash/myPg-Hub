import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  RefreshControl, TextInput, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { listStaff, addManager, removeManager, Manager } from '@/api/staff';

function ManagerCard({ manager, onRemove }: { manager: Manager; onRemove: () => void }) {
  const initials = `${manager.first_name?.[0] ?? ''}${manager.last_name?.[0] ?? ''}`.toUpperCase();
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center gap-4"
      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
      <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center shrink-0">
        <Text className="text-base font-black text-blue-600">{initials}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-black text-gray-900">{manager.first_name} {manager.last_name}</Text>
        <Text className="text-xs text-gray-500 mt-0.5">{manager.phone}</Text>
        {manager.email && <Text className="text-xs text-gray-400 mt-0.5">{manager.email}</Text>}
      </View>
      <View className="items-end gap-2">
        <View className="bg-emerald-100 px-2 py-0.5 rounded-md">
          <Text className="text-[10px] font-black text-emerald-700">ACTIVE</Text>
        </View>
        <TouchableOpacity onPress={onRemove} className="p-1">
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TeamScreen() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', email: '', pin: '',
  });

  const fetchManagers = async () => {
    try {
      const res = await listStaff();
      setManagers(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchManagers(); }, []);

  const handleAddManager = async () => {
    if (!form.first_name || !form.phone || !form.pin) {
      Alert.alert('Missing Fields', 'Name, phone and PIN are required.');
      return;
    }
    setSubmitting(true);
    try {
      await addManager(form);
      setShowModal(false);
      setForm({ first_name: '', last_name: '', phone: '', email: '', pin: '' });
      fetchManagers();
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to add manager');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = (manager: Manager) => {
    Alert.alert(
      'Remove Manager',
      `Remove access for ${manager.first_name} ${manager.last_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            try {
              await removeManager(manager.user_id);
              fetchManagers();
            } catch (err: any) {
              Alert.alert('Error', err?.message ?? 'Failed to remove manager');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-black text-gray-900">Team</Text>
          <Text className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            {managers.length} Manager{managers.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="bg-blue-600 px-4 py-2 rounded-xl flex-row items-center gap-1.5"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color="white" />
          <Text className="text-xs font-black text-white">Add</Text>
        </TouchableOpacity>
      </View>

      {loading
        ? <ActivityIndicator className="mt-12" color="#3b82f6" size="large" />
        : (
          <ScrollView
            className="flex-1 px-6 pt-2"
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchManagers(); }} tintColor="#3b82f6" />}
          >
            <View className="pb-32">
              {managers.length === 0
                ? (
                  <View className="items-center py-20">
                    <Ionicons name="people-outline" size={56} color="#e5e7eb" />
                    <Text className="text-gray-900 font-black mt-4 text-lg">No Managers Yet</Text>
                    <Text className="text-sm text-gray-400 mt-2 text-center">Add a manager to help run your PG.</Text>
                  </View>
                )
                : managers.map((m, index) => (
                  <ManagerCard key={m.user_id || index} manager={m} onRemove={() => handleRemove(m)} />
                ))
              }
            </View>
          </ScrollView>
        )
      }

      {/* Add Manager Modal */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-black text-gray-900">Add Manager</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-full">
                <Ionicons name="close" size={18} color="#374151" />
              </TouchableOpacity>
            </View>

            {[
              { field: 'first_name', placeholder: 'First Name *', keyboard: 'default' },
              { field: 'last_name', placeholder: 'Last Name', keyboard: 'default' },
              { field: 'phone', placeholder: 'Phone Number *', keyboard: 'phone-pad' },
              { field: 'email', placeholder: 'Email (optional)', keyboard: 'email-address' },
              { field: 'pin', placeholder: 'PIN (4-6 digits) *', keyboard: 'numeric' },
            ].map(({ field, placeholder, keyboard }) => (
              <TextInput
                key={field}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900 mb-3"
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                keyboardType={keyboard as any}
                value={(form as any)[field]}
                onChangeText={v => setForm(f => ({ ...f, [field]: v }))}
                secureTextEntry={field === 'pin'}
              />
            ))}

            <TouchableOpacity
              onPress={handleAddManager}
              disabled={submitting}
              className="bg-blue-600 py-4 rounded-2xl items-center mt-2"
              activeOpacity={0.8}
            >
              {submitting
                ? <ActivityIndicator color="white" />
                : <Text className="text-white font-black">Add Manager</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

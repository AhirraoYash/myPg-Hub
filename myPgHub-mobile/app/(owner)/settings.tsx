import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  TextInput, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { updateProfile, changePin } from '@/api/users';
import { getPropertySettings, updatePropertySettings, PropertySettings } from '@/api/properties';

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">{title}</Text>
  );
}

function SettingRow({ icon, label, value, onPress }: {
  icon: string; label: string; value?: string; onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="bg-white flex-row items-center px-4 py-4 border-b border-gray-50"
      activeOpacity={0.7}
    >
      <View className="w-9 h-9 bg-gray-50 rounded-xl items-center justify-center mr-3">
        <Ionicons name={icon as any} size={18} color="#6b7280" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-gray-900">{label}</Text>
        {value && <Text className="text-xs text-gray-400 mt-0.5">{value}</Text>}
      </View>
      {onPress && <Ionicons name="chevron-forward" size={16} color="#d1d5db" />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [property, setProperty] = useState<PropertySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', email: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [editingPin, setEditingPin] = useState(false);
  const [pinForm, setPinForm] = useState({ old_pin: '', new_pin: '', confirm_pin: '' });
  const [savingPin, setSavingPin] = useState(false);

  useEffect(() => {
    if (user) setProfileForm({ first_name: user.first_name, last_name: user.last_name, email: user.email ?? '' });
    fetchProperty();
  }, [user]);

  const fetchProperty = async () => {
    try {
      const res = await getPropertySettings();
      setProperty(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfile(profileForm);
      await refreshUser();
      setEditingProfile(false);
      Alert.alert('Success', 'Profile updated!');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to update profile');
    } finally { setSavingProfile(false); }
  };

  const handleChangePin = async () => {
    if (pinForm.new_pin !== pinForm.confirm_pin) {
      Alert.alert('Error', 'New PINs do not match.');
      return;
    }
    if (pinForm.new_pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits.');
      return;
    }
    setSavingPin(true);
    try {
      await changePin({ old_pin: pinForm.old_pin, new_pin: pinForm.new_pin });
      setEditingPin(false);
      setPinForm({ old_pin: '', new_pin: '', confirm_pin: '' });
      Alert.alert('Success', 'PIN changed successfully!');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to change PIN');
    } finally { setSavingPin(false); }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3">
        <Text className="text-2xl font-black text-gray-900">Settings</Text>
        <Text className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Account & Property</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="pb-32 gap-5 pt-2">

          {/* Profile Card */}
          <View>
            <View className="bg-white rounded-2xl p-4 border border-gray-100 flex-row items-center gap-4 mb-4"
              style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
              <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center">
                <Text className="text-2xl font-black text-blue-600">
                  {user ? `${user.first_name?.[0]}${user.last_name?.[0]}`.toUpperCase() : 'O'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-black text-gray-900">{user?.first_name} {user?.last_name}</Text>
                <Text className="text-sm text-gray-500">+91 {user?.phone}</Text>
                <View className="bg-blue-100 self-start px-2 py-0.5 rounded-md mt-1">
                  <Text className="text-[10px] font-black text-blue-700 uppercase">{user?.role}</Text>
                </View>
              </View>
            </View>

            {/* Profile Edit */}
            {!editingProfile ? (
              <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                <SectionHeader title="  Account" />
                <SettingRow icon="person-outline" label="Edit Profile" value={`${user?.first_name} ${user?.last_name}`} onPress={() => setEditingProfile(true)} />
                <SettingRow icon="lock-closed-outline" label="Change PIN" onPress={() => setEditingPin(!editingPin)} />
              </View>
            ) : (
              <View className="bg-white rounded-2xl p-4 border border-gray-100"
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                <Text className="text-sm font-black text-gray-900 mb-4">Edit Profile</Text>
                {['first_name', 'last_name', 'email'].map(f => (
                  <TextInput
                    key={f}
                    className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900 mb-3"
                    placeholder={f === 'first_name' ? 'First Name' : f === 'last_name' ? 'Last Name' : 'Email'}
                    placeholderTextColor="#9ca3af"
                    keyboardType={f === 'email' ? 'email-address' : 'default'}
                    value={(profileForm as any)[f]}
                    onChangeText={v => setProfileForm(p => ({ ...p, [f]: v }))}
                  />
                ))}
                <View className="flex-row gap-3">
                  <TouchableOpacity onPress={() => setEditingProfile(false)} className="flex-1 py-3.5 bg-gray-100 rounded-xl items-center">
                    <Text className="text-sm font-black text-gray-600">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveProfile} disabled={savingProfile} className="flex-1 py-3.5 bg-blue-600 rounded-xl items-center">
                    {savingProfile ? <ActivityIndicator color="white" /> : <Text className="text-sm font-black text-white">Save</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* PIN Change */}
            {editingPin && (
              <View className="bg-white rounded-2xl p-4 border border-gray-100 mt-3"
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                <Text className="text-sm font-black text-gray-900 mb-4">Change PIN</Text>
                {[['old_pin', 'Current PIN'], ['new_pin', 'New PIN'], ['confirm_pin', 'Confirm New PIN']].map(([f, p]) => (
                  <TextInput
                    key={f}
                    className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900 mb-3"
                    placeholder={p}
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={6}
                    value={(pinForm as any)[f]}
                    onChangeText={v => setPinForm(p2 => ({ ...p2, [f]: v }))}
                  />
                ))}
                <View className="flex-row gap-3">
                  <TouchableOpacity onPress={() => setEditingPin(false)} className="flex-1 py-3.5 bg-gray-100 rounded-xl items-center">
                    <Text className="text-sm font-black text-gray-600">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleChangePin} disabled={savingPin} className="flex-1 py-3.5 bg-blue-600 rounded-xl items-center">
                    {savingPin ? <ActivityIndicator color="white" /> : <Text className="text-sm font-black text-white">Change PIN</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Property Info */}
          {property && (
            <View>
              <SectionHeader title="Property" />
              <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                <SettingRow icon="business-outline" label={property.name} value={property.address ?? 'No address'} />
                <SettingRow icon="cash-outline" label="UPI ID" value={property.upi_id ?? 'Not set'} />
                <SettingRow icon="calendar-outline" label="Rent Due Date" value={`${property.settings.default_rent_due_date}th of every month`} />
                <SettingRow icon="warning-outline" label="Late Fee" value={`₹${property.settings.late_fee_amount?.toLocaleString('en-IN')}`} />
                <SettingRow icon="time-outline" label="Notice Period" value={`${property.settings.notice_period_days} days`} />
                <SettingRow icon="wallet-outline" label="Deposit" value={`₹${property.settings.deposit_amount?.toLocaleString('en-IN')}`} />
              </View>
            </View>
          )}

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
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

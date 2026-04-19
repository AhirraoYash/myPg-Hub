import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/api/client';

type Step = 'phone' | 'pin';

export default function LoginScreen() {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const pinRefs = [
    useRef<TextInput>(null), useRef<TextInput>(null),
    useRef<TextInput>(null), useRef<TextInput>(null),
  ];

  useEffect(() => {
    if (step === 'pin') {
      setTimeout(() => pinRefs[0].current?.focus(), 100);
    }
  }, [step]);

  const handlePhoneContinue = () => {
    if (phone.length < 10) return;
    setStep('pin');
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const last = value.slice(-1);
    const newPin = [...pin];
    newPin[index] = last;
    setPin(newPin);
    if (last && index < 3) pinRefs[index + 1].current?.focus();
    if (!last && index > 0) pinRefs[index - 1].current?.focus();
    // Auto-submit when last digit entered
    if (last && index === 3) {
      const fullPin = [...newPin].join('');
      if (fullPin.length === 4) handleLogin(fullPin, phone);
    }
  };

  const handleLogin = async (fullPin: string, phoneNum: string) => {
    setIsLoading(true);
    try {
      await login(phoneNum, fullPin);
      // Navigation handled by root layout auth guard
    } catch (err) {
      setPin(['', '', '', '']);
      pinRefs[0].current?.focus();
      const msg = err instanceof ApiError ? err.message : 'Login failed. Please try again.';
      Alert.alert('Login Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-8 pt-16 pb-10">

            {/* Logo & Branding */}
            <View className="items-center mb-12">
              <View className="w-24 h-24 bg-white rounded-3xl shadow-lg items-center justify-center mb-5 border border-blue-100">
                <Ionicons name="home" size={40} color="#3b82f6" />
              </View>
              <Text className="text-3xl font-black text-gray-900 tracking-tight">MyPG Hub</Text>
              <Text className="text-sm text-gray-500 mt-1">Smart PG & Hostel Management</Text>
            </View>

            {/* Form Card */}
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

              {step === 'phone' ? (
                <View>
                  <Text className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2 ml-1">
                    Mobile Number
                  </Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 mb-4">
                    <Ionicons name="call-outline" size={18} color="#6b7280" />
                    <Text className="text-sm font-bold text-gray-900 ml-2 mr-3 border-r border-gray-200 pr-3">+91</Text>
                    <TextInput
                      className="flex-1 text-lg font-bold text-gray-900"
                      placeholder="Enter 10 digit number"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phone}
                      onChangeText={t => setPhone(t.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </View>
                  <TouchableOpacity
                    onPress={handlePhoneContinue}
                    disabled={phone.length < 10}
                    className={`py-4 rounded-2xl items-center flex-row justify-center gap-2 ${phone.length < 10 ? 'bg-blue-300' : 'bg-blue-600'}`}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-bold text-sm">Continue</Text>
                    <Ionicons name="arrow-forward" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View className="flex-row justify-between items-center mb-4 ml-1">
                    <Text className="text-xs font-black text-gray-900 uppercase tracking-wider">
                      Enter PIN
                    </Text>
                    <TouchableOpacity onPress={() => { setStep('phone'); setPin(['','','','']); }}>
                      <Text className="text-xs font-bold text-blue-600">Change Number</Text>
                    </TouchableOpacity>
                  </View>

                  <Text className="text-sm text-gray-500 text-center mb-5">Sent to +91 {phone}</Text>

                  <View className="flex-row justify-between mb-6">
                    {pin.map((digit, i) => (
                      <TextInput
                        key={i}
                        ref={pinRefs[i]}
                        className={`w-16 h-16 bg-gray-50 border rounded-2xl text-center text-2xl font-black text-gray-900 ${digit ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onChangeText={v => handlePinChange(i, v)}
                        secureTextEntry
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    onPress={() => handleLogin(pin.join(''), phone)}
                    disabled={pin.join('').length < 4 || isLoading}
                    className={`py-4 rounded-2xl items-center ${pin.join('').length < 4 ? 'bg-gray-300' : 'bg-gray-900'}`}
                    activeOpacity={0.8}
                  >
                    {isLoading
                      ? <ActivityIndicator color="white" />
                      : <Text className="text-white font-bold text-sm">Verify & Login</Text>
                    }
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text className="text-xs text-gray-400 text-center mt-8">
              By logging in, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

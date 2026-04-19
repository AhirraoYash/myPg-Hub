import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getRooms, Room, Bed } from '@/api/rooms';
import { useAuth } from '@/context/AuthContext';

export default function TenantRoomScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [myRoom, setMyRoom] = useState<Room | null>(null);
  const [myBed, setMyBed] = useState<Bed | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRoom = async () => {
    try {
      const res = await getRooms();
      // Find the room where tenant's bed is
      for (const room of res.data) {
        const bed = room.beds.find(b => b.tenant?._id === user?._id || b.status === 'Occupied' && b.tenant?.phone === user?.phone);
        if (bed) {
          setMyRoom(room);
          setMyBed(bed);
          break;
        }
      }
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchRoom(); }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="px-6 pt-4 pb-3 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-black text-gray-900">My Room</Text>
          <Text className="text-xs text-gray-400 font-semibold">Room & bed details</Text>
        </View>
      </View>

      {loading
        ? <ActivityIndicator className="mt-16" color="#6366f1" size="large" />
        : (
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRoom(); }} tintColor="#6366f1" />}>
            <View className="pt-2 pb-12 gap-4">
              {!myRoom
                ? (
                  <View className="items-center py-20 gap-3">
                    <Ionicons name="bed-outline" size={56} color="#e5e7eb" />
                    <Text className="text-gray-900 font-black text-lg">No Room Assigned</Text>
                    <Text className="text-sm text-gray-400 text-center">Contact your PG owner to get a room assigned to you.</Text>
                  </View>
                )
                : (
                  <>
                    {/* Room Card */}
                    <View className="bg-indigo-600 rounded-3xl p-6"
                      style={{ shadowColor: '#6366f1', shadowOpacity: 0.25, shadowRadius: 20, elevation: 6 }}>
                      <Text className="text-indigo-200 text-xs font-black uppercase tracking-wider mb-1">Your Room</Text>
                      <Text className="text-4xl font-black text-white mb-1">Room {myRoom.room_number}</Text>
                      {myRoom.floor && <Text className="text-indigo-200 text-sm">{myRoom.floor}</Text>}
                      {myRoom.room_type && (
                        <View className="mt-3 bg-white/20 self-start px-3 py-1 rounded-full">
                          <Text className="text-white text-xs font-black">{myRoom.room_type}</Text>
                        </View>
                      )}
                    </View>

                    {/* Bed Info */}
                    {myBed && (
                      <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                        style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                        {[
                          { icon: 'bed-outline', label: 'My Bed', value: myBed.bed_identifier },
                          { icon: 'cash-outline', label: 'Monthly Rent', value: `₹${myBed.price?.toLocaleString('en-IN')}` },
                          { icon: 'people-outline', label: 'Room Capacity', value: `${myRoom.capacity} beds` },
                        ].map((row, i, arr) => (
                          <View key={row.label} className={`flex-row items-center px-4 py-4 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <View className="w-9 h-9 bg-indigo-50 rounded-xl items-center justify-center mr-3">
                              <Ionicons name={row.icon as any} size={18} color="#6366f1" />
                            </View>
                            <Text className="text-sm text-gray-500 flex-1">{row.label}</Text>
                            <Text className="text-sm font-black text-gray-900">{row.value}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Amenities */}
                    {myRoom.amenities && myRoom.amenities.length > 0 && (
                      <View>
                        <Text className="text-sm font-black text-gray-900 mb-3">Room Amenities</Text>
                        <View className="flex-row flex-wrap gap-2">
                          {myRoom.amenities.map(a => (
                            <View key={a} className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl">
                              <Text className="text-xs font-black text-indigo-700">{a}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Roommates */}
                    <View>
                      <Text className="text-sm font-black text-gray-900 mb-3">Roommates</Text>
                      <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                        style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                        {myRoom.beds.filter(b => b.status === 'Occupied' && b.tenant?.phone !== user?.phone).length === 0
                          ? <View className="py-6 items-center">
                              <Text className="text-gray-400 text-sm">No roommates currently</Text>
                            </View>
                          : myRoom.beds.filter(b => b.status === 'Occupied' && b.tenant?.phone !== user?.phone).map((bed, i, arr) => (
                              <View key={bed._id} className={`flex-row items-center px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                <View className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center mr-3">
                                  <Text className="text-xs font-black text-gray-600">
                                    {bed.tenant?.first_name?.[0]}{bed.tenant?.last_name?.[0]}
                                  </Text>
                                </View>
                                <Text className="text-sm font-bold text-gray-900">
                                  {bed.tenant?.first_name} {bed.tenant?.last_name}
                                </Text>
                              </View>
                            ))
                        }
                      </View>
                    </View>
                  </>
                )
              }
            </View>
          </ScrollView>
        )
      }
    </SafeAreaView>
  );
}

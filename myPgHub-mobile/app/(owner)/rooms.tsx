import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  RefreshControl, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getRooms, Room, Bed } from '@/api/rooms';

function BedBadge({ bed }: { bed: Bed }) {
  const colors = {
    Vacant: 'bg-emerald-100 border-emerald-300',
    Occupied: 'bg-blue-100 border-blue-200',
    Maintenance: 'bg-red-100 border-red-200',
  };
  const textColors = {
    Vacant: 'text-emerald-700',
    Occupied: 'text-blue-700',
    Maintenance: 'text-red-700',
  };
  return (
    <View className={`px-2.5 py-1 rounded-lg border ${colors[bed.status]}`}>
      <Text className={`text-[10px] font-black ${textColors[bed.status]}`}>
        {bed.bed_identifier}
      </Text>
    </View>
  );
}

function RoomCard({ room, onPress }: { room: Room; onPress: () => void }) {
  const vacant = room.beds.filter(b => b.status === 'Vacant').length;
  const occupied = room.beds.filter(b => b.status === 'Occupied').length;
  const total = room.beds.length;
  const hasVacant = vacant > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={`bg-white rounded-2xl p-4 border mb-4 ${hasVacant ? 'border-emerald-200' : 'border-gray-100'}`}
      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-lg font-black text-gray-900">Room {room.room_number}</Text>
            {room.room_type && (
              <View className="bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] font-black text-blue-600 uppercase">{room.room_type}</Text>
              </View>
            )}
          </View>
          <Text className="text-xs text-gray-400 font-semibold">
            {hasVacant ? `${vacant} bed${vacant > 1 ? 's' : ''} available` : 'Fully occupied'}
            {room.floor ? ` · ${room.floor}` : ''}
          </Text>
        </View>
        <Text className="text-xs font-black text-gray-500">{occupied}/{total}</Text>
      </View>

      {/* Beds */}
      <View className="flex-col gap-2">
        {room.beds.map(bed => (
          <View key={bed._id} className={`flex-row items-center p-3 rounded-xl border ${
            bed.status === 'Vacant' ? 'bg-emerald-50 border-dashed border-emerald-300'
            : bed.status === 'Maintenance' ? 'bg-red-50 border-red-100'
            : 'bg-gray-50 border-gray-100'
          }`}>
            <BedBadge bed={bed} />
            <View className="flex-1 ml-3">
              {bed.status === 'Occupied' && bed.tenant ? (
                <>
                  <Text className="text-xs font-black text-gray-900">
                    {bed.tenant.first_name} {bed.tenant.last_name}
                  </Text>
                  <Text className="text-[10px] text-gray-400 font-semibold">
                    {bed.tenant.phone}
                  </Text>
                </>
              ) : bed.status === 'Maintenance' ? (
                <Text className="text-xs font-bold text-red-600">Under Maintenance</Text>
              ) : (
                <Text className="text-xs font-bold text-emerald-700">Available — ₹{bed.price?.toLocaleString('en-IN')}/mo</Text>
              )}
            </View>
            {bed.status === 'Vacant' && (
              <View className="bg-emerald-600 px-2.5 py-1 rounded-lg">
                <Text className="text-[10px] font-black text-white">Add</Text>
              </View>
            )}
            {bed.status === 'Occupied' && (
              <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
            )}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export default function RoomsScreen() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filtered, setFiltered] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const FILTERS = ['All', 'Vacant', 'Occupied'];

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.data);
      setFiltered(res.data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  useEffect(() => {
    let data = [...rooms];
    if (activeFilter === 'Vacant') {
      data = data.filter(r => r.beds.some(b => b.status === 'Vacant'));
    } else if (activeFilter === 'Occupied') {
      data = data.filter(r => r.beds.every(b => b.status === 'Occupied'));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.room_number.toLowerCase().includes(q) ||
        r.beds.some(b => b.tenant && `${b.tenant.first_name} ${b.tenant.last_name}`.toLowerCase().includes(q))
      );
    }
    setFiltered(data);
  }, [rooms, search, activeFilter]);

  const totalBeds = rooms.reduce((s, r) => s + r.beds.length, 0);
  const vacantBeds = rooms.reduce((s, r) => s + r.beds.filter(b => b.status === 'Vacant').length, 0);
  const occupiedBeds = totalBeds - vacantBeds;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-3 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-black text-gray-900">Property Layout</Text>
          <Text className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Manage Rooms & Beds</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(owner)/add-room')}
          className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center"
          style={{ shadowColor: '#3b82f6', shadowOpacity: 0.35, shadowRadius: 10, elevation: 4 }}
        >
          <Ionicons name="add" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Banner */}
      <View className="mx-6 mb-4 bg-gray-900 rounded-2xl p-4 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1">Total Capacity</Text>
          <Text className="text-3xl font-black text-white">{totalBeds} <Text className="text-gray-400 text-sm font-medium">beds</Text></Text>
        </View>
        <View className="items-end gap-1">
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-emerald-400" />
            <Text className="text-xs font-bold text-emerald-300">{vacantBeds} Vacant</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-blue-400" />
            <Text className="text-xs font-bold text-blue-300">{occupiedBeds} Occupied</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View className="mx-6 mb-3 flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
        <Ionicons name="search" size={16} color="#9ca3af" />
        <TextInput
          className="flex-1 ml-2 text-sm font-medium text-gray-900"
          placeholder="Search rooms or tenants..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-4" contentContainerStyle={{ gap: 8 }}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            className={`px-5 py-2 rounded-full ${activeFilter === f ? 'bg-blue-600' : 'bg-white border border-gray-200'}`}
          >
            <Text className={`text-xs font-black ${activeFilter === f ? 'text-white' : 'text-gray-600'}`}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Room List */}
      {loading
        ? <ActivityIndicator className="mt-12" color="#3b82f6" size="large" />
        : (
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRooms(); }} tintColor="#3b82f6" />}
          >
            <View className="pb-32">
              {filtered.length === 0
                ? (
                  <View className="items-center justify-center py-20">
                    <Ionicons name="search" size={48} color="#e5e7eb" />
                    <Text className="text-gray-900 font-black mt-4">No Rooms Found</Text>
                    <Text className="text-sm text-gray-500 mt-1">Try adjusting your search.</Text>
                  </View>
                )
                : filtered.map(room => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    onPress={() => router.push(`/(owner)/tenant/${room.beds.find(b => b.status === 'Occupied')?.tenant?._id}` as any)}
                  />
                ))
              }
            </View>
          </ScrollView>
        )
      }
    </SafeAreaView>
  );
}

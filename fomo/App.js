function DMList({ users, messagesByUser, onOpen }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {users.map((u) => {
          const msgs = messagesByUser[u.id] || [];
          const last = msgs[msgs.length - 1];
          return (
            <Pressable key={u.id} onPress={() => onOpen(u)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
              {renderAvatarForHost(u.id)}
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ fontWeight: '700' }}>{u.name}</Text>
                {last ? <Text numberOfLines={1} style={{ color: '#6b7280' }}>{last.text}</Text> : <Text style={{ color: '#9ca3af' }}>No messages yet</Text>}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// Host tools separate section
function HostToolsView({ hostedEvents, onAnnounce, onCreateEvent, onEdit, onEditTime }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>My Hosted Events</Text>
        {hostedEvents.length === 0 && (
          <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee', padding: 16, marginBottom: 12 }}>
            <Text style={{ color: '#6b7280', marginBottom: 10 }}>You haven't hosted any events yet.</Text>
            <Pressable onPress={onCreateEvent} style={{ backgroundColor: '#111827', borderRadius: 12, paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Create Event</Text>
            </Pressable>
          </View>
        )}
        {hostedEvents.map((e) => (
          <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee', padding: 12 }}>
            <View style={{ width: 40, alignItems: 'center' }}>{renderEventEmoji(e.category, 10, e)}</View>
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={{ fontWeight: '600' }} numberOfLines={1}>{e.title}</Text>
              {!!e.startAt && <Text style={{ color: '#6b7280', marginTop: 2 }}>{formatTime(new Date(e.startAt))}</Text>}
            </View>
            <Pressable onPress={() => onEditTime && onEditTime(e)} style={{ backgroundColor: '#e5e7eb', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8, marginRight: 8 }}>
              <Text style={{ color: '#111827', fontWeight: '700' }}>Time</Text>
            </Pressable>
            <Pressable onPress={() => onEdit && onEdit(e)} style={{ backgroundColor: '#f3f4f6', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8, marginRight: 8 }}>
              <Text style={{ color: '#111827', fontWeight: '700' }}>Edit</Text>
            </Pressable>
            <Pressable onPress={() => onAnnounce && onAnnounce(e)} style={{ backgroundColor: '#111827', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Announce</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Edit Profile modal
function EditProfileModal({ visible, onClose, tempUri, onPickPhoto, onSave, onChangeTemp }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Pressable onPress={onClose} style={{ marginRight: 10, padding: 6 }}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </Pressable>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>Edit Profile</Text>
        </View>
        <View style={{ alignItems: 'center', padding: 24 }}>
          <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' }}>
            {tempUri ? (
              <Image source={{ uri: tempUri }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Ionicons name="person" size={44} color="#9ca3af" />
            )}
          </View>
          <Pressable onPress={onPickPhoto} style={{ marginTop: 16, backgroundColor: '#111827', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Choose Photo</Text>
          </Pressable>
        </View>
        <View style={{ padding: 16 }}>
          <Pressable onPress={onSave} style={{ backgroundColor: '#111827', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// Bottom sheet time picker with quick chips
function TimePickerSheet({ visible, onClose, initialTime, onConfirm }) {
  const [date, setDate] = useState(initialTime || new Date());
  useEffect(() => { setDate(initialTime || new Date()); }, [initialTime, visible]);
  function addMinutes(mins) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + mins);
    setDate(d);
  }
  function setHour(hour) {
    const d = new Date(date);
    d.setHours(hour, 0, 0, 0);
    setDate(d);
  }
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }} onPress={onClose} />
      <SafeAreaView style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#111827', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 }}>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800' }}>{formatTime(date)}</Text>
          <Text style={{ color: '#9ca3af' }}>{date.toLocaleDateString()}</Text>
        </View>
        <View style={{ backgroundColor: '#0f172a', borderRadius: 12, paddingVertical: 6, alignItems: 'center', marginBottom: 12 }}>
          <DateTimePicker value={date} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { if (d) setDate(d); }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {[
            { label: 'Now', action: () => setDate(new Date()) },
            { label: '+15m', action: () => addMinutes(15) },
            { label: '+30m', action: () => addMinutes(30) },
            { label: '+1h', action: () => addMinutes(60) },
            { label: '8 PM', action: () => setHour(20) },
            { label: '10 PM', action: () => setHour(22) },
          ].map((c) => (
            <Pressable key={c.label} onPress={c.action} style={{ backgroundColor: '#1f2937', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{c.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable onPress={onClose} style={[styles.button, styles.buttonSecondary, { flex: 1 }]}>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Cancel</Text>
          </Pressable>
          <Pressable onPress={() => onConfirm && onConfirm(date)} style={[styles.button, styles.buttonPrimary, { flex: 1 }]}>
            <Text style={styles.buttonText}>Confirm</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// Inline leaders tab view to avoid missing component errors
function LeaderboardView({ events, rsvps }) {
  const mostRsvped = [...events]
    .map((e) => ({ e, count: Object.entries(rsvps).filter(([id, v]) => v && id === e.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const connections = getUsersWithStats()
    .map((u) => ({ u, connections: u.stats ? u.stats.connections : Math.floor(Math.random() * 100) + 10 }))
    .sort((a, b) => b.connections - a.connections)
    .slice(0, 10);
  const attended = getUsersWithStats()
    .map((u) => ({ u, attended: u.stats ? u.stats.attended : Math.floor(Math.random() * 40) + 5 }))
    .sort((a, b) => b.attended - a.attended)
    .slice(0, 10);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Most RSVPed Events</Text>
        {mostRsvped.length === 0 && (
          <Text style={{ color: '#6b7280', marginBottom: 12 }}>No RSVPs yet.</Text>
        )}
        {mostRsvped.map(({ e, count }) => (
          <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ width: 28, alignItems: 'center' }}>{renderEventEmoji(e.category, 10)}</View>
            <Text style={{ marginLeft: 8, fontWeight: '600' }}>{e.title}</Text>
            <Text style={{ marginLeft: 'auto', color: '#6b7280' }}>{count} going</Text>
          </View>
        ))}

        <Text style={{ fontWeight: '700', marginTop: 16, marginBottom: 8 }}>Most Connected Users</Text>
        {connections.map(({ u, connections: c }) => (
          <View key={u.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            {renderAvatarForHost(u.id)}
            <Text style={{ marginLeft: 8, fontWeight: '600' }}>{u.name}</Text>
            <Text style={{ marginLeft: 'auto', color: '#6b7280' }}>{c} connections</Text>
          </View>
        ))}

        <Text style={{ fontWeight: '700', marginTop: 16, marginBottom: 8 }}>Most Events Attended</Text>
        {attended.map(({ u, attended: a }) => (
          <View key={u.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            {renderAvatarForHost(u.id)}
            <Text style={{ marginLeft: 8, fontWeight: '600' }}>{u.name}</Text>
            <Text style={{ marginLeft: 'auto', color: '#6b7280' }}>{a} attended</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, PanResponder, Image, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView, useColorScheme, Linking, Switch, RefreshControl } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import MapView, { Marker, Callout, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { API_URL, health as apiHealth, signup as apiSignup, login as apiLogin, me as apiMe, requestCode as apiRequestCode, verifyCode as apiVerifyCode, createEvent as apiCreateEvent, listNearby as apiListNearby, toggleRsvp as apiToggleRsvp } from './api';

const MILES_TO_METERS = 1609.34;

const MOCK_USERS = [
  { id: 'u1', name: 'Alex', initials: 'A', color: '#ef4444' },
  { id: 'u2', name: 'Bri', initials: 'B', color: '#22c55e' },
  { id: 'u3', name: 'Chris', initials: 'C', color: '#3b82f6' },
  { id: 'u4', name: 'Dee', initials: 'D', color: '#f59e0b' },
];
const CURRENT_USER_ID = 'u1';
const AVATAR_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#111827'];

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const ui = {
    text: isDark ? '#F9FAFB' : '#111827',
    placeholder: isDark ? '#9CA3AF' : '#6B7280',
    inputBg: isDark ? '#111827' : '#FFFFFF',
    border: isDark ? '#374151' : '#DDDDDD',
    // Darken panel even in light mode so white subtitle is readable
    panelBg: isDark ? 'rgba(17,17,17,0.94)' : 'rgba(17,24,39,0.92)',
  };
  const [userRegion, setUserRegion] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [events, setEvents] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [currentUserPhoto, setCurrentUserPhoto] = useState(null);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [tempAvatarUri, setTempAvatarUri] = useState(null);
  const [showAddTimePicker, setShowAddTimePicker] = useState(false);
  const [showEditTimePicker, setShowEditTimePicker] = useState(false);
  const [tempAddTime, setTempAddTime] = useState(null);
  const [tempEditTime, setTempEditTime] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [draftEvent, setDraftEvent] = useState({ title: '', description: '', lat: '', lng: '', hostId: CURRENT_USER_ID, startAt: null });
  const [rsvps, setRsvps] = useState({});
  const [radiusMiles, setRadiusMiles] = useState(15);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [pickerRegion, setPickerRegion] = useState(null);
  const [pickerCenter, setPickerCenter] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false); // deprecated
  const mapRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messagesByUser, setMessagesByUser] = useState({});
  const [composeText, setComposeText] = useState('');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [detailsEvent, setDetailsEvent] = useState(null);
  const [detailsAddress, setDetailsAddress] = useState('');
  const [regionZoom, setRegionZoom] = useState(0);
  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [authValue, setAuthValue] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false); // legacy modal (not used by tab)
  const [isBroadcastVisible, setIsBroadcastVisible] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [currentTab, setCurrentTab] = useState('map'); // 'map' | 'dms' | 'leaderboard'
  const [authStep, setAuthStep] = useState('enter'); // 'enter' | 'verify'
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isMapInteractive, setIsMapInteractive] = useState(true);
  const [mapInstanceKey, setMapInstanceKey] = useState(0);
  const [settings, setSettings] = useState({
    ghostMode: false,
    defaultRadius: 15,
    notifications: { events: true, dms: true, announcements: true },
    navApp: 'apple', // 'apple' | 'google'
    theme: 'system', // future use
  });
  const [isEditEventVisible, setIsEditEventVisible] = useState(false);
  const [editEventDraft, setEditEventDraft] = useState(null); // { id, title, description, category, theme, lat, lng }

  useEffect(() => {
    (async () => {
      // Load simple sign-in if present
      const saved = await AsyncStorage.getItem('fomo_user');
      if (!saved) setIsAuthVisible(true); else setCurrentUserId(saved);
      try {
        const token = await SecureStore.getItemAsync('fomo_token_secure');
        if (token) {
          // token available for API calls
        }
      } catch {}
      // Load saved avatar if present
      try {
        const savedAvatar = await AsyncStorage.getItem('fomo_avatar_uri');
        if (savedAvatar) setCurrentUserPhoto(savedAvatar);
      } catch {}
      // load settings
      try {
        const stored = await AsyncStorage.getItem('fomo_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings((s) => ({ ...s, ...parsed }));
          if (parsed.defaultRadius) setRadiusMiles(parsed.defaultRadius);
        }
      } catch {}
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasLocationPermission(granted);
      if (granted) {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { latitude, longitude } = loc.coords;
        setUserRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        // seed some fake avatars near user (exclude current user)
        setAvatars(
          MOCK_USERS.filter((u) => u.id !== CURRENT_USER_ID).map((u, i) => ({
            ...u,
            lat: latitude + (Math.random() - 0.5) * 0.02,
            lng: longitude + (Math.random() - 0.5) * 0.02,
            photo: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
            stats: {
              attended: Math.floor(Math.random() * 40) + 5,
              hosted: Math.floor(Math.random() * 25) + 2,
              connections: Math.floor(Math.random() * 150) + 20,
            },
          }))
        );
        // watch user position to keep marker tied to location
        try {
          Location.watchPositionAsync({ accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 10 }, (loc) => {
            setUserRegion((prev) => ({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              latitudeDelta: prev ? prev.latitudeDelta : 0.05,
              longitudeDelta: prev ? prev.longitudeDelta : 0.05,
            }));
          });
        } catch {}
      } else {
        // Default to San Francisco if permission denied (for testing)
        setUserRegion({ latitude: 37.7749, longitude: -122.4194, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
      }
      // Load nearby events from backend
      try {
        const token = await SecureStore.getItemAsync('fomo_token_secure');
        const center = userRegion || { latitude: 37.7749, longitude: -122.4194 };
        const res = await apiListNearby(token || '', { lat: center.latitude, lng: center.longitude, miles: radiusMiles });
        if (res?.events) setEvents(res.events.map((e) => ({
          id: e.id,
          title: e.title,
          description: e.description || '',
          lat: e.lat,
          lng: e.lng,
          category: e.category || 'General',
          hostId: e.hostId,
          startAt: new Date(e.startAt).getTime(),
        })));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    setIsMapInteractive(!isAddModalVisible);
    if (!isAddModalVisible) {
      // Force remount MapView after closing modal to recover gestures
      setMapInstanceKey((k) => k + 1);
    }
  }, [isAddModalVisible]);

  // ---- Backend auth helpers ----
  async function handleBackendSignIn(email) {
    const devPassword = 'Password123!';
    try {
      // Try login first
      let tokenRes;
      try {
        tokenRes = await apiLogin(email, devPassword);
      } catch (e) {
        // If not found, sign up
        tokenRes = await apiSignup(email, devPassword, email.split('@')[0] || 'User');
      }
      const token = tokenRes?.token;
      if (!token) return;
      try { await SecureStore.setItemAsync('fomo_token_secure', String(token)); } catch {}
      // fetch profile to confirm
      const meRes = await apiMe(token);
      try { await AsyncStorage.setItem('fomo_user', meRes?.user?.id || email); } catch {}
      setCurrentUserId(meRes?.user?.id || email);
      setIsAuthVisible(false);
    } catch (err) {
      // noop for now; could add toast
    }
  }

  async function handleRequestOtp(email) {
    try {
      const res = await apiRequestCode(email);
      // For dev, backend returns code. Show it in the modal's hint by updating auth state.
      setAuthError('');
      return res?.code;
    } catch (e) {
      setAuthError('Failed to request code');
      return null;
    }
  }

  async function handleVerifyOtp(email, code) {
    try {
      const res = await apiVerifyCode(email, code);
      const token = res?.token;
      if (token) {
        try { await SecureStore.setItemAsync('fomo_token_secure', String(token)); } catch {}
        try { await AsyncStorage.setItem('fomo_user', res?.user?.id || email); } catch {}
        setCurrentUserId(res?.user?.id || email);
        setIsAuthVisible(false);
        setAuthError('');
      } else {
        setAuthError('Verification failed');
      }
    } catch (e) {
      setAuthError('Invalid or expired code');
    }
  }

  async function pickAvatarPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!res.canceled && res.assets && res.assets[0]) {
      setCurrentUserPhoto(res.assets[0].uri);
      try { await AsyncStorage.setItem('fomo_avatar_uri', res.assets[0].uri); } catch {}
    }
  }

  async function pickTempAvatarPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!res.canceled && res.assets && res.assets[0]) {
      setTempAvatarUri(res.assets[0].uri);
    }
  }

  useEffect(() => {
    if (isAddModalVisible && userRegion) {
      setDraftEvent((d) => ({
        ...d,
        lat: d.lat || userRegion.latitude.toFixed(6),
        lng: d.lng || userRegion.longitude.toFixed(6),
      }));
    }
  }, [isAddModalVisible, userRegion]);

  const nearbyEvents = useMemo(() => {
    if (!userRegion) return [];
    const maxMeters = radiusMiles * MILES_TO_METERS;
    return events.filter((e) => {
      if (selectedCategories.length && e.category && !selectedCategories.includes(e.category)) return false;
      const dx = distanceInMeters(userRegion.latitude, userRegion.longitude, e.lat, e.lng);
      return dx <= maxMeters;
    });
  }, [events, userRegion, radiusMiles, selectedCategories]);

  async function refreshNearby() {
    setIsRefreshing(true);
    try {
      const token = await SecureStore.getItemAsync('fomo_token_secure');
      const center = userRegion || { latitude: 37.7749, longitude: -122.4194 };
      const res = await apiListNearby(token || '', { lat: center.latitude, lng: center.longitude, miles: radiusMiles });
      if (res?.events) setEvents(res.events.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description || '',
        lat: e.lat,
        lng: e.lng,
        category: e.category || 'General',
        hostId: e.hostId,
        startAt: new Date(e.startAt).getTime(),
      })));
    } catch {
      setErrorMessage('Failed to load events');
      setTimeout(() => setErrorMessage(''), 2500);
    }
    setIsRefreshing(false);
  }

  function showError(msg) {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 2500);
  }

  function toggleRsvp(id) {
    (async () => {
      const e = events.find((x) => x.id === id);
      if (e && e.hostId === (currentUserId || CURRENT_USER_ID)) return;
      try {
        const token = await SecureStore.getItemAsync('fomo_token_secure');
        if (token && typeof id === 'string') {
          const res = await apiToggleRsvp(token, id);
          setRsvps((prev) => ({ ...prev, [id]: !!res?.rsvped }));
          return;
        }
      } catch {}
      setRsvps((prev) => ({ ...prev, [id]: !prev[id] }));
    })();
  }

  function addDraftCoordinateFromMap(coordinate) {
    setDraftEvent((d) => ({ ...d, lat: coordinate.latitude.toFixed(6), lng: coordinate.longitude.toFixed(6) }));
  }

  function openProfile(user) {
    setSelectedUser(user);
    setIsProfileVisible(true);
  }

  function openChat() {
    setIsProfileVisible(false);
    setIsChatVisible(true);
  }

  function sendMessage() {
    if (!selectedUser || !composeText.trim()) return;
    const userId = selectedUser.id;
    const msg = { id: `${Date.now()}`, from: CURRENT_USER_ID, text: composeText.trim(), ts: Date.now() };
    setMessagesByUser((prev) => ({ ...prev, [userId]: [ ...(prev[userId] || []), msg ] }));
    setComposeText('');
    // Fake auto-reply
    setTimeout(() => {
      const reply = { id: `${Date.now()}r`, from: userId, text: 'See you there! 🎉', ts: Date.now() };
      setMessagesByUser((prev) => ({ ...prev, [userId]: [ ...(prev[userId] || []), reply ] }));
    }, 900);
  }

  function openEventDetails(event) {
    setDetailsEvent(event);
    setIsDetailsVisible(true);
    setDetailsAddress('');
    // best-effort reverse geocode
    Location.reverseGeocodeAsync({ latitude: event.lat, longitude: event.lng })
      .then((arr) => {
        if (arr && arr[0]) {
          const a = arr[0];
          const parts = [a.name || a.street || '', a.city || '', a.region || '', a.postalCode || ''].filter(Boolean);
          setDetailsAddress(parts.join(', '));
        }
      })
      .catch(() => {});
  }

  function openEventFromDiscover(event) {
    setIsDiscoverOpen(false);
    openEventDetails(event);
  }

  function openBroadcastModal(event) {
    setDetailsEvent(event);
    setIsBroadcastVisible(true);
  }

  function addEvent() {
    if (!draftEvent.title || !draftEvent.lat || !draftEvent.lng) return;
    (async () => {
      const payload = {
        title: draftEvent.title.trim(),
        description: (draftEvent.description || '').trim(),
        category: inferCategoryFromText(`${draftEvent.title} ${draftEvent.description || ''}`, draftEvent.category),
        lat: parseFloat(draftEvent.lat),
        lng: parseFloat(draftEvent.lng),
        startAt: (draftEvent.startAt || new Date()).toISOString()
      };
      try {
        const token = await SecureStore.getItemAsync('fomo_token_secure');
        if (token) {
          const res = await apiCreateEvent(token, payload);
          if (res?.event) {
            setEvents((prev) => [...prev, {
              id: res.event.id,
              title: res.event.title,
              description: res.event.description || '',
              lat: res.event.lat,
              lng: res.event.lng,
              category: res.event.category || 'General',
              hostId: res.event.hostId,
              startAt: new Date(res.event.startAt).getTime(),
            }] );
          }
        } else {
          // fallback local append
          setEvents((prev) => [...prev, { id: `${Date.now()}`, ...payload, hostId: currentUserId || CURRENT_USER_ID, startAt: Date.now() }]);
        }
      } catch {
        // fallback local append on failure
        setEvents((prev) => [...prev, { id: `${Date.now()}`, ...payload, hostId: currentUserId || CURRENT_USER_ID, startAt: Date.now() }]);
      }
      setDraftEvent({ title: '', description: '', lat: '', lng: '', hostId: CURRENT_USER_ID, startAt: null });
      setIsAddModalVisible(false);
      setShowAddTimePicker(false);
    })();
  }

  function openPicker() {
    if (!userRegion) return;
    setPickerRegion(userRegion);
    setPickerCenter({ latitude: userRegion.latitude, longitude: userRegion.longitude });
    setIsPickerVisible(true);
  }

  function confirmPicker() {
    if (!pickerCenter) return;
    setDraftEvent((d) => ({ ...d, lat: pickerCenter.latitude.toFixed(6), lng: pickerCenter.longitude.toFixed(6) }));
    setIsPickerVisible(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      {!!errorMessage && (
        <View style={{ position: 'absolute', top: 20, left: 16, right: 16, zIndex: 2000 }}>
          <View style={{ backgroundColor: '#ef4444', borderRadius: 10, padding: 10 }}>
            <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>{errorMessage}</Text>
          </View>
        </View>
      )}
      {/* Settings entry (profile/logout/delete) */}
      {/* settings button moved into header */}
      {currentTab === 'map' && userRegion && (
        <MapView
          key={mapInstanceKey}
          ref={mapRef}
          style={styles.map}
          initialRegion={userRegion}
          showsUserLocation={false}
          showsMyLocationButton
          scrollEnabled={isMapInteractive}
          zoomEnabled={isMapInteractive}
          rotateEnabled={isMapInteractive}
          pitchEnabled={isMapInteractive}
          onRegionChangeComplete={(reg) => {
          // derive a rough zoom level from latitudeDelta
          const z = Math.log2(360 / reg.latitudeDelta);
          setRegionZoom(z);
        }}
        >
          <Circle
            center={{ latitude: userRegion.latitude, longitude: userRegion.longitude }}
            radius={radiusMiles * MILES_TO_METERS}
            strokeColor="rgba(17,24,39,0.35)"
            fillColor="rgba(17,24,39,0.08)"
          />
          {/* current user marker */}
          {userRegion && !settings.ghostMode && (
            <Marker
              key="me"
              coordinate={{ latitude: userRegion.latitude, longitude: userRegion.longitude }}
              onPress={() => openProfile({ id: currentUserId || CURRENT_USER_ID, name: 'You', initials: 'U', photo: currentUserPhoto || 'https://i.pravatar.cc/150?img=1', stats: { attended: 12, hosted: 5, connections: 43 } })}
            >
              <View style={{ padding: 6 }}>
                {renderAvatarMarker(currentUserId || CURRENT_USER_ID, currentUserPhoto, null, { size: 34 })}
    </View>
            </Marker>
          )}
          {/* Hide non-connection users (only events and your own marker for now) */}
          {nearbyEvents.map((e) => (
            <Marker key={e.id} coordinate={{ latitude: e.lat, longitude: e.lng }} onPress={() => openEventDetails(e)}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ backgroundColor: 'rgba(17,24,39,0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 4 }}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }} numberOfLines={1}>{e.title}</Text>
                </View>
                {renderEventEmoji(e.category, regionZoom, e)}
                {regionZoom >= 11.5 && (
                  <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 }}>
                    <Text style={{ color: '#2563eb', fontWeight: '800', marginRight: 8 }}>♂ {e.guys ?? 0}</Text>
                    <Text style={{ color: '#db2777', fontWeight: '800' }}>♀ {e.girls ?? 0}</Text>
                  </View>
                )}
              </View>
              <Callout>
                <View style={{ maxWidth: 220 }}>
                  <Text style={styles.eventTitle}>{e.title}</Text>
                  {!!e.description && <Text style={styles.eventDesc}>{e.description}</Text>}
                  <Text style={styles.meta}>{formatDistance(userRegion, e)} • {e.category || 'General'}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      {currentTab === 'map' && (
      <View style={styles.topBar} pointerEvents={isAddModalVisible ? 'none' : 'box-none'}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => { setTempAvatarUri(currentUserPhoto); setIsEditProfileVisible(true); }}
            onLongPress={() => setIsProfileVisible(true)}
            hitSlop={{ top: 24, left: 24, bottom: 24, right: 24 }}
            pressRetentionOffset={{ top: 24, left: 24, bottom: 24, right: 24 }}
            accessibilityRole="button"
            accessibilityLabel="Edit profile photo"
            style={{ zIndex: 1001 }}
          >
            <View style={styles.avatarCircle}>
              {currentUserPhoto ? (
                <Image source={{ uri: currentUserPhoto }} style={styles.avatarImg} />
              ) : (
                <Ionicons name="person" size={28} color="#111827" />
              )}
            </View>
          </Pressable>
          <View style={styles.headerLogoCenter}>
            <Image source={require('./assets/fomo-logo.png')} style={styles.logoImage} resizeMode="contain" />
          </View>
          <View style={styles.rightControls}>
            <Pressable onPress={() => setIsSettingsVisible(true)} style={[styles.filterButton, { marginBottom: 6, alignSelf: 'flex-end', backgroundColor: '#111827', borderColor: '#111827' }]}>
              <Ionicons name="settings" size={18} color="#fff" />
              <Text style={[styles.pillText, { color: '#fff' }]} numberOfLines={1}>Settings</Text>
            </Pressable>
            <Pressable onPress={() => setIsFiltersVisible(true)} style={[styles.filterButton, { alignSelf: 'flex-end', backgroundColor: '#111827', borderColor: '#111827' }]}>
              <Ionicons name="options" size={18} color="#fff" />
              <Text style={[styles.pillText, { color: '#fff' }]} numberOfLines={1}>Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
      )}

      {currentTab === 'map' && (
        <Pressable style={[styles.fab, { bottom: 180 }]} onPress={() => setIsAddModalVisible(true)}>
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      )}

      {currentTab === 'map' && (
      <Pressable
        style={[styles.recenter, { bottom: 180, right: 90 }]}
        onPress={async () => {
          try {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            const region = { latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 };
            setUserRegion(region);
            if (mapRef.current) mapRef.current.animateToRegion(region, 500);
          } catch {}
        }}
      >
        <Ionicons name="locate" size={18} color="#111827" />
      </Pressable>
      )}

      {currentTab === 'map' && (
      <DiscoverPanel
        open={isDiscoverOpen}
        onToggle={() => setIsDiscoverOpen((v) => !v)}
        featured={nearbyEvents.slice(0, 5)}
        categoryCounts={buildCategoryCounts(events)}
        userRegion={userRegion}
        leaderboard={buildLeaderboard(events, rsvps)}
        onPickAvatar={pickAvatarPhoto}
        currentUserPhoto={currentUserPhoto}
        onOpenEvent={(e) => openEventDetails(e)}
        onRefresh={refreshNearby}
        refreshing={isRefreshing}
      />
      )}

      {currentTab === 'dms' && (
        <DMList
          users={getUsersWithStats().filter((u) => u.id !== (currentUserId || CURRENT_USER_ID))}
          messagesByUser={messagesByUser}
          onOpen={(u) => { setSelectedUser(u); setIsChatVisible(true); }}
        />
      )}

      {currentTab === 'host' && (
        <HostToolsView
          hostedEvents={events.filter((e) => e.hostId === (currentUserId || CURRENT_USER_ID))}
          onAnnounce={(e) => { setDetailsEvent(e); setIsBroadcastVisible(true); }}
          onCreateEvent={() => setIsAddModalVisible(true)}
          onEdit={(e) => { setEditEventDraft({ ...e }); setIsEditEventVisible(true); }}
          onEditTime={(e) => { setEditEventDraft({ ...e }); setShowEditTimePicker(true); }}
        />
      )}

      {currentTab === 'leaders' && (
        <LeaderboardView events={events} rsvps={rsvps} />
      )}
      {/* legacy modal left for potential future use */}

      <BroadcastModal
        visible={isBroadcastVisible}
        onClose={() => setIsBroadcastVisible(false)}
        value={broadcastText}
        onChange={setBroadcastText}
        onSend={() => {
          // Fan-out to all RSVPs (local demo). In real app, call backend.
          const eventId = detailsEvent?.id;
          if (!eventId || !broadcastText.trim()) return;
          const text = broadcastText.trim();
          const rsvpUserIds = Object.entries(rsvps)
            .filter(([id, v]) => v && id === eventId)
            .map(() => CURRENT_USER_ID); // demo: route to self for visibility
          // Append a message thread per user (demo)
          rsvpUserIds.forEach((uid) => {
            const msg = { id: `${Date.now()}b`, from: CURRENT_USER_ID, text: `[Announcement] ${text}`, ts: Date.now() };
            setMessagesByUser((prev) => ({ ...prev, [uid]: [ ...(prev[uid] || []), msg ] }));
          });
          setBroadcastText('');
          setIsBroadcastVisible(false);
        }}
      />

      {/* Edit Event modal (host) */}
      <Modal visible={isEditEventVisible} animationType="slide" onRequestClose={() => setIsEditEventVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Edit Event</Text>
                {editEventDraft && (
                  <>
                    <TextInput
                      style={[styles.input, { color: ui.text, borderColor: ui.border, backgroundColor: ui.inputBg }]}
                      placeholder="Title"
                      value={editEventDraft.title}
                      onChangeText={(t) => setEditEventDraft((d) => ({ ...d, title: t }))}
                      returnKeyType="done"
                      placeholderTextColor={ui.placeholder}
                      selectionColor={ui.text}
                    />
                    <TextInput
                      style={[styles.input, { height: 88, textAlignVertical: 'top', color: ui.text, borderColor: ui.border, backgroundColor: ui.inputBg }]}
                      placeholder="Description (optional)"
                      value={editEventDraft.description}
                      onChangeText={(t) => setEditEventDraft((d) => ({ ...d, description: t }))}
                      multiline
                      returnKeyType="done"
                      placeholderTextColor={ui.placeholder}
                      selectionColor={ui.text}
                    />
                    <Text style={styles.sectionLabel}>Category</Text>
                    <TagRow
                      options={["General", "Music", "Food", "Sports", "Nightlife"]}
                      value={editEventDraft.category || 'General'}
                      onChange={(v) => setEditEventDraft((d) => ({ ...d, category: v }))}
                    />
                    <Text style={styles.sectionLabel}>Start time</Text>
                    <Pressable onPress={() => { setTempEditTime(new Date(editEventDraft.startAt || Date.now())); setShowEditTimePicker(true); }} style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: ui.inputBg, borderColor: ui.border }]}> 
                      <Text style={{ color: ui.text }}>{editEventDraft.startAt ? formatTime(new Date(editEventDraft.startAt)) : 'Pick a time'}</Text>
                      <Ionicons name="time" size={18} color={ui.placeholder} />
                    </Pressable>
                    {/* Time picker handled by bottom sheet below */}
                    <View style={styles.modalButtons}>
                      <Pressable style={[styles.button, styles.buttonSecondary]} onPress={() => setIsEditEventVisible(false)}>
                        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.button, styles.buttonPrimary]}
                        onPress={() => {
                          setEvents((prev) => prev.map((e) => e.id === editEventDraft.id ? { ...e, ...editEventDraft } : e));
                          setIsEditEventVisible(false);
                        }}
                      >
                        <Text style={styles.buttonText}>Save</Text>
                      </Pressable>
                    </View>
                    <Pressable
                      onPress={() => {
                        setEvents((prev) => prev.filter((e) => e.id !== editEventDraft.id));
                        setIsEditEventVisible(false);
                      }}
                      style={{ marginTop: 12, backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Delete Event</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Polished bottom-sheet time pickers */}
      {/* Keep only one time picker path; we already have inline time picker inside Add Event modal. */}
      <TimePickerSheet
        visible={showEditTimePicker}
        onClose={() => setShowEditTimePicker(false)}
        initialTime={new Date(editEventDraft?.startAt || Date.now())}
        onConfirm={(date) => { setEditEventDraft((d) => ({ ...d, startAt: date.getTime() })); setShowEditTimePicker(false); }}
      />

      {/* Settings modal with essentials */}
      <Modal visible={isSettingsVisible} animationType="slide" onRequestClose={() => setIsSettingsVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Pressable onPress={() => setIsSettingsVisible(false)} style={{ marginRight: 10, padding: 6 }}>
              <Ionicons name="chevron-back" size={22} color="#111827" />
            </Pressable>
            <Text style={{ fontWeight: '700', fontSize: 18 }}>Settings</Text>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Privacy & Safety</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
              <Text style={{ flex: 1 }}>Ghost Mode (hide my location)</Text>
              <Switch value={!!settings.ghostMode} onValueChange={async (v) => {
                const next = { ...settings, ghostMode: v };
                setSettings(next);
                try { await AsyncStorage.setItem('fomo_settings', JSON.stringify(next)); } catch {}
              }} />
            </View>

            <Text style={{ fontWeight: '700', marginTop: 16, marginBottom: 8 }}>Map & Events</Text>
            <Text style={{ color: '#6b7280', marginBottom: 6 }}>Default radius: {settings.defaultRadius} miles</Text>
            <Slider
              value={settings.defaultRadius}
              minimumValue={1}
              maximumValue={50}
              step={1}
              onValueChange={async (v) => {
                const miles = Math.round(v);
                setRadiusMiles(miles);
                const next = { ...settings, defaultRadius: miles };
                setSettings(next);
                try { await AsyncStorage.setItem('fomo_settings', JSON.stringify(next)); } catch {}
              }}
              minimumTrackTintColor="#111827"
              maximumTrackTintColor="#d1d5db"
            />

            <Text style={{ fontWeight: '700', marginTop: 16, marginBottom: 8 }}>Notifications</Text>
            {[
              { key: 'events', label: 'Event near you' },
              { key: 'dms', label: 'Direct messages' },
              { key: 'announcements', label: 'Host announcements' },
            ].map((row) => (
              <View key={row.key} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                <Text style={{ flex: 1 }}>{row.label}</Text>
                <Switch value={!!settings.notifications[row.key]} onValueChange={async (v) => {
                  const next = { ...settings, notifications: { ...settings.notifications, [row.key]: v } };
                  setSettings(next);
                  try { await AsyncStorage.setItem('fomo_settings', JSON.stringify(next)); } catch {}
                }} />
              </View>
            ))}

            <Text style={{ fontWeight: '700', marginTop: 16, marginBottom: 8 }}>Navigation</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['apple', 'google'].map((opt) => (
                <Pressable key={opt} onPress={async () => {
                  const next = { ...settings, navApp: opt };
                  setSettings(next);
                  try { await AsyncStorage.setItem('fomo_settings', JSON.stringify(next)); } catch {}
                }} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: settings.navApp === opt ? '#111827' : '#e5e7eb', backgroundColor: settings.navApp === opt ? '#111827' : '#fff' }}>
                  <Text style={{ color: settings.navApp === opt ? '#fff' : '#111827', fontWeight: '600' }}>{opt === 'apple' ? 'Apple Maps' : 'Google Maps'}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={{ fontWeight: '700', marginTop: 20, marginBottom: 8 }}>Account</Text>
            <Pressable onPress={async () => { try { await SecureStore.deleteItemAsync('fomo_token_secure'); } catch {}; await AsyncStorage.removeItem('fomo_user'); setCurrentUserId(null); setIsSettingsVisible(false); setIsAuthVisible(true); }} style={{ backgroundColor: '#f3f4f6', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#111827', fontWeight: '700' }}>Log out</Text>
            </Pressable>
            <Pressable onPress={async () => { await AsyncStorage.clear(); setCurrentUserId(null); setIsSettingsVisible(false); setIsAuthVisible(true); }} style={{ backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Delete account (local)</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* bottom nav */}
      <View style={styles.bottomNav} pointerEvents={isAddModalVisible ? 'none' : 'box-none'}>
        <Pressable onPress={() => setCurrentTab('map')} style={[styles.navBtn, currentTab==='map' && styles.navBtnActive]}>
          <Ionicons name="map" size={18} color={currentTab==='map' ? '#111827' : '#e5e7eb'} />
          <Text style={[styles.navText, currentTab==='map' && styles.navTextActive]}>Map</Text>
        </Pressable>
        <Pressable onPress={() => setCurrentTab('dms')} style={[styles.navBtn, currentTab==='dms' && styles.navBtnActive]}>
          <Ionicons name="chatbubbles" size={18} color={currentTab==='dms' ? '#111827' : '#e5e7eb'} />
          <Text style={[styles.navText, currentTab==='dms' && styles.navTextActive]}>DMs</Text>
        </Pressable>
        <Pressable onPress={() => setCurrentTab('host')} style={[styles.navBtn, currentTab==='host' && styles.navBtnActive]}>
          <Ionicons name="megaphone" size={18} color={currentTab==='host' ? '#111827' : '#e5e7eb'} />
          <Text style={[styles.navText, currentTab==='host' && styles.navTextActive]}>Host</Text>
        </Pressable>
        <Pressable onPress={() => setCurrentTab('leaders')} style={[styles.navBtn, currentTab==='leaders' && styles.navBtnActive]}>
          <Ionicons name="trophy" size={18} color={currentTab==='leaders' ? '#111827' : '#e5e7eb'} />
          <Text style={[styles.navText, currentTab==='leaders' && styles.navTextActive]}>Leaders</Text>
        </Pressable>
      </View>

      {/* Swipe deck removed per request */}
      <EventDetailsModal
        visible={isDetailsVisible}
        onClose={() => setIsDetailsVisible(false)}
        event={detailsEvent}
        address={detailsAddress}
        userRegion={userRegion}
        onRsvp={() => toggleRsvp(detailsEvent?.id)}
        rsvped={detailsEvent ? !!rsvps[detailsEvent.id] : false}
        rsvpCount={Object.values(rsvps).filter(Boolean).length}
        onBroadcast={(e) => openBroadcastModal(e)}
      />
      <AuthModal
        visible={isAuthVisible}
        onClose={async () => {
          if (authValue.trim()) {
            await AsyncStorage.setItem('fomo_user', authValue.trim());
            setCurrentUserId(authValue.trim());
            setIsAuthVisible(false);
          }
        }}
        value={authValue}
        onChange={setAuthValue}
        onBackendSignIn={handleBackendSignIn}
        onRequestOtp={handleRequestOtp}
        onVerifyOtp={handleVerifyOtp}
      />

      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        onRequestClose={() => { setShowAddTimePicker(false); setIsAddModalVisible(false); }}
        presentationStyle={Platform.OS === 'ios' ? 'fullScreen' : undefined}
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Add Event</Text>
                <TextInput
                  style={[styles.input, { color: ui.text, borderColor: ui.border, backgroundColor: ui.inputBg }]}
                  placeholder="Title"
                  value={draftEvent.title}
                  onChangeText={(t) => setDraftEvent((d) => ({ ...d, title: t }))}
                  returnKeyType="done"
                  placeholderTextColor={ui.placeholder}
                  selectionColor={ui.text}
                />
                <TextInput
                  style={[styles.input, { height: 88, textAlignVertical: 'top', color: ui.text, borderColor: ui.border, backgroundColor: ui.inputBg }]}
                  placeholder="Description (optional)"
                  value={draftEvent.description}
                  onChangeText={(t) => setDraftEvent((d) => ({ ...d, description: t }))}
                  multiline
                  returnKeyType="done"
                  placeholderTextColor={ui.placeholder}
                  selectionColor={ui.text}
                />
                <Text style={styles.sectionLabel}>Category</Text>
                <TagRow
                  options={["General", "Music", "Food", "Sports", "Nightlife"]}
                  value={draftEvent.category || 'General'}
                  onChange={(v) => setDraftEvent((d) => ({ ...d, category: v }))}
                />
                <Text style={styles.sectionLabel}>Start time</Text>
                <Pressable onPress={() => { setTempAddTime(draftEvent.startAt || new Date()); setShowAddTimePicker(true); }} style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: ui.inputBg, borderColor: ui.border }]}> 
                  <Text style={{ color: ui.text }}>{draftEvent.startAt ? formatTime(draftEvent.startAt) : 'Pick a time'}</Text>
                  <Ionicons name="time" size={18} color={ui.placeholder} />
                </Pressable>
                {showAddTimePicker && (
                  <View style={{ backgroundColor: '#111827', borderRadius: 12, marginTop: 8, paddingVertical: 6 }}>
                    <View style={{ alignItems: 'center', paddingVertical: 6 }}>
                      <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>{formatTime(tempAddTime || draftEvent.startAt || new Date())}</Text>
                    </View>
                    <View style={{ backgroundColor: '#0f172a', borderRadius: 12, paddingVertical: 6, alignItems: 'center' }}>
                      <DateTimePicker
                        value={tempAddTime || draftEvent.startAt || new Date()}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(e, date) => { if (date) setTempAddTime(date); }}
                      />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12, padding: 12 }}>
                      <Pressable style={[styles.button, styles.buttonSecondary]} onPress={() => setShowAddTimePicker(false)}>
                        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Cancel</Text>
                      </Pressable>
                      <Pressable style={[styles.button, styles.buttonPrimary]} onPress={() => { setDraftEvent((d) => ({ ...d, startAt: tempAddTime || new Date() })); setShowAddTimePicker(false); }}>
                        <Text style={styles.buttonText}>Confirm</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                {/* Time picker handled by bottom sheet below */}
                <Text style={styles.sectionLabel}>Pick location</Text>
                <View style={{ height: 320, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }} pointerEvents="auto">
                  {userRegion && (
                    <MapView
                      style={{ flex: 1 }}
                      initialRegion={userRegion}
                      showsUserLocation
                      scrollEnabled
                      zoomEnabled
                      rotateEnabled={false}
                      pitchEnabled={false}
                      onRegionChangeComplete={(r) => {
                        // snap-map style: keep pin at map center by updating coordinates
                        setDraftEvent((d) => ({ ...d, lat: r.latitude.toFixed(6), lng: r.longitude.toFixed(6) }));
                      }}
                    >
                      {hasLocationPermission && (
                        <Circle
                          center={{ latitude: userRegion.latitude, longitude: userRegion.longitude }}
                          radius={100}
                          strokeColor="rgba(59,130,246,0.35)"
                          fillColor="rgba(59,130,246,0.08)"
                        />
                      )}
                      {/* Center pin overlay */}
                    </MapView>
                  )}
                  <View pointerEvents="none" style={styles.centerPinContainer}>
                    <Animated.View style={{ transform: [{ translateY: new Animated.Value(0) }] }}>
                      <Ionicons name="location" size={36} color="#e11d48" />
                    </Animated.View>
                  </View>
                </View>

                {/* Host avatar selection removed; creator is host */}

                <View style={styles.modalButtons}>
                  <Pressable style={[styles.button, styles.buttonSecondary]} onPress={() => setIsAddModalVisible(false)}>
                    <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Back</Text>
                  </Pressable>
                  <Pressable style={[styles.button, styles.buttonPrimary]} onPress={addEvent}>
                    <Text style={styles.buttonText}>Add</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      <Modal visible={isFiltersVisible} animationType="slide" onRequestClose={() => setIsFiltersVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Filters</Text>
          <Text style={styles.sectionLabel}>Radius: {radiusMiles} miles</Text>
          <Slider
            value={radiusMiles}
            minimumValue={1}
            maximumValue={50}
            step={1}
            onValueChange={(v) => setRadiusMiles(Math.round(v))}
            minimumTrackTintColor="#111827"
            maximumTrackTintColor="#d1d5db"
          />
          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Categories</Text>
          <MultiTagRow
            options={["Music", "Food", "Sports", "Nightlife", "General"]}
            values={selectedCategories}
            onChange={setSelectedCategories}
          />
          <View style={styles.modalButtons}>
            <Pressable style={[styles.button, styles.buttonSecondary]} onPress={() => { setSelectedCategories([]); setIsFiltersVisible(false); }}>
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Clear</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonPrimary]} onPress={() => setIsFiltersVisible(false)}>
              <Text style={styles.buttonText}>Done</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* picker modal removed */}

      <ProfileModal
        visible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
        user={selectedUser}
        onMessage={() => openChat()}
      />
      <EditProfileModal
        visible={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
        tempUri={tempAvatarUri}
        onPickPhoto={pickTempAvatarPhoto}
        onSave={async () => {
          if (tempAvatarUri) {
            setCurrentUserPhoto(tempAvatarUri);
            try { await AsyncStorage.setItem('fomo_avatar_uri', tempAvatarUri); } catch {}
          }
          setIsEditProfileVisible(false);
        }}
        onChangeTemp={setTempAvatarUri}
      />
      <ChatModal
        visible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
        user={selectedUser}
        messages={selectedUser ? (messagesByUser[selectedUser.id] || []) : []}
        onSend={sendMessage}
        composeText={composeText}
        setComposeText={setComposeText}
      />

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

// Profile modal
function ProfileModal({ visible, onClose, user, onMessage }) {
  if (!user) return null;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Image source={{ uri: user.photo }} style={{ width: 56, height: 56, borderRadius: 28, marginRight: 12 }} />
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>{user.name}</Text>
            <Text style={{ color: '#6b7280' }}>@{user.initials.toLowerCase()}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ marginRight: 16 }}>
            <Text style={{ fontWeight: '700' }}>{user.stats.attended}</Text>
            <Text style={{ color: '#6b7280' }}>Attended</Text>
          </View>
          <View style={{ marginRight: 16 }}>
            <Text style={{ fontWeight: '700' }}>{user.stats.hosted}</Text>
            <Text style={{ color: '#6b7280' }}>Hosted</Text>
          </View>
          <View>
            <Text style={{ fontWeight: '700' }}>{user.stats.connections}</Text>
            <Text style={{ color: '#6b7280' }}>Connections</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: '#f3f4f6', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ color: '#111827', fontWeight: '700' }}>Close</Text>
          </Pressable>
          <Pressable onPress={onMessage} style={{ flex: 1, backgroundColor: '#111827', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Message</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function ChatModal({ visible, onClose, user, messages, onSend, composeText, setComposeText }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (visible && scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, composeText, visible]);
  if (!user) return null;
  return (
    <Modal visible={visible} animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={24} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Pressable onPress={onClose} style={{ marginRight: 10, padding: 6 }}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </Pressable>
          <Image source={{ uri: user.photo }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }} />
          <Text style={{ fontWeight: '700', fontSize: 16 }}>{user.name}</Text>
        </View>
        <ScrollView ref={scrollRef} style={{ flex: 1, padding: 12 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 12 }}>
          {(messages || []).map((m) => (
            <View key={m.id} style={{ alignSelf: m.from === CURRENT_USER_ID ? 'flex-end' : 'flex-start', backgroundColor: m.from === CURRENT_USER_ID ? '#34c759' : '#e5e7eb', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 18, marginBottom: 8, maxWidth: '78%' }}>
              <Text style={{ color: m.from === CURRENT_USER_ID ? '#000' : '#111827' }}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: '#eee', alignItems: 'flex-end' }}>
          <TextInput value={composeText} onChangeText={setComposeText} placeholder="Message" placeholderTextColor="#6b7280" style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, marginRight: 8, color: '#111827', backgroundColor: '#fff', maxHeight: 120 }} selectionColor="#111827" multiline autoCorrect autoCapitalize="sentences" />
          <Pressable onPress={onSend} style={{ backgroundColor: '#111827', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
          </Pressable>
        </View>
      </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function EventDetailsModal({ visible, onClose, event, address, userRegion, onRsvp, rsvped, rsvpCount, onBroadcast }) {
  if (!event) return null;
  const distance = userRegion ? formatDistance(userRegion, event) : '';
  const isHost = event.hostId === CURRENT_USER_ID;
  return (
    <Modal visible={visible} animationType="none" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 6 }}>{event.title}</Text>
          {!!event.theme && <Text style={{ color: '#6b7280', marginBottom: 6 }}>Theme: {event.theme}</Text>}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            {renderAvatarForHost(event.hostId, event.hostPhoto)}
            <Text style={{ marginLeft: 6 }}>Host</Text>
          </View>
          <Text style={{ color: '#6b7280', marginBottom: 8 }}>{distance} • Category: {event.category} • Size: {event.size}</Text>
          {!!event.description && <Text style={{ marginBottom: 12 }}>{event.description}</Text>}
          <Text style={{ fontWeight: '700', marginBottom: 4 }}>Address</Text>
          <Text style={{ color: '#6b7280', marginBottom: 8 }}>{address || 'Locating...'}</Text>
          <Pressable onPress={() => openNativeDirections(event)} style={{ alignSelf: 'flex-start', backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Open in Apple Maps</Text>
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
            {!isHost && (
              <Pressable onPress={onRsvp} style={{ backgroundColor: rsvped ? '#111827' : '#fff', borderWidth: 1, borderColor: '#111827', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ color: rsvped ? '#fff' : '#111827', fontWeight: '700' }}>{rsvped ? "RSVP'd" : 'RSVP'}</Text>
              </Pressable>
            )}
            <Text style={{ marginLeft: 12, color: '#6b7280' }}>{rsvpCount} going</Text>
          </View>
          <Text style={{ fontWeight: '700', marginBottom: 4 }}>Estimated time</Text>
          <EtaRow userRegion={userRegion} event={event} />
        </View>
        <View style={{ flex: 1, marginHorizontal: 16, marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}>
          <MapView style={{ flex: 1 }} initialRegion={{ latitude: event.lat, longitude: event.lng, latitudeDelta: 0.02, longitudeDelta: 0.02 }}>
            {userRegion && (
              <Polyline coordinates={[{ latitude: userRegion.latitude, longitude: userRegion.longitude }, { latitude: event.lat, longitude: event.lng }]} strokeColor="#3b82f6" strokeWidth={4} />
            )}
            <Marker coordinate={{ latitude: event.lat, longitude: event.lng }}>
              {renderEventEmoji(event.category, 13)}
            </Marker>
          </MapView>
        </View>
        <View style={{ padding: 16 }}>
          <Pressable onPress={onClose} style={{ backgroundColor: '#111827', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Close</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function EtaRow({ userRegion, event }) {
  if (!userRegion) return <Text style={{ color: '#6b7280' }}>Location permission required</Text>;
  const meters = distanceInMeters(userRegion.latitude, userRegion.longitude, event.lat, event.lng);
  const car = Math.max(1, Math.round((meters / 1000) / 40 * 60)); // 40 km/h avg
  const bike = Math.max(1, Math.round((meters / 1000) / 15 * 60)); // 15 km/h avg
  const walk = Math.max(1, Math.round((meters / 1000) / 5 * 60));  // 5 km/h avg
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Chip label={`Car ${car} min`} />
      <Chip label={`Bike ${bike} min`} />
      <Chip label={`Walk ${walk} min`} />
    </View>
  );
}

function Chip({ label }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#f3f4f6' }}>
      <Text style={{ color: '#111827', fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

function openNativeDirections(event) {
  const url = `http://maps.apple.com/?daddr=${event.lat},${event.lng}&dirflg=d`;
  Linking.openURL(url).catch(() => {});
}

function renderEventEmoji(category, zoom, event) {
  const big = zoom < 12;
  const fontSize = big ? 36 : 26;
  let emoji = '⭐️';
  switch ((category || 'General').toLowerCase()) {
    case 'music': emoji = '🎵'; break;
    case 'sports': emoji = '🏀'; break;
    case 'nightlife': emoji = '🥂'; break;
    case 'food': emoji = '🍕'; break;
    default: emoji = '⭐️';
  }
  const timeLeft = event?.startAt ? Math.max(0, Math.floor((event.startAt - Date.now()) / (60*1000))) : null;
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: fontSize + 6 }}>{emoji}</Text>
      {timeLeft !== null && (
        <View style={{ marginTop: 2, backgroundColor: 'rgba(17,24,39,0.85)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{timeLeft}m</Text>
        </View>
      )}
    </View>
  );
}

function AuthModal({ visible, onClose, value, onChange, onBackendSignIn, onRequestOtp, onVerifyOtp }) {
  const [step, setStep] = useState('enter');
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [entered, setEntered] = useState('');
  const trimmed = (value || '').trim();
  const digits = trimmed.replace(/\D/g, '');
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const isPhone = digits.length >= 10 && digits.length <= 15;
  const isValid = isEmail || isPhone;
  async function sendCode() {
    if (!isValid) return;
    setError('');
    setEntered('');
    const generated = isEmail && onRequestOtp ? await onRequestOtp(trimmed) : String(Math.floor(100000 + Math.random() * 900000));
    if (!generated) { setError('Failed to send code'); return; }
    setCode(generated);
    setStep('verify');
  }
  async function verify(input) {
    const trimmedInput = (input || '').trim();
    if (trimmedInput.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    if (isEmail && onVerifyOtp) {
      await onVerifyOtp(trimmed, trimmedInput);
      return;
    }
    if (trimmedInput === code) onClose(); else setError('Invalid code, try again');
  }
  return (
    <Modal visible={visible} animationType="none" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding: 16, justifyContent: 'center' }}>
        <View style={{ position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {step === 'verify' ? (
            <Pressable onPress={() => { setStep('enter'); setError(''); setCode(''); setEntered(''); }} accessibilityRole="button" accessibilityLabel="Back" style={{ padding: 8 }}>
              <Ionicons name="chevron-back" size={22} color="#111827" />
            </Pressable>
          ) : <View style={{ width: 38, height: 38 }} />}
          <Image source={require('./assets/fomo-logo.png')} style={{ width: 200, height: 56 }} resizeMode="contain" />
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={{ padding: 8 }}>
            <Ionicons name="close" size={20} color="#111827" />
          </Pressable>
        </View>
        <View style={{ height: 40 }} />
        {step === 'enter' ? (
          <>
            <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' }}>{mode === 'signin' ? 'Sign in' : 'Sign up'}</Text>
            <Text style={{ color: '#6b7280', marginBottom: 8, textAlign: 'center' }}>Enter a valid email or phone number</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Email or phone"
              keyboardType="email-address"
              textContentType="username"
              autoCapitalize="none"
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 }}
            />
            <Pressable onPress={sendCode} disabled={!isValid} style={{ backgroundColor: isValid ? '#111827' : '#9ca3af', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{mode === 'signin' ? 'Send sign-in code' : 'Send sign-up code'}</Text>
            </Pressable>
            <Pressable onPress={() => onBackendSignIn && onBackendSignIn(value)} disabled={!isEmail} style={{ marginTop: 10, backgroundColor: isEmail ? '#111827' : '#9ca3af', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Sign in with backend</Text>
            </Pressable>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <Pressable onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                <Text style={{ color: '#6b7280' }}>{mode === 'signin' ? "Don't have an account? Sign up" : 'Have an account? Sign in'}</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' }}>Enter verification code</Text>
            <Text style={{ color: '#6b7280', marginBottom: 8, textAlign: 'center' }}>We sent a 6‑digit code</Text>
            <TextInput
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={(t) => setEntered(t)}
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12, textAlign: 'center', letterSpacing: 2 }}
            />
            {!!code && (
              <Text style={{ color: '#9ca3af', textAlign: 'center', marginBottom: 8 }}>Dev code: {code}</Text>
            )}
            {!!error && <Text style={{ color: '#ef4444', textAlign: 'center', marginBottom: 8 }}>{error}</Text>}
            <Pressable onPress={() => verify(entered)} style={{ backgroundColor: '#111827', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Verify</Text>
            </Pressable>
            <Pressable onPress={() => { setStep('enter'); setError(''); setCode(''); setEntered(''); }} style={{ marginTop: 10, alignItems: 'center' }}>
              <Text style={{ color: '#6b7280' }}>Change email/phone</Text>
            </Pressable>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
}

function BroadcastModal({ visible, onClose, value, onChange, onSend }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Pressable onPress={onClose} style={{ marginRight: 10, padding: 6 }}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </Pressable>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>Announcement</Text>
        </View>
        <View style={{ padding: 16 }}>
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Type a message to all RSVPs (e.g., Party cancelled)"
            placeholderTextColor="#6b7280"
            style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, minHeight: 140, color: '#111827', backgroundColor: '#fff' }}
            multiline
          />
          <Pressable onPress={onSend} style={{ marginTop: 12, backgroundColor: '#111827', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: 62,
    left: 16,
    right: 16,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    zIndex: 1000,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
  },
  logoImage: {
    width: 320,
    height: 78,
    marginBottom: 2,
    marginLeft: 14,
  },
  logoLeft: { flex: 1, paddingRight: 0, alignItems: 'flex-start', marginLeft: 0 },
  headerLogoCenter: { flex: 1, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center' },
  rightControls: { flex: 0, alignItems: 'flex-end', gap: 8, minWidth: 140 },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  sub: {
    marginTop: 2,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: '#e6e8eb',
    minWidth: 130,
    justifyContent: 'center',
  },
  pillText: { marginLeft: 6, fontWeight: '600', color: '#111827', fontSize: 13 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  roundBtn: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  eventTitle: { fontWeight: '600', marginBottom: 4 },
  eventDesc: { color: '#555', marginBottom: 8 },
  rsvpButton: {
    borderWidth: 1,
    borderColor: '#111827',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  rsvpButtonActive: {
    backgroundColor: '#111827',
  },
  rsvpButtonText: { color: '#111827', fontWeight: '600' },
  rsvpButtonTextActive: { color: '#fff' },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  sectionLabel: { fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10 },
  rowInput: { flex: 1 },
  inlinePickerButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimary: { backgroundColor: '#111827' },
  buttonSecondary: { backgroundColor: '#f3f4f6' },
  buttonText: { color: '#fff', fontWeight: '700' },
  buttonTextSecondary: { color: '#111827' },
  centerPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -36,
  },
  meta: { color: '#6b7280', marginBottom: 8 },
  recenter: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  discover: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 100,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  discoverTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { marginLeft: 6, fontWeight: '700', color: '#111827' },
  bottomNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 30,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  navBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12 },
  navBtnActive: { backgroundColor: '#ffffff' },
  navText: { marginLeft: 6, color: '#e5e7eb', fontWeight: '600' },
  navTextActive: { color: '#111827' },
});

// Haversine distance approximation (meters)
function distanceInMeters(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(userRegion, e) {
  const m = distanceInMeters(userRegion.latitude, userRegion.longitude, e.lat, e.lng);
  const mi = m / MILES_TO_METERS;
  return `${mi.toFixed(mi < 10 ? 1 : 0)} mi away`;
}

function dHost(draft, id) {
  return draft.hostId === id;
}

function Tag({ label, isActive, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: isActive ? '#111827' : '#e5e7eb',
        backgroundColor: isActive ? '#111827' : '#fff',
        marginRight: 8,
      }}
    >
      <Text style={{ color: isActive ? '#fff' : '#111827', fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

function TagRow({ options, value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
      {options.map((o) => (
        <Tag key={o} label={o} isActive={value === o} onPress={() => onChange(o)} />
      ))}
    </View>
  );
}

function MultiTagRow({ options, values, onChange }) {
  function toggle(o) {
    if (values.includes(o)) onChange(values.filter((v) => v !== o));
    else onChange([...values, o]);
  }
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
      {options.map((o) => (
        <Tag key={o} label={o} isActive={values.includes(o)} onPress={() => toggle(o)} />
      ))}
    </View>
  );
}

function DiscoverPanel({ open, onToggle, featured, categoryCounts, userRegion, leaderboard, onPickAvatar, currentUserPhoto, onOpenEvent, onRefresh, refreshing }) {
  if (!open) {
    return (
      <Pressable style={styles.discover} onPress={onToggle}>
        <Text style={styles.discoverTitle}>Discover</Text>
        <Text style={{ color: '#6b7280' }}>Tap to expand</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.discover}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.discoverTitle}>Discover</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={onToggle} style={[styles.filterButton, { backgroundColor: '#fff' }]}>
            <Ionicons name="chevron-down" size={18} color="#111827" />
          </Pressable>
        </View>
      </View>
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Featured</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}
        refreshControl={<RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />}
      >
        {featured.length === 0 ? (
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ color: '#6b7280' }}>No events yet. Add the first one!</Text>
          </View>
        ) : (
          featured.map((e) => (
            <Pressable key={e.id} onPress={() => onOpenEvent && onOpenEvent(e)} style={{ width: 220, marginRight: 12, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontWeight: '700', marginBottom: 4 }}>{e.title}</Text>
              {!!e.description && <Text numberOfLines={2} style={{ color: '#6b7280', marginBottom: 6 }}>{e.description}</Text>}
              {userRegion && (
                <Text style={{ color: '#6b7280' }}>{formatDistance(userRegion, e)}</Text>
              )}
            </Pressable>
          ))
        )}
      </ScrollView>
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Popular Categories</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <View key={cat} style={styles.chip}>
            <Text style={{ fontWeight: '600' }}>{cat} · {count}</Text>
          </View>
        ))}
      </View>
      <Text style={{ fontWeight: '600', marginTop: 12, marginBottom: 8 }}>Leaderboard</Text>
      {leaderboard.length === 0 ? (
        <Text style={{ color: '#6b7280' }}>No RSVPs yet.</Text>
      ) : (
        leaderboard.slice(0, 5).map((row) => (
          <View key={row.hostId} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            {renderAvatarForHost(row.hostId)}
            <Text style={{ marginLeft: 8, fontWeight: '600' }}>{row.name}</Text>
            <Text style={{ marginLeft: 'auto', color: '#6b7280' }}>{row.rsvps} RSVPs</Text>
          </View>
        ))
      )}
    </View>
  );
}

function buildCategoryCounts(events) {
  const map = {};
  for (const e of events) {
    const c = e.category || 'General';
    map[c] = (map[c] || 0) + 1;
  }
  return map;
}

function buildLeaderboard(events, rsvps) {
  const hostIdToCount = {};
  const idToEvent = {};
  for (const e of events) idToEvent[e.id] = e;
  for (const [eventId, isRsvp] of Object.entries(rsvps)) {
    if (!isRsvp) continue;
    const e = idToEvent[eventId];
    if (e) hostIdToCount[e.hostId] = (hostIdToCount[e.hostId] || 0) + 1;
  }
  const rows = Object.entries(hostIdToCount).map(([hostId, count]) => {
    const u = MOCK_USERS.find((x) => x.id === hostId);
    return { hostId, name: u ? u.name : 'Host', rsvps: count };
  });
  rows.sort((a, b) => b.rsvps - a.rsvps);
  return rows;
}

function renderAvatarForHost(hostId, hostPhotoUri) {
  const u = MOCK_USERS.find((x) => x.id === hostId);
  if (!u) return null;
  // Prefer explicit host photo if provided
  const photoUri = hostPhotoUri || (hostId === CURRENT_USER_ID ? null : null);
  if (photoUri) {
    return (
      <Image source={{ uri: photoUri }} style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' }} />
    );
  }
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 999, padding: 2, borderWidth: 1, borderColor: '#e5e7eb' }}>
      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: u.color, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 10 }}>{u.initials}</Text>
      </View>
    </View>
  );
}

function openEventFromDiscover(e) {
  // This function is a placeholder; the onPress wiring in Discover toggles panel then opens map callout via details flow
}

// Simple heuristic to infer category from text
function inferCategoryFromText(text, fallback) {
  const t = (text || '').toLowerCase();
  if (/(dj|music|concert|show|band|club|party)/.test(t)) return 'Music';
  if (/(pizza|taco|food|bbq|dinner|brunch|drink|bar)/.test(t)) return 'Food';
  if (/(basketball|soccer|football|tennis|gym|run|sports|game)/.test(t)) return 'Sports';
  if (/(nightlife|club|bar|lounge|afterparty)/.test(t)) return 'Nightlife';
  return fallback || 'General';
}

function formatTime(date) {
  try {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/^0/, '');
  } catch {
    return '';
  }
}

function LeaderboardModal({ visible, onClose, events, rsvps }) {
  const mostRsvped = [...events]
    .map((e) => ({ e, count: Object.entries(rsvps).filter(([id, v]) => v && id === e.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const connections = getUsersWithStats().map((u) => ({ u, connections: u.stats ? u.stats.connections : Math.floor(Math.random()*100)+10 }))
    .sort((a,b)=> b.connections - a.connections)
    .slice(0, 10);

  const attended = getUsersWithStats()
    .map((u) => ({ u, attended: u.stats ? u.stats.attended : Math.floor(Math.random()*40)+5 }))
    .sort((a,b)=> b.attended - a.attended)
    .slice(0, 10);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Pressable onPress={onClose} style={{ marginRight: 10, padding: 6 }}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </Pressable>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>Leaderboard</Text>
        </View>
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Most RSVPed Events</Text>
          {mostRsvped.length === 0 && <Text style={{ color: '#6b7280', marginBottom: 12 }}>No RSVPs yet.</Text>}
          {mostRsvped.map(({ e, count }) => (
            <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 28, alignItems: 'center' }}>{renderEventEmoji(e.category, 10)}</View>
              <Text style={{ marginLeft: 8, fontWeight: '600' }}>{e.title}</Text>
              <Text style={{ marginLeft: 'auto', color: '#6b7280' }}>{count} going</Text>
            </View>
          ))}

          <Text style={{ fontWeight: '700', marginTop: 16, marginBottom: 8 }}>Most Connected Users</Text>
          {connections.map(({ u, connections: c }) => (
            <View key={u.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              {renderAvatarForHost(u.id)}
              <Text style={{ marginLeft: 8, fontWeight: '600' }}>{u.name}</Text>
              <Text style={{ marginLeft: 'auto', color: '#6b7280' }}>{c} connections</Text>
            </View>
          ))}

          <Text style={{ fontWeight: '700', marginTop: 16, marginBottom: 8 }}>Most Events Attended</Text>
          {attended.map(({ u, attended: a }) => (
            <View key={u.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              {renderAvatarForHost(u.id)}
              <Text style={{ marginLeft: 8, fontWeight: '600' }}>{u.name}</Text>
              <Text style={{ marginLeft: 'auto', color: '#6b7280' }}>{a} attended</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function renderAvatarMarker(userId, currentUserPhoto, fallbackPhoto, options = {}) {
  const size = options.size || 28;
  const border = Math.max(2, Math.round(size * 0.07));
  const u = MOCK_USERS.find((x) => x.id === userId);
  const isKnownUser = !!u;
  const isCurrent = !isKnownUser || userId === CURRENT_USER_ID;
  const photoUri = isCurrent ? currentUserPhoto : fallbackPhoto || null;
  if (photoUri) {
    return (
      <Image source={{ uri: photoUri }} style={{ width: size, height: size, borderRadius: size/2, borderWidth: border, borderColor: '#fff' }} />
    );
  }
  if (isCurrent) {
    // Placeholder silhouette (Life360-style) until user uploads a photo
    return (
      <View style={{ backgroundColor: '#fff', borderRadius: 999, padding: 3, borderWidth: 1, borderColor: '#e5e7eb' }}>
        <View style={{ width: size - 2, height: size - 2, borderRadius: (size - 2)/2, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="person" size={Math.round(size * 0.57)} color="#9ca3af" />
        </View>
      </View>
    );
  }
  // Other users without photos: colored initials
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 999, padding: 4, borderWidth: 1, borderColor: '#e5e7eb' }}>
      <View style={{ width: size - 2, height: size - 2, borderRadius: (size - 2)/2, backgroundColor: u.color, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: Math.round(size * 0.5) }}>{u.initials}</Text>
      </View>
    </View>
  );
}

function getUsersWithStats() {
  return MOCK_USERS.map((u) => ({
    ...u,
    stats: u.stats || {
      attended: Math.floor(Math.random() * 40) + 5,
      hosted: Math.floor(Math.random() * 25) + 2,
      connections: Math.floor(Math.random() * 150) + 20,
    },
  }));
}

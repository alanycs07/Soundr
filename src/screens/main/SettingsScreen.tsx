// src/screens/main/SettingsScreen.tsx
// User settings and profile screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getUserById, updateUsername, logoutUser } from '../../store/userStorage';
import type { UserAccount } from '../../store/userStorage';

interface SettingsScreenProps {
  userId: string;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ userId, onLogout }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [updatingUsername, setUpdatingUsername] = useState(false);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const userData = await getUserById(userId);
      setUser(userData);
      setNewUsername(userData?.username || '');
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    if (newUsername === user?.username) {
      setEditingUsername(false);
      return;
    }

    setUpdatingUsername(true);
    try {
      await updateUsername(userId, newUsername);
      setUser({ ...user!, username: newUsername });
      setEditingUsername(false);
      Alert.alert('Success', 'Username updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdatingUsername(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutUser();
            onLogout();
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f1e', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 18, paddingBottom: 120, paddingTop: 24 }}>
      <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff', marginBottom: 32 }}>
        ⚙️ Settings
      </Text>

      {/* Profile Card */}
      <View
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: 20,
          padding: 24,
          marginBottom: 32,
          borderWidth: 2,
          borderColor: '#00ff00',
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 18,
            borderWidth: 2,
            borderColor: '#00ff00',
          }}
        >
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>

        <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 10 }}>
          {user?.username}
        </Text>

        <Text style={{ color: '#666', marginBottom: 4, fontWeight: '600', fontSize: 12 }}>
          User ID: {user?.userId.slice(0, 8)}...
        </Text>

        <Text style={{ color: '#666', marginBottom: 18, fontWeight: '600', fontSize: 12 }}>
          Account created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
        </Text>

        {/* Pro Status */}
        {user?.isPro && (
          <View style={{ backgroundColor: 'rgba(0, 255, 0, 0.2)', borderRadius: 8, padding: 10, marginBottom: 18 }}>
            <Text style={{ color: '#00ff00', fontWeight: '900', fontSize: 12, textAlign: 'center' }}>
              ⭐ PRO MEMBER
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            setEditingUsername(true);
            setNewUsername(user?.username || '');
          }}
          style={{
            backgroundColor: '#00ff00',
            borderRadius: 10,
            paddingVertical: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#000', fontWeight: '900', fontSize: 14 }}>
            ✏️ EDIT USERNAME
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={{ marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '900',
            color: '#00ff00',
            marginBottom: 16,
            letterSpacing: 1,
          }}
        >
          📊 STATISTICS
        </Text>

        <View
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 14,
            padding: 16,
            marginBottom: 10,
            borderLeftWidth: 3,
            borderLeftColor: '#00ff00',
          }}
        >
          <Text style={{ color: '#fff', marginBottom: 4, fontWeight: '700', fontSize: 15 }}>
            Current Streak
          </Text>
          <Text style={{ color: '#00ff00', fontSize: 28, fontWeight: '900' }}>
            {user?.streak || 0}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 14,
            padding: 16,
            marginBottom: 10,
            borderLeftWidth: 3,
            borderLeftColor: '#00ffff',
          }}
        >
          <Text style={{ color: '#fff', marginBottom: 4, fontWeight: '700', fontSize: 15 }}>
            Total Cleanings
          </Text>
          <Text style={{ color: '#00ffff', fontSize: 28, fontWeight: '900' }}>
            {user?.totalCleanings || 0}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 14,
            padding: 16,
            borderLeftWidth: 3,
            borderLeftColor: '#ffff00',
          }}
        >
          <Text style={{ color: '#fff', marginBottom: 4, fontWeight: '700', fontSize: 15 }}>
            Hearing Tests
          </Text>
          <Text style={{ color: '#ffff00', fontSize: 28, fontWeight: '900' }}>
            {user?.hearingTests || 0}
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: '#ff6b6b',
          borderRadius: 14,
          paddingVertical: 16,
          alignItems: 'center',
          shadowColor: '#ff6b6b',
          shadowOpacity: 0.5,
          shadowRadius: 12,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>
          🚪 LOGOUT
        </Text>
      </TouchableOpacity>

      {/* Edit Username Modal */}
      <Modal visible={editingUsername} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: '#1a1a2e',
              borderRadius: 16,
              padding: 24,
              borderWidth: 2,
              borderColor: '#00ff00',
              width: '100%',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 16 }}>
              Edit Username
            </Text>

            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Enter new username"
              placeholderTextColor="#666"
              style={{
                backgroundColor: '#0f0f1e',
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#00ff00',
                padding: 14,
                color: '#fff',
                marginBottom: 20,
                fontWeight: '600',
              }}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setEditingUsername(false)}
                disabled={updatingUsername}
                style={{
                  flex: 1,
                  backgroundColor: '#333',
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdateUsername}
                disabled={updatingUsername}
                style={{
                  flex: 1,
                  backgroundColor: '#00ff00',
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#000', fontWeight: '900', fontSize: 14 }}>
                  {updatingUsername ? '...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
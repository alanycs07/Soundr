import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppUser } from '../../store/appStore';

type Props = {
  user: AppUser;
  onSaveUsername: (nextName: string) => Promise<{ success: boolean; message?: string }>;
  onLogout: () => void;
};

export default function SettingsScreen({
  user,
  onSaveUsername,
  onLogout,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user.username);
  const [error, setError] = useState('');

  return (
    <View style={{ paddingHorizontal: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
        <Ionicons
          name="person-circle-outline"
          size={30}
          color="#00ff00"
          style={{ marginRight: 10 }}
        />
        <Text
          style={{
            fontSize: 40,
            fontWeight: '900',
            color: '#ffffff',
          }}
        >
          Profile
        </Text>
      </View>

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
            backgroundColor: 'rgba(0,255,0,0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 18,
            borderWidth: 2,
            borderColor: '#00ff00',
          }}
        >
          <Ionicons name="person-outline" size={36} color="#00ff00" />
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: 10,
          }}
        >
          {editing ? 'Edit Username' : user.username}
        </Text>

        {!editing ? (
          <>
            <Text style={{ color: '#888888', marginBottom: 6, fontWeight: '600' }}>
              user@earhealth.com
            </Text>
            <Text style={{ color: '#888888', marginBottom: 6, fontWeight: '600' }}>
              Mode: {user.mode === 'pro' ? 'Pro' : 'Basic'}
            </Text>
            {user.redeemedCode ? (
              <Text style={{ color: '#888888', marginBottom: 18, fontWeight: '600' }}>
                Kit code redeemed: {user.redeemedCode}
              </Text>
            ) : (
              <Text style={{ color: '#888888', marginBottom: 18, fontWeight: '600' }}>
                No kit code redeemed
              </Text>
            )}

            <TouchableOpacity
              onPress={() => {
                setEditing(true);
                setError('');
              }}
              style={{
                backgroundColor: '#00ff00',
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
                marginBottom: 12,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color="#000000"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: '#000000',
                  fontWeight: '900',
                  fontSize: 14,
                }}
              >
                EDIT USERNAME
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onLogout}
              style={{
                backgroundColor: '#2f1a1a',
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ff5a5a',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={16}
                color="#ff8d8d"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: '#ff8d8d',
                  fontWeight: '900',
                  fontSize: 14,
                }}
              >
                LOG OUT
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              value={draftName}
              onChangeText={(text) => {
                setDraftName(text);
                setError('');
              }}
              placeholder="Enter your username"
              placeholderTextColor="#8aa18f"
              style={{
                backgroundColor: '#0f0f1e',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#2b4330',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '600',
                paddingHorizontal: 14,
                paddingVertical: 14,
                marginBottom: 12,
              }}
            />

            {!!error && (
              <Text
                style={{
                  color: '#ff8d8d',
                  fontSize: 13,
                  marginBottom: 14,
                  fontWeight: '600',
                }}
              >
                {error}
              </Text>
            )}

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  setEditing(false);
                  setDraftName(user.username);
                  setError('');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#333333',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginRight: 6,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={16}
                  color="#ffffff"
                  style={{ marginRight: 6 }}
                />
                <Text style={{ color: '#ffffff', fontWeight: '800' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  const trimmed = draftName.trim();

                  if (!trimmed) {
                    setError('Please enter a username.');
                    return;
                  }

                  const result = await onSaveUsername(trimmed);

                  if (!result.success) {
                    setError(result.message || 'Could not save username.');
                    return;
                  }

                  setEditing(false);
                  setError('');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#00ff00',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginLeft: 6,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name="save-outline"
                  size={16}
                  color="#000000"
                  style={{ marginRight: 6 }}
                />
                <Text style={{ color: '#000000', fontWeight: '900' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
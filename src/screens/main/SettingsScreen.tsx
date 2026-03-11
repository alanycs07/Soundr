import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppUser } from '../../store/appStore';

type Props = {
  user: AppUser;
  onSaveUsername: (nextName: string) => void;
  onLogout: () => void;
};

export default function SettingsScreen({
  user,
  onSaveUsername,
  onLogout,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user.username);

  return (
    <View style={{ paddingHorizontal: 18 }}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: '900',
          color: '#ffffff',
          marginBottom: 32,
        }}
      >
        👤 Profile
      </Text>

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

        <Text
          style={{
            fontSize: 20,
            fontWeight: '900',
            color: '#fff',
            marginBottom: 10,
          }}
        >
          {editing ? 'Edit Username' : user.username}
        </Text>

        {!editing ? (
          <>
            <Text style={{ color: '#666', marginBottom: 6, fontWeight: '600' }}>
              user@earhealth.com
            </Text>
            <Text style={{ color: '#666', marginBottom: 6, fontWeight: '600' }}>
              Mode: {user.mode === 'pro' ? 'Pro' : 'Basic'}
            </Text>
            {user.redeemedCode ? (
              <Text style={{ color: '#666', marginBottom: 18, fontWeight: '600' }}>
                Kit code redeemed: {user.redeemedCode}
              </Text>
            ) : (
              <Text style={{ color: '#666', marginBottom: 18, fontWeight: '600' }}>
                No kit code redeemed
              </Text>
            )}

            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={{
                backgroundColor: '#00ff00',
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontWeight: '900',
                  fontSize: 14,
                }}
              >
                ✏️ EDIT USERNAME
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
              }}
            >
              <Text
                style={{
                  color: '#ff8d8d',
                  fontWeight: '900',
                  fontSize: 14,
                }}
              >
                🚪 LOG OUT
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Enter your username"
              placeholderTextColor="#55705b"
              style={{
                backgroundColor: '#0f0f1e',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#2d3b30',
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
                paddingHorizontal: 14,
                paddingVertical: 14,
                marginBottom: 14,
              }}
            />

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  setEditing(false);
                  setDraftName(user.username);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#2a2f2d',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginRight: 6,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const trimmed = draftName.trim();
                  if (!trimmed) return;
                  onSaveUsername(trimmed);
                  setEditing(false);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#00ff00',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginLeft: 6,
                }}
              >
                <Text style={{ color: '#000', fontWeight: '900' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
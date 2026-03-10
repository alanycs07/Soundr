// src/screens/auth/OnboardingScreen.tsx
// First time user onboarding and login screen

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { createUserAccount, getUserByUsername, loginUser, activateProMode } from '../../store/userStorage';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: (userId: string) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [screen, setScreen] = useState<'welcome' | 'kit-pin' | 'returning' | 'set-username'>('welcome');
  const [kitPin, setKitPin] = useState('');
  const [returningUsername, setReturningUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [tempIsPro, setTempIsPro] = useState(false);

  const logoAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  // Pulsating logo animation
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [logoAnim]);

  // Fade overlay when asking for username
  const fadeOverlay = () => {
    Animated.timing(overlayOpacity, {
      toValue: 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const unfadeOverlay = () => {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // ============================================
  // KIT PIN VALIDATION
  // ============================================
  const handleKitPin = async () => {
    if (kitPin.length !== 6) {
      Alert.alert('Error', 'PIN must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      // TODO: Validate PIN against your kit database
      // For now, we'll accept any 6-digit PIN
      // In production, you'd check against a list of valid PINs

      // For demo: accept PIN "123456"
      if (kitPin !== '123456') {
        Alert.alert('Invalid PIN', 'This PIN is not valid');
        setLoading(false);
        return;
      }

      // PIN is valid - show username entry with overlay
      setTempIsPro(true);
      fadeOverlay();
      setScreen('set-username');
    } catch (error) {
      Alert.alert('Error', 'Failed to validate PIN');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RETURNING USER LOGIN
  // ============================================
  const handleReturningUser = async () => {
    if (!returningUsername.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    setLoading(true);
    try {
      const user = await getUserByUsername(returningUsername);
      
      if (!user) {
        Alert.alert('User not found', 'No account found with that username');
        setLoading(false);
        return;
      }

      // Login user
      await loginUser(user.userId);
      onComplete(user.userId);
    } catch (error) {
      Alert.alert('Error', 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SET USERNAME (After Kit PIN or First Time)
  // ============================================
  const handleSetUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setLoading(true);
    try {
      // Check if username already taken
      const existingUser = await getUserByUsername(newUsername);
      if (existingUser) {
        Alert.alert('Username taken', 'This username is already in use');
        setLoading(false);
        return;
      }

      // Create new account
      const newUser = await createUserAccount(newUsername, tempIsPro);
      
      // If kit PIN was used, activate pro
      if (tempIsPro) {
        await activateProMode(newUser.userId);
      }

      // Login and complete onboarding
      await loginUser(newUser.userId);
      onComplete(newUser.userId);
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // WELCOME SCREEN
  // ============================================
  if (screen === 'welcome') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f1e', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18 }}>
        {/* Pulsating Logo */}
        <Animated.View
          style={{
            transform: [{ scale: logoAnim }],
            marginBottom: 60,
            alignItems: 'center',
          } as any}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 56, fontWeight: '900', color: '#ffffff', letterSpacing: -1 }}>
              Sound
            </Text>
            <Text style={{ fontSize: 56, fontWeight: '900', color: '#00ff00' }}>
              r.
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#00ff00', letterSpacing: 2, fontWeight: '700' }}>
            HEARING COMPANION
          </Text>
        </Animated.View>

        {/* Welcome Text */}
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#ffffff', marginBottom: 40, textAlign: 'center' }}>
          Welcome to Soundr!
        </Text>

        {/* Do you have a kit? */}
        <TouchableOpacity
          onPress={() => setScreen('kit-pin')}
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            marginBottom: 12,
            borderWidth: 2,
            borderColor: '#00ff00',
            width: '100%',
          }}
        >
          <Text style={{ color: '#00ff00', fontWeight: '900', fontSize: 16 }}>
            🎁 Do you have a kit?
          </Text>
        </TouchableOpacity>

        {/* Returning user? */}
        <TouchableOpacity
          onPress={() => setScreen('returning')}
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#333',
            width: '100%',
          }}
        >
          <Text style={{ color: '#888', fontWeight: '900', fontSize: 16 }}>
            👤 Returning user?
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={{ width: '100%', height: 1, backgroundColor: '#333', marginVertical: 24 }} />

        {/* Skip to app */}
        <TouchableOpacity
          onPress={async () => {
            // Create account without kit or username entry
            setTempIsPro(false);
            fadeOverlay();
            setScreen('set-username');
          }}
          style={{ alignItems: 'center' }}
        >
          <Text style={{ color: '#666', fontWeight: '600', fontSize: 13 }}>
            Or skip and continue →
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ============================================
  // KIT PIN ENTRY SCREEN
  // ============================================
  if (screen === 'kit-pin') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f1e', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18 }}>
        <TouchableOpacity onPress={() => setScreen('welcome')} style={{ position: 'absolute', top: 60, left: 18 }}>
          <Text style={{ color: '#666', fontSize: 24 }}>←</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 32, fontWeight: '900', color: '#ffffff', marginBottom: 32 }}>
          Enter Kit PIN
        </Text>

        <Text style={{ color: '#888', marginBottom: 24, fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
          Enter your 6-digit PIN from your physical kit
        </Text>

        <TextInput
          placeholder="000000"
          placeholderTextColor="#666"
          value={kitPin}
          onChangeText={(text) => setKitPin(text.replace(/[^0-9]/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#00ff00',
            padding: 14,
            color: '#fff',
            marginBottom: 24,
            fontWeight: '600',
            fontSize: 24,
            textAlign: 'center',
            letterSpacing: 8,
            width: '100%',
          }}
        />

        <TouchableOpacity
          onPress={handleKitPin}
          disabled={loading || kitPin.length !== 6}
          style={{
            backgroundColor: kitPin.length === 6 ? '#00ff00' : '#333',
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            width: '100%',
            shadowColor: '#00ff00',
            shadowOpacity: kitPin.length === 6 ? 0.5 : 0,
            shadowRadius: 12,
          }}
        >
          <Text style={{ color: kitPin.length === 6 ? '#000' : '#666', fontWeight: '900', fontSize: 16 }}>
            {loading ? 'Validating...' : 'ACTIVATE PRO'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ============================================
  // RETURNING USER LOGIN SCREEN
  // ============================================
  if (screen === 'returning') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f1e', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18 }}>
        <TouchableOpacity onPress={() => setScreen('welcome')} style={{ position: 'absolute', top: 60, left: 18 }}>
          <Text style={{ color: '#666', fontSize: 24 }}>←</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 32, fontWeight: '900', color: '#ffffff', marginBottom: 32 }}>
          Welcome Back!
        </Text>

        <Text style={{ color: '#888', marginBottom: 24, fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
          Enter your username to restore your progress
        </Text>

        <TextInput
          placeholder="Enter your username"
          placeholderTextColor="#666"
          value={returningUsername}
          onChangeText={setReturningUsername}
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#00ff00',
            padding: 14,
            color: '#fff',
            marginBottom: 24,
            fontWeight: '600',
            width: '100%',
          }}
        />

        <TouchableOpacity
          onPress={handleReturningUser}
          disabled={loading}
          style={{
            backgroundColor: '#00ff00',
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            width: '100%',
            shadowColor: '#00ff00',
            shadowOpacity: 0.5,
            shadowRadius: 12,
          }}
        >
          <Text style={{ color: '#000', fontWeight: '900', fontSize: 16 }}>
            {loading ? 'Logging in...' : 'LOGIN'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ============================================
  // SET USERNAME SCREEN (Modal with overlay)
  // ============================================
  if (screen === 'set-username') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f1e' }}>
        {/* Background with fade overlay */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            opacity: overlayOpacity,
            zIndex: 1,
          }}
        />

        {/* Center modal */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 2, paddingHorizontal: 18 }}>
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
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 16, textAlign: 'center' }}>
              Create Your Username
            </Text>

            <Text style={{ color: '#888', marginBottom: 16, fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
              This will be used to restore your progress if you reinstall the app
            </Text>

            <TextInput
              placeholder="Enter username"
              placeholderTextColor="#666"
              value={newUsername}
              onChangeText={setNewUsername}
              style={{
                backgroundColor: '#0f0f1e',
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#00ff00',
                padding: 12,
                color: '#fff',
                marginBottom: 20,
                fontWeight: '600',
              }}
            />

            {tempIsPro && (
              <View style={{ backgroundColor: 'rgba(0, 255, 0, 0.2)', borderRadius: 8, padding: 12, marginBottom: 20 }}>
                <Text style={{ color: '#00ff00', fontWeight: '900', fontSize: 12, textAlign: 'center' }}>
                  ⭐ Pro Mode Activated!
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleSetUsername}
              disabled={loading}
              style={{
                backgroundColor: '#00ff00',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#000', fontWeight: '900', fontSize: 16 }}>
                {loading ? '...' : '✓ CONTINUE'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return null;
};
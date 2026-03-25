import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppUser, EDUCATIONAL_FACTS, UserMode } from '../../store/appStore';
import {
  getStoredUserByUsername,
  isUsernameTaken,
  redeemKitCode,
  confirmCodeRedemption,
} from '../../store/userStorage';

type AuthStage = 'splash' | 'choice' | 'code' | 'username' | 'login';

type Props = {
  onComplete: (user: AppUser, options?: { isLogin?: boolean }) => void;
};

export default function OnboardingScreen({ onComplete }: Props) {
  const [stage, setStage] = useState<AuthStage>('splash');
  const [pendingMode, setPendingMode] = useState<UserMode>('basic');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);

  const logoAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const randomFact = useMemo(() => {
    const index = Math.floor(Math.random() * EDUCATIONAL_FACTS.length);
    return EDUCATIONAL_FACTS[index];
  }, []);

  useEffect(() => {
    const pulse = Animated.loop(
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
    );

    pulse.start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }).start(() => setStage('choice'));
    }, 2200);

    return () => {
      clearTimeout(timer);
      pulse.stop();
    };
  }, [fadeAnim, logoAnim]);

  const continueAsBasic = () => {
    setPendingMode('basic');
    setUsername('');
    setUsernameError('');
    setStage('username');
  };

  const continueAsProPurchase = () => {
    setPendingMode('pro');
    setUsername('');
    setUsernameError('');
    setStage('username');
  };

  const submitCode = async () => {
    setCodeError('');
    const result = await redeemKitCode(code);

    if (!result.success) {
      setCodeError(result.reason || 'Could not redeem code.');
      return;
    }

    setPendingMode('pro');
    setUsername('');
    setUsernameError('');
    setStage('username');
  };

  const finishProfile = async () => {
    const finalUsername = username.trim();
    setUsernameError('');

    if (!finalUsername) {
      setUsernameError('Please enter a username.');
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,16}$/.test(finalUsername)) {
      setUsernameError(
        'Username must be 3 to 16 characters and use only letters, numbers, or underscores.'
      );
      return;
    }

    const taken = await isUsernameTaken(finalUsername);

    if (taken) {
      setUsernameError('That username is already taken. Try logging in instead.');
      return;
    }

    // LOCK THE CODE: Permanently mark it as used on this device
    if (pendingMode === 'pro' && code) {
      await confirmCodeRedemption(code);
    }

    onComplete({
      username: finalUsername,
      mode: pendingMode,
      redeemedCode: pendingMode === 'pro' && code ? code : null,
    });
  };

  const loginToExistingAccount = async () => {
    setLoginError('');
    const finalName = loginName.trim();

    if (!finalName) {
      setLoginError('Please enter a username.');
      return;
    }

    const existing = await getStoredUserByUsername(finalName);

    if (!existing) {
      setLoginError('No account found with that username.');
      return;
    }

    onComplete(existing, { isLogin: true });
  };

  if (stage === 'splash') {
    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: '#0f0f1e',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
          paddingHorizontal: 24,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: logoAnim }],
            marginBottom: 56,
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 56,
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: -1,
              }}
            >
              Sound
            </Text>
            <Text
              style={{
                fontSize: 56,
                fontWeight: '900',
                color: '#00ff00',
              }}
            >
              r.
            </Text>
          </View>

          <Text
            style={{
              fontSize: 12,
              color: '#00ff00',
              marginTop: 8,
              letterSpacing: 2,
              fontWeight: '700',
            }}
          >
            HEARING COMPANION
          </Text>
        </Animated.View>

        <View
          style={{
            maxWidth: 320,
            backgroundColor: '#1a1a2e',
            borderRadius: 16,
            padding: 20,
            borderLeftWidth: 3,
            borderLeftColor: '#00ff00',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 22,
              fontWeight: '500',
            }}
          >
            {randomFact}
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0f0f1e',
        paddingHorizontal: 22,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {stage === 'choice' && (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: 26 }}>
            <Text
              style={{
                fontSize: 58,
                fontWeight: '900',
                color: '#ffffff',
                lineHeight: 62,
              }}
            >
              Sound
              <Text style={{ color: '#00ff00' }}>r.</Text>
            </Text>

            <Text
              style={{
                color: '#8aa18f',
                fontSize: 14,
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Ear health, cleaned up.
            </Text>
          </View>

          {[
            { label: 'Create a Basic Account', onPress: continueAsBasic, filled: false },
            { label: 'Purchase a Pro Account', onPress: continueAsProPurchase, filled: true },
            { label: 'Enter a Kit Code', onPress: () => setStage('code'), filled: false },
            { label: 'Login to Existing Account', onPress: () => setStage('login'), filled: false },
          ].map((button) => (
            <TouchableOpacity
              key={button.label}
              onPress={button.onPress}
              style={{
                width: 270,
                backgroundColor: button.filled ? '#00ff00' : '#1a1a2e',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 12,
                borderWidth: 1.5,
                borderColor: button.filled ? '#00ff00' : '#2b4330',
              }}
            >
              <Text
                style={{
                  color: button.filled ? '#000000' : '#ffffff',
                  fontWeight: '800',
                  fontSize: 15,
                }}
              >
                {button.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {stage === 'code' && (
        <View style={{ width: '100%' }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: 10,
            }}
          >
            Enter your kit code
          </Text>

          <Text
            style={{
              color: '#8aa18f',
              fontSize: 15,
              lineHeight: 22,
              marginBottom: 24,
            }}
          >
            Type the unique 6 digit code that came with your sanitation kit.
          </Text>

          <TextInput
            value={code}
            onChangeText={(text) => {
              const digitsOnly = text.replace(/\D/g, '').slice(0, 6);
              setCode(digitsOnly);
              setCodeError('');
            }}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="______"
            placeholderTextColor="#8aa18f"
            style={{
              backgroundColor: '#1a1a2e',
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: '#2b4330',
              color: '#ffffff',
              fontSize: 28,
              fontWeight: '800',
              textAlign: 'center',
              letterSpacing: 8,
              paddingVertical: 18,
              marginBottom: 12,
            }}
          />

          {!!codeError && (
            <Text
              style={{
                color: '#ff8d8d',
                fontSize: 13,
                marginBottom: 16,
                fontWeight: '600',
              }}
            >
              {codeError}
            </Text>
          )}

          <TouchableOpacity
            onPress={async () => {
              if (isCheckingCode) return;
              setIsCheckingCode(true);
              await submitCode();
              setIsCheckingCode(false);
            }}
            style={{
              backgroundColor: '#00ff00',
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            {isCheckingCode ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text
                style={{
                  color: '#000000',
                  fontWeight: '900',
                  fontSize: 16,
                }}
              >
                Redeem Code
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setStage('choice')}
            style={{
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#8aa18f',
                fontWeight: '700',
              }}
            >
              ← Back
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {stage === 'login' && (
        <View style={{ width: '100%' }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: 10,
            }}
          >
            Login
          </Text>

          <Text
            style={{
              color: '#8aa18f',
              fontSize: 15,
              lineHeight: 22,
              marginBottom: 22,
            }}
          >
            Enter your existing username to continue where you left off.
          </Text>

          <TextInput
            value={loginName}
            onChangeText={(text) => {
              setLoginName(text);
              setLoginError('');
            }}
            placeholder="Enter your username"
            placeholderTextColor="#8aa18f"
            style={{
              backgroundColor: '#1a1a2e',
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: '#2b4330',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '600',
              paddingHorizontal: 16,
              paddingVertical: 18,
              marginBottom: 12,
            }}
          />

          {!!loginError && (
            <Text
              style={{
                color: '#ff8d8d',
                fontSize: 13,
                marginBottom: 16,
                fontWeight: '600',
              }}
            >
              {loginError}
            </Text>
          )}

          <TouchableOpacity
            onPress={async () => {
              if (isCheckingLogin) return;
              setIsCheckingLogin(true);
              await loginToExistingAccount();
              setIsCheckingLogin(false);
            }}
            style={{
              backgroundColor: '#00ff00',
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            {isCheckingLogin ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text
                style={{
                  color: '#000000',
                  fontWeight: '900',
                  fontSize: 16,
                }}
              >
                Login to Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setStage('choice')}
            style={{
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#8aa18f',
                fontWeight: '700',
              }}
            >
              ← Back
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {stage === 'username' && (
        <View style={{ width: '100%' }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: 10,
            }}
          >
            What should we call you?
          </Text>

          <Text
            style={{
              color: '#8aa18f',
              fontSize: 15,
              lineHeight: 22,
              marginBottom: 22,
            }}
          >
            Pick a username. You can edit it later in your profile.
          </Text>

          <TextInput
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError('');
            }}
            placeholder="Enter your username"
            placeholderTextColor="#8aa18f"
            style={{
              backgroundColor: '#1a1a2e',
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: '#2b4330',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '600',
              paddingHorizontal: 16,
              paddingVertical: 18,
              marginBottom: 12,
            }}
          />

          {!!usernameError && (
            <Text
              style={{
                color: '#ff8d8d',
                fontSize: 13,
                marginBottom: 16,
                fontWeight: '600',
              }}
            >
              {usernameError}
            </Text>
          )}

          <TouchableOpacity
            onPress={async () => {
              if (isCheckingUsername) return;
              setIsCheckingUsername(true);
              await finishProfile();
              setIsCheckingUsername(false);
            }}
            style={{
              backgroundColor: '#00ff00',
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            {isCheckingUsername ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text
                style={{
                  color: '#000000',
                  fontWeight: '900',
                  fontSize: 16,
                }}
              >
                Continue
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setUsername('');
              setUsernameError('');
              setStage('choice');
            }}
            style={{
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#8aa18f',
                fontWeight: '700',
              }}
            >
              ← Back
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
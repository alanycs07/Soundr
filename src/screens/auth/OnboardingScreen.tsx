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
  isUsernameTaken,
  loginExistingUser,
  redeemKitCode,
} from '../../store/userStorage';

type AuthStage = 'splash' | 'choice' | 'code' | 'username' | 'login';

type Props = {
  onComplete: (user: AppUser, options?: { isLogin?: boolean }) => Promise<void>;
};

export default function OnboardingScreen({ onComplete }: Props) {
  const [stage, setStage] = useState<AuthStage>('splash');
  const [pendingMode, setPendingMode] = useState<UserMode>('basic');

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  const resetCreateFields = () => {
    setCode('');
    setCodeError('');
    setUsername('');
    setUsernameError('');
  };

  const continueAsBasic = () => {
    setPendingMode('basic');
    resetCreateFields();
    setStage('username');
  };

  const continueAsProPurchase = () => {
    setPendingMode('pro');
    resetCreateFields();
    setStage('username');
  };

  const goToLogin = () => {
    setLoginUsername('');
    setLoginError('');
    setStage('login');
  };

  const submitCode = async () => {
    setCodeError('');

    const result = await redeemKitCode(code);

    if (!result.success) {
      setCodeError(result.reason || 'Could not redeem code.');
      return;
    }

    setPendingMode('pro');
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
      setUsernameError(
        'That username is already taken. Use Log in to existing account instead.'
      );
      return;
    }

    await onComplete(
      {
        username: finalUsername,
        mode: pendingMode,
        redeemedCode: pendingMode === 'pro' && code ? code : null,
      },
      { isLogin: false }
    );
  };

  const handleLogin = async () => {
    const trimmed = loginUsername.trim();
    setLoginError('');

    if (!trimmed) {
      setLoginError('Please enter your username.');
      return;
    }

    const result = await loginExistingUser(trimmed);

    if (!result.success || !result.user) {
      setLoginError(result.reason || 'Could not log in.');
      return;
    }

    await onComplete(result.user, { isLogin: true });
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

  const buttonWidth = 290;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0f0f1e',
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {stage === 'choice' && (
        <View
          style={{
            alignItems: 'center',
            width: '100%',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              marginBottom: 48,
              justifyContent: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 68,
                  fontWeight: '900',
                  color: '#ffffff',
                  letterSpacing: -1.5,
                }}
              >
                Sound
              </Text>
              <Text
                style={{
                  fontSize: 68,
                  fontWeight: '900',
                  color: '#00ff00',
                }}
              >
                r.
              </Text>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: '#00ff00',
                marginTop: 10,
                letterSpacing: 2.2,
                fontWeight: '700',
              }}
            >
              HEARING COMPANION
            </Text>
          </View>

          <TouchableOpacity
            onPress={continueAsBasic}
            style={{
              width: buttonWidth,
              backgroundColor: '#1a1a2e',
              borderRadius: 16,
              paddingVertical: 17,
              alignItems: 'center',
              marginBottom: 14,
              borderWidth: 1.5,
              borderColor: '#2b4330',
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontWeight: '800',
                fontSize: 16,
              }}
            >
              Create a Basic Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={continueAsProPurchase}
            style={{
              width: buttonWidth,
              backgroundColor: '#00ff00',
              borderRadius: 16,
              paddingVertical: 17,
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Text
              style={{
                color: '#000',
                fontWeight: '900',
                fontSize: 16,
              }}
            >
              Purchase a Pro Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setStage('code')}
            style={{
              width: buttonWidth,
              backgroundColor: '#1a1a2e',
              borderRadius: 16,
              paddingVertical: 17,
              alignItems: 'center',
              marginBottom: 14,
              borderWidth: 1.5,
              borderColor: '#00ff00',
            }}
          >
            <Text
              style={{
                color: '#00ff00',
                fontWeight: '800',
                fontSize: 16,
              }}
            >
              Enter a Kit Code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToLogin}
            style={{
              width: buttonWidth,
              backgroundColor: '#151825',
              borderRadius: 16,
              paddingVertical: 17,
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: '#2b4330',
            }}
          >
            <Text
              style={{
                color: '#8aa18f',
                fontWeight: '800',
                fontSize: 16,
              }}
            >
              Log in to Existing Account
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {stage === 'code' && (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={{ width: buttonWidth }}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: '900',
                color: '#fff',
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
              placeholderTextColor="#55705b"
              style={{
                backgroundColor: '#1a1a2e',
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: '#2b4330',
                color: '#fff',
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
                  color: '#ff7c7c',
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
                <ActivityIndicator color="#000" />
              ) : (
                <Text
                  style={{
                    color: '#000',
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
        </View>
      )}

      {stage === 'username' && (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={{ width: buttonWidth }}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: '900',
                color: '#fff',
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
              placeholderTextColor="#55705b"
              autoCapitalize="none"
              style={{
                backgroundColor: '#1a1a2e',
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: '#2b4330',
                color: '#fff',
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
                  color: '#ff7c7c',
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
                marginBottom: 12,
              }}
            >
              {isCheckingUsername ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text
                  style={{
                    color: '#000',
                    fontWeight: '900',
                    fontSize: 16,
                  }}
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setStage('choice')}
              style={{
                paddingVertical: 10,
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
        </View>
      )}

      {stage === 'login' && (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={{ width: buttonWidth }}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: '900',
                color: '#fff',
                marginBottom: 10,
              }}
            >
              Log in
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
              value={loginUsername}
              onChangeText={(text) => {
                setLoginUsername(text);
                setLoginError('');
              }}
              placeholder="Enter your username"
              placeholderTextColor="#55705b"
              autoCapitalize="none"
              style={{
                backgroundColor: '#1a1a2e',
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: '#2b4330',
                color: '#fff',
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
                  color: '#ff7c7c',
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
                if (isLoggingIn) return;
                setIsLoggingIn(true);
                await handleLogin();
                setIsLoggingIn(false);
              }}
              style={{
                backgroundColor: '#00ff00',
                borderRadius: 16,
                paddingVertical: 18,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              {isLoggingIn ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text
                  style={{
                    color: '#000',
                    fontWeight: '900',
                    fontSize: 16,
                  }}
                >
                  Log in to account
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setStage('choice')}
              style={{
                paddingVertical: 10,
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
        </View>
      )}
    </View>
  );
}
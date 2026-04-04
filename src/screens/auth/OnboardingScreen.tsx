import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Text, TextInput, View } from 'react-native';
import { AppUser, EDUCATIONAL_FACTS, UserMode } from '../../store/appStore';
import {
  isUsernameTaken,
  redeemKitCode,
  confirmCodeRedemption,
  verifyLogin,
} from '../../store/userStorage';
import HoverButton from '../../components/HoverButton';

type AuthStage = 'splash' | 'choice' | 'code' | 'username' | 'login';
type Props = { onComplete: (user: AppUser, options?: { isLogin?: boolean }) => void };

export default function OnboardingScreen({ onComplete }: Props) {
  const [stage, setStage] = useState<AuthStage>('splash');
  const [pendingMode, setPendingMode] = useState<UserMode>('basic');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const logoAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const randomFact = useMemo(() => {
    const index = Math.floor(Math.random() * EDUCATIONAL_FACTS.length);
    return EDUCATIONAL_FACTS[index];
  }, []);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(logoAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 450, useNativeDriver: true }).start(
        () => setStage('choice')
      );
    }, 2200);
    return () => { clearTimeout(timer); pulse.stop(); };
  }, [fadeAnim, logoAnim]);

  const submitCode = async () => {
    setCodeError('');
    setIsLoading(true);
    const result = await redeemKitCode(code);
    setIsLoading(false);
    if (!result.success) { setCodeError(result.reason || 'Could not redeem code.'); return; }
    setPendingMode('pro');
    setStage('username');
  };

  const finishProfile = async () => {
    const finalUsername = username.trim();
    const finalPassword = password.trim();
    setErrorMsg('');
    if (!finalUsername || finalPassword.length < 4) {
      setErrorMsg('Username is required and password must be at least 4 characters.');
      return;
    }
    setIsLoading(true);
    const taken = await isUsernameTaken(finalUsername);
    setIsLoading(false);
    if (taken) { setErrorMsg('That username is already taken. Try logging in instead.'); return; }
    if (pendingMode === 'pro' && code) await confirmCodeRedemption(code);
    onComplete({
      username: finalUsername,
      password: finalPassword,
      mode: pendingMode,
      redeemedCode: pendingMode === 'pro' && code ? code : null,
    });
  };

  const loginToExistingAccount = async () => {
    setErrorMsg('');
    const finalName = loginName.trim();
    const finalPass = loginPassword.trim();
    if (!finalName || !finalPass) { setErrorMsg('Please enter your username and password.'); return; }
    setIsLoading(true);
    const result = await verifyLogin(finalName, finalPass);
    setIsLoading(false);
    if (!result.success) { setErrorMsg(result.reason || 'Login failed.'); return; }
    onComplete(result.user!, { isLogin: true });
  };

  if (stage === 'splash') {
    return (
      <Animated.View style={{ flex: 1, backgroundColor: '#0f0f1e', justifyContent: 'center', alignItems: 'center', opacity: fadeAnim, paddingHorizontal: 24 }}>
        <Animated.View style={{ transform: [{ scale: logoAnim }], marginBottom: 56, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 56, fontWeight: '900', color: '#ffffff' }}>Sound</Text>
            <Text style={{ fontSize: 56, fontWeight: '900', color: '#00ff00' }}>r.</Text>
          </View>
          <Text style={{ fontSize: 12, color: '#00ff00', marginTop: 8, letterSpacing: 2, fontWeight: '700' }}>HEARING COMPANION</Text>
        </Animated.View>
        <View style={{ maxWidth: 320, backgroundColor: '#1a1a2e', borderRadius: 16, padding: 20, borderLeftWidth: 3, borderLeftColor: '#00ff00' }}>
          <Text style={{ fontSize: 13, color: '#ffffff', textAlign: 'center', lineHeight: 22 }}>{randomFact}</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f1e', paddingHorizontal: 22, justifyContent: 'center', alignItems: 'center' }}>
      {stage === 'choice' && (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text style={{ fontSize: 58, fontWeight: '900', color: '#ffffff', marginBottom: 26 }}>
            Sound<Text style={{ color: '#00ff00' }}>r.</Text>
          </Text>
          <HoverButton label="Create Basic Account" onPress={() => { setPendingMode('basic'); setStage('username'); }} style={{ width: 270, marginBottom: 12 }} />
          <HoverButton label="Enter a Kit Code" onPress={() => setStage('code')} style={{ width: 270, marginBottom: 12 }} />
          <HoverButton label="Login to Existing Account" onPress={() => setStage('login')} style={{ width: 270, marginBottom: 12 }} />
        </View>
      )}

      {stage === 'code' && (
        <View style={{ width: '100%' }}>
          <Text style={head}>Enter kit code</Text>
          <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="______" placeholderTextColor="#8aa18f" style={inputStyle} />
          {!!codeError && <Text style={err}>{codeError}</Text>}
          <HoverButton label={isLoading ? <ActivityIndicator color="#000" /> : 'Redeem Code'} onPress={submitCode} primary style={{ marginBottom: 12 }} />
          <Text onPress={() => setStage('choice')} style={back}>← Back</Text>
        </View>
      )}

      {(stage === 'username' || stage === 'login') && (
        <View style={{ width: '100%' }}>
          <Text style={head}>{stage === 'username' ? 'Sign Up' : 'Login'}</Text>
          <TextInput value={stage === 'username' ? username : loginName} onChangeText={stage === 'username' ? setUsername : setLoginName} placeholder="Username" placeholderTextColor="#8aa18f" style={inputStyle} />
          <TextInput value={stage === 'username' ? password : loginPassword} onChangeText={stage === 'username' ? setPassword : setLoginPassword} secureTextEntry placeholder="Password" placeholderTextColor="#8aa18f" style={inputStyle} />
          {!!errorMsg && <Text style={err}>{errorMsg}</Text>}
          <HoverButton
            label={isLoading ? <ActivityIndicator color="#000" /> : stage === 'username' ? 'Create Account' : 'Login'}
            onPress={stage === 'username' ? finishProfile : loginToExistingAccount}
            primary
            style={{ marginBottom: 12 }}
          />
          <Text onPress={() => setStage('choice')} style={back}>← Back</Text>
        </View>
      )}
    </View>
  );
}

const head = { fontSize: 36, fontWeight: '900' as const, color: '#fff', marginBottom: 20 };
const inputStyle = { backgroundColor: '#1a1a2e', borderRadius: 16, color: '#fff', fontSize: 18, padding: 18, marginBottom: 12, borderWidth: 1.5, borderColor: '#2b4330' };
const err = { color: '#ff8d8d', fontSize: 13, marginBottom: 16, fontWeight: '600' as const };
const back = { color: '#8aa18f', fontWeight: '700' as const, textAlign: 'center' as const, marginTop: 10 };

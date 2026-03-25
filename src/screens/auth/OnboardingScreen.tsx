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
  redeemKitCode,
  confirmCodeRedemption,
  verifyLogin,
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
      Animated.timing(fadeAnim, { toValue: 0, duration: 450, useNativeDriver: true }).start(() => setStage('choice'));
    }, 2200);
    return () => {
      clearTimeout(timer);
      pulse.stop();
    };
  }, [fadeAnim, logoAnim]);

  const submitCode = async () => {
    setCodeError('');
    setIsLoading(true);
    const result = await redeemKitCode(code);
    setIsLoading(false);

    if (!result.success) {
      setCodeError(result.reason || 'Could not redeem code.');
      return;
    }
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

    if (taken) {
      setErrorMsg('That username is already taken. Try logging in instead.');
      return;
    }

    if (pendingMode === 'pro' && code) {
      await confirmCodeRedemption(code);
    }

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

    if (!finalName || !finalPass) {
      setErrorMsg('Please enter your username and password.');
      return;
    }

    setIsLoading(true);
    const result = await verifyLogin(finalName, finalPass);
    setIsLoading(false);

    if (!result.success) {
      setErrorMsg(result.reason || 'Login failed.');
      return;
    }

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
          <Text style={{ fontSize: 58, fontWeight: '900', color: '#ffffff', marginBottom: 26 }}>Sound<Text style={{ color: '#00ff00' }}>r.</Text></Text>
          <TouchableOpacity onPress={() => { setPendingMode('basic'); setStage('username'); }} style={btnStyle(false)}><Text style={btnTxt(false)}>Create Basic Account</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { setPendingMode('pro'); setStage('username'); }} style={btnStyle(true)}><Text style={btnTxt(true)}>Purchase Pro Account</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setStage('code')} style={btnStyle(false)}><Text style={btnTxt(false)}>Enter a Kit Code</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setStage('login')} style={btnStyle(false)}><Text style={btnTxt(false)}>Login to Existing Account</Text></TouchableOpacity>
        </View>
      )}

      {stage === 'code' && (
        <View style={{ width: '100%' }}>
          <Text style={head}>Enter kit code</Text>
          <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="______" placeholderTextColor="#8aa18f" style={input} />
          {!!codeError && <Text style={err}>{codeError}</Text>}
          <TouchableOpacity onPress={submitCode} style={btnStyle(true)}>{isLoading ? <ActivityIndicator color="#000" /> : <Text style={btnTxt(true)}>Redeem Code</Text>}</TouchableOpacity>
          <TouchableOpacity onPress={() => setStage('choice')}><Text style={back}>← Back</Text></TouchableOpacity>
        </View>
      )}

      {(stage === 'username' || stage === 'login') && (
        <View style={{ width: '100%' }}>
          <Text style={head}>{stage === 'username' ? 'Sign Up' : 'Login'}</Text>
          <TextInput value={stage === 'username' ? username : loginName} onChangeText={stage === 'username' ? setUsername : setLoginName} placeholder="Username" placeholderTextColor="#8aa18f" style={input} />
          <TextInput value={stage === 'username' ? password : loginPassword} onChangeText={stage === 'username' ? setPassword : setLoginPassword} secureTextEntry placeholder="Password" placeholderTextColor="#8aa18f" style={input} />
          {!!errorMsg && <Text style={err}>{errorMsg}</Text>}
          <TouchableOpacity onPress={stage === 'username' ? finishProfile : loginToExistingAccount} style={btnStyle(true)}>
            {isLoading ? <ActivityIndicator color="#000" /> : <Text style={btnTxt(true)}>{stage === 'username' ? 'Create Account' : 'Login'}</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStage('choice')}><Text style={back}>← Back</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const btnStyle = (f: boolean) => ({ width: 270, backgroundColor: f ? '#00ff00' : '#1a1a2e', borderRadius: 16, paddingVertical: 16, alignItems: 'center' as const, marginBottom: 12, borderWidth: 1.5, borderColor: f ? '#00ff00' : '#2b4330' });
const btnTxt = (f: boolean) => ({ color: f ? '#000' : '#fff', fontWeight: '800' as const, fontSize: 15 });
const head = { fontSize: 36, fontWeight: '900' as const, color: '#fff', marginBottom: 20 };
const input = { backgroundColor: '#1a1a2e', borderRadius: 16, color: '#fff', fontSize: 18, padding: 18, marginBottom: 12, borderWidth: 1.5, borderColor: '#2b4330' };
const err = { color: '#ff8d8d', fontSize: 13, marginBottom: 16, fontWeight: '600' as const };
const back = { color: '#8aa18f', fontWeight: '700' as const, textAlign: 'center' as const, marginTop: 10 };
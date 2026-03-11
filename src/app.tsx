import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import OnboardingScreen from './screens/auth/OnboardingScreen';
import CleaningScreen from './screens/main/CleaningScreen';
import HearingTestScreen from './screens/main/HearingTestScreen';
import HomeScreen from './screens/main/HomeScreen';
import PlansScreen from './screens/main/PlansScreen';
import SettingsScreen from './screens/main/SettingsScreen';
import {
  AppUser,
  FREQUENCIES,
  HearingResponse,
  TABS,
  TabName,
} from './store/appStore';
import { clearUser, getUser, saveUser } from './store/userStorage';

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabName>('home');

  const [streak, setStreak] = useState(0);
  const [currentArena, setCurrentArena] = useState(1);
  const [arenaProgress, setArenaProgress] = useState(0);
  const [showArenaMap, setShowArenaMap] = useState(false);

  const [selectedFrequency, setSelectedFrequency] = useState<number>(FREQUENCIES[0].hz);
  const [currentEar, setCurrentEar] = useState<'left' | 'right'>('left');
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [hearingResponses, setHearingResponses] = useState<Record<number, HearingResponse>>({});
  const [testComplete, setTestComplete] = useState(false);
  const [hearingScore, setHearingScore] = useState(0);
  const [hearingPercentile, setHearingPercentile] = useState(0);
  const [hearingRank, setHearingRank] = useState('');

  const [cleaningStep, setCleaningStep] = useState(0);

  const summaryFade = useRef(new Animated.Value(0)).current;
  const summaryRise = useRef(new Animated.Value(18)).current;
  const cleaningFade = useRef(new Animated.Value(1)).current;
  const statBars = useRef(FREQUENCIES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const load = async () => {
      const existingUser = await getUser();
      if (existingUser) {
        setUser(existingUser);
      }
      setBootLoading(false);
    };

    load();
  }, []);

  const completedFrequencyCount = useMemo(() => {
    return Object.values(hearingResponses).filter(
      (response) => response.left || response.right
    ).length;
  }, [hearingResponses]);

  const playSound = async () => {
    setIsPlayingSound(true);
    setTimeout(() => {
      setIsPlayingSound(false);
    }, 500);
  };

  const animateResults = () => {
    summaryFade.setValue(0);
    summaryRise.setValue(18);
    statBars.forEach((bar) => bar.setValue(0));

    Animated.parallel([
      Animated.timing(summaryFade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(summaryRise, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(
      55,
      statBars.map((bar) =>
        Animated.timing(bar, {
          toValue: 1,
          duration: 420,
          useNativeDriver: false,
        })
      )
    ).start();
  };

  const completeHearingTest = (updatedResponses: Record<number, HearingResponse>) => {
    let weightedEarned = 0;
    let weightedTotal = 0;

    FREQUENCIES.forEach((freq) => {
      const response = updatedResponses[freq.hz];
      const heardCount = (response?.left ? 1 : 0) + (response?.right ? 1 : 0);
      const normalizedScore = heardCount / 2;

      weightedEarned += normalizedScore * freq.weight;
      weightedTotal += freq.weight;
    });

    const score = Math.round((weightedEarned / weightedTotal) * 100);
    const percentile = Math.round((weightedEarned / weightedTotal) * 100);

    setHearingScore(score);
    setHearingPercentile(percentile);

    if (score >= 92) setHearingRank('Exceptional Range');
    else if (score >= 82) setHearingRank('Very Strong');
    else if (score >= 70) setHearingRank('Above Average');
    else if (score >= 55) setHearingRank('Moderate Range');
    else if (score >= 40) setHearingRank('Limited High-End Range');
    else setHearingRank('Needs Improvement');

    setTestComplete(true);
    animateResults();
  };

  const handleHearingResponse = (heard: boolean) => {
    const updatedResponses: Record<number, HearingResponse> = {
      ...hearingResponses,
      [selectedFrequency]: {
        ...(hearingResponses[selectedFrequency] || { left: false, right: false }),
        [currentEar]: heard,
      },
    };

    setHearingResponses(updatedResponses);

    if (currentEar === 'left') {
      setCurrentEar('right');
      return;
    }

    const nextFreqIndex = FREQUENCIES.findIndex((f) => f.hz === selectedFrequency);

    if (nextFreqIndex < FREQUENCIES.length - 1) {
      setSelectedFrequency(FREQUENCIES[nextFreqIndex + 1].hz);
      setCurrentEar('left');
    } else {
      completeHearingTest(updatedResponses);
    }
  };

  const resetHearingTest = () => {
    setTestComplete(false);
    setHearingResponses({});
    setSelectedFrequency(FREQUENCIES[0].hz);
    setCurrentEar('left');
    setHearingScore(0);
    setHearingPercentile(0);
    setHearingRank('');
    summaryFade.setValue(0);
    summaryRise.setValue(18);
    statBars.forEach((bar) => bar.setValue(0));
  };

  const completeToday = () => {
    const nextStreak = streak + 1;
    setStreak(nextStreak);

    const nextProgress = (nextStreak % 5) * 20;
    setArenaProgress(nextProgress);

    if (nextStreak % 5 === 0 && currentArena < 10) {
      setCurrentArena(currentArena + 1);
      setArenaProgress(0);
    }
  };

  const animateToCleaningStep = (nextStep: number) => {
    Animated.timing(cleaningFade, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setCleaningStep(nextStep);
      Animated.timing(cleaningFade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  };

  const nextCleaningStep = () => {
    if (cleaningStep < 8) {
      animateToCleaningStep(cleaningStep + 1);
    }
  };

  const prevCleaningStep = () => {
    if (cleaningStep > 0) {
      animateToCleaningStep(cleaningStep - 1);
    }
  };

  const restartCleaning = () => {
    animateToCleaningStep(0);
  };

  const handleOnboardingComplete = async (newUser: AppUser) => {
    setUser(newUser);
    setCurrentTab('home');
    await saveUser(newUser);
  };

  const saveUsername = async (nextName: string) => {
    if (!user) return;
    const updated = { ...user, username: nextName };
    setUser(updated);
    await saveUser(updated);
  };

  const handleLogout = async () => {
    await clearUser();
    setUser(null);
    setCurrentTab('home');
  };

  const visibleTabs =
    user?.mode === 'pro'
      ? TABS
      : TABS.filter((tab) => tab.name !== 'cleaning');

  useEffect(() => {
    if (user?.mode !== 'pro' && currentTab === 'cleaning') {
      setCurrentTab('home');
    }
  }, [user, currentTab]);

  if (bootLoading) {
    return <View style={{ flex: 1, backgroundColor: '#0f0f1e' }} />;
  }

  if (!user) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f1e' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {currentTab === 'home' && (
          <HomeScreen
            streak={streak}
            currentArena={currentArena}
            arenaProgress={arenaProgress}
            showArenaMap={showArenaMap}
            setShowArenaMap={setShowArenaMap}
            onCompleteToday={completeToday}
          />
        )}

        {currentTab === 'hearing' && (
          <HearingTestScreen
            selectedFrequency={selectedFrequency}
            currentEar={currentEar}
            isPlayingSound={isPlayingSound}
            completedFrequencyCount={completedFrequencyCount}
            frequencies={FREQUENCIES}
            hearingResponses={hearingResponses}
            testComplete={testComplete}
            hearingScore={hearingScore}
            hearingPercentile={hearingPercentile}
            hearingRank={hearingRank}
            summaryFade={summaryFade}
            summaryRise={summaryRise}
            statBars={statBars}
            playSound={playSound}
            handleHearingResponse={handleHearingResponse}
            resetHearingTest={resetHearingTest}
          />
        )}

        {currentTab === 'cleaning' && user.mode === 'pro' && (
          <CleaningScreen
            cleaningStep={cleaningStep}
            cleaningFade={cleaningFade}
            nextCleaningStep={nextCleaningStep}
            prevCleaningStep={prevCleaningStep}
            restartCleaning={restartCleaning}
          />
        )}

        {currentTab === 'account' && (
          <SettingsScreen
            user={user}
            onSaveUsername={saveUsername}
            onLogout={handleLogout}
          />
        )}

        {currentTab === 'plans' && <PlansScreen />}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#1a1a2e',
          borderTopWidth: 2,
          borderTopColor: '#00ff00',
          paddingTop: 12,
          paddingBottom: 20,
        }}
      >
        {visibleTabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => setCurrentTab(tab.name)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
          >
            <Text style={{ fontSize: 20, marginBottom: 4 }}>{tab.icon}</Text>
            <Text
              style={{
                fontSize: 10,
                color: currentTab === tab.name ? '#00ff00' : '#666',
                fontWeight: '700',
                letterSpacing: 0.3,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
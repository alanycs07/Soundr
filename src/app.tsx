import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import OnboardingScreen from './screens/auth/OnboardingScreen';
import CleaningScreen from './screens/main/CleaningScreen';
import HearingTestScreen from './screens/main/HearingTestScreen';
import HomeScreen from './screens/main/HomeScreen';
import PlansScreen from './screens/main/PlansScreen';
import SettingsScreen from './screens/main/SettingsScreen';
import {
  AppProgress,
  AppUser,
  DEFAULT_PROGRESS,
  FREQUENCIES,
  HearingResponse,
  TABS,
  TabName,
} from './store/appStore';
import {
  clearUser,
  getProgress,
  getUser,
  isUsernameTaken,
  saveProgress,
  saveUser,
  updateStoredUsername,
} from './store/userStorage';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function deriveArenaFromStreak(streak: number) {
  const currentArena = Math.min(Math.floor(streak / 5) + 1, 10);
  const arenaProgress = (streak % 5) * 20;
  return { currentArena, arenaProgress };
}

function TabIcon({
  tabName,
  active,
}: {
  tabName: TabName;
  active: boolean;
}) {
  const color = active ? '#00ff00' : '#666';
  const size = 20;

  if (tabName === 'home') {
    return <Ionicons name="home-outline" size={size} color={color} />;
  }

  if (tabName === 'hearing') {
    return <Ionicons name="headset-outline" size={size} color={color} />;
  }

  if (tabName === 'cleaning') {
    return <MaterialCommunityIcons name="spray-bottle" size={size} color={color} />;
  }

  if (tabName === 'account') {
    return <Ionicons name="person-outline" size={size} color={color} />;
  }

  return <Ionicons name="diamond-outline" size={size} color={color} />;
}

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabName>('home');

  const [progress, setProgress] = useState<AppProgress>(DEFAULT_PROGRESS);
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
      try {
        const [existingUser, storedProgress] = await Promise.all([getUser(), getProgress()]);

        let nextProgress = storedProgress;
        const yesterday = getYesterdayKey();

        if (
          nextProgress.lastCompletedDate &&
          nextProgress.lastCompletedDate !== getTodayKey() &&
          nextProgress.lastCompletedDate !== yesterday &&
          nextProgress.streak > 0
        ) {
          nextProgress = {
            ...nextProgress,
            streak: 0,
          };
          await saveProgress(nextProgress);
        }

        if (existingUser) {
          setUser(existingUser);
        }

        setProgress(nextProgress);
      } finally {
        setBootLoading(false);
      }
    };

    void load();
  }, []);

  const { currentArena, arenaProgress } = useMemo(() => {
    return deriveArenaFromStreak(progress.streak);
  }, [progress.streak]);

  const todayKey = getTodayKey();
  const todayStatus = progress.dailyStatus[todayKey] || {
    hearingDone: false,
    cleaningDone: false,
    streakAwarded: false,
  };

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

  const awardDailyStreakIfEligible = async (incomingProgress: AppProgress) => {
    const today = getTodayKey();
    const yesterday = getYesterdayKey();

    const todayEntry = incomingProgress.dailyStatus[today] || {
      hearingDone: false,
      cleaningDone: false,
      streakAwarded: false,
    };

    let nextProgress = { ...incomingProgress };

    if (todayEntry.hearingDone && todayEntry.cleaningDone && !todayEntry.streakAwarded) {
      let nextStreak = 1;

      if (nextProgress.lastCompletedDate === yesterday) {
        nextStreak = nextProgress.streak + 1;
      } else if (nextProgress.lastCompletedDate === today) {
        nextStreak = nextProgress.streak;
      }

      nextProgress = {
        ...nextProgress,
        streak: nextStreak,
        lastCompletedDate: today,
        dailyStatus: {
          ...nextProgress.dailyStatus,
          [today]: {
            ...todayEntry,
            streakAwarded: true,
          },
        },
      };
    }

    setProgress(nextProgress);
    await saveProgress(nextProgress);
  };

  const markHearingCompleteForToday = async () => {
    const today = getTodayKey();
    const current = await getProgress();

    const todayEntry = current.dailyStatus[today] || {
      hearingDone: false,
      cleaningDone: false,
      streakAwarded: false,
    };

    const nextProgress: AppProgress = {
      ...current,
      totalHearingTests: todayEntry.hearingDone
        ? current.totalHearingTests
        : current.totalHearingTests + 1,
      dailyStatus: {
        ...current.dailyStatus,
        [today]: {
          ...todayEntry,
          hearingDone: true,
        },
      },
    };

    await awardDailyStreakIfEligible(nextProgress);
  };

  const markCleaningCompleteForToday = async () => {
    const today = getTodayKey();
    const current = await getProgress();

    const todayEntry = current.dailyStatus[today] || {
      hearingDone: false,
      cleaningDone: false,
      streakAwarded: false,
    };

    const nextProgress: AppProgress = {
      ...current,
      totalCleanings: todayEntry.cleaningDone
        ? current.totalCleanings
        : current.totalCleanings + 1,
      dailyStatus: {
        ...current.dailyStatus,
        [today]: {
          ...todayEntry,
          cleaningDone: true,
        },
      },
    };

    await awardDailyStreakIfEligible(nextProgress);
  };

  const completeHearingTest = async (
    updatedResponses: Record<number, HearingResponse>
  ) => {
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
    await markHearingCompleteForToday();
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
      void completeHearingTest(updatedResponses);
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

  const handleFinishCleaning = async () => {
    await markCleaningCompleteForToday();
    setCurrentTab('home');
  };

  const handleOnboardingComplete = async (newUser: AppUser) => {
    setUser(newUser);
    setCurrentTab('home');
    await saveUser(newUser);
  };

  const saveUsername = async (
    nextName: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      return { success: false, message: 'No user found.' };
    }

    const trimmed = nextName.trim();

    if (!trimmed) {
      return { success: false, message: 'Please enter a username.' };
    }

    if (!/^[a-zA-Z0-9_]{3,16}$/.test(trimmed)) {
      return {
        success: false,
        message:
          'Username must be 3 to 16 characters and use only letters, numbers, or underscores.',
      };
    }

    if (trimmed.toLowerCase() !== user.username.toLowerCase()) {
      const taken = await isUsernameTaken(trimmed);

      if (taken) {
        return { success: false, message: 'That username is already taken.' };
      }

      await updateStoredUsername(user.username, trimmed);
    }

    const updated = { ...user, username: trimmed };
    setUser(updated);
    await saveUser(updated);

    return { success: true };
  };

  const handleLogout = async () => {
    await clearUser();
    setUser(null);
    setCurrentTab('home');
  };

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
            streak={progress.streak}
            currentArena={currentArena}
            arenaProgress={arenaProgress}
            showArenaMap={showArenaMap}
            setShowArenaMap={setShowArenaMap}
            todayHearingDone={todayStatus.hearingDone}
            todayCleaningDone={todayStatus.cleaningDone}
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

        {currentTab === 'cleaning' && (
          <CleaningScreen
            cleaningStep={cleaningStep}
            cleaningFade={cleaningFade}
            nextCleaningStep={nextCleaningStep}
            prevCleaningStep={prevCleaningStep}
            restartCleaning={restartCleaning}
            onFinishCleaning={handleFinishCleaning}
            isPro={user.mode === 'pro'}
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
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => setCurrentTab(tab.name)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
          >
            <TabIcon tabName={tab.name} active={currentTab === tab.name} />
            <Text
              style={{
                fontSize: 10,
                color: currentTab === tab.name ? '#00ff00' : '#666',
                fontWeight: '700',
                letterSpacing: 0.3,
                marginTop: 4,
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
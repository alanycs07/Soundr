import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type TabName = 'home' | 'hearing' | 'cleaning' | 'account' | 'plans';
type EarSide = 'left' | 'right';

type HearingResponse = {
  left: boolean;
  right: boolean;
};

type Arena = {
  id: number;
  name: string;
  days: number;
  reward: string;
};

type Frequency = {
  hz: number;
  label: string;
  weight: number;
};

type CleaningCard = {
  title: string;
  body: string;
  cta?: string;
};

const ARENAS: Arena[] = [
  { id: 1, name: 'Arena 1', days: 30, reward: '🎖️' },
  { id: 2, name: 'Arena 2', days: 35, reward: '🏅' },
  { id: 3, name: 'Arena 3', days: 40, reward: '💎' },
  { id: 4, name: 'Arena 4', days: 45, reward: '👑' },
  { id: 5, name: 'Arena 5', days: 50, reward: '⭐' },
  { id: 6, name: 'Arena 6', days: 55, reward: '🔥' },
  { id: 7, name: 'Arena 7', days: 60, reward: '🌟' },
  { id: 8, name: 'Arena 8', days: 65, reward: '🏆' },
  { id: 9, name: 'Arena 9', days: 70, reward: '🎯' },
  { id: 10, name: 'Arena 10', days: 75, reward: '👑' },
];

const FREQUENCIES: Frequency[] = [
  { hz: 125, label: 'Sub Bass', weight: 1.0 },
  { hz: 250, label: 'Bass', weight: 1.0 },
  { hz: 500, label: 'Low Mid', weight: 1.0 },
  { hz: 1000, label: 'Mid', weight: 1.0 },
  { hz: 2000, label: 'Upper Mid', weight: 1.1 },
  { hz: 4000, label: 'Presence', weight: 1.2 },
  { hz: 8000, label: 'Treble', weight: 1.4 },
  { hz: 12000, label: 'Air', weight: 1.8 },
  { hz: 14000, label: 'High Air', weight: 2.0 },
  { hz: 16000, label: 'Extreme', weight: 2.4 },
  { hz: 17000, label: 'Very Extreme', weight: 2.7 },
  { hz: 18000, label: 'Elite High', weight: 3.0 },
];

const EDUCATIONAL_FACTS = [
  '🧼 Earwax is protective and helps defend the ear canal.',
  '👂 Human hearing is often strongest in the mid-range, not at the extremes.',
  '🔊 Long exposure to loud audio can reduce hearing sensitivity over time.',
  '🎧 Earbuds at high volume for long periods can make high-frequency loss worse.',
  '💧 Clean ears gently and avoid forcing objects deep into the ear canal.',
];

const TABS: { name: TabName; label: string; icon: string }[] = [
  { name: 'home', label: 'HOME', icon: '🏠' },
  { name: 'hearing', label: 'TEST', icon: '🎧' },
  { name: 'cleaning', label: 'CLEAN', icon: '🧼' },
  { name: 'account', label: 'PROFILE', icon: '👤' },
  { name: 'plans', label: 'PLANS', icon: '💎' },
];

const CLEANING_CARDS: CleaningCard[] = [
  {
    title: 'Ready to clean?',
    body:
      'Use your sanitation kit and follow each step in order. Swipe through the cards or tap begin to start the cleaning flow.',
    cta: 'Start Cleaning',
  },
  {
    title: 'Open your sanitation kit',
    body:
      'You should have a cleaning tool, microfiber cloth, bamboo brush, and isopropyl alcohol cleaning fluid.',
  },
  {
    title: 'Brush the mesh',
    body:
      'Spray the bamboo brush with the alcohol and hold the AirPod with the mesh facing up. Brush in circles for about 15 seconds.',
  },
  {
    title: 'Blot the mesh',
    body:
      'Flip the AirPod and blot the mesh on our cloth, ensuring contact. Repeat this process three times total for each mesh.',
  },
  {
    title: 'Clean the charging port',
    body: 'Use our tool to scrape out any grime from the charging port.',
  },
  {
    title: 'Remove residue',
    body:
      'Rinse the brush with distilled water, then repeat the brushing and blotting steps with distilled water to remove residue.',
  },
  {
    title: 'Clean the charging case',
    body: 'Clean the insides of the charging case with the bamboo brush.',
  },
  {
    title: 'Final wipe',
    body: 'Wipe everything with the cleaning cloth.',
  },
  {
    title: 'Congratulations, you are done!',
    body:
      'Let the AirPods dry completely before use. Once everything is fully dry, place them back in the case.',
    cta: 'Restart Guide',
  },
];

function StatBar({
  label,
  percentage,
  animatedValue,
}: {
  label: string;
  percentage: number;
  animatedValue: Animated.Value;
}) {
  const barHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(6, percentage * 1.6)],
  });

  const barColor =
    percentage >= 100 ? '#00ff00' : percentage >= 50 ? '#ccff33' : '#3a4a3f';

  return (
    <View style={{ alignItems: 'center', width: 26 }}>
      <View
        style={{
          height: 170,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={{
            width: 18,
            height: barHeight,
            borderRadius: 6,
            backgroundColor: barColor,
            borderWidth: 1,
            borderColor: percentage >= 50 ? '#00ff00' : '#4f6b56',
          }}
        />
      </View>

      <Text
        style={{
          color: '#8aa18f',
          fontSize: 9,
          fontWeight: '700',
          marginTop: 8,
          transform: [{ rotate: '-45deg' }],
          width: 42,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabName>('home');
  const [showSplash, setShowSplash] = useState(true);

  const [streak, setStreak] = useState(0);
  const [currentArena, setCurrentArena] = useState(1);
  const [arenaProgress, setArenaProgress] = useState(0);
  const [showArenaMap, setShowArenaMap] = useState(false);

  const [selectedFrequency, setSelectedFrequency] = useState<number>(FREQUENCIES[0].hz);
  const [currentEar, setCurrentEar] = useState<EarSide>('left');
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [hearingResponses, setHearingResponses] = useState<Record<number, HearingResponse>>({});
  const [testComplete, setTestComplete] = useState(false);
  const [hearingScore, setHearingScore] = useState(0);
  const [hearingPercentile, setHearingPercentile] = useState(0);
  const [hearingRank, setHearingRank] = useState('');
  const [isPro] = useState(false);

  const [cleaningStep, setCleaningStep] = useState(0);

  const logoAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const summaryFade = useRef(new Animated.Value(0)).current;
  const summaryRise = useRef(new Animated.Value(18)).current;
  const cleaningFade = useRef(new Animated.Value(1)).current;
  const statBars = useRef(FREQUENCIES.map(() => new Animated.Value(0))).current;

  const randomFact = useMemo(() => {
    const index = Math.floor(Math.random() * EDUCATIONAL_FACTS.length);
    return EDUCATIONAL_FACTS[index];
  }, []);

  const completedFrequencyCount = useMemo(() => {
    return Object.values(hearingResponses).filter(
      (response) => response.left || response.right
    ).length;
  }, [hearingResponses]);

  const frequencyResults = useMemo(() => {
    return FREQUENCIES.map((freq) => {
      const response = hearingResponses[freq.hz];
      const heardCount = (response?.left ? 1 : 0) + (response?.right ? 1 : 0);
      const percentage = (heardCount / 2) * 100;

      return {
        ...freq,
        heardCount,
        percentage,
      };
    });
  }, [hearingResponses]);

  const currentCleaningCard = CLEANING_CARDS[cleaningStep];
  const cleaningProgress = ((cleaningStep + 1) / CLEANING_CARDS.length) * 100;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
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

    pulseAnimation.start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }, 2400);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, [fadeAnim, logoAnim]);

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

    if (nextStreak % 5 === 0 && currentArena < ARENAS.length) {
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
    if (cleaningStep < CLEANING_CARDS.length - 1) {
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

  if (showSplash) {
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
    <View style={{ flex: 1, backgroundColor: '#0f0f1e' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {currentTab === 'home' && (
          <View style={{ paddingHorizontal: 18 }}>
            <View style={{ marginBottom: 40 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#00ff00',
                  fontWeight: '700',
                  letterSpacing: 1.5,
                  marginBottom: 8,
                }}
              >
                WELCOME BACK
              </Text>
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: '900',
                  color: '#ffffff',
                  lineHeight: 48,
                }}
              >
                Keep{'\n'}Your Streak
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowArenaMap(!showArenaMap)}
              style={{
                backgroundColor: '#1a1a2e',
                borderRadius: 24,
                padding: 36,
                alignItems: 'center',
                marginBottom: 36,
                borderWidth: 2,
                borderColor: '#00ff00',
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                  borderWidth: 2,
                  borderColor: '#00ff00',
                }}
              >
                <Text style={{ fontSize: 56 }}>🔥</Text>
              </View>

              <Text
                style={{
                  fontSize: 72,
                  fontWeight: '900',
                  color: '#00ff00',
                  letterSpacing: -2,
                }}
              >
                {streak}
              </Text>
              <Text
                style={{
                  color: '#888',
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: '600',
                  letterSpacing: 0.5,
                }}
              >
                {streak === 1 ? 'DAY' : 'DAYS'} IN A ROW
              </Text>
              <Text
                style={{
                  color: '#00ff00',
                  marginTop: 16,
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 1,
                }}
              >
                TAP FOR ARENAS
              </Text>
            </TouchableOpacity>

            {showArenaMap && (
              <View
                style={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: 20,
                  padding: 24,
                  marginBottom: 36,
                  borderWidth: 2,
                  borderColor: '#00ff00',
                }}
              >
                <Text
                  style={{
                    fontWeight: '900',
                    color: '#00ff00',
                    marginBottom: 20,
                    fontSize: 16,
                    letterSpacing: 1,
                  }}
                >
                  🗺️ ARENA MAP
                </Text>

                <View
                  style={{
                    backgroundColor: 'rgba(0, 255, 0, 0.05)',
                    borderRadius: 16,
                    padding: 18,
                    marginBottom: 20,
                    borderLeftWidth: 4,
                    borderLeftColor: '#00ff00',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '800',
                      color: '#00ff00',
                      fontSize: 18,
                      marginBottom: 16,
                    }}
                  >
                    {ARENAS[currentArena - 1].name}
                  </Text>

                  <View style={{ marginBottom: 12 }}>
                    <View
                      style={{
                        height: 12,
                        backgroundColor: '#333',
                        borderRadius: 6,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: '#00ff00',
                      }}
                    >
                      <View
                        style={{
                          width: `${arenaProgress}%`,
                          height: '100%',
                          backgroundColor: '#00ff00',
                        }}
                      />
                    </View>

                    <Text
                      style={{
                        color: '#666',
                        marginTop: 10,
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                    >
                      {arenaProgress}% • Reward: {ARENAS[currentArena - 1].reward}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    marginBottom: 24,
                  }}
                >
                  {ARENAS.map((arena) => (
                    <View
                      key={arena.id}
                      style={{
                        width: '22%',
                        aspectRatio: 1,
                        marginBottom: 10,
                        backgroundColor:
                          currentArena === arena.id
                            ? '#00ff00'
                            : arena.id < currentArena
                            ? 'rgba(0, 255, 0, 0.2)'
                            : '#333',
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: currentArena === arena.id ? '#00ff00' : 'transparent',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: '900',
                          color:
                            currentArena === arena.id
                              ? '#000'
                              : arena.id < currentArena
                              ? '#00ff00'
                              : '#666',
                          fontSize: 16,
                        }}
                      >
                        {arena.id < currentArena ? '✓' : arena.id}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={completeToday}
                  style={{
                    backgroundColor: '#00ff00',
                    borderRadius: 14,
                    paddingVertical: 16,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#000',
                      fontWeight: '900',
                      fontSize: 16,
                      letterSpacing: 0.5,
                    }}
                  >
                    ✓ COMPLETE TODAY
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ marginBottom: 36 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '900',
                  color: '#00ff00',
                  marginBottom: 16,
                  letterSpacing: 1,
                }}
              >
                🏆 ACHIEVEMENTS
              </Text>

              <View
                style={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: 20,
                  padding: 32,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#333',
                  borderStyle: 'dashed',
                }}
              >
                <Text style={{ color: '#666', fontSize: 14, fontWeight: '600' }}>
                  Coming Soon 🚀
                </Text>
              </View>
            </View>
          </View>
        )}

        {currentTab === 'hearing' && (
          <View style={{ paddingHorizontal: 18 }}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: '900',
                color: '#ffffff',
                marginBottom: 10,
              }}
            >
              🎧 Test
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: '#666',
                marginBottom: 32,
                fontWeight: '600',
              }}
            >
              Check your hearing range across much tougher high-end frequencies
            </Text>

            {!testComplete ? (
              <>
                <View
                  style={{
                    backgroundColor: '#1a1a2e',
                    borderRadius: 24,
                    padding: 32,
                    marginBottom: 24,
                    borderWidth: 2,
                    borderColor: '#00ff00',
                  }}
                >
                  <Text
                    style={{
                      color: '#666',
                      marginBottom: 16,
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      fontWeight: '700',
                    }}
                  >
                    {currentEar === 'left' ? '👈 LEFT EAR' : '👉 RIGHT EAR'}
                  </Text>

                  <Text
                    style={{
                      fontSize: 68,
                      fontWeight: '900',
                      color: '#00ff00',
                      marginBottom: 4,
                      letterSpacing: -2,
                    }}
                  >
                    {selectedFrequency}
                  </Text>

                  <Text
                    style={{
                      color: '#666',
                      marginBottom: 12,
                      fontSize: 13,
                      letterSpacing: 1,
                      fontWeight: '600',
                    }}
                  >
                    Hz • {FREQUENCIES.find((f) => f.hz === selectedFrequency)?.label}
                  </Text>

                  <Text
                    style={{
                      color: '#7e8f81',
                      marginBottom: 30,
                      fontSize: 12,
                      lineHeight: 18,
                    }}
                  >
                    Higher frequencies are weighted more heavily, so late-stage tones matter more.
                  </Text>

                  <TouchableOpacity
                    onPress={playSound}
                    style={{
                      backgroundColor: '#00ff00',
                      borderRadius: 16,
                      paddingVertical: 18,
                      marginBottom: 24,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#000',
                        fontWeight: '900',
                        fontSize: 16,
                        letterSpacing: 0.5,
                      }}
                    >
                      {isPlayingSound ? '🔊 PLAYING' : '▶️ PLAY TONE'}
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => handleHearingResponse(false)}
                      style={{
                        flex: 1,
                        backgroundColor: '#333',
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#555',
                        marginRight: 6,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
                        ✗ NO
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleHearingResponse(true)}
                      style={{
                        flex: 1,
                        backgroundColor: '#00ff00',
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#00ff00',
                        marginLeft: 6,
                      }}
                    >
                      <Text style={{ color: '#000', fontWeight: '900', fontSize: 15 }}>
                        ✓ YES
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: '#1a1a2e',
                    borderRadius: 14,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#333',
                  }}
                >
                  <Text
                    style={{
                      color: '#666',
                      marginBottom: 12,
                      fontSize: 12,
                      fontWeight: '700',
                      letterSpacing: 0.5,
                    }}
                  >
                    PROGRESS: {completedFrequencyCount} / {FREQUENCIES.length}
                  </Text>

                  <View
                    style={{
                      height: 10,
                      backgroundColor: '#333',
                      borderRadius: 5,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        width: `${(completedFrequencyCount / FREQUENCIES.length) * 100}%`,
                        height: '100%',
                        backgroundColor: '#00ff00',
                      }}
                    />
                  </View>
                </View>
              </>
            ) : (
              <Animated.View
                style={{
                  opacity: summaryFade,
                  transform: [{ translateY: summaryRise }],
                }}
              >
                <View
                  style={{
                    backgroundColor: '#161d18',
                    borderRadius: 18,
                    paddingVertical: 28,
                    paddingHorizontal: 18,
                    marginBottom: 20,
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: '#2b4330',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#e5f7e7',
                      fontWeight: '500',
                      marginBottom: 6,
                    }}
                  >
                    Hearing Score
                  </Text>

                  <Text
                    style={{
                      fontSize: 84,
                      color: '#00ff00',
                      fontWeight: '900',
                      lineHeight: 90,
                    }}
                  >
                    {hearingScore}
                  </Text>

                  <Text
                    style={{
                      fontSize: 18,
                      color: '#c8d8cb',
                      fontWeight: '700',
                      marginTop: -2,
                    }}
                  >
                    / 100
                  </Text>

                  <Text
                    style={{
                      fontSize: 28,
                      color: '#ffffff',
                      fontWeight: '800',
                      marginTop: 14,
                    }}
                  >
                    {hearingPercentile}% session percentile
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: '#8aa18f',
                      fontWeight: '600',
                      marginTop: 10,
                    }}
                  >
                    {hearingRank}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: '#68806e',
                      fontWeight: '600',
                      marginTop: 12,
                    }}
                  >
                    {completedFrequencyCount} of {FREQUENCIES.length} tested tones detected
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#161d18',
                    borderRadius: 18,
                    padding: 18,
                    marginBottom: 24,
                    borderWidth: 1.5,
                    borderColor: '#2b4330',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: '#e8f5ea',
                      fontWeight: '800',
                      marginBottom: 16,
                    }}
                  >
                    Hearing Statistics
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      paddingTop: 8,
                      paddingHorizontal: 2,
                    }}
                  >
                    {frequencyResults.map((result, index) => (
                      <StatBar
                        key={result.hz}
                        label={`${
                          Math.round(result.hz / 1000) >= 1
                            ? `${result.hz / 1000}k`
                            : result.hz
                        }`}
                        percentage={result.percentage}
                        animatedValue={statBars[index]}
                      />
                    ))}
                  </View>

                  <View
                    style={{
                      marginTop: 18,
                      paddingTop: 14,
                      borderTopWidth: 1,
                      borderTopColor: '#26362a',
                    }}
                  >
                    <Text
                      style={{
                        color: '#8aa18f',
                        fontSize: 12,
                        lineHeight: 18,
                      }}
                    >
                      Each bar uses actual left/right responses from this test. Full-height bars mean both ears detected that tone.
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: '#161d18',
                    borderRadius: 18,
                    padding: 18,
                    marginBottom: 24,
                    borderWidth: 1.5,
                    borderColor: '#2b4330',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '900',
                      color: '#00ff00',
                      marginBottom: 18,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    Frequency Breakdown
                  </Text>

                  {frequencyResults.map((freq) => (
                    <View key={freq.hz} style={{ marginBottom: 18 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                          {freq.hz} Hz
                        </Text>
                        <Text
                          style={{
                            color:
                              freq.percentage === 100
                                ? '#00ff00'
                                : freq.percentage === 50
                                ? '#ccff33'
                                : '#5f7564',
                            fontWeight: '900',
                            fontSize: 14,
                          }}
                        >
                          {freq.percentage.toFixed(0)}%
                        </Text>
                      </View>

                      <View
                        style={{
                          height: 8,
                          backgroundColor: '#243127',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <View
                          style={{
                            width: `${freq.percentage}%`,
                            height: '100%',
                            backgroundColor:
                              freq.percentage === 100
                                ? '#00ff00'
                                : freq.percentage === 50
                                ? '#ccff33'
                                : '#46594a',
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={resetHearingTest}
                  style={{
                    backgroundColor: '#00ff00',
                    borderRadius: 14,
                    paddingVertical: 18,
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      color: '#000',
                      fontWeight: '900',
                      fontSize: 16,
                      letterSpacing: 0.5,
                    }}
                  >
                    🔄 RETAKE TEST
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        )}

        {currentTab === 'cleaning' && (
          <View style={{ paddingHorizontal: 18 }}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: '900',
                color: '#ffffff',
                marginBottom: 10,
              }}
            >
              🧼 Cleaning
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: '#666',
                marginBottom: 22,
                fontWeight: '600',
                lineHeight: 20,
              }}
            >
              Pro feature preview. Later this will unlock for paid Pro users or for kit owners who redeem their unique 6-digit code.
            </Text>

            <View
              style={{
                backgroundColor: '#1a1a2e',
                borderRadius: 14,
                padding: 16,
                marginBottom: 18,
                borderWidth: 1,
                borderColor: '#2b4330',
              }}
            >
              <Text
                style={{
                  color: '#8aa18f',
                  marginBottom: 10,
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                }}
              >
                STEP {cleaningStep + 1} / {CLEANING_CARDS.length}
              </Text>

              <View
                style={{
                  height: 10,
                  backgroundColor: '#333',
                  borderRadius: 5,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${cleaningProgress}%`,
                    height: '100%',
                    backgroundColor: '#00ff00',
                  }}
                />
              </View>
            </View>

            <Animated.View
              style={{
                opacity: cleaningFade,
                backgroundColor: '#161d18',
                borderRadius: 22,
                padding: 22,
                borderWidth: 1.5,
                borderColor: '#2b4330',
                marginBottom: 18,
              }}
            >
              <Text
                style={{
                  color: '#00ff00',
                  fontSize: 12,
                  fontWeight: '800',
                  letterSpacing: 1.2,
                  marginBottom: 12,
                }}
              >
                CLEANING GUIDE
              </Text>

              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 28,
                  fontWeight: '900',
                  lineHeight: 34,
                  marginBottom: 14,
                }}
              >
                {currentCleaningCard.title}
              </Text>

              <Text
                style={{
                  color: '#cfd8d1',
                  fontSize: 15,
                  lineHeight: 24,
                  marginBottom: 20,
                }}
              >
                {currentCleaningCard.body}
              </Text>

              <View
                style={{
                  height: 220,
                  borderRadius: 18,
                  borderWidth: 2,
                  borderColor: '#35503b',
                  borderStyle: 'dashed',
                  backgroundColor: '#0f0f1e',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 46,
                    marginBottom: 10,
                  }}
                >
                  🎥
                </Text>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '800',
                    marginBottom: 6,
                    textAlign: 'center',
                  }}
                >
                  Video placeholder
                </Text>
                <Text
                  style={{
                    color: '#718378',
                    fontSize: 12,
                    textAlign: 'center',
                    lineHeight: 18,
                  }}
                >
                  Drop your cleaning-step demo here later
                </Text>
              </View>

              {cleaningStep === 0 ? (
                <TouchableOpacity
                  onPress={nextCleaningStep}
                  style={{
                    backgroundColor: '#00ff00',
                    borderRadius: 14,
                    paddingVertical: 16,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#000',
                      fontWeight: '900',
                      fontSize: 16,
                      letterSpacing: 0.5,
                    }}
                  >
                    {currentCleaningCard.cta || 'Begin'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={prevCleaningStep}
                    style={{
                      flex: 1,
                      backgroundColor: '#2a2f2d',
                      borderRadius: 14,
                      paddingVertical: 16,
                      alignItems: 'center',
                      marginRight: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: '800',
                        fontSize: 15,
                      }}
                    >
                      ← Back
                    </Text>
                  </TouchableOpacity>

                  {cleaningStep < CLEANING_CARDS.length - 1 ? (
                    <TouchableOpacity
                      onPress={nextCleaningStep}
                      style={{
                        flex: 1,
                        backgroundColor: '#00ff00',
                        borderRadius: 14,
                        paddingVertical: 16,
                        alignItems: 'center',
                        marginLeft: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: '#000',
                          fontWeight: '900',
                          fontSize: 15,
                        }}
                      >
                        Next →
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={restartCleaning}
                      style={{
                        flex: 1,
                        backgroundColor: '#00ff00',
                        borderRadius: 14,
                        paddingVertical: 16,
                        alignItems: 'center',
                        marginLeft: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: '#000',
                          fontWeight: '900',
                          fontSize: 15,
                        }}
                      >
                        {currentCleaningCard.cta || 'Restart'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </Animated.View>

            <Text
              style={{
                color: '#607162',
                fontSize: 12,
                lineHeight: 18,
                marginBottom: 10,
              }}
            >
              Swipe-style flow is mocked here as step cards with fade transitions. You can later replace the placeholder block with real embedded videos.
            </Text>
          </View>
        )}

        {currentTab === 'account' && (
          <View style={{ paddingHorizontal: 18 }}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: '900',
                color: '#ffffff',
                marginBottom: 32,
              }}
            >
              👤 Account
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
                User Profile
              </Text>

              <Text style={{ color: '#666', marginBottom: 6, fontWeight: '600' }}>
                user@earhealth.com
              </Text>
              <Text style={{ color: '#666', marginBottom: 18, fontWeight: '600' }}>
                Member since Jan 1, 2026
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: '#00ff00',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#000',
                    fontWeight: '900',
                    fontSize: 14,
                  }}
                >
                  ✏️ EDIT PROFILE
                </Text>
              </TouchableOpacity>
            </View>

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
                <Text
                  style={{
                    color: '#fff',
                    marginBottom: 4,
                    fontWeight: '700',
                    fontSize: 15,
                  }}
                >
                  Current Streak
                </Text>
                <Text
                  style={{
                    color: '#00ff00',
                    fontSize: 28,
                    fontWeight: '900',
                  }}
                >
                  {streak}
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
                <Text
                  style={{
                    color: '#fff',
                    marginBottom: 4,
                    fontWeight: '700',
                    fontSize: 15,
                  }}
                >
                  Total Cleanings
                </Text>
                <Text
                  style={{
                    color: '#00ffff',
                    fontSize: 28,
                    fontWeight: '900',
                  }}
                >
                  {streak * 2}
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
                <Text
                  style={{
                    color: '#fff',
                    marginBottom: 4,
                    fontWeight: '700',
                    fontSize: 15,
                  }}
                >
                  Hearing Tests
                </Text>
                <Text
                  style={{
                    color: '#ffff00',
                    fontSize: 28,
                    fontWeight: '900',
                  }}
                >
                  {testComplete ? 1 : 0}
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '900',
                  color: '#00ff00',
                  marginBottom: 16,
                  letterSpacing: 1,
                }}
              >
                ⚙️ SETTINGS
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeftWidth: 3,
                  borderLeftColor: '#00ff00',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>
                  🔔 Notifications
                </Text>
                <Text style={{ color: '#666', fontWeight: '600' }}>Enabled</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: 14,
                  padding: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeftWidth: 3,
                  borderLeftColor: '#00ff00',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>
                  🚪 Logout
                </Text>
                <Text style={{ color: '#00ff00', fontWeight: '900' }}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentTab === 'plans' && (
          <View style={{ paddingHorizontal: 18 }}>
            <View style={{ alignItems: 'center', marginBottom: 34 }}>
              <Text
                style={{
                  fontSize: 42,
                  fontWeight: '900',
                  color: '#ffffff',
                  textAlign: 'center',
                  marginBottom: 10,
                  lineHeight: 48,
                }}
              >
                Start Soundr for free.
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  color: '#8aa18f',
                  textAlign: 'center',
                  lineHeight: 23,
                  maxWidth: 320,
                  fontWeight: '500',
                }}
              >
                Build your streak, test your hearing, and unlock deeper insights when
                you upgrade.
              </Text>

              <View
                style={{
                  marginTop: 20,
                  backgroundColor: '#1a1a2e',
                  borderRadius: 999,
                  padding: 4,
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#2b4330',
                }}
              >
                <View
                  style={{
                    backgroundColor: '#00ff00',
                    borderRadius: 999,
                    paddingVertical: 8,
                    paddingHorizontal: 18,
                  }}
                >
                  <Text
                    style={{
                      color: '#000',
                      fontWeight: '800',
                      fontSize: 13,
                    }}
                  >
                    Monthly
                  </Text>
                </View>

                <View
                  style={{
                    borderRadius: 999,
                    paddingVertical: 8,
                    paddingHorizontal: 18,
                  }}
                >
                  <Text
                    style={{
                      color: '#6d7b70',
                      fontWeight: '700',
                      fontSize: 13,
                    }}
                  >
                    Annually
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: '48%',
                  backgroundColor: '#161d18',
                  borderRadius: 22,
                  padding: 16,
                  borderWidth: 1.5,
                  borderColor: '#2b4330',
                  minHeight: 470,
                }}
              >
                <Text
                  style={{
                    color: '#dce8df',
                    fontSize: 17,
                    fontWeight: '800',
                    marginBottom: 16,
                  }}
                >
                  Basic
                </Text>

                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 40,
                    fontWeight: '900',
                    lineHeight: 44,
                    marginBottom: 16,
                  }}
                >
                  Free
                </Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: '#0f0f1e',
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: '#2d3b30',
                  }}
                >
                  <Text
                    style={{
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: 15,
                    }}
                  >
                    Get Started
                  </Text>
                </TouchableOpacity>

                <Text
                  style={{
                    color: '#8aa18f',
                    fontSize: 13,
                    marginBottom: 16,
                    fontWeight: '500',
                    lineHeight: 20,
                  }}
                >
                  Essential features for everyday ear care.
                </Text>

                <View
                  style={{
                    height: 1,
                    backgroundColor: '#26362a',
                    marginBottom: 16,
                  }}
                />

                <Text
                  style={{
                    color: '#dce8df',
                    fontSize: 13,
                    fontWeight: '800',
                    marginBottom: 12,
                  }}
                >
                  Includes
                </Text>

                {[
                  'Daily streak tracking',
                  'Standard hearing test',
                  'Arena progress system',
                  'Basic account stats',
                ].map((feature, index) => (
                  <View
                    key={feature}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginBottom: index === 3 ? 0 : 10,
                    }}
                  >
                    <Text
                      style={{
                        color: '#00ff00',
                        fontSize: 15,
                        marginRight: 8,
                        fontWeight: '900',
                      }}
                    >
                      ✓
                    </Text>
                    <Text
                      style={{
                        color: '#d7e2d9',
                        fontSize: 13,
                        lineHeight: 19,
                        flex: 1,
                      }}
                    >
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                style={{
                  width: '48%',
                  backgroundColor: '#161d18',
                  borderRadius: 22,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: '#00ff00',
                  minHeight: 470,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 17,
                      fontWeight: '800',
                    }}
                  >
                    Pro
                  </Text>

                  <View
                    style={{
                      backgroundColor: '#00ff00',
                      borderRadius: 999,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 9,
                        fontWeight: '900',
                        letterSpacing: 0.4,
                      }}
                    >
                      POPULAR
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 40,
                      fontWeight: '900',
                      lineHeight: 44,
                    }}
                  >
                    $5.99
                  </Text>
                  <Text
                    style={{
                      color: '#8aa18f',
                      fontSize: 15,
                      marginLeft: 4,
                      marginBottom: 4,
                      fontWeight: '600',
                    }}
                  >
                    / month
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: '#00ff00',
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      color: '#000',
                      fontWeight: '900',
                      fontSize: 15,
                    }}
                  >
                    Upgrade to Pro
                  </Text>
                </TouchableOpacity>

                <Text
                  style={{
                    color: '#8aa18f',
                    fontSize: 13,
                    marginBottom: 16,
                    fontWeight: '500',
                    lineHeight: 20,
                  }}
                >
                  Stronger analytics and a more advanced hearing experience.
                </Text>

                <View
                  style={{
                    height: 1,
                    backgroundColor: '#26362a',
                    marginBottom: 16,
                  }}
                />

                <Text
                  style={{
                    color: '#dce8df',
                    fontSize: 13,
                    fontWeight: '800',
                    marginBottom: 12,
                  }}
                >
                  Everything in Basic, plus...
                </Text>

                {[
                  'Advanced hearing test ranges',
                  'Deeper frequency breakdowns',
                  'Expanded score insights',
                  'Future premium analytics features',
                ].map((feature, index) => (
                  <View
                    key={feature}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginBottom: index === 3 ? 0 : 10,
                    }}
                  >
                    <Text
                      style={{
                        color: '#00ff00',
                        fontSize: 15,
                        marginRight: 8,
                        fontWeight: '900',
                      }}
                    >
                      ✓
                    </Text>
                    <Text
                      style={{
                        color: '#d7e2d9',
                        fontSize: 13,
                        lineHeight: 19,
                        flex: 1,
                      }}
                    >
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Text
              style={{
                color: '#5f7564',
                fontSize: 12,
                textAlign: 'center',
                lineHeight: 18,
                marginBottom: 10,
              }}
            >
              Pricing buttons are visual only right now. Payments and subscriptions
              have not been connected yet.
            </Text>
          </View>
        )}
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
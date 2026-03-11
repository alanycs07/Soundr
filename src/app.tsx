import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

type TabName = 'home' | 'hearing' | 'account' | 'plans';
type EarSide = 'left' | 'right';

type HearingResponse = {
  left: boolean;
  right: boolean;
};

type Friend = {
  id: number;
  name: string;
  streak: number;
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
  { hz: 250, label: 'Low' },
  { hz: 500, label: 'Low-Mid' },
  { hz: 1000, label: 'Mid' },
  { hz: 2000, label: 'Mid-High' },
  { hz: 4000, label: 'High' },
  { hz: 8000, label: 'Ultra' },
];

const EDUCATIONAL_FACTS = [
  '🧼 Earwax is actually protective. It helps keep ears clean and fights infection.',
  '👂 Your hearing is most sensitive between 1000 and 4000 Hz.',
  '🔊 Exposure to sounds over 85 dB can damage hearing over time.',
  '💧 Avoid putting water directly into your ears unless using a proper method.',
  '🎧 Taking short listening breaks can help protect long-term hearing health.',
];

const TABS: { name: TabName; label: string; icon: string }[] = [
  { name: 'home', label: 'HOME', icon: '🏠' },
  { name: 'hearing', label: 'TEST', icon: '🎧' },
  { name: 'account', label: 'PROFILE', icon: '👤' },
  { name: 'plans', label: 'PLANS', icon: '💎' },
];

const styles = {
  screen: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  } as const,
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900' as const,
    color: '#00ff00',
    marginBottom: 16,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
  } as const,
  muted: {
    color: '#666',
    fontWeight: '600' as const,
  },
};

function BellCurveCard({ percentile }: { percentile: number }) {
  const chartWidth = width - 96;
  const chartHeight = 150;
  const markerLeft = Math.max(0, Math.min(chartWidth - 4, (percentile / 100) * chartWidth));

  return (
    <View
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#00ff00',
      }}
    >
      <Text
        style={{
          color: '#00ff00',
          fontWeight: '900',
          fontSize: 14,
          marginBottom: 14,
          letterSpacing: 1,
        }}
      >
        PERCENTILE RANGE
      </Text>

      <View
        style={{
          height: chartHeight,
          backgroundColor: 'rgba(0,0,0,0.35)',
          borderRadius: 14,
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          paddingBottom: 16,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: markerLeft + 16,
            top: 16,
            bottom: 16,
            width: 3,
            backgroundColor: '#ffff00',
            borderRadius: 2,
          }}
        />
        <Text
          style={{
            position: 'absolute',
            left: Math.max(8, markerLeft - 8),
            top: 12,
            color: '#ffff00',
            fontWeight: '900',
            fontSize: 16,
          }}
        >
          {percentile}%
        </Text>

        <View
          style={{
            height: 70,
            borderTopLeftRadius: 70,
            borderTopRightRadius: 70,
            backgroundColor: 'rgba(0,255,0,0.18)',
            borderWidth: 2,
            borderColor: '#00ff00',
            borderBottomWidth: 0,
          }}
        />
      </View>

      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {['0%', '25%', '50%', '75%', '100%'].map((label) => (
          <Text
            key={label}
            style={{
              color: '#666',
              fontSize: 11,
              fontWeight: '600',
            }}
          >
            {label}
          </Text>
        ))}
      </View>
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

  const [selectedFrequency, setSelectedFrequency] = useState<number>(250);
  const [currentEar, setCurrentEar] = useState<EarSide>('left');
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [hearingResponses, setHearingResponses] = useState<Record<number, HearingResponse>>({});
  const [testComplete, setTestComplete] = useState(false);
  const [hearingPercentile, setHearingPercentile] = useState(0);
  const [hearingRank, setHearingRank] = useState('');

  const [isPro, setIsPro] = useState(false);
  const [friends] = useState<Friend[]>([
    { id: 1, name: 'Alice', streak: 42 },
    { id: 2, name: 'Bob', streak: 28 },
    { id: 3, name: 'Charlie', streak: 35 },
    { id: 4, name: 'Diana', streak: 21 },
    { id: 5, name: 'Eve', streak: 38 },
  ]);

  const logoAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bellCurveAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const randomFact = useMemo(() => {
    const index = Math.floor(Math.random() * EDUCATIONAL_FACTS.length);
    return EDUCATIONAL_FACTS[index];
  }, []);

  const sortedFriends = useMemo(() => {
    return [...friends].sort((a, b) => b.streak - a.streak);
  }, [friends]);

  const completedFrequencyCount = useMemo(() => {
    return Object.values(hearingResponses).filter(
      (response) => response.left || response.right
    ).length;
  }, [hearingResponses]);

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
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }, 2500);

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

  const completeHearingTest = (updatedResponses: Record<number, HearingResponse>) => {
    const heardCount = Object.values(updatedResponses).filter(
      (response) => response.left || response.right
    ).length;

    const percentile = Math.round((heardCount / FREQUENCIES.length) * 100);
    setHearingPercentile(percentile);

    if (percentile >= 95) setHearingRank('Perfect Hearing');
    else if (percentile >= 85) setHearingRank('Excellent');
    else if (percentile >= 75) setHearingRank('Great');
    else if (percentile >= 65) setHearingRank('Good');
    else if (percentile >= 50) setHearingRank('Average');
    else if (percentile >= 35) setHearingRank('Below Average');
    else setHearingRank('Needs Improvement');

    setTestComplete(true);

    Animated.parallel([
      Animated.timing(bellCurveAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
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
    setSelectedFrequency(250);
    setCurrentEar('left');
    setHearingPercentile(0);
    setHearingRank('');
    bellCurveAnim.setValue(0);
    scaleAnim.setValue(0.8);
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
    <View style={styles.screen}>
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
              <Text style={styles.sectionTitle}>🏆 ACHIEVEMENTS</Text>
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

            <View>
              <Text style={styles.sectionTitle}>🏅 LEADERBOARD</Text>

              {sortedFriends.map((friend, index) => (
                <View
                  key={friend.id}
                  style={{
                    backgroundColor: '#1a1a2e',
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeftWidth: 3,
                    borderLeftColor:
                      index === 0 ? '#ffff00' : index === 1 ? '#00ffff' : '#00ff00',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor:
                          index === 0 ? '#ffff00' : index === 1 ? '#00ffff' : '#00ff00',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 14,
                      }}
                    >
                      <Text style={{ fontWeight: '900', fontSize: 16, color: '#000' }}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </Text>
                    </View>

                    <View>
                      <Text style={{ fontWeight: '700', color: '#fff', fontSize: 15 }}>
                        {friend.name}
                      </Text>
                      <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>
                        {friend.streak} day streak
                      </Text>
                    </View>
                  </View>

                  <Text style={{ color: '#00ff00', fontWeight: '900', fontSize: 16 }}>🔥</Text>
                </View>
              ))}
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
              Check your hearing range
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
                      marginBottom: 32,
                      fontSize: 13,
                      letterSpacing: 1,
                      fontWeight: '600',
                    }}
                  >
                    Hz • {FREQUENCIES.find((f) => f.hz === selectedFrequency)?.label}
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
                  opacity: bellCurveAnim,
                  transform: [{ scale: scaleAnim }],
                }}
              >
                <View
                  style={{
                    backgroundColor: '#1a1a2e',
                    borderRadius: 24,
                    padding: 28,
                    marginBottom: 24,
                    borderWidth: 2,
                    borderColor: '#00ff00',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#666',
                      textAlign: 'center',
                      marginBottom: 16,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      fontWeight: '800',
                    }}
                  >
                    Your Score
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      marginBottom: 24,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 80,
                        fontWeight: '900',
                        color: '#00ff00',
                        letterSpacing: -2,
                      }}
                    >
                      {hearingPercentile}
                    </Text>
                    <Text
                      style={{
                        fontSize: 28,
                        color: '#666',
                        marginTop: 8,
                        marginLeft: 6,
                        fontWeight: '700',
                      }}
                    >
                      %
                    </Text>
                  </View>

                  <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: 26,
                        fontWeight: '900',
                        color:
                          hearingPercentile >= 85
                            ? '#00ff00'
                            : hearingPercentile >= 70
                            ? '#ffff00'
                            : '#ff6b6b',
                        marginBottom: 10,
                      }}
                    >
                      {hearingRank}
                    </Text>

                    <Text style={{ color: '#888', fontSize: 13, fontWeight: '600' }}>
                      {hearingPercentile >= 95
                        ? 'Perfect! Exceptional hearing.'
                        : hearingPercentile >= 85
                        ? 'Great! Higher than average.'
                        : hearingPercentile >= 70
                        ? 'Good hearing health.'
                        : 'Protect your ears more.'}
                    </Text>
                  </View>
                </View>

                <BellCurveCard percentile={hearingPercentile} />

                <View
                  style={{
                    backgroundColor: '#1a1a2e',
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: '#333',
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
                    Frequency Response
                  </Text>

                  {FREQUENCIES.map((freq) => {
                    const response = hearingResponses[freq.hz];
                    const heardCount = (response?.left ? 1 : 0) + (response?.right ? 1 : 0);
                    const percentage = (heardCount / 2) * 100;

                    return (
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
                                percentage === 100
                                  ? '#00ff00'
                                  : percentage === 50
                                  ? '#ffff00'
                                  : '#ff6b6b',
                              fontWeight: '900',
                              fontSize: 14,
                            }}
                          >
                            {percentage.toFixed(0)}%
                          </Text>
                        </View>

                        <View
                          style={{
                            height: 8,
                            backgroundColor: '#333',
                            borderRadius: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <View
                            style={{
                              width: `${percentage}%`,
                              height: '100%',
                              backgroundColor:
                                percentage === 100
                                  ? '#00ff00'
                                  : percentage === 50
                                  ? '#ffff00'
                                  : '#ff6b6b',
                            }}
                          />
                        </View>
                      </View>
                    );
                  })}
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
              <Text style={styles.sectionTitle}>📊 STATISTICS</Text>

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
              <Text style={styles.sectionTitle}>⚙️ SETTINGS</Text>

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
            <Text
              style={{
                fontSize: 40,
                fontWeight: '900',
                color: '#ffffff',
                marginBottom: 32,
              }}
            >
              💎 Plans
            </Text>

            <View
              style={{
                backgroundColor: isPro ? '#00ff00' : '#333',
                borderRadius: 16,
                padding: 20,
                marginBottom: 32,
                borderWidth: 2,
                borderColor: isPro ? '#00ff00' : '#555',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '900',
                  color: isPro ? '#000' : '#fff',
                  marginBottom: 8,
                }}
              >
                {isPro ? '⭐ PRO MEMBER' : '👤 BASIC MEMBER'}
              </Text>
              <Text
                style={{
                  color: isPro ? '#000' : '#888',
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {isPro ? 'All features unlocked' : 'Upgrade for more'}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: '#1a1a2e',
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                borderWidth: 2,
                borderColor: isPro ? '#333' : '#00ff00',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '900',
                  color: '#fff',
                  marginBottom: 8,
                }}
              >
                Free
              </Text>
              <Text
                style={{
                  color: '#666',
                  marginBottom: 16,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                Getting started
              </Text>

              <View style={{ marginBottom: 18 }}>
                <Text style={{ color: '#00ff00', marginBottom: 8, fontWeight: '700' }}>
                  ✓ Daily streak tracking
                </Text>
                <Text style={{ color: '#00ff00', marginBottom: 8, fontWeight: '700' }}>
                  ✓ Basic hearing test
                </Text>
                <Text style={{ color: '#00ff00', marginBottom: 8, fontWeight: '700' }}>
                  ✓ Leaderboard
                </Text>
                <Text style={{ color: '#666', fontWeight: '700' }}>✗ Advanced features</Text>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: isPro ? '#333' : '#00ff00',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
                disabled
              >
                <Text
                  style={{
                    color: isPro ? '#666' : '#000',
                    fontWeight: '900',
                    fontSize: 14,
                  }}
                >
                  {isPro ? 'CURRENT PLAN' : 'USING NOW'}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor: '#1a1a2e',
                borderRadius: 16,
                padding: 20,
                borderWidth: 2,
                borderColor: isPro ? '#00ff00' : '#00ffff',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '900',
                    color: '#fff',
                  }}
                >
                  Pro
                </Text>

                <View
                  style={{
                    backgroundColor: '#00ffff',
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 10,
                      fontWeight: '900',
                      letterSpacing: 0.5,
                    }}
                  >
                    POPULAR
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: '#666',
                  marginBottom: 16,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                $12.99 / year
              </Text>

              <View style={{ marginBottom: 18 }}>
                <Text style={{ color: '#00ff00', marginBottom: 8, fontWeight: '700' }}>
                  ✓ Everything in Basic
                </Text>
                <Text style={{ color: '#00ff00', marginBottom: 8, fontWeight: '700' }}>
                  ✓ Advanced hearing tests
                </Text>
                <Text style={{ color: '#00ff00', marginBottom: 8, fontWeight: '700' }}>
                  ✓ Personalized insights
                </Text>
                <Text style={{ color: '#00ff00', marginBottom: 8, fontWeight: '700' }}>
                  ✓ Ad-free experience
                </Text>
                <Text style={{ color: '#00ff00', fontWeight: '700' }}>
                  ✓ Priority support
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsPro(!isPro)}
                style={{
                  backgroundColor: isPro ? '#333' : '#00ffff',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: isPro ? '#666' : '#000',
                    fontWeight: '900',
                    fontSize: 14,
                  }}
                >
                  {isPro ? '✓ CURRENT PLAN' : 'UPGRADE NOW'}
                </Text>
              </TouchableOpacity>
            </View>
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
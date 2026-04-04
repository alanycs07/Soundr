import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ARENA_DAYS, ARENAS, HearingEntry } from '../../store/appStore';

// ─── Insight card ─────────────────────────────────────────────────────────────

function InsightCard({
  streak,
  hearingHistory,
  totalCleanings,
  todayHearingDone,
  todayCleaningDone,
  todayLearnDone,
  learnPoints,
}: {
  streak: number;
  hearingHistory: HearingEntry[];
  totalCleanings: number;
  todayHearingDone: boolean;
  todayCleaningDone: boolean;
  todayLearnDone: boolean;
  learnPoints: number;
}) {
  const insight = deriveInsight({
    streak,
    hearingHistory,
    totalCleanings,
    todayHearingDone,
    todayCleaningDone,
    todayLearnDone,
    learnPoints,
  });

  if (!insight) return null;

  return (
    <View
      style={{
        backgroundColor: '#161d18',
        borderRadius: 18,
        padding: 18,
        marginBottom: 28,
        borderWidth: 1.5,
        borderColor: insight.accent ? '#00ff00' : '#2b4330',
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: insight.accent ? 'rgba(0,255,0,0.12)' : 'rgba(138,161,143,0.1)',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 14,
          marginTop: 2,
          borderWidth: 1,
          borderColor: insight.accent ? '#2b4330' : '#222',
        }}
      >
        <Ionicons
          name={insight.icon as any}
          size={19}
          color={insight.accent ? '#00ff00' : '#8aa18f'}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: insight.accent ? '#00ff00' : '#8aa18f',
            fontSize: 10,
            fontWeight: '900',
            letterSpacing: 1.2,
            marginBottom: 5,
          }}
        >
          {insight.label}
        </Text>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '700',
            lineHeight: 21,
            marginBottom: insight.sub ? 6 : 0,
          }}
        >
          {insight.title}
        </Text>
        {!!insight.sub && (
          <Text style={{ color: '#8aa18f', fontSize: 12, lineHeight: 18 }}>
            {insight.sub}
          </Text>
        )}
      </View>
    </View>
  );
}

type InsightData = {
  icon: string;
  label: string;
  title: string;
  sub?: string;
  accent: boolean;
};

function deriveInsight({
  streak,
  hearingHistory,
  totalCleanings,
  todayHearingDone,
  todayCleaningDone,
  todayLearnDone,
  learnPoints,
}: {
  streak: number;
  hearingHistory: HearingEntry[];
  totalCleanings: number;
  todayHearingDone: boolean;
  todayCleaningDone: boolean;
  todayLearnDone: boolean;
  learnPoints: number;
}): InsightData | null {

  if (todayHearingDone && todayCleaningDone && todayLearnDone) {
    return {
      icon: 'checkmark-circle-outline',
      label: 'ALL DONE TODAY',
      title: `You've completed all three tasks. Streak locked in.`,
      sub: 'Come back tomorrow to keep the momentum going.',
      accent: true,
    };
  }

  if (hearingHistory.length >= 2) {
    const latest = hearingHistory[hearingHistory.length - 1];
    const prev = hearingHistory[hearingHistory.length - 2];
    const delta = latest.score - prev.score;

    if (delta <= -5) {
      return {
        icon: 'trending-down-outline',
        label: 'HEARING INSIGHT',
        title: `Your score dropped ${Math.abs(delta)} points since your last test.`,
        sub: totalCleanings === 0
          ? `You haven't logged a cleaning yet. Dirty mesh can muffle high frequencies.`
          : `Try cleaning your earbuds before your next test — buildup attenuates high-end clarity.`,
        accent: false,
      };
    }

    if (delta >= 5) {
      return {
        icon: 'trending-up-outline',
        label: 'HEARING INSIGHT',
        title: `Your score improved by ${delta} points since last time.`,
        sub: totalCleanings > 0
          ? `${totalCleanings} cleaning${totalCleanings !== 1 ? 's' : ''} logged — consistent maintenance is paying off.`
          : undefined,
        accent: true,
      };
    }
  }

  if (streak > 0 && streak % 7 === 0) {
    return {
      icon: 'flame-outline',
      label: 'STREAK MILESTONE',
      title: `${streak}-day streak — ${streak / 7} week${streak / 7 !== 1 ? 's' : ''} of consistent ear care.`,
      sub: `Your hearing and hygiene habits are building into something real.`,
      accent: true,
    };
  }

  if (!todayHearingDone && totalCleanings >= 3) {
    const latestScore = hearingHistory.length > 0
      ? hearingHistory[hearingHistory.length - 1].score
      : null;
    return {
      icon: 'headset-outline',
      label: 'HEARING CHECK',
      title: latestScore !== null
        ? `Last score: ${latestScore}. Take today's test to track your trend.`
        : `You've been cleaning consistently. Take your hearing test to see if it's making a difference.`,
      sub: undefined,
      accent: false,
    };
  }

  if (totalCleanings === 0 && hearingHistory.length > 0) {
    const weakFreq = (() => {
      const last = hearingHistory[hearingHistory.length - 1];
      if (!last.frequencyResults) return null;
      const entries = Object.entries(last.frequencyResults);
      const worst = entries.reduce((a, b) => (b[1] < a[1] ? b : a), entries[0]);
      return parseInt(worst[0]);
    })();
    return {
      icon: 'water-outline',
      label: 'CLEANING INSIGHT',
      title: weakFreq && weakFreq >= 8000
        ? `You struggled at ${weakFreq} Hz last test. Dirty mesh reduces high-frequency output.`
        : `Clean earbuds deliver measurably better sound. Try your first cleaning session.`,
      sub: `Studies show fouled mesh can attenuate treble by 6-12 dB.`,
      accent: false,
    };
  }

  if (learnPoints >= 30 && !todayLearnDone) {
    return {
      icon: 'book-outline',
      label: 'LEARN',
      title: `${learnPoints} learn points earned so far. Today's article is waiting.`,
      sub: undefined,
      accent: false,
    };
  }

  if (streak === 0 && hearingHistory.length === 0 && totalCleanings === 0) {
    return {
      icon: 'sparkles-outline',
      label: 'GET STARTED',
      title: `Take your first hearing test, clean your earbuds, and read today's article to begin your streak.`,
      sub: undefined,
      accent: false,
    };
  }

  return null;
}



type Props = {
  streak: number;
  currentArena: number;
  arenaProgress: number;
  showArenaMap: boolean;
  setShowArenaMap: (value: boolean) => void;
  todayHearingDone: boolean;
  todayCleaningDone: boolean;
  todayLearnDone: boolean;
  hearingHistory: HearingEntry[];
  totalCleanings: number;
  learnPoints: number;
};

const DAYS_PER_SEGMENT = 5;
const SEGMENTS_PER_ARENA = ARENA_DAYS / DAYS_PER_SEGMENT;

function getArenaStatus(arenaId: number, currentArena: number) {
  if (arenaId < currentArena) return 'completed';
  if (arenaId === currentArena) return 'active';
  return 'locked';
}

function getArenaDaysProgress(streak: number, arenaId: number) {
  const daysBeforeArena = (arenaId - 1) * ARENA_DAYS;
  const daysIntoArena = streak - daysBeforeArena;

  if (daysIntoArena <= 0) return 0;
  if (daysIntoArena >= ARENA_DAYS) return ARENA_DAYS;
  return daysIntoArena;
}

function ArenaRoad({
  streak,
  currentArena,
  selectedArenaId,
  onSelectArena,
}: {
  streak: number;
  currentArena: number;
  selectedArenaId: number;
  onSelectArena: (arenaId: number) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingRight: 20,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 18,
          minHeight: 120,
        }}
      >
        {ARENAS.map((arena, arenaIndex) => {
          const status = getArenaStatus(arena.id, currentArena);
          const isSelected = selectedArenaId === arena.id;
          const daysProgress = getArenaDaysProgress(streak, arena.id);
          const filledSegments = Math.floor(daysProgress / DAYS_PER_SEGMENT);

          return (
            <View
              key={arena.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onSelectArena(arena.id)}
                style={{
                  width: 62,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      status === 'completed'
                        ? '#123524'
                        : status === 'active'
                        ? '#00ff00'
                        : '#2c2f37',
                    borderWidth: isSelected ? 3 : 2,
                    borderColor:
                      isSelected
                        ? '#ffffff'
                        : status === 'completed' || status === 'active'
                        ? '#00ff00'
                        : '#505564',
                    shadowColor: status === 'active' ? '#00ff00' : '#000',
                    shadowOpacity: status === 'active' ? 0.35 : 0.12,
                    shadowRadius: status === 'active' ? 10 : 4,
                  }}
                >
                  {status === 'completed' ? (
                    <Ionicons name="checkmark" size={20} color="#00ff00" />
                  ) : (
                    <Text
                      style={{
                        color: status === 'active' ? '#000' : '#9ea4b1',
                        fontWeight: '900',
                        fontSize: 15,
                      }}
                    >
                      {arena.id}
                    </Text>
                  )}
                </View>

                <Text
                  numberOfLines={1}
                  style={{
                    marginTop: 8,
                    width: 72,
                    textAlign: 'center',
                    color: isSelected ? '#ffffff' : '#7b848d',
                    fontSize: 10,
                    fontWeight: isSelected ? '800' : '700',
                  }}
                >
                  {arena.name}
                </Text>
              </TouchableOpacity>

              {arenaIndex < ARENAS.length - 1 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 4,
                    width: 138,
                    justifyContent: 'space-between',
                  }}
                >
                  {Array.from({ length: SEGMENTS_PER_ARENA }).map((_, segmentIndex) => {
                    const segmentFilled =
                      arena.id < currentArena ||
                      (arena.id === currentArena && segmentIndex < filledSegments);

                    const segmentActive =
                      arena.id === currentArena && segmentIndex === filledSegments;

                    return (
                      <View
                        key={`${arena.id}-${segmentIndex}`}
                        style={{
                          width: 18,
                          height: 6,
                          borderRadius: 999,
                          backgroundColor: segmentFilled
                            ? '#00ff00'
                            : segmentActive
                            ? '#6eff6e'
                            : '#353946',
                          borderWidth: segmentFilled || segmentActive ? 0 : 1,
                          borderColor: '#454b59',
                        }}
                      />
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default function HomeScreen({
  streak,
  currentArena,
  arenaProgress,
  showArenaMap,
  setShowArenaMap,
  todayHearingDone,
  todayCleaningDone,
  todayLearnDone,
  hearingHistory,
  totalCleanings,
  learnPoints,
}: Props) {
  const [selectedArenaId, setSelectedArenaId] = useState(currentArena);

  const selectedArena = useMemo(() => {
    return ARENAS.find((arena) => arena.id === selectedArenaId) || ARENAS[0];
  }, [selectedArenaId]);

  const selectedArenaStatus = getArenaStatus(selectedArena.id, currentArena);
  const selectedArenaDays = getArenaDaysProgress(streak, selectedArena.id);
  const selectedArenaPercent = (selectedArenaDays / ARENA_DAYS) * 100;

  return (
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
          marginBottom: 24,
          borderWidth: 2,
          borderColor: '#00ff00',
        }}
      >
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(0,255,0,0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            borderWidth: 2,
            borderColor: '#00ff00',
          }}
        >
          <Ionicons name="flame-outline" size={54} color="#00ff00" />
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
            color: '#888888',
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
          TAP FOR TROPHY ROAD
        </Text>
      </TouchableOpacity>

      <View
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: 18,
          padding: 18,
          marginBottom: 36,
          borderWidth: 1,
          borderColor: '#2b4330',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
          <Ionicons
            name="checkmark-done-outline"
            size={16}
            color="#00ff00"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: '#00ff00',
              fontWeight: '900',
              fontSize: 13,
              letterSpacing: 1,
            }}
          >
            TODAY&apos;S PROGRESS
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
            Hearing test
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name={todayHearingDone ? 'checkmark-circle-outline' : 'ellipse-outline'}
              size={16}
              color={todayHearingDone ? '#00ff00' : '#888'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: todayHearingDone ? '#00ff00' : '#888',
                fontSize: 14,
                fontWeight: '900',
              }}
            >
              {todayHearingDone ? 'DONE' : 'NOT DONE'}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>Cleaning guide</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name={todayCleaningDone ? 'checkmark-circle-outline' : 'ellipse-outline'}
              size={16}
              color={todayCleaningDone ? '#00ff00' : '#888'}
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: todayCleaningDone ? '#00ff00' : '#888', fontSize: 14, fontWeight: '900' }}>
              {todayCleaningDone ? 'DONE' : 'NOT DONE'}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>Learn quiz</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name={todayLearnDone ? 'checkmark-circle-outline' : 'ellipse-outline'}
              size={16}
              color={todayLearnDone ? '#00ff00' : '#888'}
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: todayLearnDone ? '#00ff00' : '#888', fontSize: 14, fontWeight: '900' }}>
              {todayLearnDone ? 'DONE' : 'NOT DONE'}
            </Text>
          </View>
        </View>

        <Text style={{ color: '#8aa18f', fontSize: 12, marginTop: 14, lineHeight: 18 }}>
          Complete the hearing test and learn quiz each day to keep your streak. Cleaning is weekly.
        </Text>
      </View>

      <InsightCard
        streak={streak}
        hearingHistory={hearingHistory}
        totalCleanings={totalCleanings}
        todayHearingDone={todayHearingDone}
        todayCleaningDone={todayCleaningDone}
        todayLearnDone={todayLearnDone}
        learnPoints={learnPoints}
      />

      {showArenaMap && (
        <View
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 20,
            padding: 20,
            marginBottom: 36,
            borderWidth: 2,
            borderColor: '#00ff00',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
            <Ionicons
              name="map-outline"
              size={18}
              color="#00ff00"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontWeight: '900',
                color: '#00ff00',
                fontSize: 16,
                letterSpacing: 1,
              }}
            >
              ARENA ROAD
            </Text>
          </View>

          <View
            style={{
              backgroundColor: 'rgba(0,255,0,0.05)',
              borderRadius: 16,
              padding: 16,
              marginBottom: 18,
              borderLeftWidth: 4,
              borderLeftColor: '#00ff00',
            }}
          >
            <Text
              style={{
                fontWeight: '800',
                color: '#00ff00',
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              {selectedArena.name}
            </Text>

            <Text
              style={{
                color: '#8aa18f',
                fontSize: 13,
                lineHeight: 20,
                marginBottom: 14,
              }}
            >
              Arena {selectedArena.id} of {ARENAS.length} • 30 day journey • Reward {selectedArena.reward}
            </Text>

            <View
              style={{
                height: 12,
                backgroundColor: '#333333',
                borderRadius: 6,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#00ff00',
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  width:
                    selectedArenaStatus === 'completed'
                      ? '100%'
                      : selectedArenaStatus === 'active'
                      ? `${selectedArenaPercent}%`
                      : '0%',
                  height: '100%',
                  backgroundColor: '#00ff00',
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="trophy-outline"
                size={14}
                color="#888888"
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: '#888888',
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {selectedArenaStatus === 'completed'
                  ? 'Completed'
                  : selectedArenaStatus === 'active'
                  ? `${selectedArenaDays} / ${ARENA_DAYS} days`
                  : 'Locked'}{' '}
                • Reward: {selectedArena.reward}
              </Text>
            </View>
          </View>

          <ArenaRoad
            streak={streak}
            currentArena={currentArena}
            selectedArenaId={selectedArenaId}
            onSelectArena={setSelectedArenaId}
          />

          <Text
            style={{
              color: '#8aa18f',
              fontSize: 12,
              marginTop: 14,
              lineHeight: 18,
            }}
          >
            Tap any arena node to inspect it. Every small segment on the road equals 5 days of progress.
          </Text>
        </View>
      )}

      <View style={{ marginBottom: 36 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Ionicons
            name="ribbon-outline"
            size={18}
            color="#00ff00"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '900',
              color: '#00ff00',
              letterSpacing: 1,
            }}
          >
            ACHIEVEMENTS
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 20,
            padding: 32,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#333333',
            borderStyle: 'dashed',
          }}
        >
          <Ionicons
            name="rocket-outline"
            size={22}
            color="#888888"
            style={{ marginBottom: 10 }}
          />
          <Text style={{ color: '#888888', fontSize: 14, fontWeight: '600' }}>
            Coming Soon
          </Text>
        </View>
      </View>
    </View>
  );
}
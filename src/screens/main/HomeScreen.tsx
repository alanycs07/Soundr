import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ARENAS } from '../../store/appStore';

type Props = {
  streak: number;
  currentArena: number;
  arenaProgress: number;
  showArenaMap: boolean;
  setShowArenaMap: (value: boolean) => void;
  todayHearingDone: boolean;
  todayCleaningDone: boolean;
};

export default function HomeScreen({
  streak,
  currentArena,
  arenaProgress,
  showArenaMap,
  setShowArenaMap,
  todayHearingDone,
  todayCleaningDone,
}: Props) {
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
        <Text
          style={{
            color: '#00ff00',
            fontWeight: '900',
            fontSize: 13,
            marginBottom: 14,
            letterSpacing: 1,
          }}
        >
          TODAY'S PROGRESS
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
            Hearing test
          </Text>
          <Text
            style={{
              color: todayHearingDone ? '#00ff00' : '#888',
              fontSize: 14,
              fontWeight: '900',
            }}
          >
            {todayHearingDone ? 'DONE ✓' : 'NOT DONE'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
            Cleaning guide
          </Text>
          <Text
            style={{
              color: todayCleaningDone ? '#00ff00' : '#888',
              fontSize: 14,
              fontWeight: '900',
            }}
          >
            {todayCleaningDone ? 'DONE ✓' : 'NOT DONE'}
          </Text>
        </View>

        <Text
          style={{
            color: '#6f8574',
            fontSize: 12,
            marginTop: 14,
            lineHeight: 18,
          }}
        >
          Finish both tasks in one day to grow your streak.
        </Text>
      </View>

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
              marginBottom: 8,
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
  );
}
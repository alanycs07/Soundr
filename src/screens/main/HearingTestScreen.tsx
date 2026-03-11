import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import {
  EarSide,
  Frequency,
  HearingResponse,
} from '../../store/appStore';

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

type Props = {
  selectedFrequency: number;
  currentEar: EarSide;
  isPlayingSound: boolean;
  completedFrequencyCount: number;
  frequencies: Frequency[];
  hearingResponses: Record<number, HearingResponse>;
  testComplete: boolean;
  hearingScore: number;
  hearingPercentile: number;
  hearingRank: string;
  summaryFade: Animated.Value;
  summaryRise: Animated.Value;
  statBars: Animated.Value[];
  playSound: () => void;
  handleHearingResponse: (heard: boolean) => void;
  resetHearingTest: () => void;
};

export default function HearingTestScreen({
  selectedFrequency,
  currentEar,
  isPlayingSound,
  completedFrequencyCount,
  frequencies,
  hearingResponses,
  testComplete,
  hearingScore,
  hearingPercentile,
  hearingRank,
  summaryFade,
  summaryRise,
  statBars,
  playSound,
  handleHearingResponse,
  resetHearingTest,
}: Props) {
  const frequencyResults = frequencies.map((freq) => {
    const response = hearingResponses[freq.hz];
    const heardCount = (response?.left ? 1 : 0) + (response?.right ? 1 : 0);
    const percentage = (heardCount / 2) * 100;

    return {
      ...freq,
      percentage,
    };
  });

  return (
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
              Hz • {frequencies.find((f) => f.hz === selectedFrequency)?.label}
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
              PROGRESS: {completedFrequencyCount} / {frequencies.length}
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
                  width: `${(completedFrequencyCount / frequencies.length) * 100}%`,
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
              {completedFrequencyCount} of {frequencies.length} tested tones detected
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
                    Math.round(result.hz / 1000) >= 1 ? `${result.hz / 1000}k` : result.hz
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
  );
}
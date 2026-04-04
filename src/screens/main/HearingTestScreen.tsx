import React from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  EarSide,
  Frequency,
  HearingEntry,
  HearingResponse,
  FREQUENCY_INSIGHTS,
} from '../../store/appStore';

// ─── Stat bar for the frequency chart ────────────────────────────────────────

function StatBar({
  percentage,
  animatedValue,
}: {
  percentage: number;
  animatedValue: Animated.Value;
}) {
  const barHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(6, percentage * 1.6)],
  });
  const barColor =
    percentage >= 100 ? '#00ff00' : percentage >= 50 ? '#ccff33' : '#7ea786';

  return (
    <View style={{ alignItems: 'center', width: 26 }}>
      <View style={{ height: 170, justifyContent: 'flex-end', alignItems: 'center' }}>
        <Animated.View
          style={{
            width: 18,
            height: barHeight,
            borderRadius: 6,
            backgroundColor: barColor,
            borderWidth: 1,
            borderColor: percentage >= 50 ? '#00ff00' : '#2b4330',
          }}
        />
      </View>
    </View>
  );
}

// ─── Mini sparkline for history trend ────────────────────────────────────────

function HistorySparkline({ history }: { history: HearingEntry[] }) {
  const W = 280;
  const H = 60;
  const pad = 8;

  // Single entry — show a placeholder so the user knows their data is being tracked
  if (history.length === 1) {
    const entry = history[0];
    return (
      <View
        style={{
          backgroundColor: '#161d18',
          borderRadius: 18,
          padding: 18,
          marginBottom: 20,
          borderWidth: 1.5,
          borderColor: '#2b4330',
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16, marginBottom: 4 }}>
          Score History
        </Text>
        <Text style={{ color: '#8aa18f', fontSize: 13, marginBottom: 16, lineHeight: 20 }}>
          Take your next test tomorrow to start tracking your trend.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1a1a2e',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: '#2b4330',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#8aa18f', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
              {entry.date}
            </Text>
            <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700', marginTop: 2 }}>
              {entry.rank}
            </Text>
          </View>
          <Text style={{ color: '#00ff00', fontSize: 32, fontWeight: '900' }}>
            {entry.score}
          </Text>
        </View>
      </View>
    );
  }

  if (history.length === 0) return null;

  const scores = history.map((e) => e.score);
  const min = Math.max(0, Math.min(...scores) - 10);
  const max = Math.min(100, Math.max(...scores) + 10);

  const toX = (i: number) => pad + (i / (scores.length - 1)) * (W - pad * 2);
  const toY = (s: number) => H - pad - ((s - min) / (max - min)) * (H - pad * 2);

  // Build SVG polyline points string
  const points = scores.map((s, i) => `${toX(i)},${toY(s)}`).join(' ');

  const latest = scores[scores.length - 1];
  const prev = scores[scores.length - 2];
  const delta = latest - prev;
  const deltaColor = delta > 0 ? '#00ff00' : delta < 0 ? '#ff5a5a' : '#8aa18f';
  const deltaStr = delta > 0 ? `+${delta}` : `${delta}`;

  return (
    <View
      style={{
        backgroundColor: '#161d18',
        borderRadius: 18,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#2b4330',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16 }}>
          Score History
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: deltaColor, fontWeight: '800', fontSize: 14, marginRight: 4 }}>
            {deltaStr}
          </Text>
          <Text style={{ color: '#8aa18f', fontSize: 12 }}>vs last test</Text>
        </View>
      </View>

      {/* SVG sparkline rendered as an HTML element via RN Web */}
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        {/* @ts-ignore - SVG works on web via RN Web */}
        <svg width={W} height={H} style={{ overflow: 'visible' }}>
          {/* @ts-ignore */}
          <polyline
            points={points}
            fill="none"
            stroke="#00ff00"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {scores.map((s, i) => (
            // @ts-ignore
            <circle
              key={i}
              cx={toX(i)}
              cy={toY(s)}
              r={i === scores.length - 1 ? 5 : 3}
              fill={i === scores.length - 1 ? '#00ff00' : '#2b4330'}
              stroke="#00ff00"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </View>

      {/* X-axis labels: dates */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: pad }}>
        {history.map((e, i) => (
          <Text key={i} style={{ color: '#555', fontSize: 9, fontWeight: '600' }}>
            {e.date.slice(5)} {/* MM-DD */}
          </Text>
        ))}
      </View>

      <Text style={{ color: '#8aa18f', fontSize: 12, marginTop: 10, lineHeight: 18 }}>
        {history.length} test{history.length !== 1 ? 's' : ''} recorded.
        {delta !== 0
          ? ` Your score ${delta > 0 ? 'improved' : 'dropped'} by ${Math.abs(delta)} points since your last session.`
          : ' Your score held steady since last time.'}
      </Text>
    </View>
  );
}

// ─── Frequency insight callout ────────────────────────────────────────────────

function FrequencyCallout({
  hz,
  percentage,
}: {
  hz: number;
  percentage: number;
}) {
  const insight = FREQUENCY_INSIGHTS[hz];
  if (!insight || percentage === 100) return null;

  return (
    <View
      style={{
        backgroundColor: 'rgba(255,90,90,0.08)',
        borderRadius: 10,
        padding: 10,
        marginTop: 8,
        borderLeftWidth: 3,
        borderLeftColor: percentage === 0 ? '#ff5a5a' : '#ccff33',
      }}
    >
      <Text style={{ color: '#cccccc', fontSize: 12, lineHeight: 18 }}>
        💡 {insight}
      </Text>
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

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
  hearingHistory: HearingEntry[];
  playSound: () => void;
  handleHearingResponse: (heard: boolean) => void;
  resetHearingTest: () => void;
};

// ─── Main component ───────────────────────────────────────────────────────────

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
  hearingHistory,
  playSound,
  handleHearingResponse,
  resetHearingTest,
}: Props) {
  const frequencyResults = frequencies.map((freq) => {
    const response = hearingResponses[freq.hz];
    const heardCount = (response?.left ? 1 : 0) + (response?.right ? 1 : 0);
    const percentage = (heardCount / 2) * 100;
    return { ...freq, percentage };
  });

  // 24-hour cooldown: check if user already tested today
  const todayKey = new Date().toISOString().slice(0, 10);
  const testedToday =
    !testComplete && hearingHistory.some((e) => e.date === todayKey);

  // Most struggled frequency for callout on results
  const weakestFreq = testComplete
    ? frequencyResults.reduce(
        (worst, cur) => (cur.percentage < worst.percentage ? cur : worst),
        frequencyResults[0]
      )
    : null;

  // ── Cooldown blocked screen ──
  if (testedToday) {
    const todayEntry = hearingHistory.find((e) => e.date === todayKey)!;
    return (
      <View style={{ paddingHorizontal: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="headset-outline" size={32} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff' }}>Test</Text>
        </View>
        <Text style={{ fontSize: 13, color: '#888888', marginBottom: 28, fontWeight: '600' }}>
          Check your hearing range across tougher high-end frequencies.
        </Text>

        <View
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 20,
            padding: 24,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: '#2b4330',
            alignItems: 'center',
          }}
        >
          <Ionicons name="time-outline" size={36} color="#8aa18f" style={{ marginBottom: 12 }} />
          <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 20, marginBottom: 8 }}>
            Already tested today
          </Text>
          <Text
            style={{
              color: '#8aa18f',
              fontSize: 14,
              textAlign: 'center',
              lineHeight: 22,
              marginBottom: 16,
            }}
          >
            Come back tomorrow for your next hearing check. Daily retakes skew
            your history data — weekly consistency is what matters.
          </Text>
          <View
            style={{
              backgroundColor: '#161d18',
              borderRadius: 14,
              padding: 16,
              width: '100%',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#2b4330',
            }}
          >
            <Text style={{ color: '#8aa18f', fontSize: 12, marginBottom: 4 }}>
              TODAY'S SCORE
            </Text>
            <Text style={{ color: '#00ff00', fontSize: 48, fontWeight: '900' }}>
              {todayEntry.score}
            </Text>
            <Text style={{ color: '#8aa18f', fontSize: 13 }}>{todayEntry.rank}</Text>
          </View>
        </View>

        <HistorySparkline history={hearingHistory} />
      </View>
    );
  }

  // ── Active test screen ──
  if (!testComplete) {
    return (
      <View style={{ paddingHorizontal: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="headset-outline" size={32} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff' }}>Test</Text>
        </View>
        <Text style={{ fontSize: 13, color: '#888888', marginBottom: 32, fontWeight: '600' }}>
          Check your hearing range across tougher high-end frequencies.
        </Text>

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
              color: '#888888',
              marginBottom: 16,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontWeight: '700',
            }}
          >
            {currentEar === 'left' ? 'LEFT EAR' : 'RIGHT EAR'}
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
              color: '#888888',
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
              color: '#8aa18f',
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
                color: '#000000',
                fontWeight: '900',
                fontSize: 16,
                letterSpacing: 0.5,
              }}
            >
              {isPlayingSound ? '🔊 PLAYING...' : 'PLAY TONE'}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => handleHearingResponse(false)}
              style={{
                flex: 1,
                backgroundColor: '#333333',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#2b4330',
                marginRight: 6,
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 15 }}>NO</Text>
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
              <Text style={{ color: '#000000', fontWeight: '900', fontSize: 15 }}>YES</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: '#333333',
          }}
        >
          <Text
            style={{
              color: '#888888',
              marginBottom: 12,
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 0.5,
            }}
          >
            PROGRESS: {completedFrequencyCount} / {frequencies.length}
          </Text>
          <View style={{ height: 10, backgroundColor: '#333333', borderRadius: 5, overflow: 'hidden' }}>
            <View
              style={{
                width: `${(completedFrequencyCount / frequencies.length) * 100}%`,
                height: '100%',
                backgroundColor: '#00ff00',
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  // ── Results screen ──
  return (
    <Animated.View
      style={{
        paddingHorizontal: 18,
        opacity: summaryFade,
        transform: [{ translateY: summaryRise }],
      }}
    >
      {/* Score card */}
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
        <Text style={{ fontSize: 20, color: '#ffffff', fontWeight: '500', marginBottom: 6 }}>
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
        <Text style={{ fontSize: 18, color: '#8aa18f', fontWeight: '700', marginTop: -2 }}>
          / 100
        </Text>
        <Text style={{ fontSize: 28, color: '#ffffff', fontWeight: '800', marginTop: 14 }}>
          {hearingPercentile}% session percentile
        </Text>
        <Text style={{ fontSize: 14, color: '#8aa18f', fontWeight: '600', marginTop: 10 }}>
          {hearingRank}
        </Text>
        <Text style={{ fontSize: 12, color: '#888888', fontWeight: '600', marginTop: 12 }}>
          {completedFrequencyCount} of {frequencies.length} tested tones detected
        </Text>
      </View>

      {/* History sparkline — only shows if there's prior history */}
      <HistorySparkline history={hearingHistory} />

      {/* Weakest frequency callout */}
      {weakestFreq && weakestFreq.percentage < 100 && (
        <View
          style={{
            backgroundColor: '#161d18',
            borderRadius: 18,
            padding: 18,
            marginBottom: 20,
            borderWidth: 1.5,
            borderColor: weakestFreq.percentage === 0 ? '#ff5a5a' : '#ccff33',
          }}
        >
          <Text
            style={{
              color: weakestFreq.percentage === 0 ? '#ff8d8d' : '#ccff33',
              fontWeight: '900',
              fontSize: 12,
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            {weakestFreq.percentage === 0 ? '⚠ RANGE NOT DETECTED' : '↓ WEAKEST RANGE'}
          </Text>
          <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 18, marginBottom: 4 }}>
            {weakestFreq.hz} Hz — {weakestFreq.label}
          </Text>
          <Text style={{ color: '#8aa18f', fontSize: 13, lineHeight: 20 }}>
            {FREQUENCY_INSIGHTS[weakestFreq.hz]}
          </Text>
        </View>
      )}

      {/* Bar chart */}
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
        <Text style={{ fontSize: 17, color: '#ffffff', fontWeight: '800', marginBottom: 16 }}>
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
            borderTopColor: '#2b4330',
          }}
        >
          <Text style={{ color: '#8aa18f', fontSize: 12, lineHeight: 18 }}>
            Each bar uses actual left/right responses from this test. Full-height bars mean both
            ears detected that tone.
          </Text>
        </View>
      </View>

      {/* Frequency breakdown with educational callouts */}
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
          <View key={freq.hz} style={{ marginBottom: 20 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
                {freq.hz} Hz
                {'  '}
                <Text style={{ color: '#555', fontWeight: '500', fontSize: 12 }}>
                  {freq.label}
                </Text>
              </Text>
              <Text
                style={{
                  color:
                    freq.percentage === 100
                      ? '#00ff00'
                      : freq.percentage === 50
                      ? '#ccff33'
                      : '#ff8d8d',
                  fontWeight: '900',
                  fontSize: 14,
                }}
              >
                {freq.percentage.toFixed(0)}%
              </Text>
            </View>

            <View
              style={{ height: 8, backgroundColor: '#333333', borderRadius: 4, overflow: 'hidden' }}
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
                      : '#7ea786',
                }}
              />
            </View>

            {/* Show insight if they struggled at this frequency */}
            {freq.percentage < 100 && (
              <FrequencyCallout hz={freq.hz} percentage={freq.percentage} />
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={resetHearingTest}
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: 14,
          paddingVertical: 18,
          alignItems: 'center',
          marginBottom: 20,
          borderWidth: 1.5,
          borderColor: '#2b4330',
        }}
      >
        <Text style={{ color: '#8aa18f', fontWeight: '700', fontSize: 14 }}>
          Test again tomorrow
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
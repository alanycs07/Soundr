import React from 'react';
import { Animated, Text, View } from 'react-native';
import { EarSide, Frequency, HearingResponse } from '../../store/appStore';
import HoverButton from '../../components/HoverButton';

function StatBar({ percentage, animatedValue }: { percentage: number; animatedValue: Animated.Value }) {
  const barHeight = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, Math.max(6, percentage * 1.6)] });
  const barColor = percentage >= 100 ? '#00ff00' : percentage >= 50 ? '#ccff33' : '#7ea786';
  return (
    <View style={{ alignItems: 'center', width: 26 }}>
      <View style={{ height: 170, justifyContent: 'flex-end', alignItems: 'center' }}>
        <Animated.View style={{ width: 18, height: barHeight, borderRadius: 6, backgroundColor: barColor, borderWidth: 1, borderColor: percentage >= 50 ? '#00ff00' : '#2b4330' }} />
      </View>
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
    return { freq, percentage };
  });

  const currentFreq = frequencies.find((f) => f.hz === selectedFrequency);

  if (testComplete) {
    return (
      <Animated.View style={{ paddingHorizontal: 18, opacity: summaryFade, transform: [{ translateY: summaryRise }] }}>
        <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff', marginBottom: 6 }}>Test Complete</Text>
        <Text style={{ fontSize: 13, color: '#888888', marginBottom: 24, fontWeight: '600' }}>Here&apos;s how your hearing performed today.</Text>

        <View style={{ backgroundColor: '#161d18', borderRadius: 22, padding: 28, alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#00ff00' }}>
          <Text style={{ fontSize: 80, fontWeight: '900', color: '#00ff00', letterSpacing: -2 }}>{hearingScore}</Text>
          <Text style={{ color: '#ffffff', fontSize: 13, marginBottom: 4 }}>/ 100</Text>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#ffffff', marginBottom: 6 }}>{hearingPercentile}% session percentile</Text>
          <Text style={{ color: '#8aa18f', fontSize: 14, marginBottom: 4 }}>{hearingRank}</Text>
          <Text style={{ color: '#8aa18f', fontSize: 13 }}>{completedFrequencyCount} of {frequencies.length} tested tones detected</Text>
        </View>

        <View style={{ backgroundColor: '#161d18', borderRadius: 22, padding: 22, marginBottom: 20, borderWidth: 1, borderColor: '#2b4330' }}>
          <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16, marginBottom: 18 }}>Hearing Statistics</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {frequencyResults.map(({ freq, percentage }, i) => (
              <StatBar key={freq.hz} percentage={percentage} animatedValue={statBars[i]} />
            ))}
          </View>
          <Text style={{ color: '#8aa18f', fontSize: 11, marginTop: 12, lineHeight: 16 }}>
            Each bar uses actual left/right responses from this test. Full-height bars mean both ears detected that tone.
          </Text>
        </View>

        <View style={{ backgroundColor: '#161d18', borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: '#2b4330' }}>
          <Text style={{ color: '#00ff00', fontWeight: '800', fontSize: 12, letterSpacing: 1, marginBottom: 12 }}>FREQUENCY BREAKDOWN</Text>
          {frequencyResults.map(({ freq, percentage }) => (
            <View key={freq.hz} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#cccccc', fontSize: 13, fontWeight: '600' }}>{freq.hz} Hz</Text>
              <Text style={{ color: percentage === 100 ? '#00ff00' : percentage === 50 ? '#ccff33' : '#888888', fontSize: 13, fontWeight: '800' }}>{percentage}%</Text>
            </View>
          ))}
        </View>

        <HoverButton label="Test Again" onPress={resetHearingTest} primary style={{ marginBottom: 20 }} />
      </Animated.View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 18 }}>
      <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff', marginBottom: 6 }}>Hearing Test</Text>
      <Text style={{ fontSize: 13, color: '#888888', marginBottom: 28, fontWeight: '600', lineHeight: 20 }}>
        Listen carefully and answer whether you can hear each tone.
      </Text>

      <View style={{ backgroundColor: '#161d18', borderRadius: 22, padding: 24, marginBottom: 20, borderWidth: 2, borderColor: '#00ff00' }}>
        <Text style={{ color: '#8aa18f', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8 }}>
          {currentEar.toUpperCase()} EAR
        </Text>
        <Text style={{ fontSize: 64, fontWeight: '900', color: '#00ff00', letterSpacing: -2, marginBottom: 4 }}>
          {selectedFrequency}
        </Text>
        <Text style={{ color: '#8aa18f', fontSize: 14, fontWeight: '600', marginBottom: 16 }}>
          Hz • {currentFreq?.label}
        </Text>
        <Text style={{ color: '#888888', fontSize: 13, lineHeight: 20, marginBottom: 24 }}>
          Higher frequencies are weighted more heavily, so late-stage tones matter more.
        </Text>

        <HoverButton
          label={isPlayingSound ? '🔊 Playing...' : 'PLAY TONE'}
          onPress={playSound}
          primary
          style={{ marginBottom: 16 }}
        />

        <View style={{ flexDirection: 'row' }}>
          <HoverButton label="NO" onPress={() => handleHearingResponse(false)} style={{ flex: 1, marginRight: 6 }} />
          <HoverButton label="YES" onPress={() => handleHearingResponse(true)} primary style={{ flex: 1, marginLeft: 6 }} />
        </View>
      </View>

      <View style={{ backgroundColor: '#1a1a2e', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#2b4330' }}>
        <Text style={{ color: '#8aa18f', fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 }}>
          PROGRESS: {completedFrequencyCount} / {frequencies.length}
        </Text>
        <View style={{ height: 8, backgroundColor: '#333333', borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ width: `${(completedFrequencyCount / frequencies.length) * 100}%`, height: '100%', backgroundColor: '#00ff00' }} />
        </View>
      </View>
    </View>
  );
}

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const FREQUENCIES = [
  { hz: 250, label: 'Low' },
  { hz: 500, label: 'Low-Mid' },
  { hz: 1000, label: 'Mid' },
  { hz: 2000, label: 'Mid-High' },
  { hz: 4000, label: 'High' },
  { hz: 8000, label: 'Very High' },
];

export default function HearingTestScreen() {
  const [testStarted, setTestStarted] = useState(false);
  const [currentFreqIndex, setCurrentFreqIndex] = useState(0);
  const [currentEar, setCurrentEar] = useState<'left' | 'right'>('left');
  const [results, setResults] = useState<Record<number, { left: number; right: number }>>({});

  const handleHeardYes = () => {
    const freq = FREQUENCIES[currentFreqIndex].hz;
    setResults((prev) => ({
      ...prev,
      [freq]: {
        ...prev[freq],
        [currentEar]: 100,
      },
    }));
    handleNext();
  };

  const handleHeardNo = () => {
    const freq = FREQUENCIES[currentFreqIndex].hz;
    setResults((prev) => ({
      ...prev,
      [freq]: {
        ...prev[freq],
        [currentEar]: 0,
      },
    }));
    handleNext();
  };

  const handleNext = () => {
    if (currentEar === 'left') {
      setCurrentEar('right');
    } else if (currentFreqIndex < FREQUENCIES.length - 1) {
      setCurrentFreqIndex(currentFreqIndex + 1);
      setCurrentEar('left');
    } else {
      setTestStarted(false);
    }
  };

  if (!testStarted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>
              Hearing Test
            </Text>

            <View
              style={{
                marginTop: 32,
                backgroundColor: '#6366f1',
                borderRadius: 24,
                padding: 32,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 48 }}>🔥</Text>
              <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginTop: 24, textAlign: 'center' }}>
                Test Your Hearing
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 16, textAlign: 'center' }}>
                We'll play different tones. Tell us which ones you can hear.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setTestStarted(true)}
              style={{
                marginTop: 32,
                backgroundColor: '#6366f1',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 16 }}>
                Start Test
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const freq = FREQUENCIES[currentFreqIndex];
  const progress = ((currentFreqIndex * 2 + (currentEar === 'right' ? 1 : 0)) / (FREQUENCIES.length * 2)) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>
            Hearing Test
          </Text>

          {/* Progress */}
          <View style={{ marginTop: 24, marginBottom: 32 }}>
            <Text style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>
              Progress {Math.round(progress)}%
            </Text>
            <View
              style={{
                height: 8,
                backgroundColor: '#e5e7eb',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#6366f1',
                }}
              />
            </View>
          </View>

          {/* Current Test */}
          <View
            style={{
              backgroundColor: '#6366f1',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
              {currentEar === 'left' ? '👂 Left Ear' : '👂 Right Ear'}
            </Text>

            <View
              style={{
                marginTop: 24,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 16,
                paddingVertical: 32,
                paddingHorizontal: 24,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#ffffff', fontSize: 48, fontWeight: 'bold' }}>
                {freq.hz}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>
                {freq.label} Frequency Hz
              </Text>
            </View>

            <TouchableOpacity
              style={{
                marginTop: 32,
                backgroundColor: '#ffffff',
                borderRadius: 50,
                padding: 24,
              }}
            >
              <Text style={{ fontSize: 40 }}>🔥</Text>
            </TouchableOpacity>

            <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 24 }}>
              Tap to play tone
            </Text>
          </View>

          {/* Buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: 16,
              marginTop: 32,
            }}
          >
            <TouchableOpacity
              onPress={handleHeardNo}
              style={{
                flex: 1,
                backgroundColor: '#ef4444',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '600' }}>
                Can't Hear
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleHeardYes}
              style={{
                flex: 1,
                backgroundColor: '#22c55e',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '600' }}>
                I Heard It
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
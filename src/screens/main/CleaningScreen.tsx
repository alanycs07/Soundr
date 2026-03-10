import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/appStore';
import { Pause, Play } from 'lucide-react-native';


const STEPS = [
  { title: 'Prepare', description: 'Remove and place earbuds', duration: 20 },
  { title: 'Wipe Exterior', description: 'Use microfiber cloth', duration: 30 },
  { title: 'Clean Mesh', description: 'Gently brush speaker ports', duration: 40 },
  { title: 'Apply Fluid', description: 'Add cleaning solution', duration: 20 },
  { title: 'Final Wipe', description: 'Remove any debris', duration: 30 },
];

export default function CleaningScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(STEPS[0].duration);
  const [totalTime, setTotalTime] = useState(0);
  const { addCleaningSession } = useAppStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (currentStep < STEPS.length - 1) {
              setCurrentStep(currentStep + 1);
              setTimeLeft(STEPS[currentStep + 1].duration);
            } else {
              setIsRunning(false);
              addCleaningSession({
                date: new Date(),
                duration: totalTime,
                type: 'full',
              });
            }
            return 0;
          }
          return prev - 1;
        });
        setTotalTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentStep, totalTime, addCleaningSession]);

  const step = STEPS[currentStep];
  const progress = (currentStep + 1) / STEPS.length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>
            Clean Your Earbuds
          </Text>

          {/* Timer Card */}
          <View
            style={{
              marginTop: 32,
              backgroundColor: '#6366f1',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
              Step {currentStep + 1} of {STEPS.length}
            </Text>

            {/* Progress Bar */}
            <View
              style={{
                width: '100%',
                height: 8,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 4,
                overflow: 'hidden',
                marginBottom: 24,
              }}
            >
              <View
                style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  backgroundColor: '#fbbf24',
                }}
              />
            </View>

            {/* Timer */}
            <Text
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              {formatTime(timeLeft)}
            </Text>

            {/* Step Info */}
            <View style={{ marginTop: 32, alignItems: 'center' }}>
              <Text style={{ fontSize: 24, marginBottom: 16 }}>🧹</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }}>
                {step.title}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8, textAlign: 'center' }}>
                {step.description}
              </Text>
            </View>

            {/* Play/Pause Button */}
            <TouchableOpacity
              onPress={() => setIsRunning(!isRunning)}
              style={{
                marginTop: 32,
                backgroundColor: '#ffffff',
                borderRadius: 50,
                padding: 24,
              }}
            >
              {isRunning ? (
                <Pause color="#6366f1" size={32} />
              ) : (
                <Play color="#6366f1" size={32} />
              )}
            </TouchableOpacity>
          </View>

          {/* Steps List */}
          <View style={{ marginTop: 32 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
              Steps
            </Text>

            {STEPS.map((s, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'row',
                  gap: 16,
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor:
                    idx < currentStep
                      ? '#dcfce7'
                      : idx === currentStep
                      ? '#e0e7ff'
                      : '#ffffff',
                  borderWidth: idx === currentStep ? 2 : 1,
                  borderColor:
                    idx === currentStep ? '#6366f1' : idx < currentStep ? '#22c55e' : '#e5e7eb',
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor:
                      idx < currentStep ? '#22c55e' : idx === currentStep ? '#6366f1' : '#d1d5db',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {idx < currentStep ? (
                    <Text style={{ fontSize: 28 }}>🔥</Text>
                  ) : (
                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{idx + 1}</Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: '600',
                      color: idx === currentStep ? '#4f46e5' : '#111827',
                    }}
                  >
                    {s.title}
                  </Text>
                  <Text style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
                    {s.duration}s
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
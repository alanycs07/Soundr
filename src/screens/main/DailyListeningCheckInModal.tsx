import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  DailyListeningSurvey,
  EarDiscomfortOption,
  ListeningDurationOption,
  ListeningEnvironmentOption,
  ListeningVolumeOption,
} from '../../store/appStore';

type Props = {
  visible: boolean;
  onSubmit: (survey: DailyListeningSurvey) => Promise<void>;
};

const DURATION_OPTIONS: ListeningDurationOption[] = [
  '< 30 min',
  '30–60 min',
  '1–2 hours',
  '2–4 hours',
  '4+ hours',
];

const VOLUME_OPTIONS: ListeningVolumeOption[] = [
  'Low',
  'Medium',
  'Loud',
  'Very loud',
];

const ENVIRONMENT_OPTIONS: ListeningEnvironmentOption[] = [
  'Studying / working',
  'Gym',
  'Commuting',
  'Gaming',
  'Relaxing',
];

const DISCOMFORT_OPTIONS: EarDiscomfortOption[] = [
  'None',
  'Slight',
  'Moderate',
  'Severe',
];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function QuestionBlock<T extends string>({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: T[];
  selected: T | null;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          color: '#ffffff',
          fontSize: 15,
          fontWeight: '800',
          marginBottom: 10,
        }}
      >
        {title}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {options.map((option) => {
          const active = selected === option;

          return (
            <TouchableOpacity
              key={option}
              onPress={() => onSelect(option)}
              style={{
                backgroundColor: active ? '#00ff00' : '#1a1a2e',
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 10,
                marginRight: 8,
                marginBottom: 8,
                borderWidth: 1.2,
                borderColor: active ? '#00ff00' : '#2b4330',
              }}
            >
              <Text
                style={{
                  color: active ? '#000' : '#d7e2d9',
                  fontWeight: '800',
                  fontSize: 13,
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function DailyListeningCheckInModal({
  visible,
  onSubmit,
}: Props) {
  const [duration, setDuration] = useState<ListeningDurationOption | null>(null);
  const [volume, setVolume] = useState<ListeningVolumeOption | null>(null);
  const [environment, setEnvironment] =
    useState<ListeningEnvironmentOption | null>(null);
  const [discomfort, setDiscomfort] = useState<EarDiscomfortOption | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return !!duration && !!volume && !!environment && !!discomfort && !submitting;
  }, [duration, volume, environment, discomfort, submitting]);

  const handleSubmit = async () => {
    if (!duration || !volume || !environment || !discomfort || submitting) return;

    setSubmitting(true);

    await onSubmit({
      date: getTodayKey(),
      duration,
      volume,
      environment,
      discomfort,
    });

    setDuration(null);
    setVolume(null);
    setEnvironment(null);
    setDiscomfort(null);
    setSubmitting(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.72)',
          justifyContent: 'center',
          paddingHorizontal: 18,
        }}
      >
        <View
          style={{
            backgroundColor: '#0f0f1e',
            borderRadius: 24,
            padding: 20,
            borderWidth: 1.5,
            borderColor: '#2b4330',
            maxHeight: '85%',
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                color: '#00ff00',
                fontSize: 12,
                fontWeight: '900',
                letterSpacing: 1.1,
                marginBottom: 10,
              }}
            >
              DAILY LISTENING CHECK-IN
            </Text>

            <Text
              style={{
                color: '#ffffff',
                fontSize: 28,
                fontWeight: '900',
                lineHeight: 34,
                marginBottom: 10,
              }}
            >
              Quick check-in
            </Text>

            <Text
              style={{
                color: '#8aa18f',
                fontSize: 14,
                lineHeight: 22,
                marginBottom: 20,
              }}
            >
              Complete this daily check-in to unlock 2 extra road bars and build
              your weekly listening recap.
            </Text>

            <QuestionBlock
              title="How long did you use earbuds today?"
              options={DURATION_OPTIONS}
              selected={duration}
              onSelect={setDuration}
            />

            <QuestionBlock
              title="What volume level did you mostly listen at?"
              options={VOLUME_OPTIONS}
              selected={volume}
              onSelect={setVolume}
            />

            <QuestionBlock
              title="Where did you listen most?"
              options={ENVIRONMENT_OPTIONS}
              selected={environment}
              onSelect={setEnvironment}
            />

            <QuestionBlock
              title="Any ear discomfort today?"
              options={DISCOMFORT_OPTIONS}
              selected={discomfort}
              onSelect={setDiscomfort}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={{
                backgroundColor: canSubmit ? '#00ff00' : '#1f2a21',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  color: canSubmit ? '#000' : '#6f8574',
                  fontWeight: '900',
                  fontSize: 16,
                }}
              >
                {submitting ? 'Saving...' : 'Finish Check-In'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
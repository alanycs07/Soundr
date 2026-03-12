import React, { useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppProgress, AppUser, DailyListeningSurvey } from '../../store/appStore';

type Props = {
  user: AppUser;
  progress: AppProgress;
  onSaveUsername: (nextName: string) => Promise<{ success: boolean; message?: string }>;
  onLogout: () => void;
};

function getDurationMinutes(value: DailyListeningSurvey['duration']) {
  switch (value) {
    case '< 30 min':
      return 15;
    case '30–60 min':
      return 45;
    case '1–2 hours':
      return 90;
    case '2–4 hours':
      return 180;
    case '4+ hours':
      return 300;
  }
}

function getVolumeScore(value: DailyListeningSurvey['volume']) {
  switch (value) {
    case 'Low':
      return 1;
    case 'Medium':
      return 2;
    case 'Loud':
      return 3;
    case 'Very loud':
      return 4;
  }
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: '#0f0f1e',
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#2d3b30',
      }}
    >
      <Text
        style={{
          color: '#7b927f',
          fontSize: 12,
          fontWeight: '800',
          letterSpacing: 0.6,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: '#ffffff',
          fontSize: 24,
          fontWeight: '900',
          marginBottom: subtitle ? 6 : 0,
        }}
      >
        {value}
      </Text>

      {!!subtitle && (
        <Text
          style={{
            color: '#8aa18f',
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

export default function SettingsScreen({
  user,
  progress,
  onSaveUsername,
  onLogout,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user.username);
  const [error, setError] = useState('');

  const weeklyRecap = useMemo(() => {
    const surveys = Object.values(progress.dailySurveys)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);

    const daysCheckedIn = surveys.length;
    const totalMinutes = surveys.reduce(
      (sum, survey) => sum + getDurationMinutes(survey.duration),
      0
    );

    const avgVolumeScore =
      daysCheckedIn > 0
        ? surveys.reduce((sum, survey) => sum + getVolumeScore(survey.volume), 0) /
          daysCheckedIn
        : 0;

    let avgVolumeLabel = 'No data';
    if (avgVolumeScore > 0 && avgVolumeScore < 1.75) avgVolumeLabel = 'Mostly Low';
    else if (avgVolumeScore < 2.5) avgVolumeLabel = 'Mostly Medium';
    else if (avgVolumeScore < 3.5) avgVolumeLabel = 'Mostly Loud';
    else if (avgVolumeScore >= 3.5) avgVolumeLabel = 'Very Loud Trend';

    const environmentCounts: Record<string, number> = {};
    surveys.forEach((survey) => {
      environmentCounts[survey.environment] =
        (environmentCounts[survey.environment] || 0) + 1;
    });

    const topEnvironment =
      Object.entries(environmentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No data';

    const discomfortDays = surveys.filter((survey) => survey.discomfort !== 'None').length;

    const totalHoursLabel =
      totalMinutes >= 60
        ? `${(totalMinutes / 60).toFixed(1)} hrs`
        : `${totalMinutes} min`;

    return {
      daysCheckedIn,
      totalHoursLabel,
      avgVolumeLabel,
      topEnvironment,
      discomfortDays,
    };
  }, [progress.dailySurveys]);

  return (
    <View style={{ paddingHorizontal: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
        <Ionicons
          name="person-circle-outline"
          size={42}
          color="#ffffff"
          style={{ marginRight: 8 }}
        />
        <Text
          style={{
            fontSize: 40,
            fontWeight: '900',
            color: '#ffffff',
          }}
        >
          Profile
        </Text>
      </View>

      <View
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
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
          <Ionicons name="person-outline" size={42} color="#8aa18f" />
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: '900',
            color: '#fff',
            marginBottom: 10,
          }}
        >
          {editing ? 'Edit Username' : user.username}
        </Text>

        {!editing ? (
          <>
            <Text style={{ color: '#666', marginBottom: 6, fontWeight: '600' }}>
              user@earhealth.com
            </Text>
            <Text style={{ color: '#666', marginBottom: 6, fontWeight: '600' }}>
              Mode: {user.mode === 'pro' ? 'Pro' : 'Basic'}
            </Text>
            {user.redeemedCode ? (
              <Text style={{ color: '#666', marginBottom: 18, fontWeight: '600' }}>
                Kit code redeemed: {user.redeemedCode}
              </Text>
            ) : (
              <Text style={{ color: '#666', marginBottom: 18, fontWeight: '600' }}>
                No kit code redeemed
              </Text>
            )}

            <TouchableOpacity
              onPress={() => {
                setEditing(true);
                setError('');
              }}
              style={{
                backgroundColor: '#00ff00',
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontWeight: '900',
                  fontSize: 14,
                }}
              >
                ✏️ EDIT USERNAME
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onLogout}
              style={{
                backgroundColor: '#2f1a1a',
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ff5a5a',
              }}
            >
              <Text
                style={{
                  color: '#ff8d8d',
                  fontWeight: '900',
                  fontSize: 14,
                }}
              >
                🚪 LOG OUT
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              value={draftName}
              onChangeText={(text) => {
                setDraftName(text);
                setError('');
              }}
              placeholder="Enter your username"
              placeholderTextColor="#55705b"
              style={{
                backgroundColor: '#0f0f1e',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#2d3b30',
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
                paddingHorizontal: 14,
                paddingVertical: 14,
                marginBottom: 12,
              }}
            />

            {!!error && (
              <Text
                style={{
                  color: '#ff7c7c',
                  fontSize: 13,
                  marginBottom: 14,
                  fontWeight: '600',
                }}
              >
                {error}
              </Text>
            )}

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  setEditing(false);
                  setDraftName(user.username);
                  setError('');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#2a2f2d',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginRight: 6,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  const trimmed = draftName.trim();

                  if (!trimmed) {
                    setError('Please enter a username.');
                    return;
                  }

                  const result = await onSaveUsername(trimmed);

                  if (!result.success) {
                    setError(result.message || 'Could not save username.');
                    return;
                  }

                  setEditing(false);
                  setError('');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#00ff00',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginLeft: 6,
                }}
              >
                <Text style={{ color: '#000', fontWeight: '900' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {user.mode === 'pro' && (
        <View
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1.5,
            borderColor: '#2b4330',
          }}
        >
          <Text
            style={{
              color: '#00ff00',
              fontSize: 13,
              fontWeight: '900',
              letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            WEEKLY LISTENING RECAP
          </Text>

          <StatCard
            title="TOTAL ESTIMATED LISTENING"
            value={weeklyRecap.totalHoursLabel}
            subtitle="Based on your last 7 daily check-ins"
          />

          <StatCard
            title="AVERAGE VOLUME HABIT"
            value={weeklyRecap.avgVolumeLabel}
          />

          <StatCard
            title="TOP LISTENING ENVIRONMENT"
            value={weeklyRecap.topEnvironment}
          />

          <StatCard
            title="CHECK-IN DAYS"
            value={`${weeklyRecap.daysCheckedIn}/7`}
            subtitle="How many days you completed the listening survey this week"
          />

          <StatCard
            title="EAR DISCOMFORT DAYS"
            value={`${weeklyRecap.discomfortDays}`}
            subtitle="Days where you reported slight, moderate, or severe discomfort"
          />
        </View>
      )}
    </View>
  );
}
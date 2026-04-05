import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppProgress, AppUser } from '../../store/appStore';

type Props = {
  user: AppUser;
  progress: AppProgress;
  onSaveUsername: (nextName: string) => Promise<{ success: boolean; message?: string }>;
  onLogout: () => void;
};

// ─── Single stat tile ─────────────────────────────────────────────────────────

function StatTile({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#161d18',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1.5,
        borderColor: accent ? '#00ff00' : '#2b4330',
        margin: 4,
      }}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={accent ? '#00ff00' : '#8aa18f'}
        style={{ marginBottom: 10 }}
      />
      <Text
        style={{
          color: accent ? '#00ff00' : '#ffffff',
          fontSize: 26,
          fontWeight: '900',
          lineHeight: 30,
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text style={{ color: '#8aa18f', fontSize: 12, fontWeight: '700' }}>{label}</Text>
      {!!sub && (
        <Text style={{ color: '#555', fontSize: 11, marginTop: 3, fontWeight: '600' }}>
          {sub}
        </Text>
      )}
    </View>
  );
}

// ─── Hearing score trend bar ──────────────────────────────────────────────────

function HearingTrendBar({ history }: { history: AppProgress['hearingHistory'] }) {
  if (history.length === 0) return null;

  const recent = history.slice(-6); // last 6 entries
  const max = 100;

  return (
    <View
      style={{
        backgroundColor: '#161d18',
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#2b4330',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 15 }}>
          Hearing Score Trend
        </Text>
        <Text style={{ color: '#8aa18f', fontSize: 12 }}>
          {history.length} test{history.length !== 1 ? 's' : ''} total
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: 60,
        }}
      >
        {recent.map((entry, i) => {
          const heightPct = (entry.score / max) * 100;
          const isLatest = i === recent.length - 1;
          return (
            <View key={i} style={{ alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  width: 28,
                  height: Math.max(4, (heightPct / 100) * 56),
                  backgroundColor: isLatest ? '#00ff00' : '#2b4330',
                  borderRadius: 4,
                  marginBottom: 6,
                  borderWidth: isLatest ? 0 : 1,
                  borderColor: '#3a4a3a',
                }}
              />
              <Text style={{ color: '#555', fontSize: 9, fontWeight: '700' }}>
                {entry.date.slice(5)}
              </Text>
            </View>
          );
        })}
      </View>

      {history.length >= 2 && (() => {
        const latest = history[history.length - 1].score;
        const prev = history[history.length - 2].score;
        const delta = latest - prev;
        return (
          <Text
            style={{
              color: delta > 0 ? '#00ff00' : delta < 0 ? '#ff8d8d' : '#8aa18f',
              fontSize: 12,
              fontWeight: '700',
              marginTop: 10,
            }}
          >
            {delta > 0 ? `↑ +${delta}` : delta < 0 ? `↓ ${delta}` : '→ No change'} vs last test
          </Text>
        );
      })()}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsScreen({ user, progress, onSaveUsername, onLogout }: Props) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user.username);
  const [error, setError] = useState('');

  // Derived stats
  const avgHearingScore =
    (progress.hearingHistory || []).length > 0
      ? Math.round(
          (progress.hearingHistory || []).reduce((sum, e) => sum + e.score, 0) /
            (progress.hearingHistory || []).length
        )
      : null;

  const bestHearingScore =
    (progress.hearingHistory || []).length > 0
      ? Math.max(...(progress.hearingHistory || []).map((e) => e.score))
      : null;

  const quizzesPassed = Object.values(progress.dailyStatus || {}).filter(
    (d) => d.learnQuizDone
  ).length;

  const longestStreak = (() => {
    const dates = Object.entries(progress.dailyStatus || {})
      .filter(([, v]) => v.streakAwarded)
      .map(([k]) => k)
      .sort();
    if (dates.length === 0) return 0;
    let best = 1;
    let current = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        current++;
        best = Math.max(best, current);
      } else {
        current = 1;
      }
    }
    return best;
  })();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <Ionicons
          name="person-circle-outline"
          size={30}
          color="#00ff00"
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff' }}>Profile</Text>
      </View>

      {/* Identity card */}
      <View
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: 20,
          padding: 24,
          marginBottom: 20,
          borderWidth: 2,
          borderColor: '#00ff00',
        }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: 'rgba(0,255,0,0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            borderWidth: 2,
            borderColor: '#00ff00',
          }}
        >
          <Ionicons name="person-outline" size={32} color="#00ff00" />
        </View>

        {!editing ? (
          <>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#ffffff', marginBottom: 4 }}>
              {user.username}
            </Text>
            <Text style={{ color: '#555', fontSize: 13, marginBottom: 20, fontWeight: '600' }}>
              {user.mode === 'pro' ? 'Pro Member' : 'Basic Member'}
            </Text>

            <TouchableOpacity
              onPress={() => { setEditing(true); setError(''); }}
              style={{
                backgroundColor: '#00ff00',
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="create-outline" size={15} color="#000" style={{ marginRight: 8 }} />
              <Text style={{ color: '#000000', fontWeight: '900', fontSize: 13 }}>
                EDIT USERNAME
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
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="log-out-outline" size={15} color="#ff8d8d" style={{ marginRight: 8 }} />
              <Text style={{ color: '#ff8d8d', fontWeight: '900', fontSize: 13 }}>LOG OUT</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              value={draftName}
              onChangeText={(t) => { setDraftName(t); setError(''); }}
              placeholder="Enter username"
              placeholderTextColor="#8aa18f"
              style={{
                backgroundColor: '#0f0f1e',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#2b4330',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '600',
                paddingHorizontal: 14,
                paddingVertical: 14,
                marginBottom: 12,
              }}
            />
            {!!error && (
              <Text style={{ color: '#ff8d8d', fontSize: 13, marginBottom: 12, fontWeight: '600' }}>
                {error}
              </Text>
            )}
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => { setEditing(false); setDraftName(user.username); setError(''); }}
                style={{
                  flex: 1,
                  backgroundColor: '#333',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginRight: 6,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close-outline" size={15} color="#fff" style={{ marginRight: 6 }} />
                <Text style={{ color: '#ffffff', fontWeight: '800' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  const trimmed = draftName.trim();
                  if (!trimmed) { setError('Please enter a username.'); return; }
                  const result = await onSaveUsername(trimmed);
                  if (!result.success) { setError(result.message || 'Could not save.'); return; }
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
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="save-outline" size={15} color="#000" style={{ marginRight: 6 }} />
                <Text style={{ color: '#000000', fontWeight: '900' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Streak stats row */}
      <Text style={{ color: '#8aa18f', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8, marginLeft: 4 }}>
        STREAK
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <StatTile
          icon="flame-outline"
          label="Current Streak"
          value={progress.streak}
          sub="days in a row"
          accent
        />
        <StatTile
          icon="trophy-outline"
          label="Longest Streak"
          value={longestStreak}
          sub="days"
        />
      </View>

      {/* Hearing stats row */}
      <Text style={{ color: '#8aa18f', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8, marginTop: 12, marginLeft: 4 }}>
        HEARING
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <StatTile
          icon="headset-outline"
          label="Tests Taken"
          value={progress.totalHearingTests}
        />
        <StatTile
          icon="stats-chart-outline"
          label="Avg Score"
          value={avgHearingScore !== null ? avgHearingScore : '—'}
          sub="out of 100"
          accent={avgHearingScore !== null && avgHearingScore >= 80}
        />
        <StatTile
          icon="ribbon-outline"
          label="Best Score"
          value={bestHearingScore !== null ? bestHearingScore : '—'}
        />
      </View>

      {/* Hearing trend */}
      {progress.hearingHistory.length > 0 && (
        <View style={{ marginTop: 12 }}>
          <HearingTrendBar history={progress.hearingHistory || []} />
        </View>
      )}

      {/* Activity stats row */}
      <Text style={{ color: '#8aa18f', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8, marginTop: 8, marginLeft: 4 }}>
        ACTIVITY
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <StatTile
          icon="water-outline"
          label="Cleanings"
          value={progress.totalCleanings}
          sub="sessions done"
        />
        <StatTile
          icon="book-outline"
          label="Quizzes Passed"
          value={quizzesPassed}
          sub={`${progress.learnPoints} pts earned`}
          accent={quizzesPassed > 0}
        />
      </View>

      {/* Member since placeholder */}
      <View
        style={{
          backgroundColor: '#161d18',
          borderRadius: 14,
          padding: 16,
          marginTop: 16,
          borderWidth: 1,
          borderColor: '#2b4330',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Ionicons name="information-circle-outline" size={18} color="#555" style={{ marginRight: 12 }} />
        <Text style={{ color: '#555', fontSize: 12, lineHeight: 18, flex: 1, fontWeight: '500' }}>
          Stats update as you complete daily tasks. Streak, hearing history, cleanings, and quiz passes are all tracked automatically.
        </Text>
      </View>
    </ScrollView>
  );
}
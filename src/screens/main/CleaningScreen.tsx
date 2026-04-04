import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CLEANING_CARDS, CLEANING_TIPS } from '../../store/appStore';

// ─── Weekly cadence ring ───────────────────────────────────────────────────────

function WeeklyRing({
  daysSinceLastClean,
  totalCleanings,
}: {
  daysSinceLastClean: number | null;
  totalCleanings: number;
}) {
  const MAX_DAYS = 7;
  const days = daysSinceLastClean ?? null;

  const urgency =
    days === null ? 'new'
    : days >= 7 ? 'overdue'
    : days >= 5 ? 'soon'
    : 'good';

  const ringColor =
    urgency === 'overdue' ? '#ff8d8d'
    : urgency === 'soon' ? '#ccff33'
    : urgency === 'new' ? '#8aa18f'
    : '#00ff00';

  const fillPct =
    days === null ? 0
    : Math.min(days / MAX_DAYS, 1);

  const label =
    urgency === 'new' ? 'First clean'
    : urgency === 'overdue' ? `${days}d — overdue`
    : urgency === 'soon' ? `${days}d — soon`
    : `${days}d ago`;

  const subLabel =
    urgency === 'new' ? `${totalCleanings} total session${totalCleanings !== 1 ? 's' : ''}`
    : urgency === 'overdue' ? 'Clean now'
    : urgency === 'soon' ? 'Clean in the next day or two'
    : 'Good cadence';

  // Animated fill bar (horizontal, simpler than SVG arc on RN)
  const fillAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: fillPct,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [fillPct]);

  const barWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={{
        backgroundColor: '#111827',
        borderRadius: 18,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: urgency === 'overdue' ? '#ff5a5a' : '#1e2d20',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <View>
          <Text style={{ color: '#8aa18f', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 3 }}>
            WEEKLY CADENCE
          </Text>
          <Text style={{ color: ringColor, fontSize: 20, fontWeight: '900' }}>
            {label}
          </Text>
          <Text style={{ color: '#6b7a6e', fontSize: 12, marginTop: 2 }}>
            {subLabel}
          </Text>
        </View>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: `${ringColor}15`,
            borderWidth: 2,
            borderColor: ringColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name={urgency === 'overdue' ? 'alert-outline' : urgency === 'soon' ? 'time-outline' : 'checkmark-outline'}
            size={22}
            color={ringColor}
          />
        </View>
      </View>

      {/* Fill bar */}
      <View style={{ height: 6, backgroundColor: '#1e2d20', borderRadius: 3, overflow: 'hidden' }}>
        <Animated.View
          style={{
            height: '100%',
            width: barWidth,
            backgroundColor: ringColor,
            borderRadius: 3,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
        <Text style={{ color: '#3a4a3a', fontSize: 10 }}>Today</Text>
        <Text style={{ color: '#3a4a3a', fontSize: 10 }}>7 days</Text>
      </View>
    </View>
  );
}

// ─── Rotating tip ─────────────────────────────────────────────────────────────

function RotatingTip({ tipIndex }: { tipIndex: number }) {
  const tip = CLEANING_TIPS[tipIndex % CLEANING_TIPS.length];
  return (
    <View
      style={{
        backgroundColor: '#0d1117',
        borderRadius: 14,
        padding: 14,
        marginBottom: 18,
        borderLeftWidth: 3,
        borderLeftColor: '#2b4330',
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      <Ionicons name="bulb-outline" size={15} color="#8aa18f" style={{ marginRight: 10, marginTop: 1 }} />
      <Text style={{ color: '#8aa18f', fontSize: 12, lineHeight: 19, flex: 1 }}>
        {tip}
      </Text>
    </View>
  );
}

// ─── Step timer ───────────────────────────────────────────────────────────────

function StepTimer({
  seconds,
  onComplete,
}: {
  seconds: number;
  onComplete: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [done, setDone] = useState(false);
  const fillAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Animate bar from full to empty over `seconds`
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: seconds * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          setDone(true);
          onComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const barWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={{
        backgroundColor: '#111827',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: done ? '#00ff00' : '#2b4330',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ color: done ? '#00ff00' : '#8aa18f', fontWeight: '800', fontSize: 13 }}>
          {done ? '✓ DONE' : 'KEEP GOING'}
        </Text>
        <Text style={{ color: done ? '#00ff00' : '#ffffff', fontWeight: '900', fontSize: 18 }}>
          {remaining}s
        </Text>
      </View>
      <View style={{ height: 8, backgroundColor: '#1e2d20', borderRadius: 4, overflow: 'hidden' }}>
        <Animated.View
          style={{
            height: '100%',
            width: barWidth,
            backgroundColor: done ? '#00ff00' : '#ccff33',
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
}

// ─── Sound rating picker ───────────────────────────────────────────────────────

function SoundRatingPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  const labels = ['Poor', 'Fair', 'Okay', 'Good', 'Great'];
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: '#8aa18f', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 12 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[1, 2, 3, 4, 5].map((v) => {
          const selected = value === v;
          return (
            <TouchableOpacity
              key={v}
              onPress={() => onChange(v)}
              style={{
                flex: 1,
                marginHorizontal: 3,
                backgroundColor: selected ? '#00ff00' : '#111827',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: selected ? '#00ff00' : '#1e2d20',
              }}
            >
              <Text style={{ color: selected ? '#000' : '#555', fontSize: 16, fontWeight: '900' }}>
                {v}
              </Text>
              <Text style={{ color: selected ? '#000' : '#3a4a3a', fontSize: 9, fontWeight: '700', marginTop: 3 }}>
                {labels[v - 1].toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Screen = 'home' | 'before' | 'guide' | 'after';

type Props = {
  cleaningStep: number;
  cleaningFade: Animated.Value;
  nextCleaningStep: () => void;
  prevCleaningStep: () => void;
  restartCleaning: () => void;
  onFinishCleaning: (beforeRating: number, afterRating: number) => void;
  totalCleanings: number;
  daysSinceLastClean: number | null;
};

export default function CleaningScreen({
  cleaningStep,
  cleaningFade,
  nextCleaningStep,
  prevCleaningStep,
  restartCleaning,
  onFinishCleaning,
  totalCleanings,
  daysSinceLastClean,
}: Props) {
  const [screen, setScreen] = useState<Screen>('home');
  const [beforeRating, setBeforeRating] = useState<number | null>(null);
  const [afterRating, setAfterRating] = useState<number | null>(null);
  const [timerDone, setTimerDone] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // remount timer when step changes

  const currentCard = CLEANING_CARDS[cleaningStep];
  const isLastCard = cleaningStep === CLEANING_CARDS.length - 1;
  const cleaningProgress = ((cleaningStep + 1) / CLEANING_CARDS.length) * 100;
  const tipIndex = totalCleanings; // rotates each session

  // Reset timer state when step changes
  const goNext = () => {
    setTimerDone(false);
    setTimerKey((k) => k + 1);
    nextCleaningStep();
  };

  const goPrev = () => {
    setTimerDone(false);
    setTimerKey((k) => k + 1);
    prevCleaningStep();
  };

  const handleStartCleaning = () => {
    restartCleaning();
    setTimerDone(false);
    setTimerKey((k) => k + 1);
    setScreen('guide');
  };

  const handleFinish = () => {
    setScreen('after');
  };

  const handleSubmitAfter = () => {
    onFinishCleaning(beforeRating ?? 3, afterRating ?? 3);
    // Reset for next session
    setScreen('home');
    setBeforeRating(null);
    setAfterRating(null);
    restartCleaning();
  };

  // ── Home screen ──
  if (screen === 'home') {
    return (
      <View style={{ paddingHorizontal: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <MaterialCommunityIcons name="spray-bottle" size={30} color="#00ff00" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff' }}>Clean</Text>
        </View>
        <Text style={{ fontSize: 13, color: '#6b7a6e', marginBottom: 22, fontWeight: '600' }}>
          Weekly earbud hygiene. Takes about 2 minutes.
        </Text>

        <WeeklyRing daysSinceLastClean={daysSinceLastClean} totalCleanings={totalCleanings} />

        <RotatingTip tipIndex={tipIndex} />

        <TouchableOpacity
          onPress={() => setScreen('before')}
          style={{
            backgroundColor: '#00ff00',
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#000000', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 }}>
            Start Cleaning Session
          </Text>
        </TouchableOpacity>

        {totalCleanings > 0 && (
          <Text style={{ color: '#3a4a3a', fontSize: 12, textAlign: 'center', fontWeight: '600' }}>
            {totalCleanings} session{totalCleanings !== 1 ? 's' : ''} completed total
          </Text>
        )}
      </View>
    );
  }

  // ── Before rating ──
  if (screen === 'before') {
    return (
      <View style={{ paddingHorizontal: 18 }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: '#ffffff', marginBottom: 8 }}>
          Before you start
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7a6e', lineHeight: 22, marginBottom: 28 }}>
          How does your audio sound right now? Rate it honestly — we track this over time to show whether cleaning makes a difference.
        </Text>

        <View
          style={{
            backgroundColor: '#111827',
            borderRadius: 18,
            padding: 20,
            borderWidth: 1,
            borderColor: '#1e2d20',
            marginBottom: 24,
          }}
        >
          <SoundRatingPicker
            label="CURRENT SOUND CLARITY"
            value={beforeRating}
            onChange={setBeforeRating}
          />
        </View>

        <TouchableOpacity
          onPress={handleStartCleaning}
          disabled={beforeRating === null}
          style={{
            backgroundColor: beforeRating !== null ? '#00ff00' : '#1a1a2e',
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: beforeRating !== null ? '#00ff00' : '#2b4330',
          }}
        >
          <Text
            style={{
              color: beforeRating !== null ? '#000' : '#555',
              fontWeight: '900',
              fontSize: 15,
            }}
          >
            {beforeRating !== null ? 'Begin Cleaning →' : 'Select a rating to continue'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Guide ──
  if (screen === 'guide') {
    const hasTimer = !!currentCard.timerSeconds && cleaningStep > 0;
    const nextBlocked = hasTimer && !timerDone && !isLastCard;

    return (
      <View style={{ paddingHorizontal: 18 }}>
        {/* Progress bar */}
        <View
          style={{
            backgroundColor: '#111827',
            borderRadius: 14,
            padding: 14,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#1e2d20',
          }}
        >
          <Text style={{ color: '#6b7a6e', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 }}>
            STEP {cleaningStep + 1} / {CLEANING_CARDS.length}
          </Text>
          <View style={{ height: 8, backgroundColor: '#1e2d20', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ width: `${cleaningProgress}%`, height: '100%', backgroundColor: '#00ff00', borderRadius: 4 }} />
          </View>
        </View>

        {/* Card */}
        <Animated.View
          style={{
            opacity: cleaningFade,
            backgroundColor: '#111827',
            borderRadius: 22,
            padding: 22,
            borderWidth: 1.5,
            borderColor: '#1e2d20',
            marginBottom: 16,
            minHeight: 200,
          }}
        >
          <Text style={{ color: '#00ff00', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 10 }}>
            CLEANING GUIDE
          </Text>
          <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '900', lineHeight: 32, marginBottom: 12 }}>
            {currentCard.title}
          </Text>
          <Text style={{ color: '#cccccc', fontSize: 14, lineHeight: 22 }}>
            {currentCard.body}
          </Text>
        </Animated.View>

        {/* Timer — only on steps with timerSeconds and after step 0 */}
        {hasTimer && (
          <StepTimer
            key={timerKey}
            seconds={currentCard.timerSeconds!}
            onComplete={() => setTimerDone(true)}
          />
        )}

        {/* Navigation */}
        {cleaningStep === 0 ? (
          <TouchableOpacity
            onPress={goNext}
            style={{
              backgroundColor: '#00ff00',
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#000', fontWeight: '900', fontSize: 15 }}>
              {currentCard.cta || 'Begin'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={goPrev}
              style={{
                flex: 1,
                backgroundColor: '#1a1a2e',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginRight: 6,
                borderWidth: 1,
                borderColor: '#1e2d20',
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 14 }}>Back</Text>
            </TouchableOpacity>

            {!isLastCard ? (
              <TouchableOpacity
                onPress={goNext}
                disabled={nextBlocked}
                style={{
                  flex: 1,
                  backgroundColor: nextBlocked ? '#1a1a2e' : '#00ff00',
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  marginLeft: 6,
                  borderWidth: 1,
                  borderColor: nextBlocked ? '#2b4330' : '#00ff00',
                }}
              >
                <Text style={{ color: nextBlocked ? '#555' : '#000', fontWeight: '900', fontSize: 14 }}>
                  {nextBlocked ? `Wait…` : 'Next →'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleFinish}
                style={{
                  flex: 1,
                  backgroundColor: '#00ff00',
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  marginLeft: 6,
                }}
              >
                <Text style={{ color: '#000', fontWeight: '900', fontSize: 14 }}>
                  {currentCard.cta || 'Finish'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }

  // ── After rating ──
  if (screen === 'after') {
    const delta =
      beforeRating !== null && afterRating !== null ? afterRating - beforeRating : null;

    return (
      <View style={{ paddingHorizontal: 18 }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: '#ffffff', marginBottom: 8 }}>
          Nice work.
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7a6e', lineHeight: 22, marginBottom: 28 }}>
          How does your audio sound now? Your before/after data builds up over time so you can see whether cleaning actually improves your sound.
        </Text>

        {/* Before summary */}
        <View
          style={{
            backgroundColor: '#111827',
            borderRadius: 18,
            padding: 20,
            borderWidth: 1,
            borderColor: '#1e2d20',
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: '#6b7a6e', fontSize: 12, fontWeight: '700' }}>BEFORE</Text>
            <Text style={{ color: '#8aa18f', fontSize: 20, fontWeight: '900' }}>{beforeRating}/5</Text>
          </View>
          <SoundRatingPicker
            label="SOUND CLARITY NOW"
            value={afterRating}
            onChange={setAfterRating}
          />
        </View>

        {/* Delta preview */}
        {delta !== null && (
          <View
            style={{
              backgroundColor: delta > 0 ? 'rgba(0,255,0,0.06)' : delta < 0 ? 'rgba(255,90,90,0.06)' : '#111827',
              borderRadius: 14,
              padding: 14,
              marginBottom: 20,
              borderLeftWidth: 3,
              borderLeftColor: delta > 0 ? '#00ff00' : delta < 0 ? '#ff5a5a' : '#2b4330',
            }}
          >
            <Text style={{ color: delta > 0 ? '#00ff00' : delta < 0 ? '#ff8d8d' : '#8aa18f', fontSize: 13, fontWeight: '700' }}>
              {delta > 0
                ? `↑ +${delta} — cleaning made a difference.`
                : delta < 0
                ? `↓ ${delta} — sometimes it takes a few sessions to notice improvement.`
                : '→ No change — consistent cleaning prevents gradual degradation.'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSubmitAfter}
          disabled={afterRating === null}
          style={{
            backgroundColor: afterRating !== null ? '#00ff00' : '#1a1a2e',
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: afterRating !== null ? '#00ff00' : '#2b4330',
          }}
        >
          <Text style={{ color: afterRating !== null ? '#000' : '#555', fontWeight: '900', fontSize: 15 }}>
            {afterRating !== null ? 'Save & Finish' : 'Rate your sound to finish'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

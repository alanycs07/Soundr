import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyArticle } from '../../store/appStore';
import { getDailyArticle, regenerateDailyArticle } from '../../utils/generateArticle';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  '#00ff00', '#ccff33', '#ffffff', '#00cc44',
  '#aaff00', '#66ff66', '#00ffaa',
];

function ConfettiParticle({ delay }: { delay: number }) {
  const x = useRef(new Animated.Value(Math.random() * SCREEN_W)).current;
  const y = useRef(new Animated.Value(-20)).current;
  const rot = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  const size = 8 + Math.random() * 8;
  const isRect = Math.random() > 0.5;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(y, {
          toValue: SCREEN_H + 40,
          duration: 2200 + Math.random() * 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rot, {
          toValue: 6,
          duration: 2200 + Math.random() * 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(1600),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const rotate = rot.interpolate({
    inputRange: [0, 6],
    outputRange: ['0deg', `${360 * (Math.random() > 0.5 ? 1 : -1) * 3}deg`],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        opacity,
        transform: [{ translateY: y }, { rotate }],
        width: isRect ? size * 0.6 : size,
        height: size,
        borderRadius: isRect ? 2 : size / 2,
        backgroundColor: color,
      }}
    />
  );
}

function Confetti() {
  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      // @ts-ignore
      pointerEvents="none"
    >
      {Array.from({ length: 60 }).map((_, i) => (
        <ConfettiParticle key={i} delay={i * 40} />
      ))}
    </View>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingView() {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ paddingTop: 20 }}>
      {/* Shimmer title block */}
      <Animated.View
        style={{
          height: 14,
          width: 90,
          backgroundColor: '#2b4330',
          borderRadius: 6,
          marginBottom: 20,
          opacity: pulse,
        }}
      />
      <Animated.View
        style={{
          height: 32,
          width: '90%',
          backgroundColor: '#2b4330',
          borderRadius: 8,
          marginBottom: 10,
          opacity: pulse,
        }}
      />
      <Animated.View
        style={{
          height: 32,
          width: '70%',
          backgroundColor: '#2b4330',
          borderRadius: 8,
          marginBottom: 24,
          opacity: pulse,
        }}
      />
      <Animated.View
        style={{
          height: 18,
          width: '100%',
          backgroundColor: '#1a1a2e',
          borderRadius: 6,
          marginBottom: 10,
          opacity: pulse,
        }}
      />
      <Animated.View
        style={{
          height: 18,
          width: '95%',
          backgroundColor: '#1a1a2e',
          borderRadius: 6,
          marginBottom: 10,
          opacity: pulse,
        }}
      />
      <Animated.View
        style={{
          height: 18,
          width: '80%',
          backgroundColor: '#1a1a2e',
          borderRadius: 6,
          marginBottom: 28,
          opacity: pulse,
        }}
      />

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <ActivityIndicator color="#00ff00" size="small" style={{ marginBottom: 12 }} />
        <Text style={{ color: '#8aa18f', fontSize: 13, fontWeight: '600' }}>
          Searching for today's study...
        </Text>
      </View>
    </View>
  );
}

// ─── Error view ───────────────────────────────────────────────────────────────

function ErrorView({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void;
  isRetrying: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2b4330',
        marginTop: 16,
      }}
    >
      <Ionicons name="cloud-offline-outline" size={36} color="#555" style={{ marginBottom: 12 }} />
      <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 16, marginBottom: 8 }}>
        Couldn't load today's article
      </Text>
      <Text
        style={{
          color: '#8aa18f',
          fontSize: 13,
          textAlign: 'center',
          lineHeight: 20,
          marginBottom: 20,
        }}
      >
        Check that your API key is set in{' '}
        <Text style={{ color: '#cccc55', fontFamily: 'monospace' }}>
          utils/generateArticle.ts
        </Text>
        {'\n'}and that you have an internet connection.
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        style={{
          backgroundColor: '#00ff00',
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 28,
          opacity: isRetrying ? 0.6 : 1,
        }}
        disabled={isRetrying}
      >
        {isRetrying ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={{ color: '#000000', fontWeight: '900', fontSize: 14 }}>
            Try Again
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Article view ─────────────────────────────────────────────────────────────

function ArticleView({
  article,
  articleSource,
  onStartQuiz,
  quizDoneToday,
  learnPoints,
  onRegenerate,
  isRegenerating,
}: {
  article: DailyArticle;
  articleSource: 'generated' | 'cached' | 'fallback';
  onStartQuiz: () => void;
  quizDoneToday: boolean;
  learnPoints: number;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  return (
    <>
      {/* Source badge */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: 'rgba(0,255,0,0.12)',
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: '#00ff00',
              marginRight: 12,
            }}
          >
            <Text
              style={{ color: '#00ff00', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 }}
            >
              {article.tag}
            </Text>
          </View>
          <Text style={{ color: '#555', fontSize: 12, fontWeight: '600' }}>
            {article.readTime}
          </Text>
        </View>

        {/* AI badge + refresh */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor:
                articleSource === 'fallback' ? '#1a1a2e' : 'rgba(0,255,0,0.08)',
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderWidth: 1,
              borderColor: articleSource === 'fallback' ? '#333' : '#2b4330',
              marginRight: 8,
            }}
          >
            <Text
              style={{
                color: articleSource === 'fallback' ? '#555' : '#8aa18f',
                fontSize: 9,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}
            >
              {articleSource === 'generated'
                ? '✦ AI GENERATED'
                : articleSource === 'cached'
                ? '✦ AI · CACHED'
                : 'OFFLINE MODE'}
            </Text>
          </View>

          {!quizDoneToday && (
            <TouchableOpacity onPress={onRegenerate} disabled={isRegenerating}>
              {isRegenerating ? (
                <ActivityIndicator color="#555" size="small" />
              ) : (
                <Ionicons name="refresh-outline" size={16} color="#555" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: '900',
          color: '#ffffff',
          lineHeight: 34,
          marginBottom: 12,
        }}
      >
        {article.title}
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: 15,
          color: '#8aa18f',
          lineHeight: 24,
          marginBottom: 24,
          fontStyle: 'italic',
        }}
      >
        {article.subtitle}
      </Text>

      <View style={{ height: 1, backgroundColor: '#2b4330', marginBottom: 24 }} />

      {/* Body */}
      {article.body.map((para, i) => (
        <Text
          key={i}
          style={{ fontSize: 15, color: '#dddddd', lineHeight: 26, marginBottom: 18 }}
        >
          {para}
        </Text>
      ))}

      {/* Source */}
      <View
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: 10,
          padding: 14,
          marginBottom: 28,
          borderLeftWidth: 3,
          borderLeftColor: '#2b4330',
        }}
      >
        <Text
          style={{
            color: '#555',
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.5,
            marginBottom: 4,
          }}
        >
          SOURCE
        </Text>
        <Text style={{ color: '#8aa18f', fontSize: 12, lineHeight: 18 }}>
          {article.source}
        </Text>
      </View>

      {/* Quiz CTA */}
      {quizDoneToday ? (
        <View
          style={{
            backgroundColor: '#161d18',
            borderRadius: 16,
            padding: 20,
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#2b4330',
            marginBottom: 20,
          }}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={32}
            color="#00ff00"
            style={{ marginBottom: 8 }}
          />
          <Text style={{ color: '#00ff00', fontWeight: '900', fontSize: 16, marginBottom: 4 }}>
            Quiz Complete
          </Text>
          <Text
            style={{ color: '#8aa18f', fontSize: 13, textAlign: 'center', lineHeight: 20 }}
          >
            You passed today's quiz.{'\n'}Total points: {learnPoints} 🏆
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onStartQuiz}
          style={{
            backgroundColor: '#00ff00',
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
            marginBottom: 20,
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
            Take the Quiz →
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

// ─── Quiz view ────────────────────────────────────────────────────────────────

type AnswerState = 'unanswered' | 'correct' | 'wrong';

function QuizView({
  questions,
  onComplete,
}: {
  questions: DailyArticle['quiz'];
  onComplete: (passed: boolean, score: number) => void;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [correctCount, setCorrectCount] = useState(0);
  // Ref mirrors correctCount so handleNext always reads the synchronous value,
  // avoiding the stale-state bug where the last answer's increment hasn't flushed.
  const correctCountRef = useRef(0);

  const current = questions[qIndex];
  const isLast = qIndex === questions.length - 1;

  const handleSelect = (i: number) => {
    if (answerState !== 'unanswered') return;
    setSelected(i);
    const correct = i === current.correctIndex;
    setAnswerState(correct ? 'correct' : 'wrong');
    if (correct) {
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);
    }
  };

  const handleNext = () => {
    if (isLast) {
      // Use the ref — always reflects the true count including the last answer
      const pct = Math.round((correctCountRef.current / questions.length) * 100);
      onComplete(pct >= 75, pct);
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setAnswerState('unanswered');
    }
  };

  const optionBg = (i: number) => {
    if (answerState === 'unanswered') return '#1a1a2e';
    if (i === current.correctIndex) return '#123524';
    if (i === selected && answerState === 'wrong') return '#2f1a1a';
    return '#1a1a2e';
  };

  const optionBorder = (i: number) => {
    if (answerState === 'unanswered') return '#2b4330';
    if (i === current.correctIndex) return '#00ff00';
    if (i === selected && answerState === 'wrong') return '#ff5a5a';
    return '#2b4330';
  };

  const optionTextColor = (i: number) => {
    if (answerState === 'unanswered') return '#ffffff';
    if (i === current.correctIndex) return '#00ff00';
    if (i === selected && answerState === 'wrong') return '#ff8d8d';
    return '#555';
  };

  const letterBg = (i: number) => {
    if (answerState === 'unanswered') return '#2b4330';
    if (i === current.correctIndex) return '#00ff00';
    if (i === selected && answerState === 'wrong') return '#ff5a5a';
    return '#2b4330';
  };

  return (
    <View>
      <Text
        style={{
          color: '#8aa18f',
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 0.5,
          marginBottom: 10,
        }}
      >
        QUESTION {qIndex + 1} OF {questions.length}
      </Text>
      <View
        style={{ height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}
      >
        <View
          style={{
            width: `${((qIndex + 1) / questions.length) * 100}%`,
            height: '100%',
            backgroundColor: '#00ff00',
          }}
        />
      </View>

      <View
        style={{
          backgroundColor: '#161d18',
          borderRadius: 20,
          padding: 22,
          marginBottom: 16,
          borderWidth: 1.5,
          borderColor: '#2b4330',
        }}
      >
        <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '800', lineHeight: 28 }}>
          {current.question}
        </Text>
      </View>

      {current.options.map((option, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => handleSelect(i)}
          style={{
            backgroundColor: optionBg(i),
            borderRadius: 14,
            padding: 16,
            marginBottom: 10,
            borderWidth: 1.5,
            borderColor: optionBorder(i),
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: letterBg(i),
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 14,
            }}
          >
            <Text
              style={{
                color:
                  answerState !== 'unanswered' &&
                  (i === current.correctIndex || (i === selected && answerState === 'wrong'))
                    ? '#000'
                    : '#888',
                fontWeight: '900',
                fontSize: 12,
              }}
            >
              {String.fromCharCode(65 + i)}
            </Text>
          </View>
          <Text
            style={{
              color: optionTextColor(i),
              fontSize: 14,
              fontWeight: '600',
              flex: 1,
              lineHeight: 21,
            }}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      {answerState !== 'unanswered' && (
        <>
          <View
            style={{
              backgroundColor:
                answerState === 'correct' ? 'rgba(0,255,0,0.06)' : 'rgba(255,90,90,0.06)',
              borderRadius: 14,
              padding: 16,
              marginTop: 4,
              marginBottom: 16,
              borderLeftWidth: 3,
              borderLeftColor: answerState === 'correct' ? '#00ff00' : '#ff5a5a',
            }}
          >
            <Text
              style={{
                color: answerState === 'correct' ? '#00ff00' : '#ff8d8d',
                fontWeight: '900',
                fontSize: 12,
                marginBottom: 6,
                letterSpacing: 0.5,
              }}
            >
              {answerState === 'correct' ? '✓ CORRECT' : '✗ INCORRECT'}
            </Text>
            <Text style={{ color: '#cccccc', fontSize: 13, lineHeight: 20 }}>
              {current.explanation}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: '#00ff00',
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ color: '#000', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 }}>
              {isLast ? 'See Results' : 'Next Question →'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ─── Results view ─────────────────────────────────────────────────────────────

function ResultsView({
  score,
  passed,
  learnPoints,
  onReadAgain,
}: {
  score: number;
  passed: boolean;
  learnPoints: number;
  onReadAgain: () => void;
}) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 16 }}>
      <View
        style={{
          backgroundColor: '#161d18',
          borderRadius: 22,
          padding: 32,
          alignItems: 'center',
          borderWidth: 2,
          borderColor: passed ? '#00ff00' : '#2b4330',
          marginBottom: 20,
          width: '100%',
        }}
      >
        <Text style={{ fontSize: 64, marginBottom: 8 }}>{passed ? '🏆' : '📖'}</Text>
        <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 28, marginBottom: 6 }}>
          {score}%
        </Text>
        <Text
          style={{
            color: passed ? '#00ff00' : '#ff8d8d',
            fontWeight: '800',
            fontSize: 16,
            marginBottom: 12,
          }}
        >
          {passed ? 'Quiz Passed!' : 'Not quite — 75% needed'}
        </Text>
        <Text
          style={{ color: '#8aa18f', fontSize: 14, textAlign: 'center', lineHeight: 22 }}
        >
          {passed
            ? `+10 points earned. Total: ${learnPoints} 🏆`
            : 'Re-read the article and try again tomorrow.'}
        </Text>
      </View>

      {!passed && (
        <TouchableOpacity
          onPress={onReadAgain}
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 14,
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderWidth: 1.5,
            borderColor: '#2b4330',
          }}
        >
          <Text style={{ color: '#8aa18f', fontWeight: '700', fontSize: 14 }}>
            Re-read Article
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type Screen = 'article' | 'quiz' | 'results';

type Props = {
  quizDoneToday: boolean;
  learnPoints: number;
  onQuizPass: () => Promise<void>;
};

export default function LearnScreen({ quizDoneToday, learnPoints, onQuizPass }: Props) {
  const [article, setArticle] = useState<DailyArticle | null>(null);
  const [articleSource, setArticleSource] = useState<'generated' | 'cached' | 'fallback'>(
    'fallback'
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [screen, setScreen] = useState<Screen>('article');
  const [quizScore, setQuizScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load article on mount
  useEffect(() => {
    loadArticle();
  }, []);

  const loadArticle = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await getDailyArticle();
      setArticle(result.article);
      setArticleSource(result.source);
    } catch (e) {
      console.warn('[LearnScreen] Failed to load article:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const result = await regenerateDailyArticle();
      setArticle(result.article);
      setArticleSource(result.source);
      setScreen('article');
    } catch (e) {
      console.warn('[LearnScreen] Regeneration failed:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleQuizComplete = async (didPass: boolean, score: number) => {
    setQuizScore(score);
    setPassed(didPass);
    setScreen('results');
    if (didPass) {
      setShowConfetti(true);
      await onQuizPass();
      setTimeout(() => setShowConfetti(false), 3200);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
            marginTop: 4,
          }}
        >
          <Ionicons
            name="book-outline"
            size={30}
            color="#00ff00"
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff' }}>Learn</Text>
        </View>
        <Text
          style={{ fontSize: 13, color: '#888888', marginBottom: 24, fontWeight: '600' }}
        >
          Today's ear health read — a new article every day.
        </Text>

        {/* Points badge */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1a1a2e',
            borderRadius: 12,
            padding: 12,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#2b4330',
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>🏆</Text>
          <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 14 }}>
            {learnPoints} pts
          </Text>
          <Text style={{ color: '#555', fontSize: 13, marginLeft: 6 }}>learn points</Text>
        </View>

        {/* Content states */}
        {loading && <LoadingView />}

        {!loading && error && (
          <ErrorView onRetry={loadArticle} isRetrying={loading} />
        )}

        {!loading && !error && article && screen === 'article' && (
          <ArticleView
            article={article}
            articleSource={articleSource}
            onStartQuiz={() => setScreen('quiz')}
            quizDoneToday={quizDoneToday}
            learnPoints={learnPoints}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
          />
        )}

        {!loading && !error && article && screen === 'quiz' && (
          <QuizView questions={article.quiz} onComplete={handleQuizComplete} />
        )}

        {!loading && !error && screen === 'results' && (
          <ResultsView
            score={quizScore}
            passed={passed}
            learnPoints={learnPoints}
            onReadAgain={() => setScreen('article')}
          />
        )}
      </ScrollView>

      {showConfetti && <Confetti />}
    </View>
  );
}
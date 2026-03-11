import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { CLEANING_CARDS } from '../../store/appStore';

type Props = {
  cleaningStep: number;
  cleaningFade: Animated.Value;
  nextCleaningStep: () => void;
  prevCleaningStep: () => void;
  restartCleaning: () => void;
};

export default function CleaningScreen({
  cleaningStep,
  cleaningFade,
  nextCleaningStep,
  prevCleaningStep,
  restartCleaning,
}: Props) {
  const currentCleaningCard = CLEANING_CARDS[cleaningStep];
  const cleaningProgress = ((cleaningStep + 1) / CLEANING_CARDS.length) * 100;

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
        🧼 Cleaning
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: '#666',
          marginBottom: 22,
          fontWeight: '600',
          lineHeight: 20,
        }}
      >
        Pro feature preview. Later this will unlock for paid Pro users or for kit owners who redeem their unique 6-digit code.
      </Text>

      <View
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: 14,
          padding: 16,
          marginBottom: 18,
          borderWidth: 1,
          borderColor: '#2b4330',
        }}
      >
        <Text
          style={{
            color: '#8aa18f',
            marginBottom: 10,
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: 0.5,
          }}
        >
          STEP {cleaningStep + 1} / {CLEANING_CARDS.length}
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
              width: `${cleaningProgress}%`,
              height: '100%',
              backgroundColor: '#00ff00',
            }}
          />
        </View>
      </View>

      <Animated.View
        style={{
          opacity: cleaningFade,
          backgroundColor: '#161d18',
          borderRadius: 22,
          padding: 22,
          borderWidth: 1.5,
          borderColor: '#2b4330',
          marginBottom: 18,
        }}
      >
        <Text
          style={{
            color: '#00ff00',
            fontSize: 12,
            fontWeight: '800',
            letterSpacing: 1.2,
            marginBottom: 12,
          }}
        >
          CLEANING GUIDE
        </Text>

        <Text
          style={{
            color: '#ffffff',
            fontSize: 28,
            fontWeight: '900',
            lineHeight: 34,
            marginBottom: 14,
          }}
        >
          {currentCleaningCard.title}
        </Text>

        <Text
          style={{
            color: '#cfd8d1',
            fontSize: 15,
            lineHeight: 24,
            marginBottom: 20,
          }}
        >
          {currentCleaningCard.body}
        </Text>

        <View
          style={{
            height: 220,
            borderRadius: 18,
            borderWidth: 2,
            borderColor: '#35503b',
            borderStyle: 'dashed',
            backgroundColor: '#0f0f1e',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 46,
              marginBottom: 10,
            }}
          >
            🎥
          </Text>
          <Text
            style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: '800',
              marginBottom: 6,
              textAlign: 'center',
            }}
          >
            Video placeholder
          </Text>
          <Text
            style={{
              color: '#718378',
              fontSize: 12,
              textAlign: 'center',
              lineHeight: 18,
            }}
          >
            Drop your cleaning-step demo here later
          </Text>
        </View>

        {cleaningStep === 0 ? (
          <TouchableOpacity
            onPress={nextCleaningStep}
            style={{
              backgroundColor: '#00ff00',
              borderRadius: 14,
              paddingVertical: 16,
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
              {currentCleaningCard.cta || 'Begin'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={prevCleaningStep}
              style={{
                flex: 1,
                backgroundColor: '#2a2f2d',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginRight: 6,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: 15,
                }}
              >
                ← Back
              </Text>
            </TouchableOpacity>

            {cleaningStep < CLEANING_CARDS.length - 1 ? (
              <TouchableOpacity
                onPress={nextCleaningStep}
                style={{
                  flex: 1,
                  backgroundColor: '#00ff00',
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  marginLeft: 6,
                }}
              >
                <Text
                  style={{
                    color: '#000',
                    fontWeight: '900',
                    fontSize: 15,
                  }}
                >
                  Next →
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={restartCleaning}
                style={{
                  flex: 1,
                  backgroundColor: '#00ff00',
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  marginLeft: 6,
                }}
              >
                <Text
                  style={{
                    color: '#000',
                    fontWeight: '900',
                    fontSize: 15,
                  }}
                >
                  {currentCleaningCard.cta || 'Restart'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CLEANING_CARDS } from '../../store/appStore';

type Props = {
  cleaningStep: number;
  cleaningFade: Animated.Value;
  nextCleaningStep: () => void;
  prevCleaningStep: () => void;
  restartCleaning: () => void;
  onFinishCleaning: () => void;
  isPro: boolean;
};

export default function CleaningScreen({
  cleaningStep,
  cleaningFade,
  nextCleaningStep,
  prevCleaningStep,
  restartCleaning,
  onFinishCleaning,
  isPro,
}: Props) {
  const currentCleaningCard = CLEANING_CARDS[cleaningStep];
  const cleaningProgress = ((cleaningStep + 1) / CLEANING_CARDS.length) * 100;
  const isLastCard = cleaningStep === CLEANING_CARDS.length - 1;

  return (
    <View style={{ paddingHorizontal: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <MaterialCommunityIcons
          name="spray-bottle"
          size={30}
          color="#00ff00"
          style={{ marginRight: 8 }}
        />
        <Text
          style={{
            fontSize: 40,
            fontWeight: '900',
            color: '#ffffff',
          }}
        >
          Cleaning
        </Text>
      </View>

      <Text
        style={{
          fontSize: 13,
          color: '#888888',
          marginBottom: 22,
          fontWeight: '600',
          lineHeight: 20,
        }}
      >
        Follow the step-by-step cleaning guide. Finish all cards to count today&apos;s cleaning.
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
            backgroundColor: '#333333',
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

      {!isPro && (
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="lock-closed-outline" size={16} color="#8aa18f" />
            <Text
              style={{
                color: '#8aa18f',
                fontWeight: '900',
                fontSize: 13,
                letterSpacing: 0.8,
                marginLeft: 8,
              }}
            >
              PRO VIDEO LOCKED
            </Text>
          </View>

          <Text
            style={{
              color: '#8aa18f',
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            Basic users can still follow the full written cleaning guide. Upgrade to Pro for step-by-step video demonstrations.
          </Text>
        </View>
      )}

      <Animated.View
        style={{
          opacity: cleaningFade,
          backgroundColor: '#161d18',
          borderRadius: 22,
          padding: 22,
          borderWidth: 1.5,
          borderColor: '#2b4330',
          marginBottom: 18,
          minHeight: 280,
          justifyContent: 'space-between',
        }}
      >
        <View>
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
              color: '#ffffff',
              fontSize: 15,
              lineHeight: 24,
              marginBottom: 10,
            }}
          >
            {currentCleaningCard.body}
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
              marginTop: 20,
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
              {currentCleaningCard.cta || 'Begin'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity
              onPress={prevCleaningStep}
              style={{
                flex: 1,
                backgroundColor: '#333333',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginRight: 6,
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: 15,
                }}
              >
                Back
              </Text>
            </TouchableOpacity>

            {!isLastCard ? (
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
                    color: '#000000',
                    fontWeight: '900',
                    fontSize: 15,
                  }}
                >
                  Next
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  onFinishCleaning();
                  restartCleaning();
                }}
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
                    color: '#000000',
                    fontWeight: '900',
                    fontSize: 15,
                  }}
                >
                  {currentCleaningCard.cta || 'Finish'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
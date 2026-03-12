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
          style={{ marginRight: 10 }}
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
          color: '#666',
          marginBottom: 16,
          fontWeight: '600',
          lineHeight: 20,
        }}
      >
        Follow the step-by-step cleaning guide. Finish all cards to count today’s cleaning.
      </Text>

      <View
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: 14,
          padding: 14,
          marginBottom: 18,
          borderWidth: 1,
          borderColor: '#2b4330',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
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

        <View
          style={{
            backgroundColor: isPro ? 'rgba(0,255,0,0.14)' : '#252a28',
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: isPro ? '#00ff00' : '#38413d',
          }}
        >
          <Text
            style={{
              color: isPro ? '#00ff00' : '#9aa5a0',
              fontSize: 11,
              fontWeight: '900',
              letterSpacing: 0.6,
            }}
          >
            {isPro ? 'PRO GUIDE' : 'BASIC GUIDE'}
          </Text>
        </View>
      </View>

      {isPro ? (
        <View
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 16,
            padding: 16,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: '#2b4330',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Ionicons
              name="videocam-outline"
              size={16}
              color="#00ff00"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: '#00ff00',
                fontWeight: '800',
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              PRO VIDEO GUIDE
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#0f0f1e',
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: '#304537',
              borderStyle: 'dashed',
              minHeight: 130,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Ionicons
              name="play-circle-outline"
              size={42}
              color="#00ff00"
              style={{ marginBottom: 10 }}
            />
            <Text
              style={{
                color: '#ffffff',
                fontWeight: '800',
                fontSize: 15,
                marginBottom: 6,
              }}
            >
              Video placeholder
            </Text>
            <Text
              style={{
                color: '#7d8d84',
                textAlign: 'center',
                fontSize: 12,
                lineHeight: 18,
              }}
            >
              Pro users will see the cleaning demonstration video for this step here.
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: 16,
            padding: 14,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: '#2b4330',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons
              name="lock-closed-outline"
              size={15}
              color="#8aa18f"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: '#8aa18f',
                fontWeight: '800',
                fontSize: 12,
                letterSpacing: 0.6,
              }}
            >
              PRO VIDEO LOCKED
            </Text>
          </View>

          <Text
            style={{
              color: '#6f8574',
              fontSize: 12,
              lineHeight: 18,
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons
              name="layers-outline"
              size={16}
              color="#00ff00"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: '#00ff00',
                fontSize: 12,
                fontWeight: '800',
                letterSpacing: 1.2,
              }}
            >
              CLEANING GUIDE
            </Text>
          </View>

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
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="play-circle-outline"
              size={18}
              color="#000"
              style={{ marginRight: 8 }}
            />
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
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity
              onPress={prevCleaningStep}
              style={{
                flex: 1,
                backgroundColor: '#2a2f2d',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginRight: 6,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="arrow-back-outline"
                size={16}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: '#fff',
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
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#000',
                    fontWeight: '900',
                    fontSize: 15,
                  }}
                >
                  Next
                </Text>
                <Ionicons
                  name="arrow-forward-outline"
                  size={16}
                  color="#000"
                  style={{ marginLeft: 6 }}
                />
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
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="#000"
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: '#000',
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
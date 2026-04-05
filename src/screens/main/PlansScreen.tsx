import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlansScreen() {
  return (
    <View style={{ paddingHorizontal: 18 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28 }}>
        <Ionicons name="diamond-outline" size={30} color="#00ff00" style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff' }}>Plans</Text>
      </View>

      {/* Basic card */}
      <View
        style={{
          backgroundColor: '#161d18',
          borderRadius: 22,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1.5,
          borderColor: '#2b4330',
        }}
      >
        <Text style={{ color: '#8aa18f', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 }}>
          CURRENT PLAN
        </Text>
        <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '900', marginBottom: 6 }}>
          Basic — Free
        </Text>
        <Text style={{ color: '#6b7a6e', fontSize: 13, lineHeight: 20, marginBottom: 16 }}>
          Everything in Soundr is free right now. No limits, no paywalls.
        </Text>

        <View style={{ height: 1, backgroundColor: '#2b4330', marginBottom: 16 }} />

        {[
          'Daily streak tracking',
          'Hearing test + history',
          'Arena progress system',
          'Cleaning guide + timed steps',
          'AI-generated daily articles',
          'Learn quiz + points',
          'Full profile stats',
        ].map((feature) => (
          <View key={feature} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#00ff00', fontSize: 14, marginRight: 10, fontWeight: '900' }}>✓</Text>
            <Text style={{ color: '#cccccc', fontSize: 13, lineHeight: 20 }}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Pro coming soon card */}
      <View
        style={{
          backgroundColor: '#111827',
          borderRadius: 22,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1.5,
          borderColor: '#2b4330',
          opacity: 0.85,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '900' }}>Pro</Text>
          <View
            style={{
              backgroundColor: '#1e2d20',
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderWidth: 1,
              borderColor: '#2b4330',
            }}
          >
            <Text style={{ color: '#8aa18f', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 }}>
              COMING SOON
            </Text>
          </View>
        </View>

        <Text style={{ color: '#6b7a6e', fontSize: 13, lineHeight: 20, marginBottom: 16 }}>
          Pro features are still in development. Pricing and subscriptions will be announced when ready.
        </Text>

        <View style={{ height: 1, backgroundColor: '#1e2d20', marginBottom: 16 }} />

        <Text style={{ color: '#555', fontSize: 12, fontWeight: '700', marginBottom: 12 }}>
          PLANNED FEATURES
        </Text>

        {[
          'Hearing history trend analytics',
          'Step-by-step cleaning video guides',
          'Smart weekly cleaning reminders',
          'Advanced frequency breakdowns',
          'Extended arena challenges',
        ].map((feature) => (
          <View key={feature} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#3a4a3a', fontSize: 14, marginRight: 10, fontWeight: '900' }}>○</Text>
            <Text style={{ color: '#555', fontSize: 13, lineHeight: 20 }}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Footer note */}
      <View
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: 14,
          padding: 14,
          borderWidth: 1,
          borderColor: '#2b4330',
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <Ionicons name="information-circle-outline" size={16} color="#555" style={{ marginRight: 10, marginTop: 1 }} />
        <Text style={{ color: '#555', fontSize: 12, lineHeight: 19, flex: 1 }}>
          You currently have access to all Soundr features at no cost. Pro pricing will be announced when the feature set is complete.
        </Text>
      </View>
    </View>
  );
}
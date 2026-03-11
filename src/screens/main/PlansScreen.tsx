import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function PlansScreen() {
  return (
    <View style={{ paddingHorizontal: 18 }}>
      <View style={{ alignItems: 'center', marginBottom: 34 }}>
        <Text
          style={{
            fontSize: 42,
            fontWeight: '900',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: 10,
            lineHeight: 48,
          }}
        >
          Start Soundr for free.
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: '#8aa18f',
            textAlign: 'center',
            lineHeight: 23,
            maxWidth: 320,
            fontWeight: '500',
          }}
        >
          Build your streak, test your hearing, and unlock deeper insights when
          you upgrade.
        </Text>

        <View
          style={{
            marginTop: 20,
            backgroundColor: '#1a1a2e',
            borderRadius: 999,
            padding: 4,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: '#2b4330',
          }}
        >
          <View
            style={{
              backgroundColor: '#00ff00',
              borderRadius: 999,
              paddingVertical: 8,
              paddingHorizontal: 18,
            }}
          >
            <Text
              style={{
                color: '#000',
                fontWeight: '800',
                fontSize: 13,
              }}
            >
              Monthly
            </Text>
          </View>

          <View
            style={{
              borderRadius: 999,
              paddingVertical: 8,
              paddingHorizontal: 18,
            }}
          >
            <Text
              style={{
                color: '#6d7b70',
                fontWeight: '700',
                fontSize: 13,
              }}
            >
              Annually
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: '48%',
            backgroundColor: '#161d18',
            borderRadius: 22,
            padding: 16,
            borderWidth: 1.5,
            borderColor: '#2b4330',
            minHeight: 470,
          }}
        >
          <Text
            style={{
              color: '#dce8df',
              fontSize: 17,
              fontWeight: '800',
              marginBottom: 16,
            }}
          >
            Basic
          </Text>

          <Text
            style={{
              color: '#ffffff',
              fontSize: 40,
              fontWeight: '900',
              lineHeight: 44,
              marginBottom: 16,
            }}
          >
            Free
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              backgroundColor: '#0f0f1e',
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              marginBottom: 16,
              borderWidth: 1,
              borderColor: '#2d3b30',
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontWeight: '800',
                fontSize: 15,
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: '#8aa18f',
              fontSize: 13,
              marginBottom: 16,
              fontWeight: '500',
              lineHeight: 20,
            }}
          >
            Essential features for everyday ear care.
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: '#26362a',
              marginBottom: 16,
            }}
          />

          <Text
            style={{
              color: '#dce8df',
              fontSize: 13,
              fontWeight: '800',
              marginBottom: 12,
            }}
          >
            Includes
          </Text>

          {[
            'Daily streak tracking',
            'Standard hearing test',
            'Arena progress system',
            'Basic account stats',
          ].map((feature, index) => (
            <View
              key={feature}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: index === 3 ? 0 : 10,
              }}
            >
              <Text
                style={{
                  color: '#00ff00',
                  fontSize: 15,
                  marginRight: 8,
                  fontWeight: '900',
                }}
              >
                ✓
              </Text>
              <Text
                style={{
                  color: '#d7e2d9',
                  fontSize: 13,
                  lineHeight: 19,
                  flex: 1,
                }}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            width: '48%',
            backgroundColor: '#161d18',
            borderRadius: 22,
            padding: 16,
            borderWidth: 2,
            borderColor: '#00ff00',
            minHeight: 470,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 17,
                fontWeight: '800',
              }}
            >
              Pro
            </Text>

            <View
              style={{
                backgroundColor: '#00ff00',
                borderRadius: 999,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontSize: 9,
                  fontWeight: '900',
                  letterSpacing: 0.4,
                }}
              >
                POPULAR
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 40,
                fontWeight: '900',
                lineHeight: 44,
              }}
            >
              $5.99
            </Text>
            <Text
              style={{
                color: '#8aa18f',
                fontSize: 15,
                marginLeft: 4,
                marginBottom: 4,
                fontWeight: '600',
              }}
            >
              / month
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              backgroundColor: '#00ff00',
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: '#000',
                fontWeight: '900',
                fontSize: 15,
              }}
            >
              Upgrade to Pro
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: '#8aa18f',
              fontSize: 13,
              marginBottom: 16,
              fontWeight: '500',
              lineHeight: 20,
            }}
          >
            Stronger analytics and a more advanced hearing experience.
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: '#26362a',
              marginBottom: 16,
            }}
          />

          <Text
            style={{
              color: '#dce8df',
              fontSize: 13,
              fontWeight: '800',
              marginBottom: 12,
            }}
          >
            Everything in Basic, plus...
          </Text>

          {[
            'Advanced hearing test ranges',
            'Deeper frequency breakdowns',
            'Expanded score insights',
            'Cleaning guide access',
          ].map((feature, index) => (
            <View
              key={feature}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: index === 3 ? 0 : 10,
              }}
            >
              <Text
                style={{
                  color: '#00ff00',
                  fontSize: 15,
                  marginRight: 8,
                  fontWeight: '900',
                }}
              >
                ✓
              </Text>
              <Text
                style={{
                  color: '#d7e2d9',
                  fontSize: 13,
                  lineHeight: 19,
                  flex: 1,
                }}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Text
        style={{
          color: '#5f7564',
          fontSize: 12,
          textAlign: 'center',
          lineHeight: 18,
          marginBottom: 10,
        }}
      >
        Pricing buttons are visual only right now. Payments and subscriptions
        have not been connected yet.
      </Text>
    </View>
  );
}
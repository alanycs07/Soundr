import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Data ─────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    name: 'Daniel Lei',
    role: 'President & CEO',
    focus: 'Product strategy, financial planning, and head of app development.',
    initials: 'DL',
  },
  {
    name: 'Alan Sun',
    role: 'Vice President',
    focus: 'App development, production technician, and management overseer.',
    initials: 'AS',
  },
  {
    name: 'Steven Yan',
    role: 'VP Production',
    focus: 'Kit manufacturing, supply chain, and quality control.',
    initials: 'SY',
  },
  {
    name: 'Karthik Sinclair',
    role: 'VP Social Media',
    focus: 'Brand identity, content strategy, and audience growth.',
    initials: 'KS',
  },
  {
    name: 'Iana Kim',
    role: 'VP Sales',
    focus: 'Partnerships, school outreach, and revenue operations.',
    initials: 'IK',
  },
];

const SDG_GOALS = [
  {
    number: '03',
    title: 'Good Health & Well-Being',
    body:
      `Soundr promotes preventive ear care through daily hygiene habits, accessible education, and a hearing test that tracks changes over time. We don't replace medical care — we make consistent ear health accessible to everyone.`,
    color: '#4caf7d',
  },
  {
    number: '12',
    title: 'Responsible Consumption',
    body:
      `Our kit uses reusable microfiber, a refillable cleaning solution, and bamboo-based tools — replacing single-use wipes and throwaway accessories. The packaging is recycled cardboard with no plastic inserts.`,
    color: '#f5a623',
  },
];

const FEATURES = [
  {
    icon: 'headset-outline',
    title: 'Hearing Test',
    body: 'Frequency-based hearing assessment with historical trend tracking across 12 tones.',
  },
  {
    icon: 'water-outline',
    title: 'Cleaning Guide',
    body: 'Step-by-step earbud sanitation protocol aligned with manufacturer guidance.',
  },
  {
    icon: 'book-outline',
    title: 'Daily Learn',
    body: `Articles on ear health research, with a quiz that awards points toward your trophy road.`,
  },
  {
    icon: 'flame-outline',
    title: 'Streak System',
    body: 'Complete all three daily tasks to build a streak and advance through 12 arena stages.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        color: '#00ff00',
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 10,
      }}
    >
      {text}
    </Text>
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: '#1e1e2e',
        marginVertical: 36,
      }}
    />
  );
}

function TeamCard({
  member,
  index,
}: {
  member: (typeof TEAM)[0];
  index: number;
}) {
  const accentColors = ['#00ff00', '#ccff33', '#00ffaa', '#66ff66', '#aaff00'];
  const color = accentColors[index % accentColors.length];

  return (
    <View
      style={{
        backgroundColor: '#111827',
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e2d20',
      }}
    >
      {/* Avatar */}
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: `${color}18`,
          borderWidth: 2,
          borderColor: color,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 16,
          flexShrink: 0,
        }}
      >
        <Text
          style={{
            color,
            fontSize: 16,
            fontWeight: '900',
            letterSpacing: -0.5,
          }}
        >
          {member.initials}
        </Text>
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '800',
            marginBottom: 2,
          }}
        >
          {member.name}
        </Text>
        <Text
          style={{
            color,
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.8,
            marginBottom: 6,
          }}
        >
          {member.role.toUpperCase()}
        </Text>
        <Text
          style={{
            color: '#6b7a6e',
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          {member.focus}
        </Text>
      </View>
    </View>
  );
}

function FeatureRow({ feature }: { feature: (typeof FEATURES)[0] }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: 'rgba(0,255,0,0.08)',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 16,
          marginTop: 2,
          flexShrink: 0,
          borderWidth: 1,
          borderColor: '#1e2d20',
        }}
      >
        <Ionicons name={feature.icon as any} size={19} color="#00ff00" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 15,
            fontWeight: '800',
            marginBottom: 4,
          }}
        >
          {feature.title}
        </Text>
        <Text style={{ color: '#6b7a6e', fontSize: 13, lineHeight: 20 }}>
          {feature.body}
        </Text>
      </View>
    </View>
  );
}

function SdgCard({ goal }: { goal: (typeof SDG_GOALS)[0] }) {
  return (
    <View
      style={{
        backgroundColor: '#111827',
        borderRadius: 20,
        padding: 22,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1e2d20',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            backgroundColor: `${goal.color}20`,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginRight: 12,
            borderWidth: 1,
            borderColor: `${goal.color}40`,
          }}
        >
          <Text
            style={{
              color: goal.color,
              fontSize: 12,
              fontWeight: '900',
              letterSpacing: 0.5,
            }}
          >
            SDG {goal.number}
          </Text>
        </View>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '800',
            flex: 1,
          }}
        >
          {goal.title}
        </Text>
      </View>
      <Text style={{ color: '#6b7a6e', fontSize: 13, lineHeight: 21 }}>
        {goal.body}
      </Text>
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AboutScreen() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ── */}
      <View style={{ paddingHorizontal: 22, paddingTop: 20, paddingBottom: 8 }}>
        <SectionLabel text="OUR STORY" />
        <Text
          style={{
            fontSize: 38,
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: 46,
            marginBottom: 16,
          }}
        >
          About{'\n'}Soundr<Text style={{ color: '#00ff00' }}>.</Text>
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: '#6b7a6e',
            lineHeight: 25,
            marginBottom: 8,
          }}
        >
          Soundr is a sustainable earbud hygiene system built by a team of
          students at University Hill Secondary School in Vancouver, BC.
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: '#6b7a6e',
            lineHeight: 25,
          }}
        >
          We combine a physical cleaning kit with AI-powered education and a
          habit-tracking app — making ear health accessible, evidence-based, and
          genuinely worth doing every day.
        </Text>
      </View>

      <Divider />

      {/* ── What it does ── */}
      <View style={{ paddingHorizontal: 22 }}>
        <SectionLabel text="THE PRODUCT" />
        <Text
          style={{
            fontSize: 24,
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: 24,
          }}
        >
          Three daily habits.{'\n'}One complete system.
        </Text>

        {FEATURES.map((f) => (
          <FeatureRow key={f.title} feature={f} />
        ))}
      </View>

      <Divider />

      {/* ── SDG alignment ── */}
      <View style={{ paddingHorizontal: 22 }}>
        <SectionLabel text="SUSTAINABILITY" />
        <Text
          style={{
            fontSize: 24,
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: 6,
          }}
        >
          Aligned with the UN Global Goals
        </Text>
        <Text
          style={{
            color: '#6b7a6e',
            fontSize: 13,
            lineHeight: 20,
            marginBottom: 20,
          }}
        >
          Soundr is built around two United Nations Sustainable Development
          Goals that shape every decision — from materials to the app features.
        </Text>

        {SDG_GOALS.map((g) => (
          <SdgCard key={g.number} goal={g} />
        ))}
      </View>

      <Divider />

      {/* ── Team ── */}
      <View style={{ paddingHorizontal: 22 }}>
        <SectionLabel text="THE TEAM" />
        <Text
          style={{
            fontSize: 24,
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: 6,
          }}
        >
          Built by students,{'\n'}for everyone.
        </Text>
        <Text
          style={{
            color: '#6b7a6e',
            fontSize: 13,
            lineHeight: 20,
            marginBottom: 20,
          }}
        >
          We are a five-person student team from UHill competing in the JABC
          Discover Your Pitch competition. Soundr is our entry.
        </Text>

        {TEAM.map((member, i) => (
          <TeamCard key={member.name} member={member} index={i} />
        ))}
      </View>

      <Divider />

      {/* ── Disclaimer (collapsible) ── */}
      <View style={{ paddingHorizontal: 22 }}>
        <TouchableOpacity
          onPress={() => setShowDisclaimer((v) => !v)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#111827',
            borderRadius: 14,
            padding: 18,
            borderWidth: 1,
            borderColor: '#1e2d20',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color="#6b7a6e"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: '#6b7a6e', fontWeight: '700', fontSize: 13 }}>
              Medical Disclaimer
            </Text>
          </View>
          <Ionicons
            name={showDisclaimer ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={16}
            color="#6b7a6e"
          />
        </TouchableOpacity>

        {showDisclaimer && (
          <View
            style={{
              backgroundColor: '#0d1117',
              borderRadius: 14,
              padding: 18,
              marginTop: 2,
              borderWidth: 1,
              borderColor: '#1e2d20',
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          >
            <Text style={{ color: '#6b7a6e', fontSize: 12, lineHeight: 20 }}>
              Soundr and the Soundr app are intended to raise awareness about
              ear hygiene and hearing health. They are not medical devices and
              are not intended to diagnose, treat, cure, or prevent any
              condition. The hearing test is a self-assessment tool only and
              does not replace a clinical audiological evaluation. If you
              experience hearing loss, pain, discharge, or any other ear
              symptoms, please consult a qualified healthcare professional.
            </Text>
          </View>
        )}
      </View>

      {/* ── Footer ── */}
      <View style={{ alignItems: 'center', paddingTop: 36, paddingHorizontal: 22 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: 4,
          }}
        >
          Soundr<Text style={{ color: '#00ff00' }}>.</Text>
        </Text>
        <Text style={{ color: '#3a3a4a', fontSize: 12, fontWeight: '600' }}>
          University Hill Secondary · Vancouver, BC
        </Text>
        <Text style={{ color: '#2a2a3a', fontSize: 11, marginTop: 4 }}>
          JABC Discover Your Pitch 2026
        </Text>
      </View>
    </ScrollView>
  );
}
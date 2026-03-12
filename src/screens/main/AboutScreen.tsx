import React from 'react';
import { Text, View } from 'react-native';

function Section({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <View
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2b4330',
      }}
    >
      <Text
        style={{
          color: '#00ff00',
          fontSize: 13,
          fontWeight: '900',
          letterSpacing: 1,
          marginBottom: 10,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: '#ffffff',
          fontSize: 14,
          lineHeight: 22,
        }}
      >
        {body}
      </Text>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <View style={{ paddingHorizontal: 18 }}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: '900',
          color: '#ffffff',
          marginBottom: 24,
        }}
      >
        About Soundr
      </Text>

      <Section
        title="MISSION"
        body="Soundr uses eco-friendly materials to build a sanitation kit for earbuds alongside a web app that supplements and gamifies that experience. Our goal is to raise awareness around ear health through daily habits, routine cleaning, and accessible education."
      />

      <Section
        title="SUSTAINABILITY ALIGNMENT"
        body="Soundr aligns closely with United Nations Sustainable Development Goals 3 and 12 by encouraging healthier everyday habits while promoting more responsible production and material choices. We aim to make ear-care awareness practical, engaging, and environmentally conscious."
      />

      <Section
        title="OUR PRODUCT"
        body="Our product concept includes eco-friendly bamboo 3D printed filament, a bamboo brush, an upcycled microfiber cloth, and safe-to-use isopropyl alcohol. Together, these materials support a more sustainable and intentional cleaning routine for earbuds and AirPods."
      />

      <Section
        title="FOUNDERS"
        body="Daniel Lei, President. Alan Sun, Vice President. Steven Yan, Vice President of Production. Karthik Sinclair, Vice President of Social Media. Iana Kim, Vice President of Sales."
      />

      <Section
        title="DISCLAIMER"
        body="Soundr products and the Soundr web app are intended to raise awareness about ear health and encourage better sanitation habits for earbuds and AirPods. They are not meant to diagnose, treat, cure, or replace professional medical advice or treatment. Users experiencing pain, hearing loss, irritation, infection, or other symptoms should consult a qualified healthcare professional."
      />
    </View>
  );
}
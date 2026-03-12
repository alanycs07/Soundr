import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 20,
        marginBottom: 18,
        borderWidth: 1.5,
        borderColor: '#2b4330',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <View style={{ marginRight: 10 }}>{icon}</View>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 20,
            fontWeight: '900',
          }}
        >
          {title}
        </Text>
      </View>

      {children}
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
          marginBottom: 10,
        }}
      >
        About Soundr
      </Text>

      <Text
        style={{
          color: '#8aa18f',
          fontSize: 14,
          lineHeight: 22,
          marginBottom: 24,
          fontWeight: '600',
        }}
      >
        Learn more about our mission, our product, our team, and the purpose
        behind Soundr.
      </Text>

      <SectionCard
        icon={<Ionicons name="sparkles-outline" size={20} color="#00ff00" />}
        title="Our Mission"
      >
        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
          }}
        >
          Soundr was created to raise awareness about ear health through an
          eco-conscious sanitation kit for earbuds, paired with a web app that
          helps guide, reinforce, and gamify healthier cleaning habits. Our goal
          is to make earbud care more engaging, more accessible, and more
          sustainable, especially for students and everyday users who may not
          think about ear health until problems appear.
        </Text>
      </SectionCard>

      <SectionCard
        icon={<MaterialCommunityIcons name="earth" size={20} color="#00ff00" />}
        title="Sustainability and Impact"
      >
        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
            marginBottom: 12,
          }}
        >
          Soundr aligns closely with the spirit of United Nations Sustainable
          Development Goal 3, Good Health and Well-Being, by encouraging better
          hygiene practices and greater awareness of personal ear health.
        </Text>

        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
          }}
        >
          It also connects with Sustainable Development Goal 12, Responsible
          Consumption and Production, through our emphasis on eco-friendly
          materials, upcycled components, and more thoughtful product design.
          We want Soundr to show that health-focused products can also be built
          with sustainability in mind.
        </Text>
      </SectionCard>

      <SectionCard
        icon={
          <MaterialCommunityIcons
            name="spray-bottle"
            size={20}
            color="#00ff00"
          />
        }
        title="About Our Product"
      >
        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
            marginBottom: 12,
          }}
        >
          The Soundr sanitation kit is designed around practical cleaning,
          safety, and sustainability. Our product includes eco-friendly bamboo
          3D printed filament, a bamboo brush, an upcycled microfiber cloth, and
          safe-to-use isopropyl alcohol intended for careful earbud cleaning.
        </Text>

        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
          }}
        >
          The companion app supports that physical product by guiding users
          through repeatable cleaning steps, encouraging consistent habits, and
          turning routine maintenance into a more interactive experience.
        </Text>
      </SectionCard>

      <SectionCard
        icon={<Ionicons name="people-outline" size={20} color="#00ff00" />}
        title="The Founders"
      >
        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
            marginBottom: 8,
          }}
        >
          Daniel Lei — President
        </Text>
        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
            marginBottom: 8,
          }}
        >
          Alan Sun — Vice President
        </Text>
        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
            marginBottom: 8,
          }}
        >
          Steven Yan — Vice President of Production
        </Text>
        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
            marginBottom: 8,
          }}
        >
          Karthik Sinclair — Vice President of Social Media
        </Text>
        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
          }}
        >
          Iana Kim — Vice President of Sales
        </Text>
      </SectionCard>

      <SectionCard
        icon={<Ionicons name="alert-circle-outline" size={20} color="#00ff00" />}
        title="Disclaimer"
      >
        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
            marginBottom: 12,
          }}
        >
          Soundr products are intended to raise awareness about ear health and
          support the cleaning and sanitation of earbuds such as AirPods and
          other similar devices.
        </Text>

        <Text
          style={{
            color: '#d7e2d9',
            fontSize: 15,
            lineHeight: 24,
          }}
        >
          They are not intended to diagnose, treat, cure, or replace
          professional medical care. If a user experiences pain, infection,
          hearing loss, irritation, or any ongoing ear-related concern, they
          should stop use and seek advice from a qualified medical professional.
          Soundr should be seen as an awareness and hygiene tool, not as a
          substitute for medical treatment.
        </Text>
      </SectionCard>
    </View>
  );
}
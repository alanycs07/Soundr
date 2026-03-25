import React from 'react';
import { ScrollView, Text, View, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Inspired by Image 2: Grid/Card layout with icons
function FeatureCard({ title, body, icon, color = '#00ff00', wide = false }: { 
  title: string; 
  body: string; 
  icon: string; 
  color?: string;
  wide?: boolean;
}) {
  return (
    <View style={{
      backgroundColor: '#1a1a2e',
      borderRadius: 24,
      padding: 20,
      width: wide ? '100%' : '48%',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#2b4330',
    }}>
      <View style={{ 
        backgroundColor: '#0f0f1e', 
        width: 42, 
        height: 42, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 16,
        borderWidth: 1,
        borderColor: color
      }}>
        <MaterialCommunityIcons name={icon as any} size={24} color={color} />
      </View>
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 8 }}>{title}</Text>
      <Text style={{ color: '#8aa18f', fontSize: 13, lineHeight: 18 }}>{body}</Text>
    </View>
  );
}

// Inspired by Image 1: Circular profile layout for the team
function TeamMember({ name, role }: { name: string; role: string }) {
  return (
    <View style={{ alignItems: 'center', marginRight: 24, width: 90 }}>
      <View style={{ 
        width: 80, 
        height: 80, 
        borderRadius: 40, 
        backgroundColor: '#1a1a2e', 
        borderWidth: 2, 
        borderColor: '#00ff00',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
      }}>
         <Ionicons name="person" size={36} color="#2b4330" />
      </View>
      <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12, textAlign: 'center' }} numberOfLines={1}>
        {name.split(' ')[0]}
      </Text>
      <Text style={{ color: '#00ff00', fontSize: 9, fontWeight: '800', textAlign: 'center', marginTop: 2 }}>
        {role.toUpperCase()}
      </Text>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>
        
        {/* Header Section */}
        <Text style={{ fontSize: 12, color: '#00ff00', fontWeight: '900', letterSpacing: 2, marginBottom: 8 }}>
          OUR STORY
        </Text>
        <Text style={{ fontSize: 42, fontWeight: '900', color: '#ffffff', marginBottom: 30 }}>
          About Soundr<Text style={{color: '#00ff00'}}>.</Text>
        </Text>

        {/* Mission & Product Grid (Layout inspired by Pinterest Image 2) */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <FeatureCard 
            wide
            title="Our Mission" 
            body="Soundr uses eco-friendly materials and gamified tech to raise awareness around ear health through daily habits and accessible education."
            icon="target"
          />
          <FeatureCard 
            title="Eco-Kit" 
            body="Bamboo 3D printed tools & upcycled microfiber."
            icon="leaf"
            color="#ccff33"
          />
          <FeatureCard 
            title="Safe Tech" 
            body="Medical-grade isopropyl alcohol sanitation."
            icon="shield-check"
            color="#00ff00"
          />
          <FeatureCard 
            wide
            title="Sustainability" 
            body="Aligning with UN Goals 3 & 12 by promoting responsible production and healthier everyday ear-care habits."
            icon="earth"
            color="#5de2ff"
          />
        </View>

        {/* Team Section (Layout inspired by Image 1) */}
        <View style={{ marginTop: 40, marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
             <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>The Team</Text>
             <Text style={{ color: '#00ff00', fontSize: 11, fontWeight: '800' }}>FOUNDERS</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ overflow: 'visible' }}>
            <TeamMember name="Daniel Lei" role="President" />
            <TeamMember name="Alan Sun" role="Vice President" />
            <TeamMember name="Steven Yan" role="VP Production" />
            <TeamMember name="Karthik Sinclair" role="VP Social Media" />
            <TeamMember name="Iana Kim" role="VP Sales" />
          </ScrollView>
        </View>

        {/* Disclaimer Section */}
        <View style={{ 
          backgroundColor: '#1a1a2e', 
          padding: 24, 
          borderRadius: 24, 
          borderWidth: 1, 
          borderColor: '#2b4330',
          borderStyle: 'dashed'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="alert-circle" size={20} color="#00ff00" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>DISCLAIMER</Text>
          </View>
          <Text style={{ color: '#8aa18f', fontSize: 12, lineHeight: 18 }}>
            Soundr products and the Soundr app are intended to raise awareness about ear health. They are not meant to diagnose, treat, or replace professional medical advice. If you experience hearing loss or pain, consult a healthcare professional.
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}
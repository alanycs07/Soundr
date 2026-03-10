import React, { useState } from 'react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');

  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#0f0f1e',
      display: 'flex' as const,
      flexDirection: 'column' as const,
      height: '100vh',
    },
    content: {
      flex: 1,
      paddingTop: 24,
      paddingHorizontal: 18,
      paddingBottom: 120,
      overflowY: 'auto' as const,
    },
    title: {
      fontSize: 40,
      fontWeight: 900,
      color: '#ffffff',
      marginBottom: 32,
    },
    subtitle: {
      fontSize: 16,
      color: '#888',
    },
    navBar: {
      display: 'flex',
      backgroundColor: '#1a1a2e',
      borderTop: '2px solid #00ff00',
      paddingBottom: 20,
      paddingTop: 12,
    },
    navItem: {
      flex: 1,
      textAlign: 'center' as const,
      cursor: 'pointer',
      padding: 10,
    },
    navIcon: {
      fontSize: 20,
      marginBottom: 4,
    },
    navLabel: {
      fontSize: 10,
      fontWeight: 700,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {currentTab === 'home' && (
          <div>
            <h1 style={styles.title}>Welcome! 👋</h1>
            <p style={styles.subtitle}>Soundr is ready!</p>
          </div>
        )}
        {currentTab === 'hearing' && (
          <div>
            <h1 style={styles.title}>🎧 Hearing Test</h1>
            <p style={styles.subtitle}>Coming soon...</p>
          </div>
        )}
        {currentTab === 'settings' && (
          <div>
            <h1 style={styles.title}>⚙️ Settings</h1>
            <p style={styles.subtitle}>Coming soon...</p>
          </div>
        )}
        {currentTab === 'plans' && (
          <div>
            <h1 style={styles.title}>💎 Plans</h1>
            <p style={styles.subtitle}>Coming soon...</p>
          </div>
        )}
      </div>

      <div style={styles.navBar}>
        {[
          { name: 'home', label: 'HOME', icon: '🏠' },
          { name: 'hearing', label: 'TEST', icon: '🎧' },
          { name: 'settings', label: 'SETTINGS', icon: '⚙️' },
          { name: 'plans', label: 'PLANS', icon: '💎' },
        ].map((tab) => (
          <div
            key={tab.name}
            style={styles.navItem}
            onClick={() => setCurrentTab(tab.name)}
          >
            <div style={styles.navIcon}>{tab.icon}</div>
            <div style={{ ...styles.navLabel, color: currentTab === tab.name ? '#00ff00' : '#666' }}>
              {tab.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

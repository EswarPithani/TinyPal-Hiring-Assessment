import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Image,
  Dimensions
} from 'react-native';
import { globalStyles, colors } from '../styles/global';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    // Staggered animations for better visual appeal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2))
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 7
      })
    ]).start();
  }, []);

  const FeatureCard = ({ title, description, icon, color, onPress, delay }) => {
    const [cardAnim] = useState(new Animated.Value(0));

    useEffect(() => {
      setTimeout(() => {
        Animated.spring(cardAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
          delay: delay
        }).start();
      }, 100);
    }, []);

    return (
      <Animated.View
        style={{
          transform: [
            { scale: cardAnim },
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }
          ],
          opacity: cardAnim
        }}
      >
        <TouchableOpacity
          style={[
            styles.featureCard,
            { borderLeftColor: color },
            activeFeature === title && styles.featureCardActive
          ]}
          onPress={onPress}
          onPressIn={() => setActiveFeature(title)}
          onPressOut={() => setActiveFeature(null)}
          activeOpacity={0.9}
        >
          <View style={styles.featureHeader}>
            <View style={[styles.featureIcon, { backgroundColor: color }]}>
              <Text style={styles.featureIconText}>{icon}</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureDescription}>{description}</Text>
            </View>
          </View>
          <View style={styles.featureArrow}>
            <Text style={[styles.arrowText, { color }]}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const StatCard = ({ number, label, color }) => (
    <View style={styles.statCard}>
      <Text style={[styles.statNumber, { color }]}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👋</Text>
          </View>
          <View style={styles.welcomeText}>
            <Text style={styles.greeting}>Hello Parent!</Text>
            <Text style={styles.subGreeting}>Ready to explore today?</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Tiny<Text style={styles.titleAccent}>Pal</Text></Text>
          <Text style={styles.tagline}>Your Parenting Companion</Text>
        </View>
      </Animated.View>

      {/* Stats Section */}
      <Animated.View
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.statsTitle}>Today's Progress</Text>
        <View style={styles.statsGrid}>
          <StatCard number="5" label="Tips Learned" color="#6366F1" />
          <StatCard number="3" label="Cards Viewed" color="#8B5CF6" />
          <StatCard number="12" label="Days Streak" color="#F59E0B" />
        </View>
      </Animated.View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Explore Features</Text>

        <FeatureCard
          title="Did You Know"
          description="Discover fascinating parenting insights and educational content"
          icon="💡"
          color="#6366F1"
          onPress={() => navigation.navigate('DidYouKnow')}
          delay={0}
        />

        <FeatureCard
          title="Flash Cards"
          description="Interactive learning cards for quick parenting tips"
          icon="🎴"
          color="#8B5CF6"
          onPress={() => navigation.navigate('FlashCard')}
          delay={150}
        />
      </View>

      {/* Quick Actions */}
      <Animated.View
        style={[
          styles.quickActions,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Text style={[styles.actionIconText, { color: '#6366F1' }]}>📚</Text>
            </View>
            <Text style={styles.actionText}>Daily Tips</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
              <Text style={[styles.actionIconText, { color: '#8B5CF6' }]}>⭐</Text>
            </View>
            <Text style={styles.actionText}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Text style={[styles.actionIconText, { color: '#F59E0B' }]}>📊</Text>
            </View>
            <Text style={styles.actionText}>Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Text style={[styles.actionIconText, { color: '#10B981' }]}>⚙️</Text>
            </View>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* About Section */}
      <Animated.View
        style={[
          styles.aboutCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.aboutHeader}>
          <Text style={styles.aboutTitle}>About TinyPal</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        </View>
        <Text style={styles.aboutText}>
          Your trusted companion for modern parenting. Access educational content,
          interactive flash cards, and get personalized advice through our AI assistant Tinu.
          Join thousands of parents in their journey!
        </Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureDot}>•</Text>
            <Text style={styles.featureItemText}>Personalized Learning Paths</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureDot}>•</Text>
            <Text style={styles.featureItemText}>AI-Powered Insights</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureDot}>•</Text>
            <Text style={styles.featureItemText}>Expert-Curated Content</Text>
          </View>
        </View>
      </Animated.View>

      {/* Footer CTA */}
      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaText}>Start Your Parenting Journey 🚀</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 32,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 24,
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#64748B',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleAccent: {
    color: '#6366F1',
  },
  tagline: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureCardActive: {
    transform: [{ scale: 0.98 }],
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  featureArrow: {
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickActions: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'center',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginRight: 12,
  },
  badge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  aboutText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureDot: {
    color: '#6366F1',
    fontSize: 16,
    marginRight: 8,
  },
  featureItemText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
};

export default HomeScreen;
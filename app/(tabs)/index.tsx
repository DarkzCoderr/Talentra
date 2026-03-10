import { COLORS } from '@/constants/colors';
import { AICareerSuggestion, AIService } from '@/lib/aiService';
import { AuthService } from '@/lib/auth';
import { CareerService } from '@/lib/careerService';
import { DatabaseService } from '@/lib/database';
import { Career } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.8] });
  return (
    <Animated.View style={[styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: '60%' }]} />
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonPill} />
        <View style={styles.skeletonPill} />
      </View>
    </Animated.View>
  );
}

// ─── AI Career Card ───────────────────────────────────────────────────────────
function AICareerCard({ suggestion, index }: { suggestion: AICareerSuggestion; index: number }) {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 150;
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      ]).start();
    }, delay);
  }, []);

  const fitColor = suggestion.fitScore >= 80 ? COLORS.highlight : suggestion.fitScore >= 60 ? COLORS.accent : COLORS.gray;

  return (
    <Animated.View style={[styles.aiCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Header */}
      <View style={styles.aiCardHeader}>
        <View style={styles.aiCardTitleRow}>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={10} color={COLORS.primary} />
            <Text style={styles.aiBadgeText}>AI Pick #{index + 1}</Text>
          </View>
          {suggestion.isHot && (
            <View style={styles.hotBadge}>
              <Text style={styles.hotBadgeText}>🔥 HOT</Text>
            </View>
          )}
        </View>
        <Text style={styles.aiCardTitle}>{suggestion.title}</Text>
        <Text style={styles.aiCardCategory}>{suggestion.category}</Text>
      </View>

      {/* Why fit */}
      <View style={styles.whyFitBox}>
        <Ionicons name="bulb-outline" size={14} color={COLORS.highlight} />
        <Text style={styles.whyFitText}>{suggestion.whyFit}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statBoxLabel}>Entry Salary</Text>
          <Text style={styles.statBoxValue}>{suggestion.averageSalary}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statBoxLabel}>Senior Salary</Text>
          <Text style={styles.statBoxValue}>{suggestion.seniorSalary}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statBoxLabel}>Time to Job</Text>
          <Text style={styles.statBoxValue}>{suggestion.timeToJob}</Text>
        </View>
      </View>

      {/* Fit score + demand */}
      <View style={styles.fitRow}>
        <View style={styles.fitScoreBox}>
          <Text style={styles.fitScoreLabel}>AI Fit Score</Text>
          <View style={styles.fitScoreBar}>
            <View style={[styles.fitScoreFill, { width: `${suggestion.fitScore}%` as any, backgroundColor: fitColor }]} />
          </View>
          <Text style={[styles.fitScoreValue, { color: fitColor }]}>{suggestion.fitScore}%</Text>
        </View>
        <View style={styles.demandBox}>
          <Text style={styles.demandLabel}>India Demand</Text>
          <Text style={styles.demandValue}>{suggestion.demandInIndia}</Text>
        </View>
      </View>

      {/* Skills */}
      <View style={styles.skillsWrap}>
        {suggestion.requiredSkills.slice(0, 4).map((skill) => (
          <View key={skill} style={styles.skillTag}>
            <Text style={styles.skillTagText}>{skill}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.viewRoadmapBtn}
        onPress={() => router.push(`/career/${suggestion.$id}` as any)}
      >
        <Ionicons name="map-outline" size={16} color={COLORS.primary} />
        <Text style={styles.viewRoadmapText}>View Full Roadmap</Text>
        <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Quick-explore career card ─────────────────────────────────────────────────
function HotCareerCard({ career }: { career: Career }) {
  return (
    <TouchableOpacity
      style={styles.hotCard}
      onPress={() => router.push(`/career/${career.$id}` as any)}
    >
      {career.isHot && <Text style={styles.hotCardBadge}>🔥 HOT</Text>}
      {career.isEmerging && !career.isHot && <Text style={styles.emergingBadge}>🚀 EMERGING</Text>}
      <Text style={styles.hotCardTitle}>{career.title}</Text>
      <Text style={styles.hotCardSalary}>{career.averageSalary}</Text>
      <Text style={styles.hotCardGrowth}>↑ {career.growthRate} growth</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [aiSuggestions, setAiSuggestions] = useState<AICareerSuggestion[]>([]);
  const [analysisNote, setAnalysisNote] = useState('');
  const [hotCareers, setHotCareers] = useState<Career[]>([]);
  const [isAILoading, setIsAILoading] = useState(true);
  const [aiError, setAiError] = useState(false);
  const [userName, setUserName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    loadData();
  }, []);

  const loadData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsAILoading(true);

    try {
      const [user, hot] = await Promise.all([
        AuthService.getCurrentUser(),
        CareerService.getHotCareers(),
      ]);
      setHotCareers(hot);
      if (user) setUserName(user.name?.split(' ')[0] || 'there');

      if (user) {
        const profile = await DatabaseService.getUserProfile(user.$id);
        const interests = profile?.interests ? profile.interests.split(', ') : [];
        const background = profile?.background || '';
        const experience = profile?.experience || 'beginner';
        const goals = profile?.goals ? profile.goals.split(', ') : [];

        if (interests.length > 0) {
          const result = await AIService.getCareerSuggestions(interests, background, experience, goals);
          setAiSuggestions(result.suggestions);
          setAnalysisNote(result.analysisNote);
          setAiError(result.source === 'local');
        }
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setIsAILoading(false);
      setIsRefreshing(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadData(true)} tintColor={COLORS.highlight} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {userName || 'there'} 👋</Text>
            <Text style={styles.headerTitle}>Talentra</Text>
            <Text style={styles.headerSubtitle}>Your AI-powered career guide for India</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile' as any)}>
            <Ionicons name="person-circle-outline" size={32} color={COLORS.highlight} />
          </TouchableOpacity>
        </View>



        {/* Personalized Header (only if onboarding is done) */}
        {!isAILoading && aiSuggestions.length > 0 && (
          <View style={styles.profileSummary}>
            <Text style={styles.profileSummaryText}>
              Tailoring for your background in <Text style={styles.highlightText}>{userName}'s {aiSuggestions[0]?.category || 'Tech'}</Text> path.
            </Text>
          </View>
        )}

        {/* AI Suggestions section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="sparkles" size={18} color={COLORS.highlight} />
              <Text style={styles.sectionTitle}>AI Career Picks</Text>
            </View>
            <TouchableOpacity onPress={() => loadData(true)} style={styles.refreshBtn}>
              <Ionicons name="refresh" size={16} color={COLORS.accent} />
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Personalised career picks powered by AI and curated rules</Text>

          {isAILoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : aiSuggestions.length > 0 ? (
            aiSuggestions.map((s, i) => <AICareerCard key={s.$id} suggestion={s} index={i} />)
          ) : (
            <View style={styles.emptyAI}>
              <Ionicons name="alert-circle-outline" size={40} color={COLORS.gray} />
              <Text style={styles.emptyAIText}>Complete your profile to get AI suggestions</Text>
              <TouchableOpacity style={styles.goOnboardBtn} onPress={() => router.replace('/onboarding')}>
                <Text style={styles.goOnboardText}>Set Up Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          {aiError && (
            <View style={styles.errorNote}>
              <Ionicons name="information-circle-outline" size={14} color={COLORS.gray} />
              <Text style={styles.errorNoteText}>Using curated suggestions (AI temporarily unavailable)</Text>
            </View>
          )}
        </View>

        {/* Hot careers section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Hot in India</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/careers' as any)}>
              <Text style={styles.seeAllText}>See all →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>High-demand roles right now</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {hotCareers.map((c) => <HotCareerCard key={c.$id} career={c} />)}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: { fontSize: 14, color: COLORS.gray, marginBottom: 2 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  profileBtn: { padding: 4 },

  analysisNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(34,211,238,0.08)',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.2)',
  },
  analysisNoteText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 20 },

  profileSummary: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 4,
  },
  profileSummaryText: {
    fontSize: 13,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  highlightText: {
    color: COLORS.highlight,
    fontWeight: '600',
  },

  section: { paddingHorizontal: 20, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  sectionSubtitle: { fontSize: 13, color: COLORS.gray, marginBottom: 16 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  refreshText: { fontSize: 13, color: COLORS.accent },
  seeAllText: { fontSize: 13, color: COLORS.accent },

  // Skeleton
  skeletonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: 12,
  },
  skeletonTitle: { height: 20, width: '60%', backgroundColor: COLORS.lightGray, borderRadius: 6 },
  skeletonLine: { height: 14, width: '90%', backgroundColor: COLORS.lightGray, borderRadius: 6 },
  skeletonRow: { flexDirection: 'row', gap: 10 },
  skeletonPill: { height: 28, width: 80, backgroundColor: COLORS.lightGray, borderRadius: 20 },

  // AI Card
  aiCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: 14,
  },
  aiCardHeader: { gap: 6 },
  aiCardTitleRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.highlight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  aiBadgeText: { fontSize: 10, color: COLORS.primary, fontWeight: '700', letterSpacing: 0.5 },
  hotBadge: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  hotBadgeText: { fontSize: 10, color: '#EF4444', fontWeight: '700' },
  aiCardTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  aiCardCategory: { fontSize: 12, color: COLORS.accent, fontWeight: '600', letterSpacing: 0.5 },

  whyFitBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(34,211,238,0.06)',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.15)',
  },
  whyFitText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 20 },

  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  statBoxLabel: { fontSize: 10, color: COLORS.gray, marginBottom: 4, textAlign: 'center' },
  statBoxValue: { fontSize: 13, fontWeight: '700', color: COLORS.text, textAlign: 'center' },

  fitRow: { flexDirection: 'row', gap: 12 },
  fitScoreBox: { flex: 1.5, gap: 6 },
  fitScoreLabel: { fontSize: 11, color: COLORS.gray },
  fitScoreBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fitScoreFill: { height: '100%', borderRadius: 3 },
  fitScoreValue: { fontSize: 13, fontWeight: '700' },
  demandBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  demandLabel: { fontSize: 10, color: COLORS.gray, marginBottom: 3 },
  demandValue: { fontSize: 11, color: COLORS.text, fontWeight: '600' },

  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillTag: {
    backgroundColor: 'rgba(59,130,246,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.25)',
  },
  skillTagText: { fontSize: 11, color: COLORS.accent, fontWeight: '600' },

  viewRoadmapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.highlight,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  viewRoadmapText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  emptyAI: { alignItems: 'center', padding: 32, gap: 12 },
  emptyAIText: { fontSize: 14, color: COLORS.gray, textAlign: 'center' },
  goOnboardBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  goOnboardText: { fontSize: 14, fontWeight: '700', color: COLORS.white },

  errorNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -8,
  },
  errorNoteText: { fontSize: 11, color: COLORS.gray },

  // Hot cards
  horizontalScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  hotCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    width: 160,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: 6,
  },
  hotCardBadge: { fontSize: 10, fontWeight: '700', color: '#EF4444' },
  emergingBadge: { fontSize: 10, fontWeight: '700', color: COLORS.accent },
  hotCardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, lineHeight: 20 },
  hotCardSalary: { fontSize: 13, color: COLORS.highlight, fontWeight: '600' },
  hotCardGrowth: { fontSize: 11, color: COLORS.success },
});

import { COLORS } from '@/constants/colors';
import { AuthService } from '@/lib/auth';
import { CareerService } from '@/lib/careerService';
import { DatabaseService } from '@/lib/database';
import { Career } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProgressScreen() {
  const [trackedCareer, setTrackedCareer] = useState<Career | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [availableCareers, setAvailableCareers] = useState<Career[]>([]);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }
  }, [isLoading]);

  const loadData = async () => {
    try {
      const [user, careers] = await Promise.all([
        AuthService.getCurrentUser(),
        CareerService.getCareers(),
      ]);
      setAvailableCareers(careers);
      if (user) {
        setUserName(user.name?.split(' ')[0] || '');
        setUserId(user.$id);
        try {
          const progressDocs = await DatabaseService.getUserProgress(user.$id);
          if (progressDocs && progressDocs.length > 0) {
            const latest = progressDocs[progressDocs.length - 1] as any;
            const careerForProgress =
              careers.find((c) => c.$id === latest.careerId) || null;
            if (careerForProgress) {
              setTrackedCareer(careerForProgress);
              const currentStepId = latest.currentStep as string | undefined;
              if (currentStepId) {
                const idx = careerForProgress.roadmap.findIndex(
                  (s) => s.id === currentStepId,
                );
                if (idx >= 0) {
                  const reconstructed = careerForProgress.roadmap
                    .slice(0, idx + 1)
                    .map((s) => s.id);
                  setCompletedSteps(reconstructed);
                }
              }
            }
          }
        } catch (e) {
          console.error('Error loading existing progress:', e);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectCareer = (career: Career) => {
    setTrackedCareer(career);
    setCompletedSteps([]);
    setShowPicker(false);
  };

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const updated = prev.includes(stepId) ? prev.filter((s) => s !== stepId) : [...prev, stepId];
      if (userId && trackedCareer) {
        DatabaseService.updateStepProgress(userId, trackedCareer.$id, stepId).catch((e) =>
          console.error('Error updating remote step progress', e),
        );
      }
      return updated;
    });
  };

  const percentage =
    trackedCareer && trackedCareer.roadmap.length > 0
      ? Math.round((completedSteps.length / trackedCareer.roadmap.length) * 100)
      : 0;

  // ─── Career picker modal ─────────────────────────────────────────────────
  if (showPicker) {
    return (
      <View style={styles.container}>
        <View style={styles.pickerHeader}>
          <TouchableOpacity onPress={() => setShowPicker(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.pickerTitle}>Choose a Career to Track</Text>
        </View>
        <ScrollView style={styles.pickerList}>
          {availableCareers.map((career) => (
            <TouchableOpacity
              key={career.$id}
              style={styles.pickerItem}
              onPress={() => selectCareer(career)}
            >
              <View style={styles.pickerItemLeft}>
                {career.isHot && <Text style={styles.pickerHot}>🔥</Text>}
                <View>
                  <Text style={styles.pickerItemTitle}>{career.title}</Text>
                  <Text style={styles.pickerItemSalary}>{career.averageSalary}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ─── Empty state ──────────────────────────────────────────────────────────
  if (!trackedCareer) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Progress</Text>
          <Text style={styles.headerSub}>Track your career learning journey</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="map-outline" size={56} color={COLORS.lightGray} />
          </View>
          <Text style={styles.emptyTitle}>No career tracked yet</Text>
          <Text style={styles.emptyDesc}>
            Pick a career path to start tracking your roadmap progress
          </Text>
          <TouchableOpacity style={styles.pickBtn} onPress={() => setShowPicker(true)}>
            <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.pickBtnText}>Choose Career Path</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.aiHintBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Ionicons name="sparkles" size={16} color={COLORS.highlight} />
            <Text style={styles.aiHintText}>Get AI career suggestions first</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ─── Tracking view ─────────────────────────────────────────────────────────
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Progress</Text>
          <TouchableOpacity style={styles.changeBtn} onPress={() => setShowPicker(true)}>
            <Ionicons name="swap-horizontal" size={14} color={COLORS.accent} />
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Career summary card */}
        <View style={styles.careerCard}>
          {trackedCareer.isHot && (
            <Text style={styles.hotLabel}>🔥 HOT CAREER</Text>
          )}
          <Text style={styles.careerCardTitle}>{trackedCareer.title}</Text>
          <Text style={styles.careerCardDesc} numberOfLines={2}>{trackedCareer.description}</Text>

          <View style={styles.salaryRow}>
            <View style={styles.salaryItem}>
              <Text style={styles.salaryLabel}>Entry Salary</Text>
              <Text style={styles.salaryValue}>{trackedCareer.averageSalary}</Text>
            </View>
            {trackedCareer.seniorSalary && (
              <View style={styles.salaryItem}>
                <Text style={styles.salaryLabel}>Senior Salary</Text>
                <Text style={[styles.salaryValue, { color: COLORS.highlight }]}>
                  {trackedCareer.seniorSalary}
                </Text>
              </View>
            )}
          </View>

          {/* Progress ring area */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressPct}>{percentage}%</Text>
              <Text style={styles.progressSub}>
                {completedSteps.length}/{trackedCareer.roadmap.length} steps done
              </Text>
            </View>
            <View style={styles.progressBarWide}>
              <View style={[styles.progressFill, { width: `${percentage}%` as any }]} />
            </View>
          </View>
        </View>

        {/* Roadmap steps */}
        <View style={styles.roadmapSection}>
          <Text style={styles.roadmapTitle}>Learning Roadmap</Text>
          {trackedCareer.roadmap.map((step, index) => {
            const done = completedSteps.includes(step.id);
            const canDo = index === 0 || completedSteps.includes(trackedCareer.roadmap[index - 1].id);
            return (
              <TouchableOpacity
                key={step.id}
                style={[styles.stepCard, done && styles.stepCardDone, !canDo && styles.stepCardLocked]}
                onPress={() => {
                  if (!canDo) {
                    Alert.alert('Complete the previous step first!');
                    return;
                  }
                  toggleStep(step.id);
                }}
                disabled={!canDo && !done}
              >
                <View style={[styles.stepNum, done && styles.stepNumDone, !canDo && styles.stepNumLocked]}>
                  {done ? (
                    <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                  ) : !canDo ? (
                    <Ionicons name="lock-closed" size={14} color={COLORS.gray} />
                  ) : (
                    <Text style={styles.stepNumText}>{index + 1}</Text>
                  )}
                </View>

                <View style={styles.stepBody}>
                  <Text style={[styles.stepTitle, done && styles.stepTitleDone]}>
                    {step.title}
                  </Text>
                  <Text style={styles.stepDesc} numberOfLines={2}>{step.description}</Text>
                  <View style={styles.stepMeta}>
                    <Ionicons name="time-outline" size={12} color={COLORS.gray} />
                    <Text style={styles.stepDuration}>{step.duration}</Text>
                    <Text style={styles.stepResCount}>
                      · {step.resources.length} resource{step.resources.length !== 1 ? 's' : ''}
                    </Text>
                  </View>

                  {/* Resources */}
                  {step.resources.slice(0, 1).map((res) => (
                    <View key={res.id} style={styles.resourceRow}>
                      <Ionicons name="link-outline" size={12} color={COLORS.accent} />
                      <Text style={styles.resourceName} numberOfLines={1}>{res.title}</Text>
                      {res.isFree && (
                        <View style={styles.freeBadge}>
                          <Text style={styles.freeText}>FREE</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Completion state */}
        {percentage === 100 && (
          <View style={styles.completeCard}>
            <Text style={styles.completeEmoji}>🎉</Text>
            <Text style={styles.completeTitle}>Roadmap Complete!</Text>
            <Text style={styles.completeDesc}>
              You've completed all steps for {trackedCareer.title}. Time to apply!
            </Text>
            <TouchableOpacity
              style={styles.exploreMoreBtn}
              onPress={() => router.push('/(tabs)/careers' as any)}
            >
              <Text style={styles.exploreMoreText}>Explore More Careers</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.text },
  headerSub: { fontSize: 13, color: COLORS.gray },
  changeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  changeBtnText: { fontSize: 13, color: COLORS.accent },

  // Empty state
  emptyState: { flex: 1, alignItems: 'center', padding: 40, gap: 16, marginTop: 40 },
  emptyIcon: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.surface,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  emptyDesc: { fontSize: 14, color: COLORS.gray, textAlign: 'center', lineHeight: 22 },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.highlight,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  pickBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  aiHintBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiHintText: { fontSize: 13, color: COLORS.highlight },

  // Career summary card
  careerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: 12,
  },
  hotLabel: { fontSize: 11, fontWeight: '700', color: '#EF4444' },
  careerCardTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  careerCardDesc: { fontSize: 13, color: COLORS.gray, lineHeight: 20 },

  salaryRow: { flexDirection: 'row', gap: 20 },
  salaryItem: { gap: 2 },
  salaryLabel: { fontSize: 11, color: COLORS.gray },
  salaryValue: { fontSize: 15, fontWeight: '700', color: COLORS.text },

  progressSection: { gap: 10 },
  progressInfo: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  progressPct: { fontSize: 32, fontWeight: 'bold', color: COLORS.highlight },
  progressSub: { fontSize: 13, color: COLORS.gray },
  progressBarWide: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.highlight, borderRadius: 4 },

  // Roadmap steps
  roadmapSection: { paddingHorizontal: 20, gap: 12, marginBottom: 16 },
  roadmapTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },

  stepCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  stepCardDone: { borderColor: COLORS.highlight, backgroundColor: 'rgba(34,211,238,0.05)' },
  stepCardLocked: { opacity: 0.5 },

  stepNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumDone: { backgroundColor: COLORS.highlight },
  stepNumLocked: { backgroundColor: COLORS.lightGray },
  stepNumText: { fontSize: 14, fontWeight: '700', color: COLORS.text },

  stepBody: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  stepTitleDone: { textDecorationLine: 'line-through', opacity: 0.6 },
  stepDesc: { fontSize: 12, color: COLORS.gray, lineHeight: 18 },
  stepMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  stepDuration: { fontSize: 11, color: COLORS.gray },
  stepResCount: { fontSize: 11, color: COLORS.gray },

  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 8,
  },
  resourceName: { flex: 1, fontSize: 11, color: COLORS.accent },
  freeBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeText: { fontSize: 9, color: COLORS.success, fontWeight: '700' },

  // Picker
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  pickerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  pickerList: { flex: 1, paddingHorizontal: 20 },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  pickerItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  pickerHot: { fontSize: 16 },
  pickerItemTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  pickerItemSalary: { fontSize: 12, color: COLORS.highlight, marginTop: 2 },

  // Completion
  completeCard: {
    backgroundColor: 'rgba(34,211,238,0.08)',
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.highlight,
  },
  completeEmoji: { fontSize: 40 },
  completeTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  completeDesc: { fontSize: 14, color: COLORS.gray, textAlign: 'center' },
  exploreMoreBtn: {
    backgroundColor: COLORS.highlight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  exploreMoreText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});

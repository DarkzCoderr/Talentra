import { AnimatedCard } from '@/components/AnimatedCard';
import { COLORS } from '@/constants/colors';
import { AuthService } from '@/lib/auth';
import { CareerService } from '@/lib/careerService';
import { DatabaseService } from '@/lib/database';
import { Career, RoadmapStep } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CareerDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = params.id;
  const careerId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [career, setCareer] = useState<Career | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadCareer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careerId]);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, fadeAnim]);

  const loadCareer = async () => {
    if (!careerId) {
      setIsLoading(false);
      return;
    }
    try {
      const careerData = await CareerService.getCareerById(careerId);
      setCareer(careerData);
    } catch (error) {
      console.error('Error loading career:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStepCompletion = (stepId: string) => {
    if (!career) return;
    const updatedRoadmap = career.roadmap.map((step) =>
      step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step,
    );
    setCareer({ ...career, roadmap: updatedRoadmap });
    Alert.alert('Updated', 'Step progress updated for this session.');
  };

  const openResource = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open this resource link.');
    });
  };

  const renderRoadmapStep = (step: RoadmapStep, index: number) => (
    <AnimatedCard key={step.id} delay={index * 80} style={styles.stepCard}>
      <View style={styles.stepHeader}>
        <TouchableOpacity
          style={[styles.checkbox, step.isCompleted && styles.checkboxCompleted]}
          onPress={() => toggleStepCompletion(step.id)}
        >
          {step.isCompleted && (
            <Ionicons name="checkmark" size={16} color={COLORS.white} />
          )}
        </TouchableOpacity>
        <View style={styles.stepInfo}>
          <Text
            style={[
              styles.stepTitle,
              step.isCompleted && styles.stepTitleCompleted,
            ]}
          >
            Step {index + 1}: {step.title}
          </Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={14} color={COLORS.gray} />
            <Text style={styles.duration}>{step.duration}</Text>
            <Text style={styles.durationDot}> · </Text>
            <Text style={styles.duration}>
              {step.resources.length} resource
              {step.resources.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      {step.prerequisites && step.prerequisites.length > 0 ? (
        <View style={styles.prerequisitesContainer}>
          <Text style={styles.prerequisitesLabel}>Prerequisites</Text>
          <View style={styles.prerequisitesList}>
            {step.prerequisites.map((prereq) => (
              <View key={prereq} style={styles.prerequisiteTag}>
                <Text style={styles.prerequisiteText}>{prereq}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.resourcesContainer}>
        <Text style={styles.resourcesLabel}>Suggested resources</Text>
        <View style={styles.resourcesList}>
          {step.resources.map((item) => (
            <View key={item.id} style={styles.resourceItem}>
              <View style={styles.resourceHeader}>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceTitle}>{item.title}</Text>
                  <Text style={styles.resourceDescription}>
                    {item.description}
                  </Text>
                </View>
                <View style={styles.resourceType}>
                  <Text style={styles.resourceTypeText}>{item.type}</Text>
                </View>
              </View>
              <View style={styles.resourceFooter}>
                {item.isFree && (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeText}>FREE</Text>
                  </View>
                )}
                {item.url ? (
                  <TouchableOpacity
                    style={styles.openResourceBtn}
                    onPress={() => openResource(item.url)}
                  >
                    <Ionicons
                      name="open-outline"
                      size={14}
                      color={COLORS.accent}
                    />
                    <Text style={styles.openResourceText}>Open resource</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </View>
    </AnimatedCard>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Animated.View
            style={[styles.loadingDot, { backgroundColor: COLORS.accent }]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              { backgroundColor: COLORS.secondary, marginLeft: 10 },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              { backgroundColor: COLORS.primary, marginLeft: 10 },
            ]}
          />
        </View>
      </View>
    );
  }

  if (!career) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={COLORS.error}
        />
        <Text style={styles.errorText}>Career not found</Text>
      </View>
    );
  }

  const completedSteps = career.roadmap.filter((step) => step.isCompleted).length;
  const progressPercentage =
    career.roadmap.length > 0
      ? Math.round((completedSteps / career.roadmap.length) * 100)
      : 0;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.stickyHeaderTitle} numberOfLines={1}>
          {career.title}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 140 }}
      >
        <View style={styles.header}>
          <View style={styles.careerHeader}>
            <View style={styles.careerInfo}>
              <Text style={styles.careerTitle}>{career.title}</Text>
              <Text style={styles.careerDescription}>{career.description}</Text>
            </View>
            {career.isHot && (
              <View style={styles.hotBadge}>
                <Text style={styles.hotBadgeText}>HOT</Text>
              </View>
            )}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="cash-outline" size={20} color={COLORS.success} />
              <Text style={styles.statLabel}>Entry salary</Text>
              <Text style={styles.statValue}>{career.averageSalary}</Text>
            </View>
            {career.seniorSalary ? (
              <View style={styles.statItem}>
                <Ionicons
                  name="ribbon-outline"
                  size={20}
                  color={COLORS.highlight}
                />
                <Text style={styles.statLabel}>Senior</Text>
                <Text style={styles.statValue}>{career.seniorSalary}</Text>
              </View>
            ) : null}
            <View style={styles.statItem}>
              <Ionicons
                name="trending-up-outline"
                size={20}
                color={COLORS.accent}
              />
              <Text style={styles.statLabel}>Growth rate</Text>
              <Text style={styles.statValue}>{career.growthRate}</Text>
            </View>
          </View>

          {career.demandInIndia && (
            <View style={styles.demandPillRow}>
              <View style={styles.categoryPill}>
                <Ionicons
                  name="briefcase-outline"
                  size={14}
                  color={COLORS.accent}
                />
                <Text style={styles.categoryPillText}>{career.category}</Text>
              </View>
              <View style={styles.demandPill}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={COLORS.gray}
                />
                <Text style={styles.demandPillText}>
                  India: {career.demandInIndia}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Your progress</Text>
              <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                />
              </View>
            </View>
            <Text style={styles.progressText}>
              {completedSteps} of {career.roadmap.length} steps completed
            </Text>
          </View>
        </View>

        <View style={styles.skillsContainer}>
          <Text style={styles.skillsTitle}>Required skills</Text>
          <View style={styles.skillsList}>
            {career.requiredSkills.map((skill) => (
              <View key={skill} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.roadmapSection}>
          <Text style={styles.roadmapTitle}>Career roadmap</Text>
          <View style={styles.roadmapList}>
            {career.roadmap.map((step, index) => renderRoadmapStep(step, index))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Action Area */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={async () => {
            try {
              const user = await AuthService.getCurrentUser();
              if (user && career) {
                const existing = await DatabaseService.getProgressForCareer(
                  user.$id,
                  career.$id,
                );
                if (!existing) {
                  await DatabaseService.saveProgress({
                    userId: user.$id,
                    careerId: career.$id,
                    completedSteps: [],
                    currentStep: career.roadmap[0]?.id || '',
                    completionPercentage: 0,
                  });
                }
              }
              router.push('/(tabs)/progress' as any);
            } catch (e) {
              console.error('Failed to start career tracking', e);
              Alert.alert('Error', 'Failed to save progress.');
            }
          }}
        >
          <Ionicons name="rocket-outline" size={20} color={COLORS.primary} />
          <Text style={styles.startBtnText}>Start tracking this career</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stickyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyHeaderTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    marginTop: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  careerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  careerInfo: {
    flex: 1,
    marginRight: 16,
  },
  careerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  careerDescription: {
    fontSize: 15,
    color: COLORS.gray,
    lineHeight: 22,
  },
  hotBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  hotBadgeText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  demandPillRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(59,130,246,0.08)',
  },
  categoryPillText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
  },
  demandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  demandPillText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  progressCard: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginTop: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  progressBar: {
    height: 8,
    marginBottom: 8,
  },
  progressTrack: {
    height: '100%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: 'center',
  },
  skillsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 10,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: '500',
  },
  roadmapSection: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  roadmapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  roadmapList: {
    gap: 16,
  },
  stepCard: {
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  stepTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
    color: COLORS.gray,
  },
  durationDot: {
    fontSize: 14,
    color: COLORS.gray,
  },
  prerequisitesContainer: {
    marginBottom: 12,
    marginLeft: 36,
  },
  prerequisitesLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 6,
  },
  prerequisitesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  prerequisiteTag: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  prerequisiteText: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '500',
  },
  resourcesContainer: {
    marginLeft: 36,
  },
  resourcesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  resourcesList: {
    gap: 12,
  },
  resourceItem: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 16,
  },
  resourceType: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resourceTypeText: {
    fontSize: 10,
    color: COLORS.gray,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  resourceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  freeBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeText: {
    fontSize: 9,
    color: COLORS.success,
    fontWeight: '700',
  },
  openResourceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openResourceText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '500',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.highlight,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: COLORS.highlight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});


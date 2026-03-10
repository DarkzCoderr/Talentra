import { AnimatedCard } from '@/components/AnimatedCard';
import { COLORS } from '@/constants/colors';
import { AuthService } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Data ─────────────────────────────────────────────────────────────────────
const interests = [
  'Technology', 'Design', 'Business', 'Healthcare', 'Education',
  'Finance', 'Marketing', 'Data Science', 'Artificial Intelligence',
  'Web Development', 'Mobile Development', 'Cybersecurity',
  'Cloud Computing', 'Content Creation', 'Sales',
];

const backgrounds = [
  'Computer Science / IT', 'Engineering (Non-IT)', 'Business / Commerce',
  'Arts / Humanities', 'Science (PCM/PCB)', 'Mathematics / Statistics',
  'Healthcare / Medicine', 'Law', 'Self-taught / Bootcamp', 'Other',
];

const experienceLevels = [
  { value: 'beginner', label: 'Fresher / Student', sub: '0–1 year' },
  { value: 'intermediate', label: 'Early Career', sub: '1–3 years' },
  { value: 'advanced', label: 'Experienced', sub: '3+ years' },
];

const goals = [
  'High salary / Financial growth',
  'Work-life balance',
  'Remote / Flexible work',
  'Fast career growth',
  'Creative / Innovative work',
  'Job stability / Government jobs',
  'Entrepreneurship / Startup',
  'Social impact',
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedBackground, setSelectedBackground] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const TOTAL_STEPS = 4;

  useEffect(() => {
    checkAlreadyDone();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const checkAlreadyDone = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        const profile = await DatabaseService.getUserProfile(user.$id);
        if (profile?.interests) {
          router.replace('/(tabs)');
        }
      }
    } catch (e) {
      console.error('Check onboarding done error:', e);
    }
  };

  const toggleInterest = (item: string) =>
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );

  const toggleGoal = (item: string) =>
    setSelectedGoals((prev) =>
      prev.includes(item) ? prev.filter((g) => g !== item) : [...prev, item]
    );

  const canProceed = () => {
    if (currentStep === 0) return selectedInterests.length >= 1;
    if (currentStep === 1) return !!selectedBackground;
    if (currentStep === 2) return !!selectedExperience;
    if (currentStep === 3) return selectedGoals.length >= 1;
    return false;
  };

  const handleNext = async () => {
    if (!canProceed()) {
      const messages = [
        'Pick at least one interest to continue.',
        'Select your educational background.',
        'Choose your experience level.',
        'Select at least one career goal.',
      ];
      Alert.alert('Almost there!', messages[currentStep]);
      return;
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await saveAndAnalyse();
    }
  };

  const saveAndAnalyse = async () => {
    setIsLoading(true);
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) { router.replace('/auth/login'); return; }

      // Only save fields that exist in your Appwrite collection schema
      // (goals is not a collection attribute — it's used for AI context only)
      const profileData = {
        interests: selectedInterests.join(', '),
        background: selectedBackground,
        experience: selectedExperience,
        goals: selectedGoals.join(', '),
      };

      // Try update first; if no profile exists yet, create it
      const existing = await DatabaseService.getUserProfile(user.$id);
      if (existing) {
        await DatabaseService.updateUserProfile(user.$id, profileData as any);
      } else {
        await DatabaseService.createUserProfile({
          $id: user.$id,
          email: user.email,
          name: user.name,
          interests: selectedInterests,
          background: selectedBackground,
        } as any);
      }

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      Alert.alert('Error', 'Failed to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step Renders ──────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View>
            <Text style={styles.stepTitle}>What are you interested in?</Text>
            <Text style={styles.stepSubtitle}>Select all that apply — be generous!</Text>
            <View style={styles.chipGrid}>
              {interests.map((item) => {
                const selected = selectedInterests.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => toggleInterest(item)}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {selectedInterests.length > 0 && (
              <Text style={styles.selectionCount}>{selectedInterests.length} selected ✓</Text>
            )}
          </View>
        );

      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>What's your educational background?</Text>
            <Text style={styles.stepSubtitle}>Choose the closest match</Text>
            <View style={styles.listOptions}>
              {backgrounds.map((item) => {
                const selected = selectedBackground === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.optionItem, selected && styles.optionItemSelected]}
                    onPress={() => setSelectedBackground(item)}
                  >
                    <Ionicons
                      name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={selected ? COLORS.highlight : COLORS.gray}
                    />
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>What's your experience level?</Text>
            <Text style={styles.stepSubtitle}>Helps us tailor recommendations for you</Text>
            <View style={styles.experienceCards}>
              {experienceLevels.map((level) => {
                const selected = selectedExperience === level.value;
                return (
                  <TouchableOpacity
                    key={level.value}
                    style={[styles.expCard, selected && styles.expCardSelected]}
                    onPress={() => setSelectedExperience(level.value)}
                  >
                    <Text style={[styles.expLabel, selected && styles.expLabelSelected]}>
                      {level.label}
                    </Text>
                    <Text style={[styles.expSub, selected && styles.expSubSelected]}>
                      {level.sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>What are your career goals?</Text>
            <Text style={styles.stepSubtitle}>This helps AI personalise your suggestions</Text>
            <View style={styles.chipGrid}>
              {goals.map((item) => {
                const selected = selectedGoals.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => toggleGoal(item)}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {selectedGoals.length > 0 && (
              <Text style={styles.selectionCount}>{selectedGoals.length} selected ✓</Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  // ─── Loading overlay ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={COLORS.highlight} />
          <Text style={styles.loadingTitle}>Saving your profile…</Text>
          <Text style={styles.loadingSubtitle}>Your AI career analysis will be ready on the next screen</Text>
        </View>
      </View>
    );
  }

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[{ opacity: fadeAnim }]}>
          {/* Header card */}
          <AnimatedCard delay={0} style={styles.headerCard}>
            {/* Progress bar */}
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
            </View>
            <Text style={styles.stepIndicator}>Step {currentStep + 1} of {TOTAL_STEPS}</Text>
            <Text style={styles.headerTitle}>Welcome to Talentra</Text>
            <Text style={styles.headerSubtitle}>Let's personalise your AI career journey</Text>
          </AnimatedCard>

          {/* Step content */}
          <View style={styles.stepContent}>
            {renderStep()}
          </View>

          {/* Navigation */}
          <View style={styles.navRow}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Ionicons name="chevron-back" size={20} color={COLORS.text} />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextBtn, !canProceed() && styles.nextBtnDisabled, { flex: currentStep > 0 ? 0 : 1 }]}
              onPress={handleNext}
            >
              {currentStep === TOTAL_STEPS - 1 ? (
                <>
                  <Ionicons name="sparkles" size={20} color={COLORS.primary} />
                  <Text style={styles.nextBtnText}>Analyse My Profile</Text>
                </>
              ) : (
                <>
                  <Text style={styles.nextBtnText}>Continue</Text>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  loadingOverlay: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  headerCard: {
    margin: 20,
    marginTop: 60,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.highlight,
    borderRadius: 2,
  },
  stepIndicator: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  stepContent: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
  },
  // Chip grid (interests / goals)
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipSelected: {
    backgroundColor: COLORS.highlight,
    borderColor: COLORS.highlight,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  selectionCount: {
    fontSize: 13,
    color: COLORS.highlight,
    fontWeight: '600',
    marginTop: 4,
  },
  // List options (background)
  listOptions: { gap: 10 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: 12,
  },
  optionItemSelected: {
    borderColor: COLORS.highlight,
    backgroundColor: 'rgba(34,211,238,0.08)',
  },
  optionText: {
    fontSize: 15,
    color: COLORS.gray,
    flex: 1,
  },
  optionTextSelected: {
    color: COLORS.text,
    fontWeight: '600',
  },
  // Experience cards
  experienceCards: { gap: 12 },
  expCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  expCardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(59,130,246,0.08)',
  },
  expLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 4,
  },
  expLabelSelected: { color: COLORS.text },
  expSub: { fontSize: 13, color: COLORS.gray },
  expSubSelected: { color: COLORS.accent },
  // Navigation
  navRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: 6,
  },
  backBtnText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.highlight,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  nextBtnDisabled: { opacity: 0.45 },
  nextBtnText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

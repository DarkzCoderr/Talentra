import { COLORS } from '@/constants/colors';
import { CareerService } from '@/lib/careerService';
import { Career } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = ['All', 'Technology', 'Data Science', 'Design', 'Business', 'Emerging Tech'];

export default function CareersScreen() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [filtered, setFiltered] = useState<Career[]>([]);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { loadCareers(); }, []);
  useEffect(() => { filterCareers(); }, [careers, category, query]);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }
  }, [isLoading]);

  const loadCareers = async () => {
    try {
      const all = await CareerService.getCareers();
      setCareers(all);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCareers = () => {
    let result = careers;
    if (category !== 'All') result = result.filter(c => c.category === category);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.requiredSkills.some(s => s.toLowerCase().includes(q))
      );
    }
    setFiltered(result);
  };

  const renderCareerCard = ({ item: career, index }: { item: Career; index: number }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/career/${career.$id}` as any)}
      activeOpacity={0.85}
    >
      {/* Badges */}
      <View style={styles.badgeRow}>
        {career.isHot && (
          <View style={styles.hotBadge}>
            <Text style={styles.hotBadgeText}>🔥 HOT</Text>
          </View>
        )}
        {career.isEmerging && !career.isHot && (
          <View style={styles.emergingBadge}>
            <Text style={styles.emergingText}>🚀 EMERGING</Text>
          </View>
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{career.category}</Text>
        </View>
      </View>

      {/* Title & description */}
      <Text style={styles.cardTitle}>{career.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>{career.description}</Text>

      {/* Salary + growth */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="cash-outline" size={14} color={COLORS.highlight} />
          <Text style={styles.statLabel}>Entry Salary</Text>
          <Text style={styles.statValue}>{career.averageSalary}</Text>
        </View>
        {career.seniorSalary && (
          <View style={styles.statItem}>
            <Ionicons name="trending-up-outline" size={14} color={COLORS.accent} />
            <Text style={styles.statLabel}>Senior</Text>
            <Text style={styles.statValue}>{career.seniorSalary}</Text>
          </View>
        )}
        <View style={styles.statItem}>
          <Ionicons name="bar-chart-outline" size={14} color={COLORS.success} />
          <Text style={styles.statLabel}>Growth</Text>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{career.growthRate}</Text>
        </View>
      </View>

      {/* India demand */}
      {career.demandInIndia && (
        <View style={styles.demandRow}>
          <Ionicons name="location-outline" size={12} color={COLORS.gray} />
          <Text style={styles.demandText}>India: {career.demandInIndia}</Text>
        </View>
      )}

      {/* Skills */}
      <View style={styles.skillsRow}>
        {career.requiredSkills.slice(0, 3).map((skill) => (
          <View key={skill} style={styles.skillChip}>
            <Text style={styles.skillChipText}>{skill}</Text>
          </View>
        ))}
        {career.requiredSkills.length > 3 && (
          <Text style={styles.moreSkills}>+{career.requiredSkills.length - 3}</Text>
        )}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Text style={styles.ctaText}>View Roadmap</Text>
        <Ionicons name="arrow-forward" size={14} color={COLORS.highlight} />
      </View>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, { opacity: isLoading ? 1 : fadeAnim }]}>
      {/* Fixed header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Careers</Text>
        <Text style={styles.headerSub}>Hot & emerging roles in India 2025</Text>

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search careers, skills..."
            placeholderTextColor={COLORS.gray}
            value={query}
            onChangeText={setQuery}
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, category === cat && styles.catChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filtered.length} careers found</Text>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderCareerCard}
        keyExtractor={(c) => c.$id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 },
  headerSub: { fontSize: 13, color: COLORS.gray, marginBottom: 16 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },

  categoriesScroll: { marginBottom: 0 },
  catChip: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  catChipActive: { backgroundColor: COLORS.highlight, borderColor: COLORS.highlight },
  catChipText: { fontSize: 13, color: COLORS.gray, fontWeight: '500' },
  catChipTextActive: { color: COLORS.primary, fontWeight: '700' },

  resultsHeader: { paddingHorizontal: 20, paddingVertical: 12 },
  resultsCount: { fontSize: 13, color: COLORS.gray },

  list: { paddingHorizontal: 20, paddingBottom: 100 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: 10,
  },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  hotBadge: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  hotBadgeText: { fontSize: 10, color: '#EF4444', fontWeight: '700' },
  emergingBadge: {
    backgroundColor: 'rgba(59,130,246,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  emergingText: { fontSize: 10, color: COLORS.accent, fontWeight: '700' },
  categoryBadge: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: { fontSize: 10, color: COLORS.gray, fontWeight: '600' },

  cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  cardDesc: { fontSize: 13, color: COLORS.gray, lineHeight: 20 },

  statsRow: { flexDirection: 'row', gap: 10 },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statLabel: { fontSize: 10, color: COLORS.gray, textAlign: 'center' },
  statValue: { fontSize: 12, fontWeight: '700', color: COLORS.text, textAlign: 'center' },

  demandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  demandText: { fontSize: 11, color: COLORS.gray },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  skillChip: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
  },
  skillChipText: { fontSize: 11, color: COLORS.accent, fontWeight: '600' },
  moreSkills: { fontSize: 11, color: COLORS.gray },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.highlight,
  },
  ctaText: { fontSize: 13, fontWeight: '700', color: COLORS.highlight },
});

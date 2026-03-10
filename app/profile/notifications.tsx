import { AnimatedCard } from '@/components/AnimatedCard';
import { COLORS } from '@/constants/colors';
import { AuthService } from '@/lib/auth';
import { CareerService } from '@/lib/careerService';
import { DatabaseService, UserProgress } from '@/lib/database';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface NotificationItem {
    careerId: string;
    careerTitle: string;
    nextStep: {
        id: string;
        title: string;
        description: string;
        duration: string;
    };
}

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const user = await AuthService.getCurrentUser();
            if (!user) return;

            const progressRecords = await DatabaseService.getUserProgress(user.$id);
            const allCareers = await CareerService.getCareers();

            const nextSteps: NotificationItem[] = [];

            for (const progress of progressRecords as any as UserProgress[]) {
                const career = allCareers.find(c => c.$id === progress.careerId);
                if (!career) continue;

                // Find the first step that is NOT in completedSteps
                const completedIds = Array.isArray(progress.completedSteps)
                    ? progress.completedSteps
                    : typeof progress.completedSteps === 'string'
                        ? (progress.completedSteps as string).split(',').map(s => s.trim())
                        : [];

                const nextStep = career.roadmap.find(step => !completedIds.includes(step.id));

                if (nextStep) {
                    nextSteps.push({
                        careerId: career.$id,
                        careerTitle: career.title,
                        nextStep: {
                            id: nextStep.id,
                            title: nextStep.title,
                            description: nextStep.description,
                            duration: nextStep.duration,
                        }
                    });
                }
            }

            setNotifications(nextSteps);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResume = (id: string) => {
        router.push(`/career/${id}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Roadmap Updates</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={COLORS.highlight} />
                    </View>
                ) : notifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="notifications-off-outline" size={48} color={COLORS.gray} />
                        </View>
                        <Text style={styles.emptyTitle}>No Updates Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Start a career path to get personalized roadmap notifications and next-step guides.
                        </Text>
                        <TouchableOpacity
                            style={styles.exploreBtn}
                            onPress={() => router.push('/(tabs)/careers')}
                        >
                            <Text style={styles.exploreBtnText}>Explore Careers</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.list}>
                        <Text style={styles.sectionHeader}>Your Next Steps</Text>
                        {notifications.map((item, index) => (
                            <AnimatedCard key={item.careerId} delay={index * 100} style={styles.notifCard}>
                                <View style={styles.notifHeader}>
                                    <View style={styles.careerTag}>
                                        <Text style={styles.careerTagText}>{item.careerTitle}</Text>
                                    </View>
                                    <View style={styles.timeTag}>
                                        <Ionicons name="time-outline" size={12} color={COLORS.gray} />
                                        <Text style={styles.timeTagText}>{item.nextStep.duration}</Text>
                                    </View>
                                </View>

                                <Text style={styles.stepTitle}>{item.nextStep.title}</Text>
                                <Text style={styles.stepDesc} numberOfLines={2}>
                                    {item.nextStep.description}
                                </Text>

                                <TouchableOpacity
                                    style={styles.resumeBtn}
                                    onPress={() => handleResume(item.careerId)}
                                >
                                    <Text style={styles.resumeBtnText}>Resume Roadmap</Text>
                                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                                </TouchableOpacity>
                            </AnimatedCard>
                        ))}
                    </View>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backBtn: { padding: 4 },
    title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
    content: { flex: 1, paddingHorizontal: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },

    // Empty State
    emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
    emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
    emptySubtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    exploreBtn: { backgroundColor: COLORS.highlight, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
    exploreBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },

    // List
    list: { marginTop: 10 },
    sectionHeader: { fontSize: 16, fontWeight: 'bold', color: COLORS.gray, marginBottom: 20, letterSpacing: 1 },
    notifCard: { padding: 20, marginBottom: 16 },
    notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    careerTag: { backgroundColor: 'rgba(34,211,238,0.1)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6 },
    careerTagText: { color: COLORS.highlight, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
    timeTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    timeTagText: { color: COLORS.gray, fontSize: 12 },
    stepTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 },
    stepDesc: { fontSize: 14, color: COLORS.gray, lineHeight: 20, marginBottom: 20 },
    resumeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.highlight,
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8
    },
    resumeBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
});

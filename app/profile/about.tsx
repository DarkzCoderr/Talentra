import { AnimatedCard } from '@/components/AnimatedCard';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>About Talentra</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="sparkles" size={48} color={COLORS.highlight} />
                    </View>
                    <Text style={styles.appName}>Talentra</Text>
                    <Text style={styles.version}>Version 1.0.4</Text>
                </View>

                <AnimatedCard delay={100} style={styles.card}>
                    <Text style={styles.aboutText}>
                        Talentra is an AI-powered career companion designed specifically for the Indian education and job market. Our mission is to democratize high-quality career guidance and make it accessible to every student and professional.
                    </Text>
                    <Text style={styles.aboutText}>
                        By combining real-time industry data with personalized AI analysis, we help users find their ideal career path and provide a clear, actionable roadmap to reach their goals.
                    </Text>
                </AnimatedCard>

                <Text style={styles.sectionTitle}>What's New</Text>
                <AnimatedCard delay={200} style={styles.updateCard}>
                    <View style={styles.updateRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.updateText}>Added 5 new high-demand career paths (Go/Java, Blockchain, SDE, QA, Data Eng).</Text>
                    </View>
                    <View style={styles.updateRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.updateText}>Personalized Home UI based on your background and goals.</Text>
                    </View>
                    <View style={styles.updateRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.updateText}>Improved AI suggestion engine accuracy.</Text>
                    </View>
                </AnimatedCard>

                <View style={styles.footer}>
                    <Text style={styles.madeWith}>Made with ❤️ for Indian Students</Text>
                    <Text style={styles.copyright}>© 2026 Talentra AI. All rights reserved.</Text>
                </View>
                <View style={{ height: 40 }} />
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
    logoContainer: { alignItems: 'center', marginVertical: 40 },
    logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(34,211,238,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    appName: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
    version: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
    card: { padding: 20 },
    aboutText: { fontSize: 15, color: COLORS.gray, lineHeight: 24, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 32, marginBottom: 16 },
    updateCard: { padding: 20 },
    updateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.highlight, marginRight: 12 },
    updateText: { flex: 1, fontSize: 14, color: COLORS.gray, lineHeight: 20 },
    footer: { marginTop: 60, alignItems: 'center' },
    madeWith: { fontSize: 14, color: COLORS.text, fontWeight: '500', marginBottom: 4 },
    copyright: { fontSize: 12, color: COLORS.gray },
});

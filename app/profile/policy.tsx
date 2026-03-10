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
    View,
} from 'react-native';

export default function PolicyScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Terms & Privacy</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <AnimatedCard delay={100} style={styles.card}>
                    <Text style={styles.sectionHeader}>1. Terms of Service</Text>
                    <Text style={styles.text}>
                        Welcome to Talentra. By using our application, you agree to our terms. Talentra is a career guidance platform that provides AI-driven recommendations based on user-provided data.
                    </Text>

                    <Text style={styles.sectionHeader}>2. Privacy Policy</Text>
                    <Text style={styles.text}>
                        We value your privacy. Data collected during onboarding (interests, background, goals) is used solely to personalize your experience and improve our AI models. We do not sell your personal information to third parties.
                    </Text>

                    <Text style={styles.sectionHeader}>3. Data Protection</Text>
                    <Text style={styles.text}>
                        Your profile data is securely stored using Appwrite cloud services. You can update or delete your profile information at any time through the profile settings.
                    </Text>

                    <Text style={styles.sectionHeader}>4. Content Accuracy</Text>
                    <Text style={styles.text}>
                        While we strive for accuracy, career roadmaps and salary estimates are based on industry trends and AI analysis and should be used as general guidance rather than definitive financial advice.
                    </Text>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Last updated: March 10, 2026</Text>
                    </View>
                </AnimatedCard>
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
    card: { padding: 24, marginTop: 10 },
    sectionHeader: { fontSize: 16, fontWeight: 'bold', color: COLORS.highlight, marginBottom: 12, marginTop: 16 },
    text: { fontSize: 14, color: COLORS.gray, lineHeight: 22, marginBottom: 8 },
    footer: { marginTop: 32, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 16 },
    footerText: { fontSize: 12, color: COLORS.gray, textAlign: 'center' },
});

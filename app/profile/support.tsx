import { AnimatedCard } from '@/components/AnimatedCard';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SupportScreen() {
    const WHATSAPP_NUMBER = '6383310950'; // Placeholder

    const handleWhatsAppSupport = () => {
        const message = "Hi Talentra Support, I need help with...";
        Linking.openURL(`whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`).catch(() => {
            Alert.alert('Error', 'WhatsApp is not installed on your device');
        });
    };

    const handleEmailSupport = () => {
        Linking.openURL('mailto:support@talentra.in');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <AnimatedCard delay={100} style={styles.card}>
                    <Text style={styles.cardTitle}>How can we help?</Text>
                    <Text style={styles.cardSubtitle}>Our team is here to guide you on your career journey.</Text>

                    <TouchableOpacity style={styles.supportOption} onPress={handleWhatsAppSupport}>
                        <View style={[styles.iconCircle, { backgroundColor: '#25D366' }]}>
                            <Ionicons name="logo-whatsapp" size={24} color={COLORS.white} />
                        </View>
                        <View style={styles.optionInfo}>
                            <Text style={styles.optionLabel}>Chat on WhatsApp</Text>
                            <Text style={styles.optionSub}>Instant support from our counselors</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.supportOption} onPress={handleEmailSupport}>
                        <View style={[styles.iconCircle, { backgroundColor: COLORS.accent }]}>
                            <Ionicons name="mail-outline" size={24} color={COLORS.white} />
                        </View>
                        <View style={styles.optionInfo}>
                            <Text style={styles.optionLabel}>Email Us</Text>
                            <Text style={styles.optionSub}>Get a response within 24 hours</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                    </TouchableOpacity>
                </AnimatedCard>

                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                {[
                    { q: 'How does AI career picking work?', a: 'Our AI analyzes your skills, interests, and goals to match you with the highest-demand careers in India.' },
                    { q: 'Are the courses free?', a: 'Most roadmaps we provide consist of high-quality free resources from across the web.' },
                    { q: 'Can I track my progress?', a: 'Yes! Mark steps as completed in any career roadmap to track your journey.' }
                ].map((faq, i) => (
                    <AnimatedCard key={i} delay={200 + i * 50} style={styles.faqCard}>
                        <Text style={styles.faqQuestion}>{faq.q}</Text>
                        <Text style={styles.faqAnswer}>{faq.a}</Text>
                    </AnimatedCard>
                ))}

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
    card: { padding: 20, marginTop: 10 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
    cardSubtitle: { fontSize: 14, color: COLORS.gray, marginBottom: 24 },
    supportOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    optionInfo: { flex: 1 },
    optionLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 },
    optionSub: { fontSize: 12, color: COLORS.gray },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 8 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 32, marginBottom: 16 },
    faqCard: { padding: 16, marginBottom: 12 },
    faqQuestion: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
    faqAnswer: { fontSize: 14, color: COLORS.gray, lineHeight: 20 },
});

import { COLORS } from '@/constants/colors';
import { AuthService } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const INTERESTS = [
    'Technology', 'Design', 'Business', 'Healthcare', 'Education',
    'Finance', 'Marketing', 'Data Science', 'Artificial Intelligence',
    'Web Development', 'Mobile Development', 'Cybersecurity',
    'Cloud Computing', 'Content Creation', 'Sales',
];

const BACKGROUNDS = [
    'Computer Science / IT', 'Engineering (Non-IT)', 'Business / Commerce',
    'Arts / Humanities', 'Science (PCM/PCB)', 'Mathematics / Statistics',
    'Healthcare / Medicine', 'Law', 'Self-taught / Bootcamp', 'Other',
];

const EXPERIENCE_LEVELS = [
    { value: 'beginner', label: 'Fresher / Student', sub: '0–1 year' },
    { value: 'intermediate', label: 'Early Career', sub: '1–3 years' },
    { value: 'advanced', label: 'Experienced', sub: '3+ years' },
];

export default function PreferencesScreen() {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedBackground, setSelectedBackground] = useState('');
    const [selectedExperience, setSelectedExperience] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const user = await AuthService.getCurrentUser();
            if (user) {
                const profile = await DatabaseService.getUserProfile(user.$id);
                if (profile) {
                    setSelectedInterests(profile.interests ? profile.interests.split(', ') : []);
                    setSelectedBackground(profile.background || '');
                    setSelectedExperience(profile.experience || '');
                }
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    const handleSave = async () => {
        if (selectedInterests.length === 0 || !selectedBackground || !selectedExperience) {
            Alert.alert('Error', 'Please fill in all sections');
            return;
        }

        setIsSaving(true);
        try {
            const user = await AuthService.getCurrentUser();
            if (user) {
                await DatabaseService.updateUserProfile(user.$id, {
                    interests: selectedInterests,
                    background: selectedBackground,
                    experience: selectedExperience,
                } as any);
                Alert.alert('Success', 'Preferences updated', [{ text: 'OK', onPress: () => router.back() }]);
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            Alert.alert('Error', 'Failed to save preferences');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.highlight} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Preferences</Text>
                <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator size="small" color={COLORS.highlight} /> : <Text style={styles.saveAction}>Save</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <View style={styles.chipGrid}>
                    {INTERESTS.map(item => {
                        const selected = selectedInterests.includes(item);
                        return (
                            <TouchableOpacity
                                key={item}
                                style={[styles.chip, selected && styles.chipSelected]}
                                onPress={() => toggleInterest(item)}
                            >
                                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={styles.sectionTitle}>Background</Text>
                <View style={styles.listOptions}>
                    {BACKGROUNDS.map(item => {
                        const selected = selectedBackground === item;
                        return (
                            <TouchableOpacity
                                key={item}
                                style={[styles.optionItem, selected && styles.optionItemSelected]}
                                onPress={() => setSelectedBackground(item)}
                            >
                                <Ionicons
                                    name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                                    size={20}
                                    color={selected ? COLORS.highlight : COLORS.gray}
                                />
                                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={styles.sectionTitle}>Experience Level</Text>
                <View style={styles.experienceCards}>
                    {EXPERIENCE_LEVELS.map(level => {
                        const selected = selectedExperience === level.value;
                        return (
                            <TouchableOpacity
                                key={level.value}
                                style={[styles.expCard, selected && styles.expCardSelected]}
                                onPress={() => setSelectedExperience(level.value)}
                            >
                                <Text style={[styles.expLabel, selected && styles.expLabelSelected]}>{level.label}</Text>
                                <Text style={[styles.expSub, selected && styles.expSubSelected]}>{level.sub}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={{ height: 120 }} />
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
    saveAction: { fontSize: 16, fontWeight: 'bold', color: COLORS.highlight },
    content: { flex: 1, paddingHorizontal: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 24, marginBottom: 16 },
    chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    chipSelected: { backgroundColor: COLORS.highlight, borderColor: COLORS.highlight },
    chipText: { fontSize: 13, color: COLORS.gray },
    chipTextSelected: { color: COLORS.primary, fontWeight: 'bold' },
    listOptions: { gap: 10 },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 12,
    },
    optionItemSelected: { borderColor: COLORS.highlight, backgroundColor: 'rgba(34,211,238,0.1)' },
    optionText: { fontSize: 15, color: COLORS.gray, flex: 1 },
    optionTextSelected: { color: COLORS.text, fontWeight: 'bold' },
    experienceCards: { gap: 12 },
    expCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    expCardSelected: { borderColor: COLORS.accent, backgroundColor: 'rgba(59,130,246,0.1)' },
    expLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.gray, marginBottom: 4 },
    expLabelSelected: { color: COLORS.text },
    expSub: { fontSize: 13, color: COLORS.gray },
    expSubSelected: { color: COLORS.accent },
});

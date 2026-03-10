import { COLORS } from '@/constants/colors';
import { AuthService } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [activeField, setActiveField] = useState<string | null>(null);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters long');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      Alert.alert('Error', 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.register(email, password, name);
      router.replace('/onboarding');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { met: password.length >= 8, text: '8+ Characters' },
    { met: /[a-z]/.test(password), text: 'Lowercase' },
    { met: /[A-Z]/.test(password), text: 'Uppercase' },
    { met: /\d/.test(password), text: 'Number' },
  ];

  const renderInput = (label: string, value: string, setValue: (v: string) => void, placeholder: string, icon: string, fieldKey: string, extra = {}) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        activeField === fieldKey && styles.inputWrapperFocused
      ]}>
        <Ionicons
          name={icon as any}
          size={20}
          color={activeField === fieldKey ? COLORS.highlight : COLORS.gray}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray + '80'}
          value={value}
          onChangeText={setValue}
          onFocus={() => setActiveField(fieldKey)}
          onBlur={() => setActiveField(null)}
          {...extra}
        />
        {fieldKey.includes('password') && (
          <TouchableOpacity
            onPress={() => fieldKey === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={(fieldKey === 'password' ? showPassword : showConfirmPassword) ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background Glows */}
      <View style={[styles.glow, { top: -100, left: -100, backgroundColor: COLORS.accent + '20' }]} />
      <View style={[styles.glow, { bottom: -150, right: -100, backgroundColor: COLORS.highlight + '15' }]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[
            styles.mainContent,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
            <View style={styles.headerSection}>
              <View style={styles.logoWrapper}>
                <View style={styles.logoBackground}>
                  <Image
                    source={require('../../assets/images/talentra-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.logoGlow} />
              </View>
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.subtitleText}>Join Talentra and start your journey</Text>
            </View>

            <View style={styles.formContainer}>
              {renderInput('Full Name', name, setName, 'John Doe', 'person-outline', 'name', { autoCapitalize: 'words' })}
              {renderInput('Email Address', email, setEmail, 'name@example.com', 'mail-outline', 'email', { keyboardType: 'email-address', autoCapitalize: 'none' })}

              <View style={styles.passwordRow}>
                <View style={{ flex: 1 }}>
                  {renderInput('Password', password, setPassword, '••••••••', 'lock-closed-outline', 'password', { secureTextEntry: !showPassword })}
                </View>
              </View>

              <View style={styles.passwordRow}>
                <View style={{ flex: 1 }}>
                  {renderInput('Confirm Password', confirmPassword, setConfirmPassword, '••••••••', 'lock-closed-outline', 'confirmPassword', { secureTextEntry: !showConfirmPassword })}
                </View>
              </View>

              {password && (
                <View style={styles.requirementsGrid}>
                  {passwordRequirements.map((req, i) => (
                    <View key={i} style={styles.reqItem}>
                      <Ionicons
                        name={req.met ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={req.met ? COLORS.success : COLORS.gray}
                      />
                      <Text style={[styles.reqText, req.met && styles.reqTextMet]}>{req.text}</Text>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[styles.registerBtn, isLoading && styles.registerBtnDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : (
                  <View style={styles.btnContent}>
                    <Text style={styles.registerBtnText}>Join Talentra</Text>
                    <Ionicons name="sparkles" size={18} color={COLORS.primary} />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
  },
  mainContent: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    marginBottom: 20,
    position: 'relative',
  },
  logoBackground: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  logo: {
    width: 48,
    height: 48,
  },
  logoGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.accent,
    opacity: 0.15,
    top: -7,
    left: -7,
    zIndex: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    opacity: 0.7,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: COLORS.highlight,
    backgroundColor: 'rgba(34,211,238,0.05)',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 10,
  },
  eyeBtn: {
    padding: 8,
  },
  passwordRow: {
    flexDirection: 'row',
    gap: 12,
  },
  requirementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reqText: {
    fontSize: 11,
    color: COLORS.gray,
  },
  reqTextMet: {
    color: COLORS.success,
  },
  registerBtn: {
    backgroundColor: COLORS.highlight,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.highlight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  registerBtnDisabled: {
    opacity: 0.6,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  registerBtnText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.highlight,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

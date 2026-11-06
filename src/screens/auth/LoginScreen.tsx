import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Mail, Check } from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import { PrimaryButton, OutlinedButton, Chip } from '../../components';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid industrial work email'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<UserRole>('technician');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'sam.miller@workvoice.internal',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    await login(data.email, selectedRole);
    setIsSubmitting(false);
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'technician') {
      setValue('email', 'sam.miller@workvoice.internal');
    } else {
      setValue('email', 'sarah.jenkins@workvoice.internal');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <StatusBar style="light" />

      {/* Top Accent Hero Header */}
      <View style={styles.topHero}>
        <View style={styles.brandBadge}>
          <Sparkles size={16} color={colors.primary} strokeWidth={2.5} />
          <Text style={styles.brandTitle}>workvoice</Text>
        </View>
        <Text style={styles.heroSub}>Industrial Voice Operations Platform</Text>
      </View>

      {/* Main Bottom Sheet Body */}
      <View style={styles.bottomSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sheetTitle}>Sign in to your station</Text>
          <Text style={styles.sheetSubtitle}>
            Voice-enabled inspections and supervisor workflow
          </Text>

          {/* Quick Demo Role Selector */}
          <View style={styles.roleSelectorCard}>
            <Text style={styles.roleLabel}>Select Active Profile:</Text>
            <View style={styles.roleChipsRow}>
              <Pressable
                onPress={() => handleSelectRole('technician')}
                style={[
                  styles.rolePill,
                  selectedRole === 'technician' && styles.rolePillActive,
                ]}
              >
                {selectedRole === 'technician' && (
                  <Check size={14} color={colors.onPrimary} strokeWidth={2.5} />
                )}
                <Text
                  style={[
                    styles.rolePillText,
                    selectedRole === 'technician' && styles.rolePillTextActive,
                  ]}
                >
                  Technician (Sam)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSelectRole('supervisor')}
                style={[
                  styles.rolePill,
                  selectedRole === 'supervisor' && styles.rolePillActive,
                ]}
              >
                {selectedRole === 'supervisor' && (
                  <Check size={14} color={colors.onPrimary} strokeWidth={2.5} />
                )}
                <Text
                  style={[
                    styles.rolePillText,
                    selectedRole === 'supervisor' && styles.rolePillTextActive,
                  ]}
                >
                  Supervisor (Sarah)
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Email input with React Hook Form + Zod */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Work Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    errors.email && styles.inputWrapperError,
                  ]}
                >
                  <Mail
                    size={18}
                    color={errors.email ? colors.status.danger.text : colors.textSecondary}
                    strokeWidth={2}
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="name@company.com"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          {/* Continue Button */}
          <PrimaryButton
            label="Continue"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            style={{ marginTop: 8 }}
          />

          {/* Divider "or" */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Outlined Pill Social / SSO Buttons */}
          <View style={styles.ssoGroup}>
            <OutlinedButton
              label="Continue with Google"
              onPress={() => {
                setValue('email', `${selectedRole}.sso@workvoice.internal`);
                handleSubmit(onSubmit)();
              }}
            />
            <OutlinedButton
              label="Continue with Microsoft"
              onPress={() => {
                setValue('email', `${selectedRole}.azure@workvoice.internal`);
                handleSubmit(onSubmit)();
              }}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.accentHero,
  },
  topHero: {
    paddingTop: 54,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.pill,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  heroSub: {
    ...typography.meta,
    color: 'rgba(0,0,0,0.7)',
    fontWeight: '500',
    marginTop: 10,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.bottomSheet,
    borderTopRightRadius: radii.bottomSheet,
    paddingHorizontal: 24,
    paddingTop: 28,
    elevation: 8,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  sheetTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  sheetSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  roleSelectorCard: {
    backgroundColor: colors.surfaceMuted,
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rolePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rolePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rolePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rolePillTextActive: {
    color: colors.onPrimary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    ...typography.label,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.input,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWrapperError: {
    borderColor: colors.status.danger.text,
  },
  textInput: {
    flex: 1,
    height: 48,
    ...typography.body,
    color: colors.textPrimary,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.status.danger.text,
    marginTop: 6,
    marginLeft: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.meta,
    paddingHorizontal: 12,
    color: colors.textTertiary,
  },
  ssoGroup: {
    gap: 12,
  },
});

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { TechnicianTabs } from './TechnicianTabs';
import { SupervisorTabs } from './SupervisorTabs';
import { AssetDetailScreen } from '../screens/technician/AssetDetailScreen';
import { VoiceRecordingSheet } from '../screens/technician/VoiceRecordingSheet';
import { TranscriptObservationsScreen } from '../screens/technician/TranscriptObservationsScreen';
import { PhotoCaptureScreen } from '../screens/technician/PhotoCaptureScreen';
import { ReviewReportScreen } from '../screens/technician/ReviewReportScreen';
import { SupervisorDashboardScreen } from '../screens/supervisor/SupervisorDashboardScreen';
import { SupervisorReportReviewScreen } from '../screens/supervisor/SupervisorReportReviewScreen';
import { CorrectiveActionScreen } from '../screens/supervisor/CorrectiveActionScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  TechnicianHome: undefined;
  SupervisorDashboard: undefined;
  AssetDetail: { assetId?: string };
  VoiceRecordingSheet: { assetId?: string };
  TranscriptObservations: { initialMessage?: string } | undefined;
  PhotoCapture: undefined;
  ReviewReport: undefined;
  SupervisorReportReview: { reportId: string };
  CorrectiveAction: { actionId?: string; openAssignSheet?: boolean };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : role === 'supervisor' ? (
        <>
          <Stack.Screen name="SupervisorDashboard" component={SupervisorTabs} />
          <Stack.Screen
            name="SupervisorReportReview"
            component={SupervisorReportReviewScreen}
          />
          <Stack.Screen
            name="CorrectiveAction"
            component={CorrectiveActionScreen}
          />
          <Stack.Screen name="TechnicianHome" component={TechnicianTabs} />
          <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />
          <Stack.Screen
            name="VoiceRecordingSheet"
            component={VoiceRecordingSheet}
            options={{ animation: 'fade_from_bottom', presentation: 'transparentModal' }}
          />
          <Stack.Screen
            name="TranscriptObservations"
            component={TranscriptObservationsScreen}
          />
          <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
          <Stack.Screen name="ReviewReport" component={ReviewReportScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="TechnicianHome" component={TechnicianTabs} />
          <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />
          <Stack.Screen
            name="VoiceRecordingSheet"
            component={VoiceRecordingSheet}
            options={{ animation: 'fade_from_bottom', presentation: 'transparentModal' }}
          />
          <Stack.Screen
            name="TranscriptObservations"
            component={TranscriptObservationsScreen}
          />
          <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
          <Stack.Screen name="ReviewReport" component={ReviewReportScreen} />
          <Stack.Screen
            name="SupervisorReportReview"
            component={SupervisorReportReviewScreen}
          />
          <Stack.Screen
            name="CorrectiveAction"
            component={CorrectiveActionScreen}
          />
          <Stack.Screen name="SupervisorDashboard" component={SupervisorTabs} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};


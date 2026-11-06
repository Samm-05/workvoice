import {
  Asset,
  InspectionReport,
  CorrectiveAction,
  Defect,
  InspectionPhoto,
  ClarificationQuestion,
  User,
} from '../types';
import {
  mockAssets,
  mockChecklistC12,
  mockClarificationsC12,
  mockInitialTranscriptC12,
  mockObservationsC12,
  mockPhotosC12,
  mockReportC12,
  mockCorrectiveActions,
  mockUsers,
} from './mockData';

// Simulated latency helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ApiSimulationConfig {
  simulateLatency: boolean;
  simulateOffline: boolean;
  transcriptionErrorChance: number; // 0 to 1
  uploadErrorChance: number;
}

export const apiConfig: ApiSimulationConfig = {
  simulateLatency: true,
  simulateOffline: false,
  transcriptionErrorChance: 0,
  uploadErrorChance: 0,
};

export const api = {
  async getCurrentUser(role: 'technician' | 'supervisor' = 'technician'): Promise<User> {
    if (apiConfig.simulateLatency) await delay(300);
    return mockUsers[role];
  },

  async getAssets(): Promise<Asset[]> {
    if (apiConfig.simulateLatency) await delay(450);
    if (apiConfig.simulateOffline) {
      throw new Error('Network offline: Unable to load asset list.');
    }
    return [...mockAssets];
  },

  async getAssetById(id: string): Promise<Asset> {
    if (apiConfig.simulateLatency) await delay(350);
    const asset = mockAssets.find((a) => a.id === id);
    if (!asset) throw new Error(`Asset ${id} not found`);
    return { ...asset };
  },

  async getInspectionReports(): Promise<InspectionReport[]> {
    if (apiConfig.simulateLatency) await delay(500);
    return [{ ...mockReportC12 }];
  },

  async getInspectionById(id: string): Promise<InspectionReport> {
    if (apiConfig.simulateLatency) await delay(400);
    if (id === mockReportC12.id) {
      return { ...mockReportC12 };
    }
    throw new Error(`Report ${id} not found`);
  },

  async generateVoiceTranscript(audioUri?: string): Promise<{
    transcript: string;
    observations: Defect[];
    clarificationQuestions: ClarificationQuestion[];
  }> {
    if (apiConfig.simulateLatency) await delay(1400); // realistic speech-to-text processing time
    if (Math.random() < apiConfig.transcriptionErrorChance) {
      throw new Error('Transcription engine timeout. Please tap Retry.');
    }

    return {
      transcript: mockInitialTranscriptC12,
      observations: [...mockObservationsC12],
      clarificationQuestions: [...mockClarificationsC12],
    };
  },

  async uploadPhoto(photo: Omit<InspectionPhoto, 'id'>): Promise<InspectionPhoto> {
    if (apiConfig.simulateLatency) await delay(800);
    if (Math.random() < apiConfig.uploadErrorChance) {
      throw new Error('Photo upload failed. Check cellular connection.');
    }
    return {
      ...photo,
      id: `photo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
  },

  async submitInspectionReport(report: InspectionReport): Promise<{ success: boolean; reportId: string }> {
    if (apiConfig.simulateLatency) await delay(900);
    if (apiConfig.simulateOffline) {
      throw new Error('Offline: Inspection queued to local storage and will sync when connected.');
    }
    return {
      success: true,
      reportId: report.id || `insp-${Date.now()}`,
    };
  },

  async approveReport(reportId: string, supervisorNotes: string): Promise<InspectionReport> {
    if (apiConfig.simulateLatency) await delay(650);
    return {
      ...mockReportC12,
      id: reportId,
      status: 'approved',
      supervisorNotes,
      updatedAt: 'Just now',
    };
  },

  async requestClarification(reportId: string, note: string): Promise<InspectionReport> {
    if (apiConfig.simulateLatency) await delay(650);
    return {
      ...mockReportC12,
      id: reportId,
      status: 'needs_clarification',
      supervisorNotes: note,
      updatedAt: 'Just now',
    };
  },

  async getCorrectiveActions(): Promise<CorrectiveAction[]> {
    if (apiConfig.simulateLatency) await delay(400);
    return [...mockCorrectiveActions];
  },

  async createCorrectiveAction(action: Omit<CorrectiveAction, 'id' | 'createdAt' | 'history'>): Promise<CorrectiveAction> {
    if (apiConfig.simulateLatency) await delay(700);
    const newAction: CorrectiveAction = {
      ...action,
      id: `act-${Date.now()}`,
      createdAt: 'Just now',
      history: [
        {
          id: `h-${Date.now()}`,
          status: action.status,
          timestamp: 'Just now',
          note: 'Corrective action created by supervisor.',
          author: 'Sarah Jenkins (Supervisor)',
        },
      ],
    };
    return newAction;
  },

  async updateActionStatus(
    actionId: string,
    status: CorrectiveAction['status'],
    note: string,
    author: string
  ): Promise<CorrectiveAction> {
    if (apiConfig.simulateLatency) await delay(500);
    const existing = mockCorrectiveActions.find((a) => a.id === actionId) || mockCorrectiveActions[0];
    const updated: CorrectiveAction = {
      ...existing,
      status,
      history: [
        ...existing.history,
        {
          id: `h-${Date.now()}`,
          status,
          timestamp: 'Just now',
          note,
          author,
        },
      ],
    };
    return updated;
  },
};


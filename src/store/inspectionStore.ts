import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ChecklistStatus,
  Defect,
  InspectionPhoto,
  InspectionReport,
  CorrectiveAction,
  ActionStatus,
} from '../types';
import {
  mockChecklistC12,
  mockClarificationsC12,
  mockInitialTranscriptC12,
  mockMissingFieldsC12,
  mockObservationsC12,
  mockPhotosC12,
  mockReportC12,
  mockCorrectiveActions,
} from '../services/mockData';
import { api } from '../services/api';

interface InspectionState {
  currentDraft: InspectionReport;
  reports: InspectionReport[];
  correctiveActions: CorrectiveAction[];
  isRecording: boolean;
  recordingSeconds: number;
  isTranscribing: boolean;
  transcriptionError: string | null;
  toastMessage: string | null;

  // Actions
  showToast: (msg: string) => void;
  hideToast: () => void;
  initC12Draft: () => void;
  resetDraft: (assetId?: string, assetName?: string) => void;
  startRecording: () => void;
  stopRecordingAndTranscribe: () => Promise<void>;
  updateTranscript: (text: string) => void;
  toggleObservationConfirm: (id: string) => void;
  toggleObservationSupervisorVerify: (id: string) => void;
  updateChecklistStatus: (id: string, status: ChecklistStatus, note?: string) => void;
  addPhoto: (photo: InspectionPhoto) => void;
  togglePhotoFlag: (photoId: string) => void;
  removePhoto: (photoId: string) => void;
  answerClarification: (questionId: string, answer: string) => void;
  submitCurrentReport: () => Promise<{ success: boolean; id: string }>;
  approveReport: (reportId: string, notes: string) => Promise<void>;
  requestClarification: (reportId: string, notes: string) => Promise<void>;
  assignCorrectiveAction: (
    action: Omit<CorrectiveAction, 'id' | 'createdAt' | 'history'>
  ) => Promise<void>;
  advanceActionStatus: (
    actionId: string,
    nextStatus: ActionStatus,
    note: string,
    author: string
  ) => Promise<void>;
}

const defaultDraft: InspectionReport = {
  id: 'draft-c12-current',
  assetId: 'conveyor-c12',
  assetName: 'Conveyor C-12',
  line: 'Line 2 - Stamping & Assembly',
  technicianId: 'tech-sam',
  technicianName: 'Sam Miller',
  status: 'draft',
  createdAt: 'Today, 10:10 AM',
  updatedAt: 'Just now',
  recordingDurationSeconds: 42,
  transcript: mockInitialTranscriptC12,
  originalTranscript: mockInitialTranscriptC12,
  observations: [...mockObservationsC12],
  checklist: [...mockChecklistC12],
  photos: [...mockPhotosC12],
  clarificationQuestions: [...mockClarificationsC12],
  missingFields: [...mockMissingFieldsC12],
};

export const useInspectionStore = create<InspectionState>()(
  persist(
    (set, get) => ({
      currentDraft: { ...defaultDraft },
      reports: [{ ...mockReportC12 }],
      correctiveActions: [...mockCorrectiveActions],
      isRecording: false,
      recordingSeconds: 0,
      isTranscribing: false,
      transcriptionError: null,
      toastMessage: null,

      showToast: (msg: string) => {
        set({ toastMessage: msg });
        setTimeout(() => {
          if (get().toastMessage === msg) {
            set({ toastMessage: null });
          }
        }, 3200);
      },

      hideToast: () => set({ toastMessage: null }),

      initC12Draft: () => {
        set({
          currentDraft: {
            ...defaultDraft,
            status: 'draft',
            id: `draft-c12-${Date.now()}`,
          },
        });
      },

      resetDraft: (assetId = 'conveyor-c12', assetName = 'Conveyor C-12') => {
        set({
          currentDraft: {
            id: `draft-${Date.now()}`,
            assetId,
            assetName,
            line: 'Line 2 - Stamping & Assembly',
            technicianId: 'tech-sam',
            technicianName: 'Sam Miller',
            status: 'draft',
            createdAt: 'Just now',
            updatedAt: 'Just now',
            recordingDurationSeconds: 0,
            transcript: '',
            observations: [],
            checklist: [...mockChecklistC12.map((item) => ({ ...item, status: 'pending' as const }))],
            photos: [],
            clarificationQuestions: [],
            missingFields: ['Initial voice inspection', 'Operating thermal check'],
          },
        });
      },

      startRecording: () => {
        set({ isRecording: true, recordingSeconds: 0, transcriptionError: null });
      },

      stopRecordingAndTranscribe: async () => {
        const { currentDraft } = get();
        set({ isRecording: false, isTranscribing: true, transcriptionError: null });

        try {
          const result = await api.generateVoiceTranscript();
          set({
            isTranscribing: false,
            currentDraft: {
              ...currentDraft,
              transcript: result.transcript,
              originalTranscript: result.transcript,
              observations: result.observations,
              clarificationQuestions: result.clarificationQuestions,
              recordingDurationSeconds: 42,
              updatedAt: 'Just now',
            },
          });
          get().showToast('Voice transcription & observation extraction completed');
        } catch (error: any) {
          set({
            isTranscribing: false,
            transcriptionError: error.message || 'Failed to process voice note',
          });
        }
      },

      updateTranscript: (text: string) => {
        set((state) => ({
          currentDraft: {
            ...state.currentDraft,
            transcript: text,
            updatedAt: 'Just now',
          },
        }));
      },

      toggleObservationConfirm: (id: string) => {
        set((state) => ({
          currentDraft: {
            ...state.currentDraft,
            observations: state.currentDraft.observations.map((obs) =>
              obs.id === id ? { ...obs, technicianConfirmed: !obs.technicianConfirmed } : obs
            ),
          },
        }));
      },

      toggleObservationSupervisorVerify: (id: string) => {
        set((state) => ({
          currentDraft: {
            ...state.currentDraft,
            observations: state.currentDraft.observations.map((obs) =>
              obs.id === id ? { ...obs, supervisorVerified: !obs.supervisorVerified } : obs
            ),
          },
        }));
      },

      updateChecklistStatus: (id: string, status: ChecklistStatus, note?: string) => {
        set((state) => ({
          currentDraft: {
            ...state.currentDraft,
            checklist: state.currentDraft.checklist.map((item) =>
              item.id === id ? { ...item, status, note: note !== undefined ? note : item.note } : item
            ),
          },
        }));
      },

      addPhoto: (photo: InspectionPhoto) => {
        set((state) => ({
          currentDraft: {
            ...state.currentDraft,
            photos: [photo, ...state.currentDraft.photos],
          },
        }));
        get().showToast('Photo added to inspection report');
      },

      togglePhotoFlag: (photoId: string) => {
        set((state) => ({
          currentDraft: {
            ...state.currentDraft,
            photos: state.currentDraft.photos.map((p) =>
              p.id === photoId ? { ...p, flagged: !p.flagged } : p
            ),
          },
        }));
      },

      removePhoto: (photoId: string) => {
        set((state) => ({
          currentDraft: {
            ...state.currentDraft,
            photos: state.currentDraft.photos.filter((p) => p.id !== photoId),
          },
        }));
      },

      answerClarification: (questionId: string, answer: string) => {
        set((state) => ({
          currentDraft: {
            ...state.currentDraft,
            clarificationQuestions: state.currentDraft.clarificationQuestions.map((q) =>
              q.id === questionId ? { ...q, selectedAnswer: answer, answeredAt: 'Just now' } : q
            ),
          },
        }));
        get().showToast(`Clarification saved: "${answer}"`);
      },

      submitCurrentReport: async () => {
        const { currentDraft, reports } = get();
        const submittedReport: InspectionReport = {
          ...currentDraft,
          status: 'submitted',
          updatedAt: 'Just now',
        };

        await api.submitInspectionReport(submittedReport);

        const existingIndex = reports.findIndex((r) => r.id === submittedReport.id);
        const updatedReports =
          existingIndex >= 0
            ? reports.map((r, i) => (i === existingIndex ? submittedReport : r))
            : [submittedReport, ...reports];

        set({
          currentDraft: submittedReport,
          reports: updatedReports,
        });

        get().showToast('Report submitted for supervisor review');
        return { success: true, id: submittedReport.id };
      },

      approveReport: async (reportId: string, notes: string) => {
        const updated = await api.approveReport(reportId, notes);
        set((state) => ({
          reports: state.reports.map((r) => (r.id === reportId ? updated : r)),
          currentDraft: state.currentDraft.id === reportId ? updated : state.currentDraft,
        }));
        get().showToast('Inspection report approved');
      },

      requestClarification: async (reportId: string, notes: string) => {
        const updated = await api.requestClarification(reportId, notes);
        set((state) => ({
          reports: state.reports.map((r) => (r.id === reportId ? updated : r)),
          currentDraft: state.currentDraft.id === reportId ? updated : state.currentDraft,
        }));
        get().showToast('Clarification requested from technician');
      },

      assignCorrectiveAction: async (actionData) => {
        const newAction = await api.createCorrectiveAction(actionData);
        set((state) => ({
          correctiveActions: [newAction, ...state.correctiveActions],
        }));
        get().showToast(`Corrective action assigned to ${newAction.assignedToTechnician}`);
      },

      advanceActionStatus: async (actionId, nextStatus, note, author) => {
        const updated = await api.updateActionStatus(actionId, nextStatus, note, author);
        set((state) => ({
          correctiveActions: state.correctiveActions.map((a) => (a.id === actionId ? updated : a)),
        }));
        get().showToast(`Action status updated to ${nextStatus.toUpperCase()}`);
      },
    }),
    {
      name: 'workvoice-inspection-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentDraft: state.currentDraft,
        reports: state.reports,
        correctiveActions: state.correctiveActions,
      }),
    }
  )
);

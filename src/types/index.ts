import { StatusType } from '../theme/tokens';

export type UserRole = 'technician' | 'supervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  title: string;
  line: string;
}

export interface Asset {
  id: string;
  name: string;
  line: string;
  location: string;
  status: StatusType;
  statusLabel: string;
  imageUrl: string;
  lastInspected: string;
  pendingDefectsCount: number;
  description: string;
  speedRating: string;
  operatingHours: number;
}

export type ChecklistStatus = 'pass' | 'fail' | 'needs_review' | 'pending';

export interface ChecklistItem {
  id: string;
  code: string;
  label: string;
  category: 'Drive & Motor' | 'Belt & Rollers' | 'Safety & Guards' | 'Sensors & Electrical';
  status: ChecklistStatus;
  note?: string;
}

export interface Defect {
  id: string;
  component: string;
  description: string;
  severity: StatusType;
  confidence: number; // e.g. 0.98
  technicianConfirmed: boolean;
  supervisorVerified?: boolean;
  category: string;
  photoUri?: string;
}

export interface InspectionPhoto {
  id: string;
  uri: string;
  timestamp: string;
  label: string;
  flagged?: boolean;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  options: string[];
  selectedAnswer?: string;
  answeredAt?: string;
}

export type InspectionStatus = 'draft' | 'submitted' | 'needs_clarification' | 'approved';

export interface InspectionReport {
  id: string;
  assetId: string;
  assetName: string;
  line: string;
  technicianId: string;
  technicianName: string;
  supervisorId?: string;
  supervisorName?: string;
  status: InspectionStatus;
  createdAt: string;
  updatedAt: string;
  audioUri?: string;
  recordingDurationSeconds?: number;
  transcript: string;
  originalTranscript?: string;
  observations: Defect[];
  checklist: ChecklistItem[];
  photos: InspectionPhoto[];
  clarificationQuestions: ClarificationQuestion[];
  missingFields: string[];
  supervisorNotes?: string;
  signature?: string;
}

export type ActionPriority = 'critical' | 'high' | 'medium' | 'low';
export type ActionStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

export interface ActionHistoryEntry {
  id: string;
  status: ActionStatus;
  timestamp: string;
  note: string;
  author: string;
}

export interface CorrectiveAction {
  id: string;
  inspectionId: string;
  assetId: string;
  assetName: string;
  title: string;
  description: string;
  assignedToTechnician: string;
  priority: ActionPriority;
  dueDate: string;
  status: ActionStatus;
  createdAt: string;
  history: ActionHistoryEntry[];
}


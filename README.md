# WorkVoice — Voice-First Industrial Inspection App

WorkVoice is a voice-first industrial inspection platform engineered for field technicians and plant supervisors. It mirrors the clean, monochrome **Mindtrip** design language: generous whitespace, high-contrast black pill CTAs, large rounded image cards, a warm amber hero accent (`#F5A623`), and intuitive voice-driven workflows.

---

## 🌟 Key Highlights & Design System

- **Aesthetic:** Clean, white monochrome UI (`#FFFFFF`, `#F4F4F5`, `#E5E5E7`) with black pill CTAs (`#000000`), rounded cards, and warm amber accent (`#F5A623`) on onboarding hero.
- **Voice-First Operations:** Real-time pulse-animated `VoiceOrb` with speech-to-text transcription and automatic observation extraction.
- **Two Full Interactive Journeys:**
  - **Technician Journey:** Login → Home → Select Conveyor C-12 → Open Checklist → Record Voice → Generate Transcript → Extract Observations → Answer Clarifications → Capture Photo Evidence → Review Report → Submit.
  - **Supervisor Journey:** Login → Dashboard → Pending Reviews → Open C-12 Report → Verify Transcript & Observations → Check Missing Fields → Approve / Request Clarification → Assign Corrective Action → Stepper Resolution Tracking.
- **State Persistence:** Zustand stores with `@react-native-async-storage/async-storage` persist drafts, observations, photos, and corrective action lifecycles across reloads.
- **Validation & Types:** React Hook Form + Zod schema validation on forms, typed API simulation layer with configurable offline and latency modes.

---

## 🚀 Running on Android Emulator / Device

### 1. Prerequisites
- **Node.js**: v18+ (verified on v22)
- **Android Studio** with Android Emulator (API 33+ recommended) or an Android device with **Expo Go** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npx expo start
```

### 4. Launch on Android Emulator
Press `a` in the terminal or run:
```bash
npm run android
```

### 5. Web Preview (Optional)
```bash
npm run web
```

---

## 🧭 Step-by-Step Journey Walkthrough

### Journey 1: Technician Flow
1. **Welcome Screen:** Experience the onboarding hero with the arch illustration, floating cards, pagination dots, and black pill "Next" / "Get Started".
2. **Login Screen:** Select profile "Technician (Sam)", enter your work email (validated with Zod), or use 1-tap demo credentials.
3. **Technician Home:**
   - Tap **"Start inspection"** or select **Conveyor C-12** from the horizontal asset cards.
   - Or use the floating `InputBar` to tap the mic or attach a photo.
4. **Asset Detail / Checklist:**
   - Inspect Conveyor C-12 parameters (Line 2 · Stamping & Assembly).
   - Tap checklist rows (CHK-01 to CHK-06) to cycle status: `PASS` → `FAIL` → `NEEDS REVIEW`.
   - Tap **"Record voice note"** at the bottom.
5. **Voice Recording Sheet:**
   - Watch the animated `VoiceOrb` pulse with live recording timer.
   - Tap **"Stop & generate transcript"** to process speech.
6. **Transcript & AI Extracted Observations:**
   - Review the editable transcript bubble with Sam's avatar.
   - Tap **"Edit transcript"** to modify text in-line.
   - Review AI-extracted defects (Drive Pulley wear, belt misalignment) with confidence badges.
   - Select clarification chips (e.g. *Motor Temperature: Yes (>75°C)*).
   - Tap **"Proceed to Photo Capture"**.
7. **Photo Capture:**
   - Switch angles, inspect the viewfinder, tap the white pill shutter, and tap **"Use Photo"**.
   - Tap **"Review"** to inspect the report.
8. **Review Report & Submission:**
   - Expand / collapse sections (Transcript, Observations, Checklist, Photos, Audit Notes).
   - Tap **"Confirm & submit report"** → confirm modal → view success sheet.
   - Tap **"Open in Supervisor Review Mode"** to seamlessly transition to the supervisor journey!

---

### Journey 2: Supervisor Flow
1. **Supervisor Dashboard:**
   - Inspect the KPI chips row (Pending Reviews, Critical Issues, Active Actions, Shift Pass Rate).
   - In "Pending Inspection Reviews", tap **Conveyor C-12 Shift Inspection**.
2. **Supervisor Report Review:**
   - View dual source badge chips: *"Reported by Sam Miller"* vs *"Verified by Sarah Jenkins"*.
   - Read technician voice quote and review photo evidence.
   - Tap **"Tap to Verify"** on any defect observation to stamp supervisor verification.
   - Audit missing fields.
   - Tap **"Request clarification"** or tap **"Approve report"**.
3. **Corrective Action & Resolution Stepper:**
   - Upon approval, the Corrective Action screen opens for **Conveyor C-12: Replace Drive Pulley Lagging & Realign Belt**.
   - Tap any step in the stepper: **Open → Assigned → In Progress → Resolved → Closed**.
   - Tap **"+"** in header to open the "Assign Corrective Action" bottom sheet with technician picker and priority chips.
   - Review the chronological resolution history timeline.

---

## 📂 Project Architecture

```
src/
├── theme/
│   └── tokens.ts              # Colors, typography, spacing (4pt grid), radii, elevation
├── types/
│   └── index.ts               # User, Asset, ChecklistItem, Defect, InspectionReport, CorrectiveAction
├── components/
│   ├── Button.tsx             # PrimaryButton (h52, pill, black), SecondaryButton, IconButton
│   ├── Chip.tsx               # Chip & StatusChip (success, warning, danger, info, neutral)
│   ├── InputBar.tsx           # Floating input bar with +, mic circle, and send button
│   ├── ImageCard.tsx          # Radius 16, bottom gradient, action badges (heart, plus)
│   ├── ListRow.tsx            # Mindtrip PlaceCard row with optional "View photo" pill
│   ├── Avatar.tsx             # Avatar circle (initials) & AssistantMark
│   ├── VoiceOrb.tsx           # 96px black circle with Reanimated 3 scale & ring pulse
│   ├── PaginationDots.tsx     # 5 dots, active white / inactive white 50%
│   ├── BottomSheet.tsx        # Top radius 24, close X top-left, scrim behind
│   ├── ConfirmDialog.tsx      # Radius 20 modal with two pill buttons
│   ├── HeaderBar.tsx          # 56px height, logo or title dropdown, action icons
│   ├── Skeleton.tsx           # Shimmer loading skeleton (#F4F4F5)
│   ├── Toast.tsx              # Black pill notification toast
│   └── index.ts
├── store/
│   ├── authStore.ts           # Authentication, role switching, AsyncStorage persistence
│   └── inspectionStore.ts     # Drafts, reports, checklist status, photos, corrective actions
├── services/
│   ├── mockData.ts            # Realistic Conveyor C-12 industrial data, defects, photos
│   └── api.ts                 # Typed async API layer with latency & offline simulation
├── screens/
│   ├── auth/
│   │   ├── WelcomeScreen.tsx  # Mindtrip amber hero onboarding
│   │   └── LoginScreen.tsx    # Email validation with Zod & role switchers
│   ├── technician/
│   │   ├── TechnicianHomeScreen.tsx
│   │   ├── AssetDetailScreen.tsx
│   │   ├── VoiceRecordingSheet.tsx
│   │   ├── TranscriptObservationsScreen.tsx
│   │   ├── PhotoCaptureScreen.tsx
│   │   └── ReviewReportScreen.tsx
│   ├── supervisor/
│   │   ├── SupervisorDashboardScreen.tsx
│   │   ├── SupervisorReportReviewScreen.tsx
│   │   └── CorrectiveActionScreen.tsx
│   └── shared/
│       ├── AssetsTabScreen.tsx
│       ├── InspectionsTabScreen.tsx
│       └── ProfileTabScreen.tsx
└── navigation/
    ├── TechnicianTabs.tsx     # 5 tabs: Home, Inspections, Reports, Assets, Profile
    ├── SupervisorTabs.tsx     # 5 tabs: Overview, Inspections, Reviews, Actions, Profile
    └── RootNavigator.tsx      # Root native stack wiring all screens
```

---

## 🎨 Design Tokens Summary

| Token | Value | Usage |
|---|---|---|
| `background` | `#FFFFFF` | Screen canvas |
| `surfaceMuted` | `#F4F4F5` | Secondary buttons, chips fill, input bar |
| `border` | `#E5E5E7` | Card hairlines, outlined chips |
| `textPrimary` | `#0B0B0C` | Near-black text |
| `textSecondary` | `#6B6B70` | Subtitles, meta lines |
| `textTertiary` | `#9A9AA0` | Placeholders, captions ("Listening…") |
| `primary` | `#000000` | Black pill CTAs, Voice Orb |
| `accentHero` | `#F5A623` | Onboarding hero background |
| `accentBlue` | `#CFE3FF` bg / `#2F6FED` | Avatar circle |
| `heartRed` | `#FF4D5E` | Flag / favorite indicator |
| `Status Success` | `#1F9D55` on `#E8F6EE` | Operational / Passed / Approved |
| `Status Warning` | `#B7791F` on `#FDF3DC` | Needs Review / Maintenance Req |
| `Status Danger` | `#D64545` on `#FDECEC` | Critical Fault / Fail |


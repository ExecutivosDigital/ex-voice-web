# Recording System Documentation - ex-voice-web

## Overview

This document provides a comprehensive breakdown of how the recording system works in ex-voice-web. The system supports both audio-only recordings and video recordings (for online meetings with screen capture).

---

## Architecture Overview

The recording system is composed of three main custom hooks and one main component:

1. **`useMediaRecorder`** - Handles the actual media recording (audio/video)
2. **`useRecordingFlow`** - Manages the recording workflow and metadata
3. **`useRecordingUpload`** - Handles the upload process to the API
4. **`AudioRecorder`** - Main component that orchestrates everything

---

## 1. Recording Flow and State Management

### Recording Steps

The recording process follows these steps (defined in `use-recording-flow.ts`):

- `idle` - Initial state, no recording active
- `save-dialog` - User fills in metadata (name, description, type, client selection)
- `instructions` - For video recordings, shows instructions for screen sharing
- `recording` - Active recording state
- `preview` - Review the recorded media before saving
- `processing` - Uploading and saving to API

### Metadata Structure

```typescript
interface RecordingMetadata {
  name: string;
  description: string;
  recordingType: "CLIENT" | "PERSONAL";
  consultationType: "IN_PERSON" | "ONLINE" | null; // Only for CLIENT
  personalRecordingType: "REMINDER" | "STUDY" | "OTHER" | null; // Only for PERSONAL
  selectedClientId: string; // Only for CLIENT
}
```

### Media Type Determination

The media type (audio vs video) is determined dynamically based on metadata:

- **Audio**: All personal recordings OR client recordings with `consultationType === "IN_PERSON"`
- **Video**: Client recordings with `consultationType === "ONLINE"`

```typescript
const getMediaTypeFromMetadata = (metadata: {
  recordingType: string;
  consultationType: string | null;
}): "audio" | "video" => {
  return metadata.recordingType === "CLIENT" &&
    metadata.consultationType === "ONLINE"
    ? "video"
    : "audio";
};
```

---

## 2. Audio Recording Configuration

### Location: `use-media-recorder.ts` - `startAudioRecording()`

### Audio Input Settings

```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true, // Reduces echo
    noiseSuppression: true, // Reduces background noise
    autoGainControl: true, // Automatically adjusts volume
    sampleRate: 44100, // 44.1 kHz sample rate (CD quality)
  },
});
```

### Codec Selection

The system uses the best available codec:

```typescript
const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
  ? "audio/webm;codecs=opus" // Preferred: Opus codec
  : "audio/webm"; // Fallback: Default WebM
```

### Bitrate Configuration

```typescript
const mediaRecorder = new MediaRecorder(stream, {
  mimeType,
  audioBitsPerSecond: 128000, // 128 kbps bitrate
});
```

### Data Capture Frequency

```typescript
mediaRecorder.start(100); // Capture data every 100ms to prevent data loss
```

### Key Audio Recording Features:

- **Sample Rate**: 44.1 kHz (high quality)
- **Bitrate**: 128 kbps
- **Codec**: Opus (preferred) or default WebM
- **Audio Processing**: Echo cancellation, noise suppression, auto gain control
- **Data Capture**: Every 100ms to prevent loss

---

## 3. Video Recording Configuration

### Location: `use-media-recorder.ts` - `startVideoRecording()`

### Screen Capture Settings

```typescript
const displayStream = await navigator.mediaDevices.getDisplayMedia({
  video: {
    displaySurface: "browser" as DisplayCaptureSurfaceType,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  } as MediaStreamConstraints,
  preferCurrentTab: false,
  selfBrowserSurface: "exclude",
  systemAudio: "include", // Captures system audio from the tab
} as MediaStreamConstraints);
```

### Audio Mixing

The system mixes two audio sources:

1. **Tab Audio**: Audio from the shared browser tab (Google Meet, etc.)
2. **Microphone Audio**: User's microphone (optional, captured if available)

```typescript
// Creates AudioContext to mix audio sources
const audioContext = new AudioContext();
const destination = audioContext.createMediaStreamDestination();

// Mix tab audio
const tabAudioSource = audioContext.createMediaStreamSource(displayStream);
tabAudioSource.connect(destination);

// Mix microphone audio (if available)
if (micStream) {
  const micSource = audioContext.createMediaStreamSource(micStream);
  micSource.connect(destination);
}

// Final stream combines video + mixed audio
const finalStream = new MediaStream([
  ...displayStream.getVideoTracks(),
  ...destination.stream.getAudioTracks(),
]);
```

### Video Codec Selection

```typescript
const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
  ? "video/webm;codecs=vp9,opus" // Preferred: VP9 video + Opus audio
  : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
    ? "video/webm;codecs=vp8,opus" // Fallback: VP8 video + Opus audio
    : "video/webm"; // Final fallback: Default WebM
```

### Video Bitrate

```typescript
const mediaRecorder = new MediaRecorder(finalStream, {
  mimeType,
  videoBitsPerSecond: 1000000, // 1 Mbps (reduced from 2.5 Mbps)
});
```

### Audio Validation

The system validates that audio is being captured:

```typescript
const audioTracks = displayStream.getAudioTracks();
if (audioTracks.length === 0) {
  throw new Error(
    'Áudio não detectado. Selecione uma ABA e marque "Compartilhar áudio da aba"',
  );
}
```

### Key Video Recording Features:

- **Resolution**: 1920x1080 (ideal)
- **Video Bitrate**: 1 Mbps
- **Video Codec**: VP9 (preferred) or VP8 (fallback)
- **Audio Codec**: Opus
- **Audio Mixing**: Tab audio + microphone audio
- **Audio Sample Rate**: 44.1 kHz
- **Data Capture**: Every 100ms

---

## 4. Duration Tracking

### Precise Timer Implementation

The system uses `requestAnimationFrame` for accurate duration tracking:

```typescript
// Timer using timestamps
const startTimeRef = useRef<number>(0);
const pausedTimeRef = useRef<number>(0);
const pauseStartRef = useRef<number>(0);

const updateDuration = useCallback(() => {
  if (startTimeRef.current && !state.isPaused) {
    const elapsed = Math.floor(
      (Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000,
    );
    setState((prev) => ({ ...prev, duration: elapsed }));
    animationFrameRef.current = requestAnimationFrame(updateDuration);
  }
}, [state.isPaused]);
```

### Final Duration Calculation

```typescript
const finalDuration = Math.floor(
  (Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000,
);
```

### Duration Formatting for API

```typescript
const formatDurationForAPI = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};
```

**Key Points:**

- Uses `Date.now()` timestamps for precision
- Accounts for paused time
- Updates via `requestAnimationFrame` for smooth UI
- Final duration calculated on stop

---

## 5. Upload Process (Presigned URLs)

### Location: `use-recording-upload.ts`

### Two-Step Upload Process

#### Step 1: Request Presigned URL

```typescript
const presignedResponse = await PostAPI(
  "/upload/presigned-url",
  {
    fileName: `recording-${Date.now()}.${extension}`, // e.g., "recording-1234567890.mp3"
    fileType: mimeType, // "audio/mpeg" for audio, "video/webm" for video
  },
  true, // Requires authentication
);
```

**File Extensions:**

- Audio: `.mp3`
- Video: `.webm`

**MIME Types:**

- Audio: `audio/mpeg`
- Video: `video/webm`

#### Step 2: Direct Upload to Presigned URL

```typescript
const uploadResponse = await fetch(uploadUrl, {
  method: "PUT", // Presigned URLs use PUT method
  body: blob, // The recorded media blob
  headers: {
    "Content-Type": mimeType, // Must match the exact MIME type
  },
});
```

**Response Handling:**

```typescript
const presignedData = presignedResponse.body;
const uploadUrl = presignedData.uploadUrl || presignedData.url;
const finalUrl = presignedData.finalUrl || presignedData.url;
```

**Key Points:**

- Uses presigned URLs for direct S3/storage upload
- PUT method for upload
- Exact Content-Type header required
- Returns final URL for API payload

---

## 6. API Payload Structure

### Location: `audio-recorder.tsx` - `handleRecordingComplete()`

### Recording Creation Payload

```typescript
const payload = {
  name: metadata.name.trim() || getDerivedTitle(),
  description: metadata.description || getDerivedDescription(),
  duration: formatDurationForAPI(duration), // e.g., "5m 30s"
  seconds: duration, // e.g., 330
  audioUrl: uploadedUrl, // Final URL from presigned upload
  type:
    metadata.recordingType === "PERSONAL"
      ? metadata.personalRecordingType // "REMINDER" | "STUDY" | "OTHER"
      : "CLIENT", // "CLIENT"
  ...(metadata.selectedClientId ? { clientId: metadata.selectedClientId } : {}),
};
```

### API Endpoint

```typescript
const response = await PostAPI("/recording", payload, true);
```

### Derived Titles

If user doesn't provide a name, system generates one:

**For CLIENT recordings:**

- Default: "Gravação do Cliente"

**For PERSONAL recordings:**

- REMINDER: "Lembrete"
- STUDY: "Estudo"
- OTHER: "Gravação"

### Derived Descriptions

If user doesn't provide a description, system generates one:

**For CLIENT recordings:**

```typescript
const type =
  metadata.consultationType === "IN_PERSON" ? "presencial" : "online";
return `Reunião ${type} realizada em ${date}`;
```

**For PERSONAL recordings:**

```typescript
const labels = {
  REMINDER: "Gravação de lembrete",
  STUDY: "Gravação de estudo",
  OTHER: "Gravação pessoal",
};
return (
  labels[metadata.personalRecordingType!] ||
  `Gravação pessoal realizada em ${date}`
);
```

---

## 7. Error Handling

### Recording Errors

```typescript
catch (error: any) {
  let errorMessage = "Erro ao iniciar gravação";

  if (error.name === "NotAllowedError") {
    errorMessage = "Permissão negada. Permita o acesso ao microfone.";
  } else if (error.name === "NotFoundError") {
    errorMessage = "Nenhum microfone encontrado.";
  } else if (error.message) {
    errorMessage = error.message;  // Custom error messages
  }

  setError(errorMessage);
  setCurrentStep("save-dialog");
}
```

### Upload Errors

```typescript
catch (error) {
  // Network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    throw new Error(
      "Erro de conexão. Verifique sua internet e tente novamente.",
    );
  }
  throw error;
}
```

### Save Errors

```typescript
catch (error: any) {
  let errorMessage = "Erro ao salvar gravação. Tente novamente.";
  if (error.message) {
    errorMessage = error.message;
  }

  setError(errorMessage);
  toast.error(errorMessage);
  setCurrentStep("preview");  // Return to preview to allow retry
  // DO NOT call resetFlow() - keep the modal open with the recording
}
```

**Key Error Handling Features:**

- Specific error messages for different scenarios
- Preserves recording on save errors (allows retry)
- Network error detection
- User-friendly error messages

---

## 8. Cleanup and Resource Management

### Location: `use-media-recorder.ts` - `cleanup()`

```typescript
const cleanup = useCallback(() => {
  // Cancel animation frame
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }

  // Stop all media tracks
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  if (displayStreamRef.current) {
    displayStreamRef.current.getTracks().forEach((track) => track.stop());
    displayStreamRef.current = null;
  }

  // Close audio context
  if (audioContextRef.current) {
    audioContextRef.current.close();
    audioContextRef.current = null;
  }

  // Stop media recorder if active
  if (
    mediaRecorderRef.current &&
    mediaRecorderRef.current.state !== "inactive"
  ) {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current = null;
  }
}, []);
```

**Cleanup is called:**

- On component unmount
- On recording errors
- On recording stop
- On reset

---

## 9. Key Implementation Details

### Media Type Handling

- The `mediaType` is derived from metadata, not set manually
- The recorder hook receives `currentMediaType` which is computed from metadata
- Both audio and video recordings use the same flow, just different recording functions

### Blob Handling

- Audio recordings: `audio/webm` or `audio/webm;codecs=opus` blob
- Video recordings: `video/webm` or `video/webm;codecs=vp9,opus` blob
- Blobs are created from chunks array: `new Blob(chunksRef.current, { type: mimeType })`
- Object URLs are created for preview: `URL.createObjectURL(mediaBlob)`
- Object URLs are revoked on reset: `URL.revokeObjectURL(state.mediaUrl)`

### State Management

- Uses React hooks (`useState`, `useRef`, `useCallback`, `useEffect`)
- State is managed in `useMediaRecorder` hook
- Metadata is managed in `useRecordingFlow` hook
- Upload logic is in `useRecordingUpload` hook

### Preview System

- Audio preview uses `<audio>` element
- Video preview uses `<video>` element
- Preview is shown in `preview` step before final save
- User can retry recording from preview step

---

## 10. Summary of Quality Settings

### Audio Recording

| Setting               | Value            |
| --------------------- | ---------------- |
| Sample Rate           | 44.1 kHz         |
| Bitrate               | 128 kbps         |
| Codec                 | Opus (preferred) |
| Echo Cancellation     | Enabled          |
| Noise Suppression     | Enabled          |
| Auto Gain Control     | Enabled          |
| Data Capture Interval | 100ms            |

### Video Recording

| Setting               | Value                          |
| --------------------- | ------------------------------ |
| Resolution            | 1920x1080 (ideal)              |
| Video Bitrate         | 1 Mbps                         |
| Video Codec           | VP9 (preferred) or VP8         |
| Audio Codec           | Opus                           |
| Audio Sample Rate     | 44.1 kHz                       |
| Audio Sources         | Tab audio + Microphone (mixed) |
| Data Capture Interval | 100ms                          |

---

## 11. API Integration Points

### Endpoints Used

1. **POST `/upload/presigned-url`**
   - Request: `{ fileName: string, fileType: string }`
   - Response: `{ uploadUrl: string, finalUrl: string }` or `{ url: string }`

2. **POST `/recording`**
   - Request: `{ name, description, duration, seconds, audioUrl, type, clientId? }`
   - Response: Recording object

### Authentication

- All API calls use `auth: true` parameter
- Uses AWS Amplify Cognito for authentication
- Bearer token in Authorization header

---

## 12. Important Notes for Migration

### Critical Settings to Preserve:

1. **Audio quality settings** (sampleRate: 44100, audioBitsPerSecond: 128000)
2. **Codec selection logic** (Opus preferred, fallbacks)
3. **Presigned URL upload flow** (two-step process)
4. **Duration tracking** (requestAnimationFrame with timestamps)
5. **Audio mixing for video** (AudioContext mixing)
6. **Error handling** (preserve recording on save errors)
7. **Cleanup logic** (proper resource management)

### File Structure:

```
src/components/audio-recorder/
  ├── audio-recorder.tsx          # Main component
  ├── use-media-recorder.ts       # Recording logic
  ├── use-recording-flow.ts       # Flow management
  └── use-recording-upload.ts     # Upload logic
```

### Dependencies:

- React hooks (useState, useRef, useCallback, useEffect)
- MediaRecorder API
- AudioContext API (for video audio mixing)
- AWS Amplify (for authentication)
- axios (for API calls)

---

## 13. Testing Checklist

When implementing this in health-voice, verify:

- [ ] Audio recording with 44.1 kHz sample rate
- [ ] Audio recording with 128 kbps bitrate
- [ ] Opus codec is used when available
- [ ] Video recording captures tab audio
- [ ] Video recording mixes microphone audio
- [ ] Presigned URL upload works (two-step process)
- [ ] Duration tracking is accurate
- [ ] Error handling preserves recordings
- [ ] Cleanup properly releases resources
- [ ] Preview works for both audio and video
- [ ] API payload includes both `duration` (formatted) and `seconds` (numeric)

---

## End of Documentation

This document covers all aspects of the recording system in ex-voice-web. Use this as a reference when implementing similar functionality in health-voice.

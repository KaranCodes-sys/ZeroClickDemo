
// import { useState, useRef } from 'react';

// export const useVoiceRecording = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       chunksRef.current = [];

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
//         // Here you would typically send to speech recognition service
//         console.log('Audio recorded:', audioBlob);
//         setIsRecording(false);
//         setIsListening(false);
//       };

//       mediaRecorderRef.current.start();
//       setIsRecording(true);
//       setIsListening(true);
//     } catch (error) {
//       console.error('Error starting recording:', error);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
//     }
//   };

//   const startListening = () => {
//     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       const recognition = new SpeechRecognition();
      
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         setIsListening(true);
//         console.log('Voice recognition started');
//       };

//       recognition.onresult = (event) => {
//         const transcript = Array.from(event.results)
//           .map(result => result[0])
//           .map(result => result.transcript)
//           .join('');
        
//         console.log('Voice input:', transcript);
//         // Here you would process the voice command
//       };

//       recognition.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         setIsListening(false);
//       };

//       recognition.onend = () => {
//         setIsListening(false);
//       };

//       recognition.start();
//       return recognition;
//     } else {
//       console.log('Speech recognition not supported, falling back to recording');
//       startRecording();
//       return null;
//     }
//   };

//   return {
//     isRecording,
//     isListening,
//     startRecording,
//     stopRecording,
//     startListening
//   };
// };
// src/hooks/useVoiceRecording.ts
// -------------------------------------------------------------------
// Cross‑platform voice‑input hook
//   • Web  : window.SpeechRecognition / webkitSpeechRecognition
//   • Mobile (Capacitor) : @capacitor-community/speech-recognition
// -------------------------------------------------------------------
import { useState, useRef, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

/* ------------------------- return type --------------------------- */
export interface UseVoiceRecording {
  isListening: boolean;
  transcript: string;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
}

/* --------------------- helper: web recognizer -------------------- */
const createWebRecognizer = (): SpeechRecognition | null => {
  const Ctor: any =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
};

/* --------------------------- the hook ---------------------------- */
export const useVoiceRecording = (): UseVoiceRecording => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const platform = Capacitor.getPlatform(); // 'web' | 'android' | 'ios'
  const webRecognizerRef = useRef<SpeechRecognition | null>(null);

  /* ---------- native‑permission helper (Android/iOS) ------------- */
  const ensureNativePermission = async (): Promise<boolean> => {
    const { available } = await SpeechRecognition.available();
    if (!available) {
      alert('Speech recognition not available on this device.');
      return false;
    }

    const perm = await SpeechRecognition.checkPermissions();
    if (perm.speechRecognition !== 'granted') {
      const requested = await SpeechRecognition.requestPermissions();
      if (requested.speechRecognition !== 'granted') {
        alert('Microphone permission is required.');
        return false;
      }
    }
    return true;
  };

  /* ------------------------ startListening ----------------------- */
  const startListening = async (): Promise<void> => {
    if (isListening) return;

    /* ========= WEB ========= */
    if (platform === 'web') {
      const rec = createWebRecognizer();
      if (!rec) {
        alert('SpeechRecognition is not supported in this browser.');
        return;
      }
      webRecognizerRef.current = rec;

      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const text = Array.from(e.results)
          .map(r => r[0].transcript)
          .join(' ');
        setTranscript(text.trim());
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      rec.start();
      return;
    }

    /* ======== ANDROID / iOS ========= */
    if (!(await ensureNativePermission())) return;

    setIsListening(true);
    try {
      const { matches } = await SpeechRecognition.start({
        language: 'en-US',
        maxResults: 1,
        partialResults: false,
        prompt: 'Speak now…',
        popup: true,
      });
      if (matches && matches.length) setTranscript(matches[0]);
    } catch (err) {
      console.error('Native SR error:', err);
    } finally {
      setIsListening(false);
    }
  };

  /* ------------------------ stopListening ------------------------ */
  const stopListening = async (): Promise<void> => {
    if (!isListening) return;

    if (platform === 'web') {
      webRecognizerRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        await SpeechRecognition.stop();
      } finally {
        setIsListening(false);
      }
    }
  };

  /* -------- remove native event listeners on unmount ------------- */
  useEffect(() => {
    return () => {
      SpeechRecognition.removeAllListeners();
    };
  }, []);

  return { isListening, transcript, startListening, stopListening };
};

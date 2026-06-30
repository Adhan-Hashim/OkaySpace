// Text-to-Speech Engine for the "Guru"

let voices: SpeechSynthesisVoice[] = [];
let preferredVoice: SpeechSynthesisVoice | null = null;
let isPlaying = false;

// Initialize and find the best voice
export function initTTS() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const loadVoices = () => {
    voices = window.speechSynthesis.getVoices();
    // Try to find a deep/soothing voice. Usually UK English male or Google UK English Male are good.
    // If not, just fallback to default English.
    preferredVoice = voices.find(v => v.name.includes('Google UK English Male')) ||
                     voices.find(v => v.name.includes('UK English') && v.name.includes('Male')) ||
                     voices.find(v => v.lang === 'en-GB' || v.lang === 'en-US') ||
                     voices[0];
  };

  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function stopTTS() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.resume(); } catch (e) {}
    window.speechSynthesis.cancel();
    isPlaying = false;
  }
}

export function speakStep(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) setTimeout(onEnd, 2000); // Mock delay if no TTS
    return;
  }

  try { window.speechSynthesis.resume(); } catch (e) {}

  const utterance = new SpeechSynthesisUtterance(text);
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Guru style: slow, low pitch
  utterance.rate = 0.85; 
  utterance.pitch = 0.8;
  utterance.volume = 1;

  utterance.onend = () => {
    if (onEnd && isPlaying) {
      onEnd();
    }
  };

  utterance.onerror = () => {
    if (onEnd && isPlaying) {
      onEnd();
    }
  };

  window.speechSynthesis.speak(utterance);
}

export async function playMeditationSequence(steps: string[], onProgress: (index: number) => void, onComplete: () => void) {
  stopTTS();
  isPlaying = true;
  
  let currentIndex = 0;

  const nextStep = () => {
    if (!isPlaying) return;
    if (currentIndex >= steps.length) {
      isPlaying = false;
      onComplete();
      return;
    }

    onProgress(currentIndex);
    speakStep(steps[currentIndex], () => {
      // Pause for 5 seconds between steps for reflection
      if (isPlaying) {
        setTimeout(() => {
          currentIndex++;
          nextStep();
        }, 5000); 
      }
    });
  };

  // Small delay before starting
  setTimeout(nextStep, 1000);
}

export class SpeechRecognitionService {
  constructor(onResult, onStatusChange) {
    this.recognizer = null;
    this.isListening = false;
    this.onResult = onResult;
    this.onStatusChange = onStatusChange;

    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognizer = new SpeechRecognition();
      this.recognizer.lang = "en-US";
      this.recognizer.continuous = false;
      this.recognizer.interimResults = false;

      this.recognizer.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          if (this.onResult) this.onResult(transcript);
        }
      };

      this.recognizer.onstart = () => {
        this.isListening = true;
        if (this.onStatusChange) this.onStatusChange(true);
      };

      this.recognizer.onend = () => {
        this.isListening = false;
        if (this.onStatusChange) this.onStatusChange(false);
      };

      this.recognizer.onerror = () => {
        this.isListening = false;
        if (this.onStatusChange) this.onStatusChange(false);
      };
    }
  }

  setLang(langCode) {
    if (this.recognizer) {
      this.recognizer.lang = langCode;
    }
  }

  toggle() {
    if (!this.recognizer) return false;
    if (this.isListening) {
      this.recognizer.stop();
    } else {
      try {
        this.recognizer.start();
      } catch (e) {
        console.warn("Speech recognition start failed:", e);
      }
    }
    return true;
  }
}

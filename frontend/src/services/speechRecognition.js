/**
 * SpeechRecognitionService
 * Modern Web Speech API wrapper with automatic permission handling,
 * real-time interim results, error recovery, and multi-language support.
 */

export class SpeechRecognitionService {
  constructor(onResult, onStatusChange, onError, onPermissionRequired) {
    this.recognizer = null;
    this.isListening = false;
    this.onResult = onResult;
    this.onStatusChange = onStatusChange;
    this.onError = onError;
    this.onPermissionRequired = onPermissionRequired;
    this.currentLang = "en-US";
    this.baseText = "";

    this.initRecognizer();
  }

  initRecognizer() {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API is not supported in this browser.");
      return;
    }

    try {
      this.recognizer = new SpeechRecognition();
      this.recognizer.lang = this.currentLang;
      this.recognizer.continuous = true;
      this.recognizer.interimResults = true;
      this.recognizer.maxAlternatives = 1;

      this.recognizer.onstart = () => {
        this.isListening = true;
        if (this.onStatusChange) this.onStatusChange(true);
      };

      this.recognizer.onresult = (event) => {
        let interim = "";
        let final = "";

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript + " ";
          } else {
            interim += res[0].transcript;
          }
        }

        const recognized = (final + interim).trim();
        if (recognized) {
          const combined = this.baseText
            ? `${this.baseText.trim()} ${recognized}`.trim()
            : recognized;

          if (this.onResult) {
            this.onResult(combined);
          }
        }
      };

      this.recognizer.onerror = (event) => {
        console.warn("SpeechRecognition error:", event.error);
        this.isListening = false;
        if (this.onStatusChange) this.onStatusChange(false);

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          this.triggerPermissionModal("denied");
        } else if (event.error === "audio-capture") {
          const msg = "Không tìm thấy thiết bị Microphone. Vui lòng kiểm tra lại dây cắm hoặc micro!";
          if (this.onError) this.onError(msg);
        } else if (event.error === "network") {
          console.warn("Dịch vụ nhận diện giọng nói gặp sự cố mạng.");
        }
      };

      this.recognizer.onend = () => {
        this.isListening = false;
        if (this.onStatusChange) this.onStatusChange(false);
      };
    } catch (err) {
      console.warn("Could not instantiate SpeechRecognition:", err);
      this.recognizer = null;
    }
  }

  triggerPermissionModal(reason = "denied") {
    if (typeof this.onPermissionRequired === "function") {
      this.onPermissionRequired(reason);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("shotlang:mic-permission-required", { detail: { reason } })
      );
    }
  }

  setLang(langCode) {
    if (!langCode) return;
    this.currentLang = langCode;
    if (this.recognizer) {
      this.recognizer.lang = langCode;
    }
  }

  async requestMicrophonePermission() {
    if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (err) {
        console.warn("requestMicrophonePermission denied:", err);
        return false;
      }
    }
    return false;
  }

  async toggle(currentBaseText = "") {
    // Save base text so spoken words append to current input
    this.baseText = typeof currentBaseText === "string" ? currentBaseText : "";

    if (this.isListening) {
      try {
        this.recognizer && this.recognizer.stop();
      } catch (e) {
        console.warn("Stop error:", e);
      }
      this.isListening = false;
      if (this.onStatusChange) this.onStatusChange(false);
      return false;
    }

    // 1. Check if permission was explicitly blocked
    if (typeof navigator !== "undefined" && navigator.permissions && navigator.permissions.query) {
      try {
        const perm = await navigator.permissions.query({ name: "microphone" });
        if (perm.state === "denied") {
          this.triggerPermissionModal("denied");
          return false;
        }
      } catch (e) {
        // Query microphone might not be supported in some browser engines
      }
    }

    // 2. Request microphone access via getUserMedia to prompt browser dialog if not yet granted
    if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.warn("Microphone access error via getUserMedia:", err);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          this.triggerPermissionModal("denied");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          if (this.onError) this.onError("Không tìm thấy thiết bị Microphone trên máy của bạn.");
        }
        return false;
      }
    }

    // 3. Always create a fresh recognizer instance to avoid stale state
    //    (Chrome's SpeechRecognition gets stuck after a deny→grant cycle)
    this.initRecognizer();

    if (!this.recognizer) {
      if (this.onError) {
        this.onError("Trình duyệt hiện tại chưa hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome, Edge hoặc Safari!");
      }
      return false;
    }

    // 4. Start fresh recognizer
    try {
      this.recognizer.lang = this.currentLang;
      this.recognizer.start();
      return true;
    } catch (e) {
      console.warn("Speech recognition start failed:", e);
      return false;
    }
  }
}

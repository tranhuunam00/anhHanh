/**
 * SpeechRecognitionService
 * Modern Web Speech API wrapper with automatic permission handling,
 * real-time interim results, error recovery, and multi-language support.
 */

export class SpeechRecognitionService {
  constructor(onResult, onStatusChange, onError) {
    this.recognizer = null;
    this.isListening = false;
    this.onResult = onResult;
    this.onStatusChange = onStatusChange;
    this.onError = onError;
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
          const msg = "Quyền truy cập Microphone bị từ chối. Vui lòng bấm vào biểu tượng Micro/Ổ khóa trên thanh địa chỉ của trình duyệt để Cho phép (Allow)!";
          alert(msg);
          if (this.onError) this.onError(msg);
        } else if (event.error === "audio-capture") {
          const msg = "Không tìm thấy thiết bị Microphone. Vui lòng kiểm tra lại kết nối micro!";
          alert(msg);
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

  setLang(langCode) {
    if (!langCode) return;
    this.currentLang = langCode;
    if (this.recognizer) {
      this.recognizer.lang = langCode;
    }
  }

  async toggle(currentBaseText = "") {
    if (!this.recognizer) {
      alert("Trình duyệt của bạn hiện chưa hỗ trợ Web Speech API. Vui lòng sử dụng Google Chrome hoặc Microsoft Edge để nói qua micro!");
      return false;
    }

    if (this.isListening) {
      try {
        this.recognizer.stop();
      } catch (e) {
        console.warn("Stop error:", e);
      }
      this.isListening = false;
      if (this.onStatusChange) this.onStatusChange(false);
      return false;
    }

    // Save base text so spoken words append or complete the current input
    this.baseText = typeof currentBaseText === "string" ? currentBaseText : "";

    // Explicitly request microphone permission first if mediaDevices is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately release stream so SpeechRecognition can bind to the audio hardware
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.warn("Microphone permission denied via getUserMedia:", err);
        alert("Chưa cấp quyền truy cập Microphone. Vui lòng cho phép quyền micro trên trình duyệt để sử dụng tính năng này!");
        return false;
      }
    }

    try {
      this.recognizer.lang = this.currentLang;
      this.recognizer.start();
      return true;
    } catch (e) {
      console.warn("Speech recognition start failed:", e);
      // If already started, stop and restart cleanly
      try {
        this.recognizer.stop();
        setTimeout(() => {
          try {
            this.recognizer.start();
          } catch (err2) {
            console.warn("Retry start failed:", err2);
          }
        }, 150);
      } catch (err3) {
        // Ignored
      }
      return false;
    }
  }
}

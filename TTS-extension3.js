(function(Scratch) {
  'use strict';

  class WebSpeechTTS {
    constructor() {
      this.isSpeaking = false;
      this.voices = [];

      // Load voices on startup
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      // Preload
      this.voices = window.speechSynthesis.getVoices();
    }

    getInfo() {
      return {
        id: 'webspeechTTS',
        name: 'Web Speech TTS',
        blocks: [
          {
            opcode: 'speakWithVoice',
            blockType: Scratch.BlockType.COMMAND,
            text: 'say [TEXT] with voice [VOICE]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello world!' },
              VOICE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Google UK English Male' }
            }
          },
          {
            opcode: 'listVoices',
            blockType: Scratch.BlockType.REPORTER,
            text: 'available voices'
          }
        ]
      };
    }

    speakWithVoice(args) {
      const utterance = new SpeechSynthesisUtterance(args.TEXT);
      const selectedVoice = this.voices.find(v => v.name === args.VOICE);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      window.speechSynthesis.speak(utterance);
    }

    listVoices() {
      // Return a comma-separated list of available voice names
      const currentVoices = window.speechSynthesis.getVoices();
      return currentVoices.map(v => v.name).join(', ');
    }
  }

  Scratch.extensions.register(new WebSpeechTTS());
})(Scratch);

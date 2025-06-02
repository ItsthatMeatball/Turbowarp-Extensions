(function(Scratch) {
  'use strict';

  class WebSpeechTTS {
    constructor() {
      this.isSpeaking = false;
      this.voices = [];

      // Load voices when available
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };

      // Preload voices if available immediately
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
              VOICE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'voiceMenu'
              }
            }
          }
        ],
        menus: {
          voiceMenu: {
            acceptReporters: false,
            items: 'getVoiceList'
          }
        }
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

    getVoiceList() {
      // Return array of voice names as menu items
      const currentVoices = window.speechSynthesis.getVoices();
      if (currentVoices.length === 0) return ['(no voices loaded)'];
      return currentVoices.map(v => v.name);
    }
  }

  Scratch.extensions.register(new WebSpeechTTS());
})(Scratch);

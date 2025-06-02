(function(Scratch) {
  'use strict';

  class WebSpeechTTS {
    constructor() {
      this.isSpeaking = false;
      this.voices = [];

      // Load voices when they become available
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };

      // Try to load voices immediately if possible
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
            items: () => this.getVoiceList()
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
      const currentVoices = window.speechSynthesis.getVoices();
      if (!currentVoices || currentVoices.length === 0) {
        return ['(voices not loaded yet)'];
      }
      return currentVoices.map(v => v.name);
    }
  }

  Scratch.extensions.register(new WebSpeechTTS());
})(Scratch);

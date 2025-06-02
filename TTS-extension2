(function(Scratch) {
  'use strict';

  class WebSpeechTTS {
    constructor() {
      this.isSpeaking = false;
    }

    getInfo() {
      return {
        id: 'webspeechTTS',
        name: 'Web Speech TTS',
        blocks: [
          {
            opcode: 'speak',
            blockType: Scratch.BlockType.COMMAND,
            text: 'say [TEXT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello world!' }
            }
          },
          {
            opcode: 'speakWait',
            blockType: Scratch.BlockType.COMMAND,
            text: 'say [TEXT] until done',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello world!' }
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

    speak(args) {
      const utterance = new SpeechSynthesisUtterance(args.TEXT);
      window.speechSynthesis.speak(utterance);
    }

    async speakWait(args) {
      const utterance = new SpeechSynthesisUtterance(args.TEXT);
      this.isSpeaking = true;

      await new Promise(resolve => {
        utterance.onend = () => {
          this.isSpeaking = false;
          resolve();
        };
        window.speechSynthesis.speak(utterance);
      });
    }

    listVoices() {
      const voices = window.speechSynthesis.getVoices();
      return voices.map(v => v.name).join(', ');
    }
  }

  Scratch.extensions.register(new WebSpeechTTS());
})(Scratch);

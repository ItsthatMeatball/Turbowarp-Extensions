(function(Scratch) {
  'use strict';

  class VoiceRSSTTS {
    constructor() {
      this.isPlaying = false;
    }

    getInfo() {
      return {
        id: 'voicerssTTS',
        name: 'VoiceRSS TTS',
        blocks: [
          {
            opcode: 'speak',
            blockType: Scratch.BlockType.COMMAND,
            text: 'say [TEXT] at language [LANG] with key [APIKEY]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello world!' },
              LANG: { type: Scratch.ArgumentType.STRING, defaultValue: 'en-us' },
              APIKEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'YOUR_API_KEY' }
            }
          },
          {
            opcode: 'speakWait',
            blockType: Scratch.BlockType.COMMAND,
            text: 'say [TEXT] until done at language [LANG] with key [APIKEY]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello world!' },
              LANG: { type: Scratch.ArgumentType.STRING, defaultValue: 'en-us' },
              APIKEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'YOUR_API_KEY' }
            }
          }
        ]
      };
    }

    speak(args) {
      const text = encodeURIComponent(args.TEXT);
      const lang = args.LANG;
      const key = args.APIKEY;
      const url = `https://api.voicerss.org/?key=${key}&hl=${lang}&src=${text}`;

      const audio = new Audio(url);
      audio.play();
    }

    async speakWait(args) {
      const text = encodeURIComponent(args.TEXT);
      const lang = args.LANG;
      const key = args.APIKEY;
      const url = `https://api.voicerss.org/?key=${key}&hl=${lang}&src=${text}`;

      const audio = new Audio(url);
      this.isPlaying = true;

      // Return a Promise to wait until audio ends
      await new Promise(resolve => {
        audio.onended = () => {
          this.isPlaying = false;
          resolve();
        };
        audio.play();
      });
    }
  }

  Scratch.extensions.register(new VoiceRSSTTS());
})(Scratch);

(function(Scratch) {
  'use strict';

  class VoiceRSSTTS {
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
              APIKEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'd64251b07f5b4c44a36e4731ebd6642b' }
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
  }

  Scratch.extensions.register(new VoiceRSSTTS());
})(Scratch);

(function (Scratch) {
  'use strict';

  class RemixerRemover {
    getInfo() {
      return {
        id: 'remixerremover',
        name: 'Remixer Remover',
        blocks: [
          {
            opcode: 'removeCharacters',
            blockType: Scratch.BlockType.REPORTER,
            text: 'remove characters [START] to [END] from [TEXT]',
            arguments: {
              START: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              END: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World'
              }
            }
          }
        ]
      };
    }

    removeCharacters(args) {
      const text = String(args.TEXT);
      const startIndex = Math.max(0, Number(args.START) - 1);
      const endIndex = Math.min(text.length, Number(args.END));

      if (startIndex >= text.length || startIndex >= endIndex) {
        return text;
      }

      const result = text.slice(0, startIndex) + text.slice(endIndex);
      return result;
    }
  }

  Scratch.extensions.register(new RemixerRemover());
})(Scratch);

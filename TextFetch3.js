(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('TextFetch requires TurboWarp with unsandboxed extensions enabled.');
  }

  class TextFetchExtension {
    constructor() {
      this.textData = [];
      this.connected = false;
      this.requestSuccess = false;
      this.requestFail = false;
      this.currentFile = '';
    }

    getInfo() {
      return {
        id: 'textfetch',
        name: 'Text Fetch',
        blocks: [
          {
            opcode: 'loadText',
            blockType: Scratch.BlockType.COMMAND,
            text: 'load text from URL [URL]',
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://...' }
            }
          },
          {
            opcode: 'lengthOfText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'length of loaded text'
          },
          {
            opcode: 'urlResponded',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'URL responded?'
          },
          {
            opcode: 'requestFailed',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'request failed?'
          },
          {
            opcode: 'requestSucceeded',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'request succeeded?'
          },
          {
            opcode: 'whenConnected',
            blockType: Scratch.BlockType.HAT,
            text: 'when connected'
          },
          {
            opcode: 'whenFailed',
            blockType: Scratch.BlockType.HAT,
            text: 'when request fails'
          },
          {
            opcode: 'disconnect',
            blockType: Scratch.BlockType.COMMAND,
            text: 'disconnect from URL'
          },
          {
            opcode: 'whenDisconnected',
            blockType: Scratch.BlockType.HAT,
            text: 'when disconnected'
          },
          {
            opcode: 'connected',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'connected?'
          },
          {
            opcode: 'loadedTextAsJson',
            blockType: Scratch.BlockType.REPORTER,
            text: 'loaded text as JSON array'
          },
          {
            opcode: 'itemOfText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'item [INDEX] of loaded text',
            arguments: {
              INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'itemNumberOfText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'item number of [ITEM] in loaded text',
            arguments: {
              ITEM: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello' }
            }
          },
          {
            opcode: 'textContains',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'loaded text contains [ITEM]?',
            arguments: {
              ITEM: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello' }
            }
          },
          {
            opcode: 'currentFileName',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current file name'
          }
        ]
      };
    }

    loadText(args) {
      const url = args.URL;
      this.connected = false;
      this.requestSuccess = false;
      this.requestFail = false;
      this.currentFile = url.split('/').pop();

      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('Network response not ok');
          this.connected = true;
          Scratch.vm.runtime.startHats('textfetch_whenConnected');
          return response.text();
        })
        .then(text => {
          this.textData = text.split('\n').map(line => line.trim()).filter(line => line.length);
          this.requestSuccess = true;
        })
        .catch(() => {
          this.requestFail = true;
          Scratch.vm.runtime.startHats('textfetch_whenFailed');
        });
    }

    lengthOfText() {
      return this.textData.length;
    }

    urlResponded() {
      return this.connected;
    }

    requestFailed() {
      return this.requestFail;
    }

    requestSucceeded() {
      return this.requestSuccess;
    }

    whenConnected() {
      return false;
    }

    whenFailed() {
      return false;
    }

    disconnect() {
      this.connected = false;
      this.requestSuccess = false;
      this.requestFail = false;
      this.textData = [];
      Scratch.vm.runtime.startHats('textfetch_whenDisconnected');
    }

    whenDisconnected() {
      return false;
    }

    connected() {
      return this.connected;
    }

    loadedTextAsJson() {
      return JSON.stringify(this.textData);
    }

    itemOfText(args) {
      const index = parseInt(args.INDEX) - 1;
      if (index < 0 || index >= this.textData.length) return '';
      return this.textData[index];
    }

    itemNumberOfText(args) {
      return this.textData.indexOf(args.ITEM) + 1;
    }

    textContains(args) {
      return this.textData.includes(args.ITEM);
    }

    currentFileName() {
      return this.currentFile;
    }
  }

  Scratch.extensions.register(new TextFetchExtension());
})(Scratch);

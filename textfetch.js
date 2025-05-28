class TextNetwork {
  constructor() {
    this.url = '';
    this.connected = false;
    this.responded = false;
    this.failed = false;
    this.succeeded = false;
    this.text = '';
    this.lines = [];
    this.jsonArray = [];
    this.connectedCallback = () => {};
    this.failCallback = () => {};
    this.disconnectCallback = () => {};
  }

  getInfo() {
    return {
      id: 'textnetwork',
      name: 'Text Network',
      blocks: [
        {
          opcode: 'loadText',
          blockType: Scratch.BlockType.COMMAND,
          text: 'load text from [URL]',
          arguments: {
            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://example.com/file.txt' }
          }
        },
        {
          opcode: 'disconnect',
          blockType: Scratch.BlockType.COMMAND,
          text: 'disconnect from URL'
        },
        {
          opcode: 'lengthText',
          blockType: Scratch.BlockType.REPORTER,
          text: 'length of loaded text'
        },
        {
          opcode: 'getLinesAsJSON',
          blockType: Scratch.BlockType.REPORTER,
          text: 'loaded text as JSON array'
        },
        {
          opcode: 'getItem',
          blockType: Scratch.BlockType.REPORTER,
          text: 'item [INDEX] of loaded text',
          arguments: {
            INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
          }
        },
        {
          opcode: 'getItemNumber',
          blockType: Scratch.BlockType.REPORTER,
          text: 'item number of [TEXT] in loaded text',
          arguments: {
            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' }
          }
        },
        {
          opcode: 'containsText',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'loaded text contains [TEXT]',
          arguments: {
            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' }
          }
        },
        {
          opcode: 'isConnected',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'connected?'
        },
        {
          opcode: 'didRespond',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'URL responded?'
        },
        {
          opcode: 'didFail',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'request failed?'
        },
        {
          opcode: 'didSucceed',
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
          opcode: 'whenDisconnected',
          blockType: Scratch.BlockType.HAT,
          text: 'when disconnected'
        }
      ]
    };
  }

  loadText(args) {
    const url = args.URL;
    this.url = url;
    this.connected = false;
    this.responded = false;
    this.failed = false;
    this.succeeded = false;
    fetch(url)
      .then(r => {
        this.responded = true;
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then(txt => {
        this.text = txt;
        this.lines = txt.split(/\r?\n/);
        try {
          this.jsonArray = JSON.parse(txt);
        } catch (e) {
          this.jsonArray = [];
        }
        this.connected = true;
        this.succeeded = true;
        this.connectedCallback();
      })
      .catch(e => {
        this.failed = true;
        this.failCallback();
      });
  }

  disconnect() {
    this.connected = false;
    this.responded = false;
    this.failed = false;
    this.succeeded = false;
    this.text = '';
    this.lines = [];
    this.jsonArray = [];
    this.disconnectCallback();
  }

  lengthText() {
    return this.text.length;
  }

  getLinesAsJSON() {
    return JSON.stringify(this.lines);
  }

  getItem(args) {
    const idx = Number(args.INDEX) - 1;
    if (idx < 0 || idx >= this.lines.length) return '';
    return this.lines[idx];
  }

  getItemNumber(args) {
    const text = args.TEXT;
    const idx = this.lines.indexOf(text);
    return idx === -1 ? 0 : idx + 1;
  }

  containsText(args) {
    return this.lines.includes(args.TEXT);
  }

  isConnected() {
    return this.connected;
  }

  didRespond() {
    return this.responded;
  }

  didFail() {
    return this.failed;
  }

  didSucceed() {
    return this.succeeded;
  }

  whenConnected() {
    return this.connected;
  }

  whenFailed() {
    return this.failed;
  }

  whenDisconnected() {
    return !this.connected;
  }
}

Scratch.extensions.register(new TextNetwork());

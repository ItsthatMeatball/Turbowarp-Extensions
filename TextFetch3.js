(function(Scratch) {
  'use strict';

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
            opcode: 'c

(function(Scratch) {
  'use strict';

  let socket = null;
  let connected = false;
  let roomNumber = 0;
  let lastMessage = '';
  let lastMessageSender = '';
  let currentUsername = '';

  class TurboChatExtension {
    getInfo() {
      return {
        id: 'turbochat',
        name: 'TurboChat Server',
        blocks: [
          {
            opcode: 'joinServer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'join server [TEXT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'ws://localhost:8080' }
            }
          },
          {
            opcode: 'leaveServer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'leave server'
          },
          {
            opcode: 'connected',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'connected?'
          },
          {
            opcode: 'disconnected',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'disconnected?'
          },
          {
            opcode: 'whenConnected',
            blockType: Scratch.BlockType.HAT,
            text: 'when connected to server'
          },
          {
            opcode: 'whenDisconnected',
            blockType: Scratch.BlockType.HAT,
            text: 'when disconnected from server'
          },
          {
            opcode: 'joinRoom',
            blockType: Scratch.BlockType.COMMAND,
            text: 'join room number [ROOM]',
            arguments: {
              ROOM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'leaveRoom',
            blockType: Scratch.BlockType.COMMAND,
            text: 'leave room'
          },
          {
            opcode: 'currentRoom',
            blockType: Scratch.BlockType.REPORTER,
            text: 'room number'
          },
          {
            opcode: 'whenNewRoom',
            blockType: Scratch.BlockType.HAT,
            text: 'when connected to new room'
          },
          {
            opcode: 'sendMessage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'send message [MESSAGE]',
            arguments: {
              MESSAGE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello world' }
            }
          },
          {
            opcode: 'whenMessage',
            blockType: Scratch.BlockType.HAT,
            text: 'when message received'
          },
          {
            opcode: 'lastMessage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last message'
          },
          {
            opcode: 'setUsername',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set username [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Guest' }
            }
          },
          {
            opcode: 'currentUsername',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current username'
          },
          {
            opcode: 'lastMessageSender',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last message sender'
          }
        ]
      };
    }

    joinServer(args) {
      if (socket && connected) socket.close();

      socket = new WebSocket(args.TEXT);

      socket.onopen = () => {
        connected = true;
        Scratch.vm.runtime.startHats('turbochat_whenConnected');
      };

      socket.onclose = () => {
        connected = false;
        Scratch.vm.runtime.startHats('turbochat_whenDisconnected');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          lastMessage = data.content;
          lastMessageSender = data.username;
          Scratch.vm.runtime.startHats('turbochat_whenMessage');
        }
      };
    }

    leaveServer() {
      if (connected && socket) {
        socket.close();
        connected = false;
        roomNumber = 0;
        currentUsername = '';
      }
    }

    connected() {
      return connected;
    }

    disconnected() {
      return !connected;
    }

    whenConnected() {
      return true;
    }

    whenDisconnected() {
      return true;
    }

    joinRoom(args) {
      if (connected && socket) {
        roomNumber = args.ROOM;
        socket.send(JSON.stringify({ type: 'joinRoom', room: roomNumber }));
        Scratch.vm.runtime.startHats('turbochat_whenNewRoom');
      }
    }

    leaveRoom() {
      if (connected && socket) {
        socket.send(JSON.stringify({ type: 'leaveRoom' }));
        roomNumber = 0;
        Scratch.vm.runtime.startHats('turbochat_whenNewRoom');
      }
    }

    currentRoom() {
      return roomNumber;
    }

    whenNewRoom() {
      return true;
    }

    sendMessage(args) {
      if (connected && socket) {
        if (currentUsername === '') return;
        socket.send(JSON.stringify({ type: 'message', content: args.MESSAGE }));
      }
    }

    whenMessage() {
      return true;
    }

    lastMessage() {
      return lastMessage;
    }

    setUsername(args) {
      if (connected && socket) {
        currentUsername = args.NAME;
        socket.send(JSON.stringify({ type: 'setUsername', username: currentUsername }));
      }
    }

    currentUsername() {
      return currentUsername;
    }

    lastMessageSender() {
      return lastMessageSender;
    }
  }

  Scratch.extensions.register(new TurboChatExtension());
})(Scratch);

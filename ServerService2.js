(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Server Service requires TurboWarp Unsandboxed mode.');
  }

  class ServerService {
    constructor() {
      this.socket = null;
      this.connected = false;
      this.myUsername = "Guest";
      this.currentRoom = 0;
      this.lastMessage = "";
      this.lastSender = "";
      this.runtime = Scratch.vm.runtime;
    }

    getInfo() {
      return {
        id: 'serverService',
        name: 'Server Service',
        blocks: [
          {
            opcode: 'connect',
            blockType: Scratch.BlockType.COMMAND,
            text: 'connect to [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'ws://localhost:3000'
              }
            }
          },
          {
            opcode: 'disconnect',
            blockType: Scratch.BlockType.COMMAND,
            text: 'disconnect'
          },
          {
            opcode: 'setUsername',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set username as [USERNAME]',
            arguments: {
              USERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Guest'
              }
            }
          },
          {
            opcode: 'joinRoom',
            blockType: Scratch.BlockType.COMMAND,
            text: 'join room [ROOM]',
            arguments: {
              ROOM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'sendGlobal',
            blockType: Scratch.BlockType.COMMAND,
            text: 'send [MESSAGE] globally',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello everyone!'
              }
            }
          },
          {
            opcode: 'sendRoom',
            blockType: Scratch.BlockType.COMMAND,
            text: 'send [MESSAGE] to room',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello room!'
              }
            }
          },
          {
            opcode: 'isConnected',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'connected?'
          },
          {
            opcode: 'getMyClientID',
            blockType: Scratch.BlockType.REPORTER,
            text: 'my client ID'
          },
          {
            opcode: 'getCurrentRoom',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current room number'
          },
          {
            opcode: 'getLastMessage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last received message'
          },
          {
            opcode: 'getLastSender',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sender ID of last message'
          },
          {
            opcode: 'onConnected',
            blockType: Scratch.BlockType.HAT,
            text: 'when connected'
          },
          {
            opcode: 'onDisconnected',
            blockType: Scratch.BlockType.HAT,
            text: 'when disconnected'
          },
          {
            opcode: 'onMessageReceived',
            blockType: Scratch.BlockType.HAT,
            text: 'when message received'
          },
          {
            opcode: 'onRoomJoined',
            blockType: Scratch.BlockType.HAT,
            text: 'when connected to room'
          }
        ]
      };
    }

    connect({ URL }) {
      if (this.socket) this.socket.close();

      this.socket = new WebSocket(URL);

      this.socket.onopen = () => {
        this.connected = true;
        this.runtime.startHats('serverService_onConnected');
      };

      this.socket.onclose = () => {
        this.connected = false;
        this.runtime.startHats('serverService_onDisconnected');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "roomMessage" || data.type === "globalMessage") {
            this.lastMessage = data.message;
            this.lastSender = data.sender;
            this.runtime.startHats('serverService_onMessageReceived');
          }

          if (data.type === "joinedRoom") {
            this.currentRoom = data.room;
            this.runtime.startHats('serverService_onRoomJoined');
          }
        } catch {
          // fallback if data isn't JSON
          this.lastMessage = event.data;
          this.lastSender = "";
          this.runtime.startHats('serverService_onMessageReceived');
        }
      };
    }

    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
        this.connected = false;
      }
    }

    setUsername({ USERNAME }) {
      this.myUsername = USERNAME;
    }

    joinRoom({ ROOM }) {
      if (this.socket && this.connected) {
        const message = {
          type: "joinRoom",
          room: ROOM
        };
        this.socket.send(JSON.stringify(message));
      }
    }

    sendGlobal({ MESSAGE }) {
      if (this.socket && this.connected) {
        const message = {
          type: "globalMessage",
          message: MESSAGE,
          sender: this.myUsername
        };
        this.socket.send(JSON.stringify(message));
      }
    }

    sendRoom({ MESSAGE }) {
      if (this.socket && this.connected) {
        const message = {
          type: "roomMessage",
          message: MESSAGE,
          sender: this.myUsername
        };
        this.socket.send(JSON.stringify(message));
      }
    }

    isConnected() {
      return this.connected;
    }

    getMyClientID() {
      return this.myUsername;
    }

    getCurrentRoom() {
      return this.currentRoom;
    }

    getLastMessage() {
      return this.lastMessage;
    }

    getLastSender() {
      return this.lastSender;
    }

    onConnected() {
      return true;
    }

    onDisconnected() {
      return true;
    }

    onMessageReceived() {
      return true;
    }

    onRoomJoined() {
      return true;
    }
  }

  Scratch.extensions.register(new ServerService());
})(Scratch);

(function(Scratch) {
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

    // connect to WebSocket server
    connect({ URL }) {
      if (this.socket) {
        this.socket.close();
      }
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

    // Hat block triggers
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

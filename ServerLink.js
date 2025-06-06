(function (Scratch) {
    'use strict';

    let ws;
    let username = "Unnamed";
    let serverStatus = "Disconnected";
    let lastMessage = "";

    const runtime = Scratch.vm.runtime;

    class AIConnectExtension {
        getInfo() {
            return {
                id: 'aiconnect',
                name: 'AI Server Link',
                blocks: [
                    {
                        opcode: 'connectServer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'connect to server [URL]',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'ws://localhost:3000' }
                        }
                    },
                    {
                        opcode: 'setUsername',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set username [NAME]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'User1' }
                        }
                    },
                    {
                        opcode: 'sendMessageToUser',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'send message [TEXT] to [TARGET]',
                        arguments: {
                            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' },
                            TARGET: { type: Scratch.ArgumentType.STRING, defaultValue: 'User2' }
                        }
                    },
                    {
                        opcode: 'getStatus',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'server status'
                    },
                    {
                        opcode: 'onMessageReceived',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when a message is received'
                    },
                    {
                        opcode: 'getLastMessage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'last message received'
                    }
                ]
            };
        }

        connectServer(args) {
            ws = new WebSocket(args.URL);

            ws.onopen = () => {
                console.log("Connected to " + args.URL);
                serverStatus = "Connected";
            };

            ws.onclose = () => {
                console.log("Connection closed.");
                serverStatus = "Disconnected";
            };

            ws.onerror = (err) => {
                console.error("Connection error:", err);
                serverStatus = "Error";
            };

            ws.onmessage = (event) => {
                console.log("Received:", event.data);
                lastMessage = event.data;
                runtime.startHats('aiconnect_onMessageReceived');
            };
        }

        setUsername(args) {
            username = args.NAME;
            if (ws && ws.readyState === 1) {
                ws.send(JSON.stringify({ cmd: "setName", val: username }));
            }
        }

        sendMessageToUser(args) {
            if (ws && ws.readyState === 1) {
                ws.send(JSON.stringify({
                    cmd: "sendMessage",
                    from: username,
                    to: args.TARGET,
                    message: args.TEXT
                }));
            }
        }

        getStatus() {
            return serverStatus;
        }

        onMessageReceived() {
            return true;
        }

        getLastMessage() {
            return lastMessage;
        }
    }

    Scratch.extensions.register(new AIConnectExtension());
})(Scratch);

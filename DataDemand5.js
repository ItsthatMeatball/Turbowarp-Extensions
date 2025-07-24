// Data Demand TurboWarp Extension
// Author: ChatGPT + Nigel (🔥 Dev Energy)
(function(Scratch) {
  "use strict";

  let fileContent = "";
  let isConnected = false;
  let hasTriggeredConnect = false;
  let hasTriggeredDisconnect = false;
  let textData = [];
  let connectionStatus = "idle"; // "connected", "disconnected", "idle"

  const splitLinesExact = (text) => {
    const lines = text.split(/\r?\n/);
    if (lines.length > 0 && lines[lines.length - 1] === "") {
      lines.pop();
    }
    return lines;
  };

  class DataDemand {
    getInfo() {
      return {
        id: "dataDemand",
        name: "Data Demand",
        blocks: [
          {
            opcode: "connect",
            blockType: Scratch.BlockType.COMMAND,
            text: "Connect to GitHub file [URL]",
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://raw.githubusercontent.com/user/repo/main/data.txt"
              }
            }
          },
          {
            opcode: "disconnect",
            blockType: Scratch.BlockType.COMMAND,
            text: "Disconnect from GitHub file"
          },
          {
            opcode: "getLine",
            blockType: Scratch.BlockType.REPORTER,
            text: "item [INDEX] of GitHub file",
            arguments: {
              INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: "indexOf",
            blockType: Scratch.BlockType.REPORTER,
            text: "Item # of [TEXT] in GitHub file",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "example" }
            }
          },
          {
            opcode: "asJSON",
            blockType: Scratch.BlockType.REPORTER,
            text: "GitHub file as JSON array"
          },
          {
            opcode: "length",
            blockType: Scratch.BlockType.REPORTER,
            text: "Length of GitHub file"
          },
          {
            opcode: "contains",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "GitHub file contains [TEXT]?",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "something" }
            }
          },
          {
            opcode: "isEmpty",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "Is file empty?"
          },
          {
            opcode: "connected",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "Connected?"
          },
          {
            opcode: "disconnected",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "Disconnected?"
          },
          {
            opcode: "onConnect",
            blockType: Scratch.BlockType.HAT,
            text: "when connected to GitHub Repository"
          },
          {
            opcode: "onDisconnect",
            blockType: Scratch.BlockType.HAT,
            text: "when disconnected from GitHub Repository"
          }
        ]
      };
    }

    connect(args) {
      const url = args.URL;
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.text();
        })
        .then(text => {
          fileContent = text;
          textData = splitLinesExact(text);
          isConnected = true;
          connectionStatus = "connected";
          hasTriggeredConnect = false;
        })
        .catch(() => {
          fileContent = "";
          textData = [];
          isConnected = false;
          connectionStatus = "disconnected";
          hasTriggeredDisconnect = false;
        });
    }

    disconnect() {
      if (isConnected) {
        isConnected = false;
        connectionStatus = "disconnected";
        hasTriggeredDisconnect = false;
      }
      fileContent = "";
      textData = [];
    }

    getLine(args) {
      const idx = parseInt(args.INDEX);
      return textData[idx - 1] || "";
    }

    indexOf(args) {
      const index = textData.indexOf(args.TEXT);
      return index === -1 ? 0 : index + 1;
    }

    asJSON() {
      try {
        return JSON.stringify(textData);
      } catch (e) {
        return "[]";
      }
    }

    length() {
      return textData.length;
    }

    contains(args) {
      return textData.includes(args.TEXT);
    }

    isEmpty() {
      return textData.length === 0;
    }

    connected() {
      return connectionStatus === "connected";
    }

    disconnected() {
      return connectionStatus === "disconnected";
    }

    onConnect() {
      if (connectionStatus === "connected" && !hasTriggeredConnect) {
        hasTriggeredConnect = true;
        return true;
      }
      return false;
    }

    onDisconnect() {
      if (connectionStatus === "disconnected" && !hasTriggeredDisconnect) {
        hasTriggeredDisconnect = true;
        return true;
      }
      return false;
    }
  }

  Scratch.extensions.register(new DataDemand());
})(Scratch);

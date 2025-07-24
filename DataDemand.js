// Data Demand TurboWarp Extension
// Author: ChatGPT + Nigel (🔥 Dev Energy)
(function(Scratch) {
  "use strict";

  let fileContent = "";
  let isConnected = false;
  let hasTriggeredConnect = false;
  let hasTriggeredDisconnect = false;

  const lineSplit = () => fileContent.split(/\r?\n/);

  class DataDemand {
    getInfo() {
      return {
        id: "dataDemand",
        name: "Data Demand",
        blocks: [
          { opcode: "connect", blockType: Scratch.BlockType.COMMAND, text: "Connect to GitHub file [URL]", arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://raw.githubusercontent.com/user/repo/main/data.txt" } } },
          { opcode: "disconnect", blockType: Scratch.BlockType.COMMAND, text: "Disconnect from GitHub file" },
          { opcode: "getLine", blockType: Scratch.BlockType.REPORTER, text: "item [INDEX] of GitHub file", arguments: { INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } } },
          { opcode: "indexOf", blockType: Scratch.BlockType.REPORTER, text: "Item # of [TEXT] in GitHub file", arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "example" } } },
          { opcode: "asJSON", blockType: Scratch.BlockType.REPORTER, text: "GitHub file as JSON array" },
          { opcode: "length", blockType: Scratch.BlockType.REPORTER, text: "Length of GitHub file" },
          { opcode: "contains", blockType: Scratch.BlockType.BOOLEAN, text: "GitHub file contains [TEXT]?", arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "something" } } },
          { opcode: "isEmpty", blockType: Scratch.BlockType.BOOLEAN, text: "Is file empty?" },
          { opcode: "connected", blockType: Scratch.BlockType.BOOLEAN, text: "Connected?" },
          { opcode: "disconnected", blockType: Scratch.BlockType.BOOLEAN, text: "Disconnected?" },
          { opcode: "onConnect", blockType: Scratch.BlockType.HAT, text: "when connected to GitHub Repository" },
          { opcode: "onDisconnect", blockType: Scratch.BlockType.HAT, text: "when disconnected from GitHub Repository" }
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
          isConnected = true;
          hasTriggeredConnect = false;
          hasTriggeredDisconnect = false;
        })
        .catch(() => {
          fileContent = "";
          isConnected = false;
        });
    }

    disconnect() {
      if (isConnected) {
        isConnected = false;
        hasTriggeredDisconnect = false;
      }
      fileContent = "";
    }

    getLine(args) {
      const lines = lineSplit();
      const idx = parseInt(args.INDEX);
      return lines[idx - 1] || "";
    }

    indexOf(args) {
      const lines = lineSplit();
      const index = lines.indexOf(args.TEXT);
      return index === -1 ? 0 : index + 1;
    }

    asJSON() {
      try {
        const json = JSON.parse(fileContent);
        if (Array.isArray(json)) return JSON.stringify(json);
        return "[]";
      } catch {
        return "[]";
      }
    }

    length() {
      return lineSplit().length;
    }

    contains(args) {
      return fileContent.includes(args.TEXT);
    }

    isEmpty() {
      return fileContent.trim().length === 0;
    }

    connected() {
      return isConnected;
    }

    disconnected() {
      return !isConnected;
    }

    onConnect() {
      if (isConnected && !hasTriggeredConnect) {
        hasTriggeredConnect = true;
        return true;
      }
      return false;
    }

    onDisconnect() {
      if (!isConnected && !hasTriggeredDisconnect) {
        hasTriggeredDisconnect = true;
        return true;
      }
      return false;
    }
  }

  Scratch.extensions.register(new DataDemand());
})(Scratch);

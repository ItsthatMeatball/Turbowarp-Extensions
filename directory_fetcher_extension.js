
(function(Scratch) {
    'use strict';

    let cachedDirectory = [];

    class DirectoryFetcher {
        getInfo() {
            return {
                id: 'directoryfetcher',
                name: 'Directory Fetcher',
                blocks: [
                    {
                        opcode: 'loadDirectory',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'load directory from [URL]',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING }
                        }
                    },
                    {
                        opcode: 'loadFileNamed',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'load file named [FILENAME]',
                        arguments: {
                            FILENAME: { type: Scratch.ArgumentType.STRING }
                        }
                    },
                    {
                        opcode: 'numberOfFiles',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'number of files in directory'
                    },
                    {
                        opcode: 'fileNameAt',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'file name number [INDEX] in directory',
                        arguments: {
                            INDEX: { type: Scratch.ArgumentType.NUMBER }
                        }
                    },
                    {
                        opcode: 'disconnect',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'disconnect'
                    }
                ]
            };
        }

        loadDirectory(args) {
            return fetch(args.URL)
                .then(res => res.json())
                .then(data => {
                    cachedDirectory = data;
                    return 'Directory loaded.';
                })
                .catch(err => {
                    console.error(err);
                    return 'Failed to load directory.';
                });
        }

        loadFileNamed(args) {
            const fileEntry = cachedDirectory.find(file => file.name === args.FILENAME);
            if (!fileEntry) {
                return Promise.resolve('File not found.');
            }
            return fetch(fileEntry.download_url)
                .then(res => res.text())
                .catch(err => {
                    console.error(err);
                    return 'Failed to load file.';
                });
        }

        numberOfFiles() {
            return cachedDirectory.length;
        }

        fileNameAt(args) {
            const index = args.INDEX;
            if (index < 1 || index > cachedDirectory.length) {
                return 'Invalid index.';
            }
            return cachedDirectory[index - 1].name;
        }

        disconnect() {
            cachedDirectory = [];
            return 'Disconnected.';
        }
    }

    Scratch.extensions.register(new DirectoryFetcher());
})(Scratch);

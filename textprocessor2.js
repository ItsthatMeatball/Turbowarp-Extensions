class TextProcessorExtension {
  getInfo() {
    return {
      id: 'textProcessor',
      name: 'Text Processor',
      blocks: [
        {
          opcode: 'processText',
          blockType: Scratch.BlockType.REPORTER,
          text: 'process [TEXT]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "What's 55+12?"
            }
          }
        }
      ]
    };
  }

  numberToWords(num) {
    const ones = ['zero','one','two','three','four','five','six','seven','eight','nine'];
    const teens = ['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
    const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' ' + this.numberToWords(num % 100) : '');
    if (num <= 10000) return (num === 10000) ? 'ten thousand' : 'one thousand' + (num % 1000 ? ' ' + this.numberToWords(num % 1000) : '');
    return num.toString();
  }

  expandContractions(text) {
    const contractions = {
      "i'm": "i am", "you're": "you are", "he's": "he is", "she's": "she is", "it's": "it is",
      "we're": "we are", "they're": "they are", "i've": "i have", "you've": "you have",
      "we've": "we have", "they've": "they have", "i'd": "i would", "you'd": "you would",
      "he'd": "he would", "she'd": "she would", "we'd": "we would", "they'd": "they would",
      "i'll": "i will", "you'll": "you will", "he'll": "he will", "she'll": "she will",
      "we'll": "we will", "they'll": "they will", "can't": "cannot", "won't": "will not",
      "don't": "do not", "didn't": "did not", "isn't": "is not", "aren't": "are not",
      "wasn't": "was not", "weren't": "were not", "couldn't": "could not", "shouldn't": "should not",
      "wouldn't": "would not", "haven't": "have not", "hasn't": "has not", "hadn't": "had not",
      "what's": "what is"
    };

    const regex = new RegExp("\\b(" + Object.keys(contractions).join("|") + ")\\b", "gi");
    return text.replace(regex, (match) => contractions[match.toLowerCase()] || match);
  }

  removePunctuation(text) {
    return text.replace(/[.,!?;:()"'`]/g, '');
  }

  convertSymbols(text) {
    return text.replace(/\$/g, ' dollars ')
               .replace(/\+/g, ' plus ');
  }

  processText(args) {
    let text = args.TEXT.toLowerCase();

    // Expand contractions
    text = this.expandContractions(text);

    // Convert symbols with spacing
    text = this.convertSymbols(text);

    // Convert numbers 0-10000 to words
    text = text.replace(/\b\d+\b/g, (match) => {
      const num = parseInt(match);
      return (num >= 0 && num <= 10000) ? this.numberToWords(num) : match;
    });

    // Remove punctuation
    text = this.removePunctuation(text);

    // Clean up extra spaces
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }
}

Scratch.extensions.register(new TextProcessorExtension());

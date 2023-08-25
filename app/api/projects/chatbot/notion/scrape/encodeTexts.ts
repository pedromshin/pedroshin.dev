import { encode } from "gpt-tokenizer";

const CHUNK_SIZE = 200;

const generateChunks = ({
  encoded,
  content,
}: {
  encoded: any;
  content: any;
}) => {
  let chunks = [];

  if (encoded.length > CHUNK_SIZE) {
    const split = content.split(". ");
    let chunkText = "";

    for (let i = 0; i < split.length; i++) {
      const sentence = split[i];
      const sentenceTokenLength = encode(sentence);
      const chunkTextTokenLength = encode(chunkText).length;

      if (chunkTextTokenLength + sentenceTokenLength.length > CHUNK_SIZE) {
        chunks.push(chunkText);
        chunkText = "";
      }

      if (sentence[sentence.length - 1].match(/[a-z0-9]/i)) {
        chunkText += sentence + ". ";
      } else {
        chunkText += sentence + " ";
      }
    }

    chunks.push(chunkText.trim());
  } else {
    chunks.push(content);
  }

  const essayChunks = chunks.map((text) => {
    const trimmedText = text.trim();

    const chunk = {
      content: trimmedText,
      content_length: trimmedText.length,
      content_tokens: encode(trimmedText).length,
      embedding: [],
    };

    return chunk;
  });

  if (essayChunks.length > 1) {
    for (let i = 0; i < essayChunks.length; i++) {
      const chunk = essayChunks[i];
      const prevChunk = essayChunks[i - 1];

      if (chunk.content_tokens < 100 && prevChunk) {
        prevChunk.content += " " + chunk.content;
        prevChunk.content_length += chunk.content_length;
        prevChunk.content_tokens += chunk.content_tokens;
        essayChunks.splice(i, 1);
        i--;
      }
    }
  }

  return essayChunks;
};

export const encodeText = (texts: string[]) => {
  const encodedTexts = texts.map((text) => {
    const trimmedContent = text.trim();
    const encoded = encode(trimmedContent);

    return {
      content: trimmedContent,
      length: trimmedContent.length,
      encoded: encoded,
      tokens: encoded.length,
      chunks: generateChunks({ encoded, content: trimmedContent }),
    };
  });

  return encodedTexts;
};

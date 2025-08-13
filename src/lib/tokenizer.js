import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";

let enc = null;

export function initTokenizer() {
  if (!enc) {
    enc = new Tiktoken(o200k_base);
  }
}

// Returns only token IDs
export function getTokenIds(text) {
  if (!enc) throw new Error("Tokenizer not initialized");
  return enc.encode(text);
}

// Returns array of objects: { token, text, start, end }
export function getTokenMapping(text) {
  if (!enc) throw new Error("Tokenizer not initialized");
  const encoded = enc.encode(text);
  let tokens = [];
  let currentIdx = 0;
  for (let i = 0; i < encoded.length; i++) {
    const tokenId = encoded[i];
    const tokenText = enc.decode([tokenId]);
    const start = text.indexOf(tokenText, currentIdx);
    const end = start + tokenText.length;
    tokens.push({ token: tokenId, text: tokenText, start, end });
    currentIdx = end;
  }
  return tokens;
}

export function encodeText(text) {
  return getTokenMapping(text);
}

export function decodeTokens(tokens) {
  if (!enc) throw new Error("Tokenizer not initialized");
  return enc.decode(tokens);
}

import React, { useState, useEffect } from "react";
import { initTokenizer, getTokenMapping, decodeTokens } from "../lib/tokenizer";
import { ArrowLeftRight } from "lucide-react";
const suggestions = [
  "Hi, Sekhar.",
  "Hello, world! Let's code.",
  "Will AI replace coders?",
  "The quick brown fox\njumps over the lazy dog.",
  "Coding is fun!\nAI makes it easier.",
  "Welcome to Smart Tokenizer.",
];

const sampleText = suggestions[0];

const COLORS = [
  "#fbbf24",
  "#60a5fa",
  "#34d399",
  "#f472b6",
  "#f87171",
  "#a78bfa",
  "#fb7185",
  "#38bdf8",
  "#facc15",
  "#4ade80",
];

const Tokenizer = () => {
  const [mode, setMode] = useState("text-to-token");
  const [inputText, setInputText] = useState(sampleText);
  const [tokens, setTokens] = useState([]);
  const [hoverId, setHoverId] = useState(null);
  const [decodedText, setDecodedText] = useState("");
  const [error, setError] = useState("");
  const [lastEncodedTokens, setLastEncodedTokens] = useState([]);

  // Initialize tokenizer once
  useEffect(() => {
    (async () => {
      await initTokenizer();
      updateTokens(sampleText);
    })();
  }, []);

  // Update tokens whenever text changes
  const updateTokens = async (text) => {
    try {
      setError("");
      console.log("updateTokens called. Mode:", mode, "Input:", text);
      if (mode === "token-to-text") {
        // Try to decode tokens from comma-separated input
        const arr = text
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
          .map(Number)
          .filter((n) => !isNaN(n));
        console.log("Parsed array:", arr);
        if (arr.length > 0) {
          try {
            const decoded = decodeTokens(arr);
            setDecodedText(decoded);
            setError("");
          } catch (e) {
            setDecodedText("");
            setError("Failed to decode tokens. Are they valid?");
          }
        } else {
          setDecodedText("");
          setError(
            "No valid tokens to decode. Enter comma-separated token IDs."
          );
        }
        setTokens(arr.map((token, idx) => ({ id: idx, token, text: "" })));
        return;
      } else {
        setDecodedText("");
        setError("");
      }
      const mapping = await getTokenMapping(text);
      setTokens(
        mapping.map((m, idx) => ({
          id: idx,
          text: m.text,
          token: m.token,
        }))
      );
      setLastEncodedTokens(mapping.map((m) => m.token));
    } catch (err) {
      setError("Error tokenizing or decoding text.");
      console.error("Error tokenizing or decoding text:", err);
    }
  };

  const toggleMode = () => {
    setMode((prev) => {
      if (prev === "text-to-token") {
        // Switching to decode mode and fill input with last encoded tokens
        const newInput =
          lastEncodedTokens.length > 0 ? lastEncodedTokens.join(", ") : "";
        setInputText(newInput);
        setDecodedText("");
        setError("");
        return "token-to-text";
      } else {
        // Switching to encode mode and fill input with first suggestion
        setInputText(suggestions[0]);
        setDecodedText("");
        setError("");
        return "text-to-token";
      }
    });
  };

  useEffect(() => {
    if (inputText !== undefined && inputText !== null) {
      updateTokens(inputText);
    }
  }, [mode, inputText]);

  return (
    <div className="min-h-screen mt-10">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-gray-600 mt-2">
          Convert text to tokens and explore the connections with interactive
          hover. 
        </p>
        <p >source code is available on <a href="https://github.com/skehargit/jsTokenizer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">github</a></p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Left: Text Input */}
        <div className="bg-white shadow-sm h-full border p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Text
          </label>

          {/* Input */}
          {mode === "token-to-text" && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter comma-separated token IDs (e.g. 12194, 11, 35553)
            </label>
          )}
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              updateTokens(e.target.value);
            }}
            className={`w-full h-40 border rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none ${
              mode === "token-to-text" ? "bg-yellow-50" : ""
            }`}
            placeholder={
              mode === "token-to-text"
                ? "Enter comma-separated token IDs (e.g. 12194, 11, 35553)"
                : "Type or select a suggestion..."
            }
          />
          {error && (
            <div className="mt-2 text-red-600 text-sm font-medium">{error}</div>
          )}

          {/* Suggestions */}
          {mode === "text-to-token" && suggestions.length > 0 && (
            <div className="mt-3">
              <h3 className="text-xs font-medium text-gray-500 mb-1">
                Suggestions
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors duration-150
              ${
                inputText === s
                  ? "bg-purple-500 text-white border-purple-500"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-purple-100"
              }`}
                    onClick={() => {
                      setInputText(s);
                      updateTokens(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Display */}
        <div className="bg-white shadow-sm  p-5 mb-6 h-full border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-md font-semibold ">
              {mode === "text-to-token"
                ? "Encoded Sequence"
                : "Decoded Sequence"}
            </h2>
            <div>
              <button
                onClick={toggleMode}
                className={`flex items-center gap-2 px-4 py-1 text-xs rounded-full border font-semibold shadow-sm transition-colors duration-150 focus:outline-none focus:ring-0
                  ${
                    mode === "text-to-token"
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-yellow-400 text-gray-900 border-yellow-500"
                  }
                `}
                aria-label="Toggle encode/decode mode"
              >
                {mode === "text-to-token" ? (
                  <>
                    <ArrowLeftRight className="w-4 h-4" /> Switch to Decode
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="w-4 h-4" /> Switch to Encode
                  </>
                )}
              </button>
            </div>
          </div>
          {mode === "text-to-token" && (
            <div className="bg-white shadow-sm p-4 mb-6 border">
              <h2 className="text-sm font-semibold mb-4  border-b">
                Token IDs
              </h2>
              <div className="flex flex-wrap">
                {tokens.map((t, idx) => (
                  <React.Fragment key={t.id}>
                    <span
                      onMouseEnter={() => setHoverId(t.id)}
                      onMouseLeave={() => setHoverId(null)}
                      style={{
                        backgroundColor:
                          hoverId === t.id
                            ? COLORS[idx % COLORS.length]
                            : "transparent",
                        transition: "background-color 0.2s ease",
                      }}
                      className={`cursor-pointer ${
                        hoverId === t.id ? "text-white" : "text-black"
                      }`}
                    >
                      {t.token}
                    </span>
                    {idx < tokens.length - 1 && <span className="mr-1">,</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {mode === "text-to-token" && (
            <div className="bg-white shadow-sm h-fit p-4 border">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token strings
              </label>
              <div
                className="flex flex-wrap gap-0 h-fit"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {tokens.map((t, idx) => {
                  // Show visible \n for each newline, with same hover effect
                  if (t.text.includes("\n")) {
                    return (
                      <span
                        key={t.id}
                        onMouseEnter={() => setHoverId(t.id)}
                        onMouseLeave={() => setHoverId(null)}
                        style={{
                          backgroundColor:
                            hoverId === null
                              ? COLORS[idx % COLORS.length]
                              : hoverId === t.id
                              ? COLORS[idx % COLORS.length]
                              : "transparent",
                          color:
                            hoverId === t.id || hoverId === null
                              ? "#fff"
                              : "#000",
                        }}
                      >
                        {t.text.split("\n").map((part, i, arr) => (
                          <React.Fragment key={`${t.id}-part-${i}`}>
                            {part}
                            {i < arr.length - 1 && (
                              <span style={{ opacity: 0.7 }}>{"\\n"}</span>
                            )}
                          </React.Fragment>
                        ))}
                      </span>
                    );
                  }
                  return (
                    <span
                      key={t.id}
                      onMouseEnter={() => setHoverId(t.id)}
                      onMouseLeave={() => setHoverId(null)}
                      style={{
                        backgroundColor:
                          hoverId === null
                            ? COLORS[idx % COLORS.length]
                            : hoverId === t.id
                            ? COLORS[idx % COLORS.length]
                            : "transparent",
                        color:
                          hoverId === t.id || hoverId === null
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      {t.text}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {mode === "token-to-text" && (
            <div className="bg-white shadow-sm h-fit p-4 border">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decoded text
              </label>
              <div
                className="flex flex-wrap gap-0 h-fit"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {decodedText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tokenizer;

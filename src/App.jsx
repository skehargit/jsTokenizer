import React from "react";
import Tokenizer from "./pages/Tokenizer";
import { Github, Linkedin } from "lucide-react";

const App = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto w-full px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h1 className="text-2xl font-bold text-black tracking-tight">
            Smart Tokenizer
          </h1>

          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/sudhansu-sekhar-behera-972210249/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-blue-600 transition-colors"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="https://github.com/skehargit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-700 transition-colors"
            >
              <Github size={22} />
            </a>
          </div>
        </div>

        {/* Main Content */}
        <Tokenizer />
      </div>
    </div>
  );
};

export default App;

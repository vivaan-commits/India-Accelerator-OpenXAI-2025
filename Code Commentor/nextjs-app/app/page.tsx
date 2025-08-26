"use client";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!code.trim()) {
      setError("Please enter some code to comment");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process code");
      }

      setResult(data.commentedCode || "⚠️ Error processing code");
    } catch (err) {
      setError("Failed to process code. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result);
  }

  function downloadCode() {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `commented-code.${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function getFileExtension(lang: string) {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      typescript: "ts",
      php: "php",
      ruby: "rb",
      go: "go",
      rust: "rs",
    };
    return extensions[lang] || "txt";
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">💬 Code Commenter</h1>
          <p className="text-slate-400 text-lg">
            Paste or upload your code and get clean, AI-generated comments — no edits, just annotations.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <section className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Input Code</h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 text-sm px-3 py-1 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="typescript">TypeScript</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".js,.py,.java,.cpp,.cs,.ts,.php,.rb,.go,.rs,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer px-4 py-2 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                📁 Upload File
              </label>
              <span className="text-slate-500 text-sm">or paste code below</span>
            </div>

            <textarea
              className="w-full min-h-[250px] font-mono text-sm rounded-xl bg-slate-950 border border-slate-800 p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              placeholder={`Paste your ${language} code here...`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {error && (
              <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading || !code.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 transition-colors px-6 py-3 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                "✨ Add Comments"
              )}
            </button>
          </section>

          {/* Output */}
          <section className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Commented Code</h2>
              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={downloadCode}
                    className="px-3 py-1 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    💾 Download
                  </button>
                </div>
              )}
            </div>

            <div className="min-h-[250px] bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-auto">
              {result ? (
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                  {result}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <p>Your commented code will appear here</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

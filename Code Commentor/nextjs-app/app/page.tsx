"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [stats, setStats] = useState({ lines: 0, chars: 0 });

  useEffect(() => {
    const lines = code.split("\n").length;
    const chars = code.length;
    setStats({ lines, chars });
  }, [code]);

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
      if (!res.ok) throw new Error(data.error || "Failed to process code");
      setResult(data.commentedCode || "⚠️ Error processing code");
    } catch (err) {
      setError("Failed to process code. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadFile = () => {
    const file = new Blob([result], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `commented.${language}`;
    link.click();
  };

  const languages = [
    { value: "javascript", name: "JavaScript", icon: "🟨" },
    { value: "python", name: "Python", icon: "🐍" },
    { value: "java", name: "Java", icon: "☕" },
    { value: "cpp", name: "C++", icon: "⚡" },
    { value: "csharp", name: "C#", icon: "💎" },
    { value: "typescript", name: "TypeScript", icon: "🔷" },
    { value: "php", name: "PHP", icon: "🐘" },
    { value: "ruby", name: "Ruby", icon: "💎" },
    { value: "go", name: "Go", icon: "🐹" },
    { value: "rust", name: "Rust", icon: "🦀" },
  ];
  const selectedLang = languages.find((l) => l.value === language);

  return (
    <>
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
          40%, 43% { transform: translate3d(0, -10px, 0); }
          70% { transform: translate3d(0, -5px, 0); }
          90% { transform: translate3d(0, -2px, 0); }
        }
        .animate-bounce-custom { animation: bounce 1.4s infinite; }
        .animate-bounce-custom-delay { animation: bounce 1.4s infinite 0.2s; }
        .animate-bounce-custom-delay2 { animation: bounce 1.4s infinite 0.4s; }
        .glass { backdrop-filter: blur(20px); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
        .glass-dark { backdrop-filter: blur(20px); background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); }
        .scrollbar::-webkit-scrollbar { width: 6px; }
        .scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden font-sans">
        {/* Background accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        {/* Navbar */}
        <nav className="sticky top-0 z-50 glass shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                💬
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Code Commenter AI
                </h1>
                <p className="text-xs text-slate-400">Intelligent code documentation</p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white shadow">
              v2.0 Beta
            </span>
          </div>
        </nav>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-6 mt-6 flex gap-4 justify-center">
          <div className="glass rounded-xl px-4 py-2 shadow">
            <div className="text-xs text-slate-400">Lines</div>
            <div className="text-lg font-bold">{stats.lines}</div>
          </div>
          <div className="glass rounded-xl px-4 py-2 shadow">
            <div className="text-xs text-slate-400">Characters</div>
            <div className="text-lg font-bold">{stats.chars}</div>
          </div>
          <div className="glass rounded-xl px-4 py-2 shadow flex items-center gap-1">
            <span>{selectedLang?.icon}</span>
            <span className="text-lg font-bold">{selectedLang?.name}</span>
          </div>
        </div>

        {/* Workspace */}
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input */}
          <div className="glass rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <header className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-white/10 p-4 flex justify-between">
              <h2 className="font-semibold">Input Code</h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="glass-dark px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.icon} {lang.name}
                  </option>
                ))}
              </select>
            </header>

            <textarea
              className="flex-1 bg-black/30 text-white font-mono text-sm p-6 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-500"
              placeholder={`// Enter your ${selectedLang?.name} code here...`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {error && <p className="px-4 py-2 text-sm text-red-400">⚠️ {error}</p>}

            <button
              onClick={handleSubmit}
              disabled={isLoading || !code.trim()}
              className="m-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 disabled:from-slate-700 disabled:to-slate-700 text-white px-6 py-3 rounded-xl font-semibold shadow hover:opacity-90 transition"
            >
              {isLoading ? (
                <div className="flex gap-2 justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce-custom"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce-custom-delay"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce-custom-delay2"></span>
                </div>
              ) : (
                "✨ Generate Comments"
              )}
            </button>
          </div>

          {/* Output */}
          <div className="glass rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <header className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-white/10 p-4 flex justify-between">
              <h2 className="font-semibold">Commented Code</h2>
              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="glass-dark px-3 py-1 rounded-lg text-sm hover:text-green-400 transition"
                  >
                    {showCopied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                  <button
                    onClick={downloadFile}
                    className="glass-dark px-3 py-1 rounded-lg text-sm hover:text-blue-400 transition"
                  >
                    💾 Download
                  </button>
                </div>
              )}
            </header>

            <div className="flex-1 bg-black/30 p-6 overflow-auto scrollbar">
              {result ? (
                <pre className="text-sm font-mono whitespace-pre-wrap text-green-300">
                  <code>{result}</code>
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <p>Your commented code will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 py-4">
          Built with ❤️ at Hackathon 2025
        </footer>
      </div>
    </>
  );
}

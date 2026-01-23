import { useEffect, useState } from "react";
import { Link2, Copy, Check, ExternalLink, TrendingUp } from "lucide-react";

function getClientId() {
  let id = localStorage.getItem("clientId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("clientId", id);
  }
  return id;
}

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  const clientId = getClientId();

  const fetchMyUrls = async () => {
    try {
      const res = await fetch(`/api/my-urls/${clientId}`)
      const data = await res.json();
      if (res.ok) setHistory(data);
    } catch {}
  };

  useEffect(() => {
    fetchMyUrls();
  }, []);

  const handleShorten = async () => {
    if (!longUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, clientId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        setShortUrl(data.shortUrl);
        setLongUrl("");
        fetchMyUrls();
      }
    } catch (e) {
      setError("Backend not running / network error");
    }

    setLoading(false);
  };

  const copyToClipboard = async (text, code = "") => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedCode(code);
    setTimeout(() => {
      setCopied(false);
      setCopiedCode("");
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleShorten();
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] relative overflow-hidden flex items-center justify-center">
      {/* Dark Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)`,
        }}
      />

      {/* Content Container - Centered */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 py-12">
        {/* Header with Icon */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/20 mb-6 shadow-2xl shadow-white/10">
            <Link2 className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-5 drop-shadow-2xl">
            MINI URL
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Transform long URLs into short, shareable links in seconds
          </p>
          <p className="text-zinc-600 text-sm mt-3">Built with MERN Stack</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl mb-10">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1 relative group">
              <input
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Paste your long URL here..."
                className="w-full px-6 py-4 rounded-2xl bg-black/60 border border-white/20 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-white/40 focus:border-white/30 transition-all group-hover:border-white/30"
              />
            </div>

            <button
              onClick={handleShorten}
              disabled={loading || !longUrl.trim()}
              className="relative px-8 py-4 rounded-2xl bg-black text-white font-bold border-2 border-white/30 hover:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 whitespace-nowrap overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
              {loading ? (
                <div className="flex items-center gap-2 relative z-10">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Shortening...
                </div>
              ) : (
                <span className="relative z-10">Shorten</span>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-red-400 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Success Result */}
          {shortUrl && (
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black border border-white/30 mb-3 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-semibold text-lg">Success! Your link is ready</p>
              </div>
              
              <div className="flex items-center gap-3 bg-black/70 rounded-xl p-4 border border-white/20">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-gray-300 hover:text-white font-mono text-sm md:text-base break-all flex items-center gap-2 group"
                >
                  {shortUrl}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="bg-black hover:bg-zinc-900 p-3 rounded-xl transition-all hover:scale-110 active:scale-95 shrink-0 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                  {copied && !copiedCode ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-xl bg-black border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Your Links</h2>
                <p className="text-zinc-500 text-sm">Track and manage your shortened URLs</p>
              </div>
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.code}
                  className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Short URL */}
                      <div>
                        <p className="text-zinc-500 text-xs font-medium mb-1.5 uppercase tracking-wider">Short Link</p>
                        <a
                          className="text-gray-300 hover:text-white font-semibold text-sm md:text-base break-all flex items-center gap-2 group/link"
                          href={item.shortUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.shortUrl}
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                        </a>
                      </div>

                      {/* Original URL */}
                      <div>
                        <p className="text-zinc-500 text-xs font-medium mb-1.5 uppercase tracking-wider">Original URL</p>
                        <p className="text-sm text-zinc-400 break-all line-clamp-2">
                          {item.longUrl}
                        </p>
                      </div>
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center bg-black border border-white/20 rounded-xl px-6 py-3 min-w-[100px] shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <p className="text-zinc-400 text-xs font-medium mb-1">Clicks</p>
                        <p className="text-white font-bold text-2xl">{item.clicks}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.shortUrl, item.code)}
                        className="bg-black hover:bg-zinc-900 p-3 rounded-xl transition-all hover:scale-110 active:scale-95 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                      >
                        {copied && copiedCode === item.code ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-black border border-white/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Link2 className="w-10 h-10 text-zinc-400" />
            </div>
            <p className="text-xl font-medium text-zinc-300 mb-2">No URLs yet</p>
            <p className="text-sm text-zinc-500">Create your first shortened link above 🚀</p>
          </div>
        )}
      </div>
    </div>
  );
}
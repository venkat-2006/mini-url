import { useEffect, useState } from "react";
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Trash2,
  AlertCircle,
  X,
} from "lucide-react";

/**
 * API Configuration
 * Defaults to production URL if environment variable is not set
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://mini-url-production.up.railway.app/api/v1";

/**
 * Generates or retrieves a persistent client identifier
 * Stores the ID in localStorage for session persistence
 * @returns {string} UUID v4 client identifier
 */
function getClientId() {
  let id = localStorage.getItem("clientId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("clientId", id);
  }
  return id;
}

/**
 * Main Application Component
 * Provides URL shortening, management, and analytics functionality
 */
export default function App() {
  // Form state
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Data state
  const [history, setHistory] = useState([]);
  const [selectedStats, setSelectedStats] = useState(null);

  // UI state
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const [toast, setToast] = useState("");

  const clientId = getClientId();

  /**
   * Display temporary toast notification
   * Auto-dismisses after 2 seconds
   * @param {string} message - Message to display
   */
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  /**
   * Fetch all URLs associated with current client
   * Updates history state with retrieved URLs
   */
  const fetchMyUrls = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/urls/client/${clientId}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setHistory(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch URLs:", err);
    }
  };

  /**
   * Load user's URL history on component mount
   */
  useEffect(() => {
    fetchMyUrls();
  }, []);

  /**
   * Shorten a long URL via API
   * Validates input, handles errors, and updates UI
   */
  const handleShorten = async () => {
    if (!longUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Reset state
    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/urls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, clientId }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message || "Failed to shorten URL");
      } else {
        setShortUrl(result.data.shortUrl);
        setLongUrl("");
        fetchMyUrls();
        showToast("URL shortened successfully");
      }
    } catch (err) {
      console.error("Shortening error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch analytics statistics for a specific URL
   * @param {string} code - Short URL code identifier
   */
  const fetchStats = async (code) => {
    try {
      const res = await fetch(`${API_BASE_URL}/urls/${code}/stats`);
      const result = await res.json();

      if (res.ok && result.success) {
        setSelectedStats(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    }
  };

  /**
   * Delete a shortened URL
   * Requires user confirmation before proceeding
   * @param {string} code - Short URL code to delete
   */
  const handleDelete = async (code) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this URL? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/urls/${code}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        fetchMyUrls();
        showToast("URL deleted successfully");
      } else {
        showToast("Failed to delete URL");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Network error occurred");
    }
  };

  /**
   * Copy text to clipboard and show visual feedback
   * @param {string} text - Text to copy
   * @param {string} code - Optional URL code for feedback targeting
   */
  const copyToClipboard = async (text, code = "") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedCode(code);
      showToast("Copied to clipboard");

      setTimeout(() => {
        setCopied(false);
        setCopiedCode("");
      }, 1500);
    } catch (err) {
      console.error("Copy failed:", err);
      showToast("Failed to copy");
    }
  };

  /**
   * Handle Enter key press in URL input
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleShorten();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center">
      {/* Animated background gradient */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <header className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-6 shadow-2xl shadow-blue-500/20 transform hover:scale-105 transition-transform duration-300">
            <Link2 className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
            MINI URL
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Transform long URLs into short, shareable links with advanced analytics
          </p>
        </header>

        {/* URL Shortening Card */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl mb-10 hover:border-white/20 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1 relative group">
              <input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Paste your long URL here..."
                className="w-full px-6 py-4 rounded-2xl bg-black/60 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleShorten}
              disabled={loading || !longUrl.trim()}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Shortening...
                </span>
              ) : (
                "Shorten URL"
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success Message with Shortened URL */}
          {shortUrl && (
            <div className="mt-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-green-400 text-sm font-medium mb-3">
                URL shortened successfully!
              </p>
              <div className="flex items-center gap-3 bg-black/70 rounded-lg p-4">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-300 hover:text-blue-200 break-all transition-colors"
                >
                  {shortUrl}
                </a>
                
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied && !copiedCode ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-white" />
                  )}
                </button>
                
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          )}
        </section>

        {/* URL History Section */}
        {history.length > 0 && (
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Your Links
              </h2>
              <span className="text-slate-400 text-sm">
                {history.length} {history.length === 1 ? "link" : "links"}
              </span>
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <article
                  key={item.code}
                  className="group p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* URL Information */}
                    <div className="flex-1 min-w-0">
                      <a
                        href={item.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-semibold break-all hover:text-blue-300 transition-colors inline-flex items-center gap-2 group/link"
                      >
                        {item.shortUrl}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                      <p className="text-slate-400 text-sm mt-1 break-all line-clamp-1">
                        {item.longUrl}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium text-sm">
                          {item.clicks}
                        </span>
                      </div>

                      <button
                        onClick={() => fetchStats(item.code)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors group/btn"
                        title="View statistics"
                      >
                        <BarChart3 className="w-5 h-5 text-slate-300 group-hover/btn:text-white transition-colors" />
                      </button>

                      <button
                        onClick={() => copyToClipboard(item.shortUrl, item.code)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors group/btn"
                        title="Copy link"
                      >
                        {copied && copiedCode === item.code ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5 text-slate-300 group-hover/btn:text-white transition-colors" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(item.code)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group/btn"
                        title="Delete link"
                      >
                        <Trash2 className="w-5 h-5 text-red-400 group-hover/btn:text-red-300 transition-colors" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4">
              <Link2 className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-500 text-lg">
              No URLs shortened yet
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Start by pasting a long URL above
            </p>
          </div>
        )}

        {/* Statistics Modal */}
        {selectedStats && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedStats(null)}
          >
            <div
              className="bg-slate-900 border border-white/20 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    URL Statistics
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedStats(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-slate-400 text-sm mb-1">Short Code</p>
                  <p className="text-white font-mono text-lg">
                    {selectedStats.code}
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-slate-400 text-sm mb-1">Total Clicks</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <p className="text-white text-2xl font-bold">
                      {selectedStats.clicks}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStats(null)}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-slate-900 border border-white/20 text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300 z-50">
            <p className="text-sm font-medium">{toast}</p>
          </div>
        )}
      </div>
    </div>
  );
}
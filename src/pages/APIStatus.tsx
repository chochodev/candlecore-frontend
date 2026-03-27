import { useState, useEffect } from "react";

interface HealthResponse {
  status: string;
  time: string;
  version?: string;
}

function JSONViewer({ data }: { data: any }) {
  const syntaxHighlight = (json: string) => {
    if (!json) return "";

    json = JSON.stringify(json, null, 2);

    json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Split by newlines for proper formatting
    const lines = json.split("\n");

    return lines.map((line, lineIndex) => {
      const elements: React.ReactNode[] = [];

      // Process keys and values
      const keyValueRegex = /"([^"]+)"(\s*:\s*)("([^"]*)"|\d+\.?\d*|true|false|null)/g;
      let match;
      let lastPos = 0;

      while ((match = keyValueRegex.exec(line)) !== null) {
        // Add text before match
        if (match.index > lastPos) {
          elements.push(
            <span key={`pre-${lineIndex}-${lastPos}`} className="text-gray-400">
              {line.substring(lastPos, match.index)}
            </span>
          );
        }

        // Add key (cyan)
        elements.push(
          <span key={`key-${lineIndex}-${match.index}`} className="text-cyan-400">
            "{match[1]}"
          </span>
        );

        // Add colon
        elements.push(
          <span key={`colon-${lineIndex}-${match.index}`} className="text-gray-400">
            {match[2]}
          </span>
        );

        // Add value with appropriate color
        const value = match[3];
        let valueClassName = "text-emerald-400"; // default for strings

        if (value === "true" || value === "false" || value === "null") {
          valueClassName = "text-purple-400";
        } else if (/^-?\d+\.?\d*$/.test(value)) {
          valueClassName = "text-blue-400";
        }

        elements.push(
          <span key={`val-${lineIndex}-${match.index}`} className={valueClassName}>
            {value}
          </span>
        );

        lastPos = match.index + match[0].length;
      }

      // Add remaining text
      if (lastPos < line.length) {
        elements.push(
          <span key={`post-${lineIndex}-${lastPos}`} className="text-gray-400">
            {line.substring(lastPos)}
          </span>
        );
      }

      // If no matches found, render the whole line
      if (elements.length === 0) {
        return (
          <div key={`line-${lineIndex}`}>
            <span className="text-gray-400">{line}</span>
          </div>
        );
      }

      return <div key={`line-${lineIndex}`}>{elements}</div>;
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950 p-4">
      <pre className="font-mono text-sm leading-relaxed">{syntaxHighlight(data)}</pre>
    </div>
  );
}

export function APIStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/health");
        if (response.ok) {
          const data = await response.json();
          setHealth(data);
          setError(null);
        } else {
          setError("API returned error status");
        }
      } catch (err) {
        setError("Failed to connect to API");
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000); // Check every 5s

    return () => clearInterval(interval);
  }, []);

  const isHealthy = health?.status === "healthy";

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Status Badge */}
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                      isHealthy ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                      isHealthy ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                </span>
                {loading ? "Checking..." : isHealthy ? "Operational" : "Offline"}
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">API Status</h1>
            <p className="text-lg text-gray-400">Real-time health monitoring for Candlecore Trading Engine</p>
          </div>
        </div>
      </div>

      {/* Status Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Main Status */}
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
            <div className="border-b border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white">System Health</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-gray-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-800" />
                    <div className="h-3 w-48 animate-pulse rounded bg-gray-800" />
                  </div>
                </div>
              ) : error ? (
                <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-red-400">API Unavailable</p>
                      <p className="mt-1 text-sm text-red-300/70">{error}</p>
                      <p className="mt-2 text-xs text-red-300/50">
                        Make sure the API server is running on http://localhost:8080
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-5 w-5 shrink-0 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="font-medium text-emerald-400">All Systems Operational</p>
                        <p className="mt-1 text-sm text-emerald-300/70">
                          Last checked: {health?.time ? new Date(health.time).toLocaleString("en-GB") : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* JSON Response */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-400">Response Data</h3>
                    <JSONViewer data={health} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Connection Info */}
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
            <div className="border-b border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white">Connection Details</h2>
            </div>
            <div className="p-6">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-400">Health Endpoint</dt>
                  <dd className="mt-1 font-mono text-sm text-emerald-400">GET /api/v1/health</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Base URL</dt>
                  <dd className="mt-1 font-mono text-sm text-white">http://localhost:8080</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">WebSocket</dt>
                  <dd className="mt-1 font-mono text-sm text-white">ws://localhost:8080/ws</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-400">Check Interval</dt>
                  <dd className="mt-1 text-sm text-white">Every 5 seconds</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

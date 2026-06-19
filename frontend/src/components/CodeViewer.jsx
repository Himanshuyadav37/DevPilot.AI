import { useState } from "react";

function getLanguage(filename) {
  const ext = filename.split(".").pop();
  const map = {
    py: "python", js: "javascript", jsx: "javascript",
    ts: "typescript", tsx: "typescript", json: "json",
    yml: "yaml", yaml: "yaml", md: "markdown",
    dockerfile: "dockerfile", sh: "bash", txt: "text",
  };
  return map[ext] || map[filename.toLowerCase()] || "text";
}

function getFileIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const icons = {
    py: "🐍", js: "📜", jsx: "⚛", ts: "📘", tsx: "⚛",
    json: "📋", yml: "⚙", yaml: "⚙", md: "📝",
    dockerfile: "🐳", sh: "💻", txt: "📄",
  };
  return icons[ext] || icons[filename.toLowerCase()] || "📄";
}

export default function CodeViewer({ files, deploymentFiles }) {
  const allFiles = { ...(files || {}), ...(deploymentFiles || {}) };
  const fileNames = Object.keys(allFiles);
  const [activeFile, setActiveFile] = useState(fileNames[0] || "");
  const [copied, setCopied] = useState(false);

  if (!fileNames.length) return null;

  const activeCode = allFiles[activeFile] || "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    fileNames.forEach((fname) => {
      const blob = new Blob([allFiles[fname]], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fname;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="codeviewer-wrapper">
      <div className="codeviewer-header">
        <span className="codeviewer-title">Generated Files</span>
        <div className="codeviewer-actions">
          <span className="file-count">{fileNames.length} files</span>
          <button className="action-btn" onClick={handleDownloadAll}>
            ↓ Download All
          </button>
        </div>
      </div>

      <div className="file-tabs">
        {fileNames.map((fname) => (
          <button
            key={fname}
            className={`file-tab ${activeFile === fname ? "tab-active" : ""}`}
            onClick={() => setActiveFile(fname)}
          >
            <span className="file-tab-icon">{getFileIcon(fname)}</span>
            <span className="file-tab-name">{fname}</span>
          </button>
        ))}
      </div>

      <div className="code-block">
        <div className="code-topbar">
          <div className="code-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="code-filename">{activeFile}</span>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <pre className="code-pre">
          <code className={`language-${getLanguage(activeFile)}`}>
            {activeCode}
          </code>
        </pre>
      </div>
    </div>
  );
}
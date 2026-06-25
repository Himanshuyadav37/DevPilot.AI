import { useState } from "react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import "./FileViewer.css";

function formatHtml(code = "") {
  if (!code.trim()) return code;

  const lines = code
    .replace(/></g, ">\n<")
    .replace(/(<\/(?:html|head|body|div|section|main|header|footer|nav|ul|ol|li|p|h1|h2|h3|h4|button|a|form)>)/gi, "$1\n")
    .replace(/(<(?:html|head|body|div|section|main|header|footer|nav|ul|ol|li|p|h1|h2|h3|h4|button|a|form)(?:\s[^>]*)?>)/gi, "\n$1")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  let depth = 0;
  return lines.map(line => {
    if (/^<\//.test(line)) depth = Math.max(depth - 1, 0);
    const formatted = `${"  ".repeat(depth)}${line}`;
    if (/^<[^!/][^>]*[^/]>/i.test(line) && !/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i.test(line) && !line.includes(`</`)) {
      depth += 1;
    }
    return formatted;
  }).join("\n");
}

function formatCss(code = "") {
  if (!code.trim()) return code;

  let depth = 0;
  return code
    .replace(/\{/g, " {\n")
    .replace(/;/g, ";\n")
    .replace(/\}/g, "\n}\n")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      if (line === "}") depth = Math.max(depth - 1, 0);
      const formatted = `${"  ".repeat(depth)}${line}`;
      if (line.endsWith("{") || line.endsWith(" {")) depth += 1;
      return formatted;
    })
    .join("\n");
}

function formatCodeForDisplay(path = "", code = "") {
  const lowerPath = path.toLowerCase();

  if (lowerPath.endsWith(".html")) return formatHtml(code);
  if (lowerPath.endsWith(".css")) return formatCss(code);
  if (lowerPath.endsWith(".json")) {
    try {
      return JSON.stringify(JSON.parse(code), null, 2);
    } catch {
      return code;
    }
  }

  return code;
}

function FileViewer({ files = [], diffs = null, showDiffToggle = false }) {

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [viewMode, setViewMode] = useState("code");

  const [selectedFile, setSelectedFile] =
    useState(
      files.length > 0
        ? files[0]
        : null
    );

  const [selectedDiff, setSelectedDiff] = useState(
    diffs?.length > 0 ? diffs[0] : null
  );

  function getLanguage(path) {

    if (!path)
      return "plaintext";

    if (path.endsWith(".py"))
      return "python";

    if (path.endsWith(".js"))
      return "javascript";

    if (path.endsWith(".jsx"))
      return "javascript";

    if (path.endsWith(".ts"))
      return "typescript";

    if (path.endsWith(".tsx"))
      return "typescript";

    if (path.endsWith(".json"))
      return "json";

    if (path.endsWith(".css"))
      return "css";

    if (path.endsWith(".html"))
      return "html";

    if (path.endsWith(".md"))
      return "markdown";

    return "plaintext";
  }

  if (!files || files.length === 0) {

    if (!diffs || diffs.length === 0) {

    return (

      <div
        style={{
          color: "white",
          padding: "20px"
        }}
      >

        No Files Available

      </div>

    );

    }

  }

  const activeFile =
    selectedFile || files[0];

  const activeDiff = selectedDiff || diffs?.[0];

  const editorTheme = "vs-dark";


  return (

    <div
      className={
        isFullscreen
          ? "file-viewer fullscreen-viewer"
          : "file-viewer"
      }
    >

      <div className="file-sidebar">

        <div className="file-sidebar-header">

          <h3>
            {viewMode === "diff" ? "Code Changes" : "Generated Files"}
          </h3>

          <span>
            {viewMode === "diff"
              ? `${diffs?.length || 0} changes`
              : `${files.length} files`}
          </span>

        </div>

        {showDiffToggle && diffs?.length > 0 && (
          <div style={{ padding: "8px 12px", display: "flex", gap: "8px" }}>
            <button
              className={viewMode === "code" ? "action-btn active" : "action-btn"}
              onClick={() => setViewMode("code")}
            >
              Code
            </button>
            <button
              className={viewMode === "diff" ? "action-btn active" : "action-btn"}
              onClick={() => setViewMode("diff")}
            >
              Diff
            </button>
          </div>
        )}

        {viewMode === "diff" && diffs?.map((diff) => (
          <div
            key={diff.path}
            className={
              activeDiff?.path === diff.path
                ? "file-item active"
                : "file-item"
            }
            onClick={() => setSelectedDiff(diff)}
          >
            {diff.status === "added" ? "➕" : diff.status === "removed" ? "➖" : "📝"}{" "}
            {diff.path}
          </div>
        ))}

        {viewMode === "code" &&

          files.map((file) => (

            <div

              key={file.path}

              className={
                activeFile?.path ===
                file.path
                  ? "file-item active"
                  : "file-item"
              }

              onClick={() =>
                setSelectedFile(file)
              }

            >

              📄 {file.path}

            </div>

          ))

        }

      </div>

      <div className="code-panel">

        <div className="code-header">

          <span className="file-name">

            {viewMode === "diff"
              ? activeDiff?.path
              : activeFile?.path}

          </span>

          <button

            className="action-btn"

            onClick={() =>
              setIsFullscreen(
                !isFullscreen
              )
            }

          >

            {
              isFullscreen
                ? "Exit Fullscreen"
                : "Fullscreen"
            }

          </button>

        </div>

        <div
          className="editor-container"
          style={{
            height: "700px"
          }}
        >

          {viewMode === "diff" && activeDiff ? (
            <DiffEditor
              key={activeDiff.path}
              height="700px"
              language={getLanguage(activeDiff.path)}
              theme={editorTheme}
              original={formatCodeForDisplay(activeDiff.path, activeDiff.before || "")}
              modified={formatCodeForDisplay(activeDiff.path, activeDiff.after || "")}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: "on",
                renderSideBySide: true,
              }}
            />
          ) : (
          <Editor

            key={
              activeFile?.path
            }

            height="700px"

            language={
              getLanguage(
                activeFile?.path
              )
            }

            theme={editorTheme}

            value={
              formatCodeForDisplay(activeFile?.path, activeFile?.code || "")
            }


            options={{

              readOnly: true,

              minimap: {
                enabled: false
              },

              automaticLayout: true,

              wordWrap: "on",

              scrollBeyondLastLine: false,

              fontSize: 14

            }}

          />
          )}

        </div>

      </div>

    </div>

  );

}

export default FileViewer;
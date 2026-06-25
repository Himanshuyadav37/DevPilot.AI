import { useState } from "react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import "./FileViewer.css";

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

  console.log(
    "ACTIVE FILE:",
    activeFile
  );

  console.log(
    "ACTIVE FILE CODE:",
    activeFile?.code
  );

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
              theme="vs-dark"
              original={activeDiff.before || ""}
              modified={activeDiff.after || ""}
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

            theme="vs-dark"

            value={
              activeFile?.code || ""
            }

            onMount={() => {

              console.log(
                "MONACO LOADED"
              );

            }}

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
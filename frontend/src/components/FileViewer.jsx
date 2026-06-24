import { useState } from "react";
import Editor from "@monaco-editor/react";
import "./FileViewer.css";

function FileViewer({ files = [] }) {

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState(
      files.length > 0
        ? files[0]
        : null
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

  const activeFile =
    selectedFile || files[0];

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
            Generated Files
          </h3>

          <span>
            {files.length} files
          </span>

        </div>

        {

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

            {activeFile?.path}

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

        </div>

      </div>

    </div>

  );

}

export default FileViewer;
import { useState } from "react";
import Editor from "@monaco-editor/react";
import "./CodeEditor.css";

const CodeEditor = ({ title = "Generated Code", language, value, onChange }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value || "");
    };

    const handleDownload = () => {
        const fileExtension = language === "python" ? "py" : language === "javascript" ? "js" : "txt";
        const blob = new Blob([value || ""], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `code.${fileExtension}`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="editor-card">
            <div className="editor-header">
                <h3 className="editor-title">{title}</h3>

                <div className="editor-actions">
                    <button className="editor-btn" onClick={handleCopy}>Copy</button>
                    <button className="editor-btn" onClick={handleDownload}>Download</button>
                </div>
            </div>

            <div className="editor-container">
                {isLoading && (
                    <div className="editor-loading">
                        <p>Loading editor...</p>
                    </div>
                )}
                <Editor
                    height="100%"
                    width="100%"
                    language={language}
                    value={value}
                    onChange={onChange}
                    theme="vs-dark"
                    loading={<div className="editor-loading"><p>Loading editor...</p></div>}
                    onMount={() => setIsLoading(false)}
                    options={{
                        fontSize: 15,
                        minimap: { enabled: false },
                        automaticLayout: true,
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        tabSize: 4,
                        padding: { top: 16 },
                        readOnly: false,
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
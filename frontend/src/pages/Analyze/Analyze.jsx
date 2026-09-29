import { useState } from "react";

import { analyzeCode } from "../../api/axios";
import "../Generate/Generate.css";
import "./Analyze.css";

const parseAiOutput = (output) => {
    if (!output) {
        return {};
    }

    if (typeof output === "object") {
        return output;
    }

    const cleanedOutput = output
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "");

    try {
        const parsedOutput = JSON.parse(cleanedOutput);
        return parsedOutput && typeof parsedOutput === "object"
            ? parsedOutput
            : { summary: cleanedOutput };
    } catch {
        return { summary: output };
    }
};

const toList = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    return value ? [value] : [];
};

const getItemText = (item, fallback) => {
    if (typeof item === "string") {
        return item;
    }

    return item?.message || item?.description || item?.suggestion || fallback;
};

const renderIssue = (issue, index) => {
    const details = typeof issue === "object" && issue !== null ? issue : {};
    const metadata = [
        details.severity,
        details.line_number ? `Line ${details.line_number}` : details.line ? `Line ${details.line}` : null,
        details.column ? `Column ${details.column}` : null,
    ].filter(Boolean);

    return (
        <li className="analysis-issue" key={`${getItemText(issue, "issue")}-${index}`}>
            <strong>{getItemText(issue, "Issue found")}</strong>
            {metadata.length > 0 && <span className="analysis-issue-meta">{metadata.join(" · ")}</span>}
        </li>
    );
};

const renderStaticIssue = (issue, index) => (
    <li className="analysis-issue" key={`${issue.message || "static-issue"}-${index}`}>
        <strong>{issue.message || "Issue found"}</strong>
        <span className="analysis-issue-meta">
            {[issue.line_number && `Line ${issue.line_number}`, issue.severity && `Severity ${issue.severity}`]
                .filter(Boolean)
                .join(" · ")}
        </span>
    </li>
);

const Analyze = () => {
    const [code, setCode] = useState("// Paste code to analyze");
    const [language, setLanguage] = useState("javascript");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!code.trim()) {
            return;
        }

        try {
            setLoading(true);
            const response = await analyzeCode({ code, language });
            setResult(response.data);
        } catch (error) {
            setResult({
                aiAnalysis: {
                    model: "unavailable",
                    output: {
                        error: "AI analysis unavailable",
                        details: { message: error.response?.data?.message || error.message },
                    },
                },
                staticAnalysis: {
                    issues: [],
                    error: { message: "Analysis request failed before static analysis completed." },
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="generate-page">
            <h1 className="generate-title">Analyze Code</h1>
            <p className="generate-description">Review code with AI and static analysis.</p>
            <div className="generate-layout">
                <div className="generate-input">
                    <h1>Code to Analyze</h1>
                    <textarea
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        className="generate-textarea"
                    />
                    <select
                        className="generate-select"
                        value={language}
                        onChange={(event) => setLanguage(event.target.value)}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                    <button className="generate-button" onClick={handleAnalyze} disabled={loading}>
                        {loading ? "Analyzing..." : "Analyze Code"}
                    </button>
                </div>
                <div className="generate-output">
                    <div className="analysis-results">
                        <section className="analysis-panel">
                            <h2>AI Analysis</h2>
                            {!result && <p className="analysis-muted">Run analysis to see AI findings.</p>}
                            {result?.aiAnalysis?.output?.error && (
                                <div className="analysis-error">
                                    <h3>AI Analysis Unavailable</h3>
                                    <p>The AI analysis is temporarily unavailable. Please try again later.</p>
                                </div>
                            )}
                            {result?.aiAnalysis && !result.aiAnalysis.output?.error && (() => {
                                const aiOutput = parseAiOutput(result.aiAnalysis.output);
                                const issues = toList(aiOutput.issues);
                                const suggestions = toList(aiOutput.suggestions);

                                return (
                                    <div className="analysis-content">
                                        <div className="analysis-section">
                                            <h3>Summary</h3>
                                            <p>{aiOutput.summary || "No summary provided."}</p>
                                        </div>
                                        <div className="analysis-section">
                                            <h3>Issues</h3>
                                            {issues.length === 0
                                                ? <p className="analysis-success">No issues found.</p>
                                                : <ul className="analysis-list">{issues.map(renderIssue)}</ul>}
                                        </div>
                                        <div className="analysis-section">
                                            <h3>Suggestions</h3>
                                            {suggestions.length === 0
                                                ? <p className="analysis-muted">No suggestions provided.</p>
                                                : (
                                                    <ol className="analysis-list analysis-suggestions">
                                                        {suggestions.map((suggestion, index) => (
                                                            <li key={`${getItemText(suggestion, "suggestion")}-${index}`}>
                                                                {getItemText(suggestion, "Suggestion provided")}
                                                            </li>
                                                        ))}
                                                    </ol>
                                                )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </section>

                        <section className="analysis-panel">
                            <h2>Static Analysis</h2>
                            {result?.staticAnalysis?.error && (
                                <div className="analysis-error">
                                    <strong>Static analysis unavailable</strong>
                                    <p>{result.staticAnalysis.error.message || "The static analyzer could not complete."}</p>
                                </div>
                            )}
                            {result && !result.staticAnalysis?.error && (
                                result.staticAnalysis.length === 0
                                    ? <p className="analysis-success">No static-analysis issues found.</p>
                                    : <ul className="analysis-list">{result.staticAnalysis.map(renderStaticIssue)}</ul>
                            )}
                            {!result && <p className="analysis-muted">Run analysis to see lint issues.</p>}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analyze;

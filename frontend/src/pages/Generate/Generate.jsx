import { useState } from "react";

import CodeEditor from "../../components/CodeEditor/CodeEditor";

import { generateCode } from "../../api/axios";

import './Generate.css';

const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
];

const taskTypes = [
    { value: "boilerplate", label: "Boilerplate" },
    { value: "unit_test", label: "Unit Test" },
    { value: "doc_string", label: "Documentation" },
];

const Generate = () => {
    const [language, setLanguage] = useState("javascript");
    const [prompt, setPrompt] = useState("");
    const [taskType, setTaskType] = useState("boilerplate");
    const [generatedCode, setGeneratedCode] = useState("// Your generated code will appear here...");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert("Please enter a prompt.");
            return;
        }

        try {
            setLoading(true);

            const response = await generateCode({
                prompt,
                language,
                task_type: taskType,
            });

            const output = response.data.output;
            setGeneratedCode(typeof output === "string" ? output : JSON.stringify(output, null, 2));

        } catch (error) {
            console.error(error);
            alert("Failed to generate code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="generate-page">
            <h1 className="generate-title">Generate Code</h1>
            <p className="generate-description">Describe what you want to build: Our AI will generate clean efficient code for you.</p>

            <div className="generate-layout">
                <div className="generate-input">
                    <h1>Describe your Requirements</h1>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Example: Create a function that checks if a string is a palindrome."
                        className="generate-textarea"
                    />

                    <div className="generate-select-wrapper">
                        <div className="generate-select-container">
                            <p>Programming Language</p>
                            <select
                                className="generate-select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                {languages.map((lang) => (
                                    <option key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="generate-select-container">
                            <p>Task Type</p>
                            <select
                                className="generate-select"
                                value={taskType}
                                onChange={(e) => setTaskType(e.target.value)}
                            >
                                {taskTypes.map((task) => (
                                    <option key={task.value} value={task.value}>
                                        {task.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button className="generate-button" onClick={handleGenerate} disabled={loading}>
                        {loading ? "Generating..." : "Generate Code"}
                    </button>
                </div>

                <div className="generate-output">
                    <CodeEditor
                        language={language}
                        value={generatedCode}
                        onChange={setGeneratedCode}
                    />
                </div>
            </div>
        </div>
    );
};

export default Generate;
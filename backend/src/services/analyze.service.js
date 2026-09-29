const { execute } = require("./llm/model.router");
const { buildAnalyzePrompt } = require("../promts/analyze.prompt");
const { runEslint } = require("./analysis/eslint.service");
const { createRequest } = require("../repositories/request.repository");

const parseAiOutput = (aiAnalysis) => {
    if (typeof aiAnalysis?.output !== "string") {
        return aiAnalysis;
    }

    try {
        return { ...aiAnalysis, output: JSON.parse(aiAnalysis.output) };
    } catch (error) {
        console.error("Failed to parse AI output as JSON:", error.message);
        return {
            ...aiAnalysis,
            output: {
                error: "Invalid JSON from AI",
                raw: aiAnalysis.output,
            },
        };
    }
};

const resolveAiAnalysis = (result) => {
    if (result.status === "fulfilled") {
        return parseAiOutput(result.value);
    }

    console.error("AI analysis failed:", result.reason?.message);
    return {
        model: "unavailable",
        output: {
            error: "AI analysis unavailable",
            details: {
                message: result.reason?.message ?? "Unknown error",
            },
        },
    };
};

const resolveStaticAnalysis = (result) => {
    if (result.status === "fulfilled") {
        return result.value;
    }

    console.error("Static analysis failed:", result.reason?.message);
    return {
        issues: [],
        error: {
            message: result.reason?.message ?? "Unknown error",
        },
    };
};

const persistAnalysisHistory = async ({ code, language, aiAnalysis, staticAnalysis }) => {
    await createRequest({
        endpoint: "/analyze",
        taskType: "analyze",
        language,
        userInput: code,
        routedModel: aiAnalysis.model ?? "unavailable",
        llmOutput: aiAnalysis.output,
        staticAnalysisOutput: staticAnalysis,
        success: !aiAnalysis.output?.error,
    });
};

const analyzeCodeService = async (code, language) => {
    const prompt = buildAnalyzePrompt(code, language);

    const [aiResult, eslintResult] = await Promise.allSettled([
        execute("analyze", prompt, language),
        runEslint(code, language),
    ]);

    const aiAnalysis = resolveAiAnalysis(aiResult);
    const staticAnalysis = resolveStaticAnalysis(eslintResult);

    persistAnalysisHistory({ code, language, aiAnalysis, staticAnalysis }).catch((error) => {
        console.error("Failed to persist analysis history:", error.message);
    });

    return { aiAnalysis, staticAnalysis };
};

module.exports = {
    analyzeCodeService,
};

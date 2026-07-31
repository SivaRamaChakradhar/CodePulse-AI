const { execute } = require("./llm/model.router");
const { buildAnalyzePrompt } = require("../promts/analyze.prompt");
const { runEslint } = require("./analysis/eslint.service");
const { createRequest } = require("../repositories/request.repository");

const withTimeout = (promise, timeoutMs, message) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(message)), timeoutMs);
        }),
    ]);
};

const analyzeCodeService = async (code, language) => {
    const prompt = buildAnalyzePrompt(code, language);

    let aiAnalysis;
    let staticAnalysis;

    try {
        [aiAnalysis, staticAnalysis] = await Promise.all([
            withTimeout(execute("analyze", prompt, language), 20000, "AI analysis timed out"),
            runEslint(code),
        ]);
    } catch (error) {
        console.error("Analyze service error:", error);
        staticAnalysis = { error: "Static analysis unavailable" };
        aiAnalysis = {
            model: "unavailable",
            output: {
                error: "AI analysis unavailable",
                details: error.message,
            },
        };
    }

    try {
        await withTimeout(
            createRequest({
                endpoint: "/analyze",
                taskType: "analyze",
                language,
                userInput: code,
                routedModel: aiAnalysis?.model || "unavailable",
                llmOutput: aiAnalysis?.output,
                staticAnalysisOutput: staticAnalysis,
                success: !!aiAnalysis && !aiAnalysis.output?.error,
            }),
            3000,
            "Request persistence timed out"
        );
    } catch (dbError) {
        console.error("Request persistence error:", dbError);
    }

    try {
        if (typeof aiAnalysis?.output === "string") {
            aiAnalysis.output = JSON.parse(aiAnalysis.output);
        }
    } catch (error) {
        aiAnalysis.output = {
            error: "Invalid JSON returned by AI",
        };
    }

    return {
        aiAnalysis,
        staticAnalysis,
    };
};

module.exports = {
    analyzeCodeService
}
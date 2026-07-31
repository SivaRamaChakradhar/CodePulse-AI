const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const REQUEST_TIMEOUT_MS = 20000;

const withTimeout = (promise, timeoutMs, message) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(message)), timeoutMs);
        }),
    ]);
};

const buildFallback = (details) => ({
    model: MODEL,
    output: {
        error: "AI analysis unavailable",
        details,
    },
});

const generate = async (prompt, language) => {
    if (!process.env.GEMINI_API_KEY) {
        return buildFallback("GEMINI_API_KEY is not configured");
    }

    try {
        const response = await withTimeout(
            ai.models.generateContent({
                model: MODEL,
                contents: prompt,
            }),
            REQUEST_TIMEOUT_MS,
            "Gemini request timed out"
        );

        const text = response?.text || "";
        const cleanCode = text.replace(/```[\w]*\n?/g, "").replace(/```/g, "").trim();

        if (!cleanCode) {
            return buildFallback("Gemini returned an empty response");
        }

        return {
            model: MODEL,
            output: cleanCode,
        };
    } catch (error) {
        console.error("Gemini provider error:", error);
        return buildFallback(error?.message || "Unknown Gemini error");
    }
};

module.exports = {
    generate,
};
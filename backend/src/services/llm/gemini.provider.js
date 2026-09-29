const { GoogleGenAI } = require("@google/genai");

const DEFAULT_MODEL = "gemini-3.8-flash";
const DEFAULT_FALLBACK_MODEL = "gemini-3.5-flash";

const resolveModel = () => {
    const configuredModel = process.env.GEMINI_MODEL?.trim();

    return configuredModel || DEFAULT_MODEL;
};

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = resolveModel();
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_FALLBACK_MODEL;
const REQUEST_TIMEOUT_MS = 20000;
const MAX_ATTEMPTS_PER_MODEL = 2;
const RETRY_BASE_DELAY_MS = 500;

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

const extractErrorDetails = (error) => {
    const directError = error?.error || error?.details?.error;
    const message = error?.message || directError?.message || "Unknown Gemini error";
    const status = error?.status || directError?.status;
    const code = error?.code || directError?.code || status;

    if (directError) {
        return {
            code,
            status,
            message: directError.message || message,
        };
    }

    const match = message.match(/\{[\s\S]*\}/);
    if (match) {
        try {
            const parsed = JSON.parse(match[0]);
            if (parsed.error) {
                return {
                    code: parsed.error.code,
                    status: parsed.error.status,
                    message: parsed.error.message,
                };
            }
        } catch {
            // Keep the SDK error fields when its message is not valid JSON.
        }
    }

    return {
        code,
        status,
        message,
    };
};

const getErrorDetails = (error) => {
    return extractErrorDetails(error);
};

const isTransientError = (error) => {
    const details = extractErrorDetails(error);
    return [429, 500, 502, 503, 504].includes(Number(details.code))
        || [429, 500, 502, 503, 504].includes(Number(details.status));
};

const wait = (durationMs) => new Promise((resolve) => setTimeout(resolve, durationMs));

const cleanResponse = (text) => text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

const generate = async (prompt) => {
    if (!process.env.GEMINI_API_KEY) {
        return buildFallback({
            message: "GEMINI_API_KEY is not configured",
        });
    }

    try {
        const models = [MODEL, FALLBACK_MODEL].filter((model, index, values) => model && values.indexOf(model) === index);
        let lastError;

        for (const model of models) {
            for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_MODEL; attempt += 1) {
                try {
                    const response = await withTimeout(
                        ai.models.generateContent({
                            model,
                            contents: prompt,
                        }),
                        REQUEST_TIMEOUT_MS,
                        "Gemini request timed out"
                    );

                    const text = typeof response?.text === "string" ? response.text : "";
                    const cleanCode = cleanResponse(text);

                    if (!cleanCode) {
                        return buildFallback({
                            message: "Gemini returned an empty response",
                        });
                    }

                    return { model, output: cleanCode };
                } catch (error) {
                    lastError = error;
                    const details = getErrorDetails(error);
                    console.error("Gemini provider error", {
                        model,
                        status: details.status,
                        code: details.code,
                        message: details.message,
                    });

                    if (!isTransientError(error)) {
                        return buildFallback(details);
                    }

                    if (attempt === MAX_ATTEMPTS_PER_MODEL - 1) {
                        break;
                    }
                    await wait(RETRY_BASE_DELAY_MS * (2 ** attempt));
                }
            }
        }

        return buildFallback(getErrorDetails(lastError));
    } catch (error) {
        const details = getErrorDetails(error);
        console.error("Gemini provider error", details);
        return buildFallback(details);
    }
};

module.exports = {
    generate,
};
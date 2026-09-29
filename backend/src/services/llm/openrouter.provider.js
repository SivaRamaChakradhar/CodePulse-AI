const OPENROUTER_URL =
    "https://openrouter.ai/api/v1/chat/completions";

const DEFAULT_MODEL =
    process.env.OPENROUTER_MODEL || "openai/gpt-5";

const REQUEST_TIMEOUT_MS = 30000;

const withTimeout = (promise, timeoutMs, message) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(message));
            }, timeoutMs);
        }),
    ]);
};

const buildFallback = (details) => ({
    model: DEFAULT_MODEL,
    output: {
        error: "AI analysis unavailable",
        details,
    },
});

const cleanResponse = (text) => {
    if (typeof text !== "string") {
        return "";
    }

    return text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
};

const generate = async (prompt) => {
    if (!process.env.OPENROUTER_API_KEY) {
        return buildFallback({
            message: "OPENROUTER_API_KEY is not configured",
        });
    }

    try {
        const response = await withTimeout(
            fetch(OPENROUTER_URL, {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "CodePulse AI",
                },

                body: JSON.stringify({
                    model: DEFAULT_MODEL,

                    messages: [
                        {
                            role: "system",
                            content: `
                                You are an expert software code reviewer.

                                Analyze the provided code and return ONLY valid JSON.

                                The JSON must follow exactly this structure:

                                {
                                "summary": "Short explanation of the overall code quality and behavior.",
                                "issues": [],
                                "suggestions": []
                                }

                                Rules:
                                - "summary" must be a string.
                                - "issues" must be an array.
                                - "suggestions" must be an array.
                                - Do not use Markdown.
                                - Do not wrap the JSON in code fences.
                                - Do not add any text before or after the JSON.
                                - Identify functional bugs, security problems, performance problems, and important code-quality issues.
                                - If there are no issues, return an empty issues array.
                                - Keep suggestions practical and relevant.
                            `,
                        },
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],

                    max_tokens: 2000,
                    temperature: 0.2,
                }),
            }),
            REQUEST_TIMEOUT_MS,
            "OpenRouter request timed out"
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenRouter API error:", {
                status: response.status,
                data,
            });

            return buildFallback({
                code: response.status,
                message:
                    data?.error?.message ||
                    "OpenRouter request failed",
            });
        }

        const text =
            data?.choices?.[0]?.message?.content || "";

        const output = cleanResponse(text);

        if (!output) {
            return buildFallback({
                message: "OpenRouter returned an empty response",
            });
        }

        return {
            model: DEFAULT_MODEL,
            output,
        };
    } catch (error) {
        console.error("OpenRouter provider error:", error);

        return buildFallback({
            message:
                error?.message ||
                "Unknown OpenRouter error",
        });
    }
};

module.exports = {
    generate,
};
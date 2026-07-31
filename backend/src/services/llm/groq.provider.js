const Groq = require("groq-sdk");

const MODEL = "llama-3.3-70b-versatile";

const createGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return null;
    }

    return new Groq({ apiKey });
};

const generate = async (prompt, language) => {
    const groq = createGroqClient();

    if (!groq) {
        return {
            model: MODEL,
            output: {
                error: "AI generation unavailable",
                details: "GROQ_API_KEY is not configured",
            },
        };
    }

    try {
        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: "user",
                    content: `Generate ${language} code for: ${prompt}`,
                },
            ],
        });

        const response = completion.choices[0].message.content;
        const cleanCode = response.replace(/```[\w]*\n?/g, "").replace(/```/g, "").trim();

        return {
            model: MODEL,
            output: cleanCode,
        };
    } catch (error) {
        console.error("Groq provider error:", error);
        return {
            model: MODEL,
            output: {
                error: "AI generation unavailable",
                details: error?.message || "Unknown Groq error",
            },
        };
    }
};

module.exports = {
    generate,
};
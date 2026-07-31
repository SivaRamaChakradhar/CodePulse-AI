const { execute } = require("./llm/model.router");
const { buildGeneratePrompt } = require("../promts/generate.prompt");
const { createRequest } = require("../repositories/request.repository");

const withTimeout = (promise, timeoutMs, message) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(message)), timeoutMs);
        }),
    ]);
};

const generateCodeService = async (prompt, language, taskType) => {

    const finalPrompt = buildGeneratePrompt(prompt, language);

    const result = await withTimeout(
        execute(taskType, finalPrompt, language),
        20000,
        "Generation timed out"
    );

    try {
        await withTimeout(
            createRequest({
                endpoint: "/generate",
                taskType,
                language,
                userInput: prompt,
                routedModel: result.model,
                llmOutput: result.output,
                success: true,
            }),
            3000,
            "Request persistence timed out"
        );
    } catch (dbError) {
        console.error("Request persistence error:", dbError);
    }

    return result;
};

module.exports = {
    generateCodeService
};
const openrouter = require("./openrouter.provider");
const groq = require("./groq.provider");

const execute = async (taskType, prompt, language) => {
    if (taskType === "analyze") {
        return openrouter.generate(prompt, language);
    }

    if (["boilerplate", "unit_test", "doc_string"].includes(taskType)) {
        return groq.generate(prompt, language);
    }

    return openrouter.generate(prompt, language);
};

module.exports = {
    execute
}
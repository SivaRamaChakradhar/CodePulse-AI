const gemini = require("./gemini.provider");
const groq = require("./groq.provider");

const execute = async (task_type, prompt, language) => {
    if(task_type == "analyze"){
        return gemini.generate(prompt, language);
    }

    if(["boilerplate", "unit_test", "doc_string"].includes(task_type)){
        return await groq.generate(prompt, language);
    }

    return await gemini.generate(prompt, language);
}

module.exports = {
    execute
}
const path = require("path");

const { ESLint } = require("eslint");

const eslint = new ESLint({
    cwd: path.resolve(__dirname, "../../../"),
    overrideConfig: {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
    },
});

const formatMessages = (messages) => messages.map((msg) => ({
        line_number: msg.line,
        message: msg.message,
    severity: msg.severity,
}));

const runEslint = async (code, language = "javascript") => {
    if (language !== "javascript") {
        return [];
    }

    const [result] = await eslint.lintText(code, { filePath: "code.mjs" });
    return formatMessages(result.messages);
};

module.exports = {
    runEslint,
};

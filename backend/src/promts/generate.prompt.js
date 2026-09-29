const buildGeneratePrompt = (prompt, language) => {
    const finalPrompt = `
        You are an expert ${language} developer.

        Generate production-ready ${language} code.

        Rules:
        - Return ONLY the source code.
        - Do NOT include explanations.
        - Do NOT include markdown.
        - Do NOT include headings.
        - Do NOT include code fences.
        - Do NOT include alternative implementations.

        User Request:
        ${prompt}
    `

    return finalPrompt;
}

module.exports = {
    buildGeneratePrompt
}
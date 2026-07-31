const buildAnalyzePrompt = (code, language) => {
    const prompt = `
        Your are a Senior Software Engineer.
        Analyze the following ${language} code.
        check for
            -Bugs
            -Security Issues
            -Perfomance Issues
            -Code Quality
            -Best Practices
        Return ONLY valid JSON.
            Do not include:

            - markdown
            - explanation
            - comments
            - JavaScript
            - console.log
            - code blocks

            Return exactly this structure:

            {
            "summary": "...",
            "issues": [],
            "suggestions": []
            }
        Code: ${code}
    `;

    return prompt
}

module.exports = {
    buildAnalyzePrompt
}
const { analyzeCodeService } = require("../services/analyze.service");

const withTimeout = (promise, timeoutMs, fallback) => {
    return Promise.race([
        promise,
        new Promise((resolve) => {
            setTimeout(() => resolve(fallback), timeoutMs);
        }),
    ]);
};

const analyzeCode = async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "code is required",
            });
        }

        const result = await withTimeout(
            analyzeCodeService(code, language),
            25000,
            {
                aiAnalysis: {
                    model: "unavailable",
                    output: {
                        error: "AI analysis unavailable",
                        details: "Request timed out",
                    },
                },
                staticAnalysis: {
                    error: "Static analysis unavailable",
                },
            }
        );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    analyzeCode,
};
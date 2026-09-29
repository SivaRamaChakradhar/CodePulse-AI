const { analyzeCodeService } = require("../services/analyze.service");

const analyzeCode = async (req, res) => {
    const { code, language } = req.body;

    if (typeof code !== "string" || !code.trim()) {
        return res.status(400).json({
            success: false,
            message: "Code is required",
        });
    }

    try {
        const result = await analyzeCodeService(code, language);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Analyze controller error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Analysis failed",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

module.exports = {
    analyzeCode,
};

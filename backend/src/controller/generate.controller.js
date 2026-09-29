const { generateCodeService } = require("../services/generate.service");

const generateCode = async (req, res) => {
    try {
        const { prompt, language, task_type } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required",
            });
        }

        const result = await generateCodeService(prompt, language, task_type);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Generate controller error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    generateCode,
};
const { historyService } = require("../services/history.service");

const getHistory = async (req, res) => {
    try {
        const history = await historyService();

        return res.status(200).json({
            success: true,
            data: history,
        });
    } catch (error) {
        console.error("History fetch error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch history",
        });
    }
};

module.exports = {
    getHistory,
};
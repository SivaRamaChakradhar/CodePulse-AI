const prisma = require("../config/prisma");

const createRequest = async (data) => {
    try {
        const request = await prisma.request.create({
            data: {
                ...data,
                createdAt: new Date(),
            },
        });
        return request;
    } catch (error) {
        console.error("Failed to create request record:", error.message);
        throw error;
    }
};

const getHistory = async () => {
    try {
        return await prisma.request.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 100,
        });
    } catch (error) {
        console.error("Failed to fetch history:", error.message);
        throw error;
    }
};

module.exports = {
    createRequest,
    getHistory,
};
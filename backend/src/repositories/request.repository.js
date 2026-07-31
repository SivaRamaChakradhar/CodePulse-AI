const prisma = require("../config/prisma");

const createRequest = async (data) => {
    return await prisma.request.create({
        data
    });
};

const getHistory = async () => {
    return await prisma.request.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
};

module.exports = {
    createRequest,
    getHistory
};
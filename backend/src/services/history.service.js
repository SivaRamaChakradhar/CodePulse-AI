const { getHistory } = require("../repositories/request.repository");

const historyService = async () => {
    return await getHistory();
};

module.exports = {
    historyService,
};
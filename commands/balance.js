module.exports = {
    name: "balance",
    dev: "HNT",
    info: "Kiểm tra số dư tài khoản của bạn",
    onPrefix: true,
    usages: ".balance: Kiểm tra số dư tài khoản của bạn.",
    cooldowns: 0,

    onLaunch: async function({ api, event }) {
        const { threadID, messageID, senderID } = event;
        const userID = String(senderID);

        const balance = global.balance[userID] || 0;

        return api.sendMessage(`» Số dư tài khoản của bạn là: ${balance} Gems`, threadID, messageID);
    }
};

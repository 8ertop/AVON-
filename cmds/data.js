const { setBalance, getBalance, saveData } = require('../utils/currencies'); 

function formatNumber(number)  {
    return number.toLocaleString('vi-VN');
}

module.exports = {
    name: "data",
    dev: "HNT",
    info: "Thay đổi số tiền của người dùng bằng ID.",
    onPrefix: true,
    usages: ".data <ID> <số tiền>: Thay đổi số dư của một ID cụ thể.",
    cooldowns: 0,
    usedby: 2,
    hide: true,

    onLaunch: async function({ api, event, target = [] }) {
        const { threadID, messageID } = event;

        if (target.length < 2) {
            return api.sendMessage("Vui lòng nhập đúng cú pháp: .data <ID> <số tiền>", threadID, messageID);
        }

        const userID = target[0];
        const amount = parseInt(target[1].replace(/\./g, ''), 10);

        if (isNaN(amount)) {
            return api.sendMessage("Số tiền phải là một số nguyên.", threadID, messageID);
        }

        const currentBalance = getBalance(userID);
        setBalance(userID, amount);
        saveData(); 

        return api.sendMessage(
            `✅ Đã thay đổi số dư của ID: ${userID}.\nSố dư cũ: ${formatNumber(currentBalance)} Gems.\nSố dư mới: ${formatNumber(amount)} Gems.`,
            threadID,
            messageID
        );
    }
};

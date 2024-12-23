const { randomInt } = require("crypto");
const fs = require('fs');
const path = require('path');

const userClaimFilePath = path.join(__dirname, 'json', 'userClaims.json');

function readClaims() {
    if (fs.existsSync(userClaimFilePath)) {
        return JSON.parse(fs.readFileSync(userClaimFilePath));
    } else {
        return {};
    }
}

function updateClaimed(senderID, timestamp) {
    const claims = readClaims();
    claims[senderID] = timestamp;
    fs.writeFileSync(userClaimFilePath, JSON.stringify(claims, null, 2));
}

function formatNumber(number) {
    return number.toLocaleString('vi-VN');
}

module.exports = {
    name: "daily",
    dev: "HNT", 
    info: "Nhận Xu mỗi ngày",
    onPrefix: true,
    usages: ".daily: Nhận Xu hàng ngày.",
    cooldowns: 0,

    onLaunch: async function({ api, event }) {
        const { threadID, messageID, senderID } = event;

        const claims = readClaims();
        const lastClaimed = claims[senderID] || 0;
        const now = Date.now();
        const dayInMillis = 24 * 60 * 60 * 1000;

        if ((now - lastClaimed) < dayInMillis) {
            return api.sendMessage("Bạn đã nhận Xu hôm nay rồi. Hãy quay lại vào ngày mai!", threadID, messageID);
        }

        const amount = randomInt(10, 51) * 1000;

        global.balance[senderID] = (global.balance[senderID] || 0) + amount;
        updateClaimed(senderID, now);

        require('../utils/currencies').saveData();

        const currentBalance = global.balance[senderID] || 0;

        return api.sendMessage(
            `» Bạn đã nhận ${formatNumber(amount)} Xu! Số dư hiện tại của bạn là: ${formatNumber(currentBalance)} Xu.`,
            threadID,
            messageID
        );
    }
};

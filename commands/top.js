const fs = require('fs');
const path = require('path');
const { allBalances } = require('../utils/currencies');

module.exports = {
    name: "top",
    dev: "HNT",
    info: "Xem top 10 người giàu nhất server.",
    onPrefix: true,
    usages: ".top: Xem top 10 người chơi giàu nhất.",
    cooldowns: 0,

    onLaunch: async function({ api, event, target = [] }) {
        const { threadID, messageID, senderID } = event;

        let allBalancesData;
        try {
            allBalancesData = allBalances();
        } catch (error) {
            console.log("Không thể lấy dữ liệu số dư:", error);
            return api.sendMessage("Không thể lấy dữ liệu người dùng.", threadID, messageID);
        }

        let userData;
        try {
            const rawData = fs.readFileSync('./events/cache/userData.json');
            userData = JSON.parse(rawData);
        } catch (error) {
            console.log("Không thể đọc file userData.json:", error);
            return api.sendMessage("Không thể đọc dữ liệu người dùng.", threadID, messageID);
        }

        const sortedBalances = Object.entries(allBalancesData)
            .sort((a, b) => b[1] - a[1]) 
            .slice(0, 10); 

        let topMessage = "💎 Top 10 người giàu nhất Server\n━━━━━━━━━━━━━━━━━━\n\n";

        let userPosition = null;
        sortedBalances.forEach((entry, index) => {
            const userID = entry[0];
            const balance = entry[1];
            const userName = userData[userID] ? userData[userID].name : "NaN";

            topMessage += `\n${index + 1}. ${userName}: ${balance} Gems\n`;

            if (userID === senderID) {
                userPosition = index + 1;
            }
        });

        if (sortedBalances.length === 0) {
            topMessage = "Không có người chơi nào trong hệ thống.";
        }

        if (userPosition !== null) {
            topMessage += `\n🎉 Bạn đang ở vị trí #${userPosition} trong top 10 người giàu nhất!`;
        } else {
            topMessage += "\n⚠️ Bạn không có trong top 10 người giàu nhất server.";
        }

        return api.sendMessage(topMessage, threadID, messageID);
    }
};

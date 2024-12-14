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
        const { threadID, messageID } = event;

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
        sortedBalances.forEach((entry, index) => {
            const userID = entry[0];
            const balance = entry[1];

            const userName = userData[userID] ? userData[userID].name : "NaN";

            topMessage += `${index + 1}. ${userName}: ${balance} Gems\n`;
        });

        if (sortedBalances.length === 0) {
            topMessage = "Không có người chơi nào trong hệ thống.";
        }

        return api.sendMessage(topMessage, threadID, messageID);
    }
};

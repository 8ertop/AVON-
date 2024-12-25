const fs = require('fs');
const path = require('path');
const { randomInt } = require('crypto');

const wishesFilePath = path.join(__dirname, 'json', 'wishes.json');
const claimsFilePath = path.join(__dirname, 'json', 'claims.json');
const gifsDirectory = path.join(__dirname, 'cache');

const gifFiles = [
    "eb4058219d80f9957ed8fa12b3921208.gif",
    "icegif-715.gif",
    "db2b7a8e45eae83e67944f4d9773292f.gif"
];

function getRandomGif() {
    if (gifFiles.length === 0) {
        console.error('Không có GIF nào trong thư mục cache.');
        return null;
    }
    const randomIndex = Math.floor(Math.random() * gifFiles.length);
    return path.join(gifsDirectory, gifFiles[randomIndex]);
}

function readJSON(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } else {
            console.warn(`File not found: ${filePath}`);
            return {};
        }
    } catch (err) {
        console.error(`Failed to read JSON from ${filePath}:`, err.message);
        return {};
    }
}

function writeJSON(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Data written to ${filePath}`);
    } catch (err) {
        console.error(`Failed to write JSON to ${filePath}:`, err.message);
    }
}

const wishes = readJSON(wishesFilePath);
const claims = readJSON(claimsFilePath);
module.exports = {
    name: 'noel',
    info: 'Gửi và nhận lời chúc Noel',
    dev: 'HNT',
    dmUser: true,
    onPrefix: true,
    usages: '.noel <lời chúc>: Gửi lời chúc Noel và nhận quà!',
    cooldowns: 0,

    onLaunch: async function ({ api, event, target }) {
        const { threadID, messageID, senderID } = event;

        const now = new Date();
        const startDate = new Date('2024-12-24T00:00:00+07:00');
        const endDate = new Date('2024-12-25T23:59:59+07:00');

        if (now < startDate || now > endDate) {
            return api.sendMessage("Chỉ có thể tham gia sự kiện Noel trong ngày 24 và 25/12!", threadID, messageID);
        }

        if (claims[senderID]?.received) {
            return api.sendMessage("Bạn đã tham gia và nhận lời chúc rồi! Chúc bạn một Giáng Sinh an lành!", threadID, messageID);
        }

        const userWish = (target && target.join) ? target.join(" ").trim() : '';
        if (!userWish) {
            return api.sendMessage("Bạn cần nhập lời chúc sau lệnh, ví dụ: `.noel Chúc bạn một Giáng Sinh an lành!`", threadID, messageID);
        }

        if (!wishes[senderID]) wishes[senderID] = [];
        wishes[senderID].push(userWish);
        writeJSON(wishesFilePath, wishes);

        const amount = randomInt(200, 501) * 1000;
        global.balance[senderID] = (global.balance[senderID] || 0) + amount;

        claims[senderID] = { received: true, timestamp: now.getTime() };
        writeJSON(claimsFilePath, claims);

        const randomGif = getRandomGif();

        if (!randomGif) {
            return api.sendMessage("Có lỗi xảy ra khi tải GIF, vui lòng thử lại sau!", threadID, messageID);
        }

        const allWishes = Object.keys(wishes).flatMap(id => wishes[id].map(wish => ({ senderID: id, wish })));
        if (allWishes.length > 1) {
            const randomWish = allWishes.filter(w => w.senderID !== senderID);
            const randomChoice = randomWish[Math.floor(Math.random() * randomWish.length)];
            const chosenWish = randomChoice.wish;

            await api.sendMessage({
                body: `Bạn đã nhận được lời chúc từ người dùng khác: "${chosenWish}"\nChúc bạn một Giáng Sinh vui vẻ và tràn đầy hạnh phúc!`,
                attachment: fs.createReadStream(randomGif)
            }, threadID, messageID);
        } else {
            await api.sendMessage({
                body: `Cảm ơn bạn đã gửi lời chúc! Bạn đã nhận ${amount.toLocaleString('vi-VN')} Xu.`,
                attachment: fs.createReadStream(randomGif)
            }, threadID, messageID);
        }
    },

    preload: async function () {
        console.log('Đã tải sẵn GIF');
    }
};

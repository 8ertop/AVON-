const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');

const userDataPath = path.join(__dirname, '../events/cache/userData.json');

function calculateRequiredXp(level) {
    if (level === 1) return 0;
    return Math.floor(10 * Math.pow(1.5, level - 2));
}

async function circleImage(imageBuffer, size) {
    const img = await loadImage(imageBuffer);
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);

    return canvas.toBuffer();
}

function createCanvasBackground(ctx, width, height, level) {
    const bgColor = level >= 10 ? '#1abc9c' : level >= 5 ? '#3498db' : '#9b59b6';
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, bgColor);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function drawUserInfo(ctx, name, level, currentExp, requiredXp, rank) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    
    ctx.font = 'bold 45px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'; 
    ctx.fillStyle = '#e74c3c'; 
    ctx.fillText(`${name.toUpperCase()}`, 310, 120); 

    ctx.font = 'bold 30px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    ctx.fillStyle = '#ecf0f1'; 
    ctx.fillText(`Level: ${level}`, 310, 170);
    ctx.fillText(`Exp: ${currentExp}/${requiredXp}`, 310, 220);
    ctx.fillText(`Xếp Hạng: ${rank}`, 310, 270);
}

function drawProgressBar(ctx, currentExp, requiredXp) {
    const progressBarWidth = 500;
    const progressBarHeight = 30;
    const progress = Math.min(currentExp / requiredXp, 1);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 3;

    ctx.fillStyle = '#34495e';
    ctx.fillRect(50, 350, progressBarWidth, progressBarHeight);

    ctx.strokeRect(50, 350, progressBarWidth, progressBarHeight);

    const progressGradient = ctx.createLinearGradient(0, 0, progressBarWidth, 0);
    progressGradient.addColorStop(0, '#e74c3c');
    progressGradient.addColorStop(1, '#f1c40f');

    ctx.fillStyle = progressGradient;
    ctx.fillRect(50, 350, progress * progressBarWidth, progressBarHeight);

    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50 + progress * progressBarWidth, 350);
    ctx.lineTo(50 + progress * progressBarWidth, 350 + progressBarHeight);
    ctx.stroke();

    ctx.shadowColor = 'transparent';

    ctx.font = '20px Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText(`${currentExp}/${requiredXp} XP`, 50 + progressBarWidth / 2 - 50, 373);
}

async function drawAvatar(ctx, senderID, level) {
    const avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    
    const avatarX = 50; 
    const avatarY = 80; 
    const avatarSize = 200; 

    try {
        const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        const avatarBuffer = Buffer.from(avatarResponse.data);
        const avatar = await circleImage(avatarBuffer, avatarSize);

        const avatarImage = await loadImage(avatar);
        ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize); 

        const frameX = avatarX + avatarSize / 2; 
        const frameY = avatarY + avatarSize / 2; 
        const frameRadius = avatarSize / 2;

        ctx.strokeStyle = level >= 10 ? '#e74c3c' : level >= 5 ? '#f1c40f' : '#ecf0f1';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(frameX, frameY, frameRadius, 0, Math.PI * 2, true); 
        ctx.closePath();
        ctx.stroke();
    } catch (error) {
        console.log('Lỗi khi tải avatar:', error.message);
    }
}

async function updateRankApi(senderID, name, currentExp, level, rank) {
    const requiredXp = calculateRequiredXp(level);
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    createCanvasBackground(ctx, width, height, level);
    drawUserInfo(ctx, name, level, currentExp, requiredXp, rank);
    drawProgressBar(ctx, currentExp, requiredXp);
    await drawAvatar(ctx, senderID, level);

    const imagePath = path.join(__dirname, 'cache', `rankcard_${senderID}.jpeg`);
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(imagePath, buffer);

    return imagePath;
}

module.exports = {
    name: 'rank',
    info: 'Xem xếp hạng hiện tại của bạn',
    dev: 'HNT',
    onPrefix: true, 
    dmUser: true,
    usages: 'rank',
    cooldowns: 5, 

    onLaunch: async function ({ api, event }) {
        const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
        const userId = event.senderID;

        if (!userData[userId]) {
            return api.sendMessage("Bạn chưa có dữ liệu xếp hạng. Hãy nhắn tin để kiếm XP!", event.threadID);
        }

        const user = userData[userId];
        const rank = user.rank || "N/A"; 
        const currentExp = user.exp || 0;
        const level = user.level || 1;

        const imagePath = await updateRankApi(userId, user.name || "Người dùng", currentExp, level, rank);

        if (imagePath) {
            api.sendMessage({
                body: `⏫ | Đây là xếp hạng của bạn:`,
                attachment: fs.createReadStream(imagePath)
            }, event.threadID);

            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Lỗi khi xóa tệp hình ảnh:', err);
                } else {
                    console.log('Tệp hình ảnh đã được xóa thành công:', imagePath);
                }
            });
        } else {
            api.sendMessage("Lỗi khi tạo hình ảnh xếp hạng.", event.threadID);
        }
    }
};

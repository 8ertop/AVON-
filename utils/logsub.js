const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');

async function drawAvatarAndMemberNumber(api, userID, memberNumber, threadName) {
    const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    
    const canvasWidth = 800;
    const canvasHeight = 600;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    try {
        const bgUrl = 'https://imgur.com/9qfjEMp.jpg';
        const bgResponse = await axios.get(bgUrl, { responseType: 'arraybuffer' });
        const bgBuffer = Buffer.from(bgResponse.data);
        const bgImage = await loadImage(bgBuffer);

        ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);

        const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        const avatarBuffer = Buffer.from(avatarResponse.data);
        const avatarImage = await loadImage(avatarBuffer);

        const avatarSize = 150;
        const avatarX = (canvasWidth - avatarSize) / 2;
        const avatarY = (canvasHeight - avatarSize) / 3;

        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);

        ctx.font = '30px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Thành viên số ${memberNumber}`, canvasWidth / 2 - 120, avatarY + avatarSize + 40);

        const outputImagePath = path.join(__dirname, 'cache', 'new_member_card.jpg');
        const buffer = canvas.toBuffer('image/jpeg');
        fs.writeFileSync(outputImagePath, buffer);

        return outputImagePath;

    } catch (error) {
        console.error('Lỗi khi tải avatar hoặc nền:', error);
        return null;
    }
}

const handleLogSubscribe = async (api, event, adminConfig) => {
    try {
        
        if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
            await api.changeNickname(
                `${adminConfig.botName} • [ ${adminConfig.prefix} ]`,
                event.threadID,
                api.getCurrentUserID()
            );
            return api.shareContact(
                `✅ 𝗕𝗼𝘁 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱\n━━━━━━━━━━━━━━━━━━\n${adminConfig.botName} Bot đã kết nối thành công!\nGõ "${adminConfig.prefix}help all" để xem toàn bộ lệnh.\n\nLiên hệ: ${adminConfig.ownerName}`,
                api.getCurrentUserID(),
                event.threadID
            );
        }

        const { threadID } = event;
        const threadInfo = await api.getThreadInfo(threadID);

        let threadName = threadInfo.threadName || "Unnamed group";
        let { participantIDs } = threadInfo;
        let addedParticipants = event.logMessageData.addedParticipants;

        const botJoinGifUrl = 'https://64.media.tumblr.com/73e541e05ee8ce97fc63c7ec808fa09a/7de43115bd5186f6-2b/s400x600/c224b8136296a7e4e068adf1a6feba5fd04d3a11.gif'; 

        await api.sendMessage(
            {
                body: `✅ 𝗕𝗼𝘁 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱\n━━━━━━━━━━━━━━━━━━\n${adminConfig.botName} Bot đã kết nối thành công!\nGõ "${adminConfig.prefix}help all" để xem toàn bộ lệnh.\n\nLiên hệ: ${adminConfig.ownerName}`,
                attachment: { url: botJoinGifUrl, type: 'gif' }
            },
            threadID
        );

        for (let newParticipant of addedParticipants) {
            let userID = newParticipant.userFbId;

            if (userID === api.getCurrentUserID()) continue;

            let userInfo = await api.getUserInfo(userID);
            let userName = userInfo[userID]?.name?.replace("@", "") || "User";

            const memberNumber = participantIDs.length;
            const imagePath = await drawAvatarAndMemberNumber(api, userID, memberNumber, threadName);

            if (imagePath) {
                await api.sendMessage(
                    {
                        body: `🎉 Xin chào ${userName}!\nChào mừng bạn đến với nhóm "${threadName}"!\nBạn là thành viên thứ ${memberNumber} của nhóm này.\n\nChúc bạn vui vẻ khi tham gia nhóm nha! 😊`,
                        attachment: fs.createReadStream(imagePath)
                    },
                    threadID
                );
            }
        }
    } catch (error) {
        console.error("Lỗi trong handleLogSubscribe:", error);
        api.sendMessage("❌ Đã xảy ra lỗi trong quá trình xử lý thành viên mới.", event.threadID);
    }
};

module.exports = { handleLogSubscribe };

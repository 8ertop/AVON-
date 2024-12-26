const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "gai",
    version: "1.0.0",
    info: "xem ảnh gái xinh",
    onPrefix: true,
    dev: "HNT",
    cooldowns: 10,
    config: {
        apis: [
            "https://api.waifu.pics/sfw/neko",
            "https://api.waifu.im/search/?included_tags=waifu",
            "https://nekos.best/api/v2/neko",
            "https://api.waifu.pics/sfw/waifu"
        ]
    },
    
    onLaunch: async function ({ event, api }) {
        try {
            
            const randomApi = this.config.apis[Math.floor(Math.random() * this.config.apis.length)];
            const response = await axios.get(randomApi);
            
            let imageUrl;
            if (randomApi.includes('waifu.im')) {
                imageUrl = response.data.images[0].url;
            } else if (randomApi.includes('nekos.best')) {
                imageUrl = response.data.results[0].url;
            } else {
                imageUrl = response.data.url;
            }

            const tempFilePath = path.join(__dirname, 'cache', `gai-${Date.now()}.jpg`);
            
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(tempFilePath, imageResponse.data);

            api.sendMessage({
                body: "『 🌸 』→ Ảnh của bạn đây\n『 💓 』→ Chúc bạn ngày mới tốt lành",
                attachment: fs.createReadStream(tempFilePath)
            }, event.threadID, () => fs.unlinkSync(tempFilePath));

        } catch (error) {
            console.error(error);
            api.sendMessage("❌ Đã có lỗi xảy ra, vui lòng thử lại sau!", event.threadID);
        }
    }
};

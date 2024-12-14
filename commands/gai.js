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
    onLaunch: async function ({ event, api }) {
        try {
            const response = await axios.get('http://localhost:3000/getRandomImage');
            const imageUrl = response.data.imageUrl;

            const tempFilePath = path.join(__dirname, 'cache', 'image-gai.jpg');
            
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(tempFilePath, imageResponse.data);

            api.sendMessage({
                body: "Gái của bạn đây :))",
                attachment: fs.createReadStream(tempFilePath) 
            }, event.threadID, () => {
                
                fs.unlinkSync(tempFilePath); 
            });
        } catch (error) {
            console.log(error);
            api.sendMessage("Đã có lỗi xảy ra khi lấy ảnh!", event.threadID);
        }
    }
};

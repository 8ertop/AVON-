module.exports = {
    name: "douyin",
    info: "Tải video từ Douyin",
    dev: "HNT",
    onPrefix: true, 
    dmUser: false,  
    nickName: ["douyin", "tiktok", "downvideo"],  
    usages: "[]", 
    cooldowns: 3,  

    onLaunch: async function ({ api, event, actions }) {
        const axios = require("axios");
        const downloader = require("image-downloader");
        const fse = require("fs-extra");

        const regEx_tiktok = /(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//;

        const urls = Array.isArray(event.target) ? event.target : [event.target];

        for (const url of urls) {
            if (regEx_tiktok.test(url)) {
                try {
                    const response = await axios.post("https://www.tikwm.com/api/", { url });
                    const videoData = response.data.data;

                    await actions.send({
                        body: `🌸 𝗧𝗶𝗧𝗹𝗲: ${videoData.title}\n📥 Video tải về thành công!`,
                        attachment: await streamURL(videoData.play, "mp4")
                    });
                } catch (error) {
                    console.error(error);
                    actions.reply("❌ Lỗi tải video! Vui lòng thử lại sau.");
                }
            }
        }

        async function streamURL(url, mime) {
            const dest = `${__dirname}/cache/${Date.now()}.${mime}`;
            await downloader.image({ url, dest });
            setTimeout(() => fse.unlinkSync(dest), 60 * 1000); 
            return fse.createReadStream(dest);
        }
    },
};

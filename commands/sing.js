const fs = require('fs-extra');
const ytdl = require('@distube/ytdl-core');
const Youtube = require('youtube-search-api');
const axios = require('axios');
const path = require('path');

const convertHMS = (value) => new Date(value * 1000).toISOString().slice(11, 19);
const ITAG = 140;

const downloadMusicFromYoutube = async (link, filePath, itag = ITAG) => {
    try {
        const data = await ytdl.getInfo(link);
        const result = {
            title: data.videoDetails.title,
            dur: Number(data.videoDetails.lengthSeconds),
            timestart: Date.now(),
        };

        return new Promise((resolve, reject) => {
            ytdl(link, { filter: format => format.itag === itag })
                .pipe(fs.createWriteStream(filePath))
                .on('finish', () => {
                    resolve({
                        data: filePath,
                        info: result,
                    });
                })
                .on('error', reject);
        });
    } catch (error) {
        console.error('Lỗi khi tải nhạc:', error);
        throw error;
    }
};

module.exports = {
    name: "sing",
    info: "Tìm kiếm và tải nhạc từ YouTube",
    dev: "HNT",
    onPrefix: true,
    dmUser: false,
    nickName: ["music", "download"],
    usages: "<từ khóa> hoặc <link YouTube>",
    cooldowns: 10,

    onLaunch: async function({ api, event, target = [] }) {
        const { threadID, messageID, senderID } = event;

        if (target.length < 1) {
            return api.sendMessage("❯ Vui lòng nhập từ khóa tìm kiếm hoặc liên kết YouTube!", threadID, messageID);
        }

        const keywordSearch = target.join(" "); 
        const filePath = path.resolve(__dirname, 'cache', `sing-${senderID}.mp3`);

        if (target[0]?.startsWith("https://")) {
            const findingMessage = await api.sendMessage(`🔍 | Đang tìm kiếm video từ link YouTube...`, threadID, messageID);

            try {
                const { data, info } = await downloadMusicFromYoutube(target[0], filePath);
                const body = `🎵 Tiêu đề: ${info.title}\n⏱️ Thời lượng: ${convertHMS(info.dur)}\n⏱️ Thời gian xử lý: ${Math.floor((Date.now() - info.timestart) / 1000)} giây`;

                if (fs.statSync(data).size > 26214400) {
                    return api.sendMessage("⚠️ Không thể gửi tệp vì kích thước lớn hơn 25MB.", threadID, messageID);
                }

                await api.editMessage(`⏱️ | Đã tìm thấy bài hát: "${info.title}". Đang tải xuống...`, findingMessage.messageID, threadID);
                
                return api.sendMessage({ body, attachment: fs.createReadStream(data) }, threadID, () => fs.unlinkSync(data), messageID);
            } catch (e) {
                console.error("Lỗi khi tải nhạc từ link:", e);
                return api.sendMessage("⚠️ Đã xảy ra lỗi khi tải nhạc từ link.", threadID, messageID);
            }
        } else {
            const findingMessage = await api.sendMessage(`🔍 | Đang tìm kiếm bài hát "${keywordSearch}". Vui lòng chờ...`, threadID, messageID);

            try {
                const results = await Youtube.GetListByKeyword(keywordSearch, false, 6);
                const data = results?.items || [];
                const links = data.map(item => item?.id);
                const thumbnails = [];

                for (let i = 0; i < data.length; i++) {
                    const thumbnailUrl = `https://i.ytimg.com/vi/${data[i]?.id}/hqdefault.jpg`;
                    const thumbnailPath = path.resolve(__dirname, 'cache', `thumbnail-${senderID}-${i + 1}.jpg`);
                    const response = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
                    fs.writeFileSync(thumbnailPath, Buffer.from(response.data, 'binary'));
                    thumbnails.push(fs.createReadStream(thumbnailPath));
                }

                const randomIndex = Math.floor(Math.random() * data.length);
                const selectedLink = links[randomIndex];
                const selectedTitle = data[randomIndex].title;
                const selectedDuration = data[randomIndex].length.simpleText;

                const body = `🎵 Tiêu đề: ${selectedTitle}\n⏱️ Thời lượng: ${selectedDuration}`;

                await api.editMessage(`⏱️ | Đã tìm thấy bài hát: "${selectedTitle}". Đang tải xuống...`, findingMessage.messageID, threadID);

                try {
                    const { data: downloadData, info } = await downloadMusicFromYoutube(`https://www.youtube.com/watch?v=${selectedLink}`, filePath);
                    if (fs.statSync(downloadData).size > 26214400) {
                        return api.sendMessage("⚠️ Không thể gửi tệp vì kích thước lớn hơn 25MB.", threadID, messageID);
                    }

                    return api.sendMessage({ body, attachment: fs.createReadStream(downloadData) }, threadID, () => fs.unlinkSync(downloadData), messageID);
                } catch (e) {
                    console.error("Lỗi khi tải nhạc từ video:", e);
                    return api.sendMessage("⚠️ Đã xảy ra lỗi khi tải nhạc từ video.", threadID, messageID);
                }

            } catch (error) {
                console.error("Lỗi khi tìm kiếm video:", error);
                return api.sendMessage("⚠️ Đã xảy ra lỗi khi tìm kiếm video.", threadID, messageID);
            }
        }
    }
};

const fs = require('fs');
const path = require('path');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const { execSync } = require('child_process');

module.exports = {
    name: "video",
    version: "1.0.0",
    info: "Tải video từ Youtube",
    onPrefix: true,
    dev: "HNT",
    cooldowns: 10,

    onLaunch: async function ({ api, event, target }) {
        if (!target[0]) {
            return api.sendMessage(`❌ Vui lòng nhập tên video!`, event.threadID);
        }

        try {
            const videoQuery = target.join(" ");
            const findingMessage = await api.sendMessage(`🔍 | Đang tìm "${videoQuery}". Vui lòng chờ...`, event.threadID);

            const searchResults = await yts(videoQuery);
            const video = searchResults.videos[0];

            if (!video) {
                return api.editMessage(`❌ | Không tìm thấy video: "${videoQuery}"`, findingMessage.messageID, event.threadID);
            }

            await api.editMessage(`⏳ | Đang tải xuống: "${video.title}"...`, findingMessage.messageID, event.threadID);

            const videoPath = path.resolve(__dirname, 'cache', `video_${Date.now()}.mp4`);
            const audioPath = path.resolve(__dirname, 'cache', `audio_${Date.now()}.mp3`);
            const outputPath = path.resolve(__dirname, 'cache', `final_${Date.now()}.mp4`);

            try {
                await Promise.all([
                    new Promise((resolve, reject) => {
                        ytdl(video.url, {
                            quality: 'highestvideo',
                            filter: 'videoonly'
                        })
                        .pipe(fs.createWriteStream(videoPath))
                        .on('finish', resolve)
                        .on('error', reject);
                    }),
                    new Promise((resolve, reject) => {
                        ytdl(video.url, {
                            quality: 'highestaudio',
                            filter: 'audioonly'
                        })
                        .pipe(fs.createWriteStream(audioPath))
                        .on('finish', resolve)
                        .on('error', reject);
                    })
                ]);

                await new Promise((resolve, reject) => {
                    ffmpeg()
                        .input(videoPath)
                        .input(audioPath)
                        .outputOptions(['-c:v copy', '-c:a aac'])
                        .save(outputPath)
                        .on('end', resolve)
                        .on('error', reject);
                });

                const stats = fs.statSync(outputPath);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB > 25) {
                    await api.editMessage(`❌ | Video quá lớn (${fileSizeInMB.toFixed(2)}MB). Giới hạn là 25MB.`, findingMessage.messageID, event.threadID);
                } else {
                    await api.sendMessage({
                        body: `🎥 Video: ${video.title}\n⏱️ Thời lượng: ${video.duration.timestamp}\n👍 Lượt thích: ${video.likes}\n👁️ Lượt xem: ${video.views}`,
                        attachment: fs.createReadStream(outputPath)
                    }, event.threadID, () => {
                        api.unsendMessage(findingMessage.messageID);
                    });
                }
            } catch (error) {
                console.error('Lỗi tải video:', error);
                await api.editMessage(`❌ | Lỗi khi xử lý video: ${error.message}`, findingMessage.messageID, event.threadID);
            } finally {
            
                [videoPath, audioPath, outputPath].forEach(file => {
                    if (fs.existsSync(file)) fs.unlinkSync(file);
                });
            }
        } catch (error) {
            console.error('Lỗi chung:', error);
            await api.sendMessage(`❌ | Lỗi: ${error.message}`, event.threadID);
        }
    }
};

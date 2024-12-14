const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Thư mục lưu ảnh/video tải về
const cacheDir = path.join(__dirname, 'cache', 'images', 'instagram');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

// Hàm kiểm tra URL hợp lệ
const is_url = (url) => /^http(s)?:\/\//.test(url);

// Hàm tải file từ URL
const downloadFile = async (url, type) => {
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        const filePath = path.join(cacheDir, `${Date.now()}.${type}`);
        fs.writeFileSync(filePath, res.data);
        return filePath;
    } catch (error) {
        console.error("Lỗi khi tải tệp từ URL:", error);
        throw new Error("Không thể tải tệp từ URL");
    }
};

// Hàm xử lý tải ảnh và video Instagram
const processInstagramUrl = async (url, api, threadID, messageID) => {
    if (!is_url(url)) {
        return api.sendMessage("❌ Vui lòng cung cấp URL hợp lệ. 🌐", threadID, messageID);
    }

    // Kiểm tra nếu URL là của Instagram
    if (/instagram\.com/.test(url)) {
        try {
            // Sử dụng một dịch vụ API để tải ảnh/video (ví dụ: insta-downloader)
            const res = await axios.get(`https://api.instagramdownloader.io/api/v1/download?url=${url}`);

            if (res.data.status !== 'success') {
                return api.sendMessage("⚠️ Không thể tải nội dung từ URL này. 😢", threadID, messageID);
            }

            const media = res.data.media;
            let attachments = [];
            let filePaths = [];

            // Nếu có ảnh
            if (media.images && media.images.length > 0) {
                for (let imageUrl of media.images) {
                    const imagePath = await downloadFile(imageUrl, 'jpg');
                    attachments.push(fs.createReadStream(imagePath));
                    filePaths.push(imagePath);
                }
            }

            // Nếu có video
            if (media.video) {
                const videoPath = await downloadFile(media.video, 'mp4');
                attachments.push(fs.createReadStream(videoPath));
                filePaths.push(videoPath);
            }

            // Gửi tin nhắn với các tệp đính kèm
            await api.sendMessage({
                body: `==[ Instagram Downloader ]==\n\n📷 -Ảnh/Video Instagram đã được tải thành công!`,
                attachment: attachments
            }, threadID, messageID);

            // Xóa các tệp tải về
            cleanupFiles(filePaths);
        } catch (error) {
            console.error("Lỗi trong quá trình xử lý:", error);
            return api.sendMessage("❌ Đã xảy ra lỗi khi xử lý yêu cầu của bạn. 😥", threadID, messageID);
        }
    } else {
        return api.sendMessage("⚠️ Vui lòng cung cấp URL Instagram hợp lệ. 📲", threadID, messageID);
    }
};

// Hàm dọn dẹp các tệp đã tải về
const cleanupFiles = (filePaths) => {
    setTimeout(() => {
        filePaths.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Đã xóa tệp: ${filePath}`);
            }
        });
    }, 1000 * 60); // Xóa sau 1 phút
};

// Lệnh khi người dùng gọi
module.exports = {
    name: 'ig',
    info: '🎥 Tải ảnh và video từ Instagram 🌟',
    onLaunch: async function({ api, event, actions }) {
        const { threadID, messageID, body } = event;
        const url = body.trim().split(' ')[1];

        if (!url) {
            return actions.reply("❌ Vui lòng cung cấp URL hợp lệ. 🌐");
        }

        await processInstagramUrl(url, api, threadID, messageID);
    },
};

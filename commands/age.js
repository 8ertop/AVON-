const fs = require('fs');
const path = require('path');
const { Canvas, Image, ImageData, loadImage } = require('canvas');
const faceapi = require('face-api.js');
const axios = require('axios');

const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

module.exports = {
  name: "age",
  dev: "HNT",
  info: "Đoán tuổi và cảm xúc của người trong ảnh, đánh giá độ đẹp trai or đẹp gái.",
  usages: "[reply ảnh]",
  onPrefix: true,
  cooldowns: 5,

  onLaunch: async function({ api, event }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("Vui lòng reply một ảnh để bot đoán tuổi.", threadID, messageID);
    }

    const attachment = messageReply.attachments[0];
    if (attachment.type === 'video' || attachment.type === 'animated_image') {
      return api.sendMessage("Bot không hỗ trợ phân tích video hoặc GIF. Vui lòng gửi ảnh.", threadID, messageID);
    }

    try {
      const waitMessage = await api.sendMessage("Đợi xíu để bot kiểm tra ảnh... 🤔", threadID);

      await faceapi.nets.ssdMobilenetv1.loadFromDisk('./commands/cache/models');
      await faceapi.nets.faceLandmark68Net.loadFromDisk('./commands/cache/models');
      await faceapi.nets.faceRecognitionNet.loadFromDisk('./commands/cache/models');
      await faceapi.nets.ageGenderNet.loadFromDisk('./commands/cache/models');
      await faceapi.nets.faceExpressionNet.loadFromDisk('./commands/cache/models'); // Mô hình cảm xúc

      const imageUrl = attachment.url;
      const imageFileName = `image_${Date.now()}.jpg`;
      const imagePath = path.join(cacheDir, imageFileName);

      const response = await axios({
        url: imageUrl,
        responseType: 'stream',
      });

      await new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(imagePath))
          .on('finish', resolve)
          .on('error', reject);
      });

      const imgBuffer = fs.readFileSync(imagePath);
      const image = await loadImage(imgBuffer);

      const detections = await faceapi.detectAllFaces(image).withAgeAndGender().withFaceExpressions(); // Thêm cảm xúc

      if (detections.length === 0) {
        fs.unlinkSync(imagePath);
        return api.sendMessage("Bot không phát hiện khuôn mặt nào trong ảnh. Vui lòng gửi ảnh khác.", threadID, messageID);
      }

      const averageAge = detections.map(d => d.age).reduce((a, b) => a + b, 0) / detections.length;
      const roundedAge = Math.round(averageAge);
      const gender = detections[0].gender;
      const beautyPrefix = gender === 'male' ? "Anh chàng này" : "Cô gái này"; 
      
      const genderMessage = gender === 'male' ? "nam" : "nữ"; 
      
      const beautyRating = Math.random(); 
      
      let beautyMessage = '';
      if (beautyRating > 0.8) {
        beautyMessage = `${beautyPrefix} rất phong độ! 😍`;
      } else if (beautyRating > 0.6) {
        beautyMessage = `${beautyPrefix} khá thu hút! 😁`;
      } else if (beautyRating > 0.4) {
        beautyMessage = `${beautyPrefix} dễ thương! 😊`;
      } else {
        beautyMessage = `${beautyPrefix} vẫn rất dễ mến! 😜`;
      }

      const emotions = detections[0].expressions;
      const maxEmotion = Object.keys(emotions).reduce((max, emotion) => emotions[emotion] > emotions[max] ? emotion : max, 'neutral');

      let emotionMessage = '';
      switch(maxEmotion) {
        case 'happy':
          emotionMessage = "Người này có vẻ rất vui vẻ! 😊";
          break;
        case 'sad':
          emotionMessage = "Người này trông hơi buồn... 😔";
          break;
        case 'angry':
          emotionMessage = "Người này có vẻ hơi tức giận... 😡";
          break;
        case 'surprised':
          emotionMessage = "Người này đang ngạc nhiên! 😲";
          break;
        default:
          emotionMessage = "Trông người này khá điềm tĩnh và trung lập. 😌";
      }

      api.sendMessage(
        `Bot đã phát hiện ${detections.length} khuôn mặt trong ảnh. Hmm... người này trông khoảng ${roundedAge} tuổi, và có vẻ là ${genderMessage}. 🤔\n${beautyMessage}\n${emotionMessage}`,
        threadID,
        () => {
          setTimeout(() => {
            api.unsendMessage(waitMessage.messageID);
          }, 3000);
          fs.unlinkSync(imagePath);
        },
        messageID
      );      
    } catch (error) {
      console.error("Lỗi khi phân tích khuôn mặt:", error);
      api.sendMessage("Đã xảy ra lỗi khi phân tích ảnh. Vui lòng thử lại sau.", threadID, messageID);
    }
  }
};

const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');
const QrCode = require('qrcode-reader'); 
const imageDownloader = require('image-downloader');
const jimp = require('jimp'); 
const qrcode = require('qrcode');

function getRandomColor() {
  let color;
  do {
    color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  } while (isTooBright(color) || color === '#ffffff');
  return color;
}

function isTooBright(hex) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
}

module.exports = {
  name: "qr",
  dev: "Hoàng Ngọc Từ",
  inffo: "Tạo và đọc mã QR",
  onPrefix: true,
  usages: ".qrcode [dữ liệu] | reply ảnh chứa mã QR để quét",
  cooldowns: 0,

  onLaunch: async function ({ api, event, target }) { 
    const { threadID, messageID, type, messageReply, senderID } = event;

    if (target.length > 0) {
      const data = target.join(" ");
      if (!data) {
        return api.sendMessage("» Vui lòng cung cấp dữ liệu để tạo mã QR!", threadID, messageID);
      }

      try {
        const qrCodeBuffer = await qrcode.toBuffer(data, {
          width: 1024,
          color: {
            dark: getRandomColor(),
            light: '#FFFFFF'
          }
        });

        const canvasWidth = 800;
        const canvasHeight = 800;
        const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const qrImage = await Canvas.loadImage(qrCodeBuffer);
        const qrSize = Math.min(canvasWidth, canvasHeight) - 60;
        ctx.drawImage(qrImage, 30, 30, qrSize, qrSize);

        ctx.font = '30px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const copyrightText = 'by HNT';
        const textX = canvasWidth / 2;
        const textY = canvasHeight - 30;
        ctx.fillText(copyrightText, textX, textY);

        const canvasPath = path.join(__dirname, 'cache', 'qrcode_canvas.png');
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(canvasPath, buffer);

        api.sendMessage({
          attachment: fs.createReadStream(canvasPath)
        }, threadID, () => {
          fs.unlinkSync(canvasPath); 
        }, messageID);

      } catch (error) {
        console.error("Error while creating QR code:", error);
        return api.sendMessage("» Đã xảy ra lỗi khi tạo mã QR!", threadID, messageID);
      }
    } else if (type === "message_reply" && messageReply.attachments && messageReply.attachments.length > 0) {
      if (messageReply.attachments[0].type !== 'photo') {
        return api.sendMessage("» Bạn chỉ có thể quét mã QR từ ảnh!", threadID, messageID);
      }
      
      try {
        const imageUrl = messageReply.attachments[0].url;
        const imagePath = path.join(__dirname, "cache", "qrcode.png");
      
        await imageDownloader.image({ url: imageUrl, dest: imagePath });
      
        jimp.read(imagePath)
          .then(image => {
            const qrReader = new QrCode();
            qrReader.callback = (err, value) => {
              if (err) {
                console.error("Error decoding QR code:", err);
                api.sendMessage("» Đã xảy ra lỗi khi quét mã QR!", threadID, messageID);
                fs.unlinkSync(imagePath); 
                return;
              }
      
              const qrResults = Array.isArray(value) ? value.map(v => v.result) : [value.result];
              if (qrResults.length > 0) {
                api.getUserInfo(senderID).then(userData => {
                  const userName = userData[senderID].name;
                  const formattedResults = qrResults.map((result, index) => `${result}`).join('\n');
                  api.sendMessage(`» đây là kết quả quét mã QR:\n${formattedResults}`, threadID, messageID);
                  fs.unlinkSync(imagePath); 
                });
              } else {
                api.sendMessage("» Không tìm thấy mã QR trong ảnh!", threadID, messageID);
                fs.unlinkSync(imagePath); 
              }
            };
            qrReader.decode(image.bitmap);
          })
          .catch(error => {
            console.error("Error while loading image with Jimp:", error);
            api.sendMessage("» Đã xảy ra lỗi khi tải hình ảnh để quét mã QR!", threadID, messageID);
            fs.unlinkSync(imagePath); 
          });
      
      } catch (error) {
        console.error("Error while scanning QR code:", error);
        return api.sendMessage("» Đã xảy ra lỗi khi quét mã QR!", threadID, messageID);
      }      
  }
}
};

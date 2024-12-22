const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jsQR = require("jsqr");
const { createCanvas, loadImage } = require("canvas");

const apiKeysPath = path.join(__dirname, 'json', 'key.json');

let API_KEYS = [];
const loadAPIKeys = async () => {
  try {
    const data = await fs.readJson(apiKeysPath);
    API_KEYS = data.api_keys;
  } catch (error) {
    console.error("Lỗi khi đọc API keys:", error);
  }
};

loadAPIKeys();

const Model_Name = "gemini-1.5-flash";

const generationConfig = {
  temperature: 1,
  topK: 0,
  topP: 0.95,
  maxOutputTokens: 8192,
};

const systemInstruction = `
bạn là AI trợ lý ảo có tên là AKI AI do Hoàng Ngọc Từ tạo ra vào ngày 6/7/2022 và là AI mạnh mẽ, trả lời logic và hiểu`;

const conversationHistory = {};
const jsonFilePath = path.resolve(__dirname, 'json', 'gemini.json');

const readDataFromFile = async () => {
  try {
    if (await fs.pathExists(jsonFilePath)) {
      const data = await fs.readJson(jsonFilePath);
      Object.assign(conversationHistory, data);
    }
  } catch (error) {
    console.error("Lỗi khi đọc tệp JSON:", error);
  }
};

const saveDataToFile = async () => {
  try {
    await fs.writeJson(jsonFilePath, conversationHistory, { spaces: 2 });
  } catch (error) {
    console.error("Lỗi khi ghi tệp JSON:", error);
  }
};

readDataFromFile();

const generateContentWithAPI = async (apiKey, fullPrompt, imageParts) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: Model_Name, generationConfig, systemInstruction });

    const result = await model.generateContent([{ text: fullPrompt }, ...imageParts]);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Lỗi khi sử dụng API:", error);
    throw error;
  }
};

const decodeQRCode = async (imagePath) => {
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

  return qrCode ? qrCode.data : null;
};

module.exports = {
  name: "ai",
  info: "Tạo văn bản và phân tích hình ảnh, quét mã QR",
  dev: "HNT",
  onPrefix: true,
  dmUser: false,
  nickName: ["ai"],
  usages: "ai [prompt]",
  cooldowns: 10,

  onLaunch: async function ({ event, target, actions }) {
    const { senderID, messageReply } = event;
    const prompt = target.join(" ").trim();

    if (!prompt) {
      return await actions.reply("❎ Vui lòng nhập một prompt.");
    }

    try {
      if (!Array.isArray(conversationHistory[senderID])) {
        conversationHistory[senderID] = [];
      }

      conversationHistory[senderID].push(`User: ${prompt}`);

      const context = conversationHistory[senderID].join("\n");
      const fullPrompt = `${context}\nTrả lời bằng tiếng Việt:`;

      let imageParts = [];

      if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
        const attachments = messageReply.attachments.filter(att => att.type === 'photo');

        for (const attachment of attachments) {
          const fileUrl = attachment.url;
          const tempFilePath = path.join(__dirname, 'cache', `temp_image_${Date.now()}.jpg`);

          const response = await axios({
            url: fileUrl,
            responseType: 'stream'
          });

          const writer = fs.createWriteStream(tempFilePath);
          response.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          const qrCodeData = await decodeQRCode(tempFilePath);

          if (qrCodeData) {
            fs.unlinkSync(tempFilePath);
            return await actions.reply(`📦 Nội dung mã QR: ${qrCodeData}`);
          }

          const fileData = fs.readFileSync(tempFilePath);
          const base64Image = Buffer.from(fileData).toString('base64');

          imageParts.push({
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg'
            }
          });

          fs.unlinkSync(tempFilePath);
        }
      }

      let responseText = '';
      for (const apiKey of API_KEYS) {
        try {
          responseText = await generateContentWithAPI(apiKey, fullPrompt, imageParts);
          break;
        } catch (error) {
          console.error(`API Key ${apiKey} gặp lỗi. Thử API Key khác...`);
        }
      }

      if (!responseText) {
        throw new Error("Tất cả các API đều gặp lỗi.");
      }

      conversationHistory[senderID].push(`Bot: ${responseText}`);

      await saveDataToFile();

      return await actions.reply(responseText);

    } catch (error) {
      console.error("Lỗi khi tạo nội dung:", error);
      return await actions.reply("⚠️ GPU quá tải, vui lòng thử lại sau.");
    }
  }
};

module.exports = {
    name: "idst", 
    info: "Lấy ID sticker khi trả lời một tin nhắn chứa sticker", 
    dev: "HNT", 
    usedby: 2,
    onPrefix: true, 
    dmUser: true,
    usages: "Trả lời sticker để lấy ID, hoặc cung cấp ID sticker để bot gửi sticker đó",
    cooldowns: 0,
    onLaunch: async function ({ api, event, args }) {
        if (event.type == "message_reply") {
            if (event.messageReply.attachments && event.messageReply.attachments[0].type == "sticker") {
               
                return api.sendMessage({
                    body: `ID: ${event.messageReply.attachments[0].stickerID}\nMô tả: ${event.messageReply.attachments[0].description}`
                }, event.threadID);
            } else {
                return api.sendMessage("Chỉ trả lời sticker nhé.", event.threadID);
            }
        } else if (args[0]) {
            
            const stickerID = args[0];
            return api.sendMessage({
                body: "Đây là sticker bạn yêu cầu:",
                sticker: stickerID
            }, event.threadID);
        } else {
       
            return api.sendMessage("Vui lòng trả lời một sticker để lấy ID.", event.threadID);
        }
    }
};

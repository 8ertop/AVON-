const { updateBalance, getBalance, saveData } = require('../utils/currencies');

module.exports = {
    name: "pay",
    dev: "HNT", 
    info: "Chuyển tiền cho người khác với thuế 1%.",
    onPrefix: true,
    usages: ".pay <số tiền>: Chuyển tiền cho người dùng được reply.",
    cooldowns: 0,

    onLaunch: async function({ api, event, target = [] }) {
        const { threadID, messageID, senderID } = event;

        if (target.length < 1) {
            return api.sendMessage("Vui lòng nhập đúng cú pháp: .pay <số tiền> (và reply cho người nhận)", threadID, messageID);
        }

        let recipientID;
        if (event.type === 'message_reply') {
            recipientID = event.messageReply.senderID;
        } else {
            return api.sendMessage("Bạn cần reply tin nhắn của người nhận.", threadID, messageID);
        }

        const transferAmount = parseInt(target[0], 10);

        if (isNaN(transferAmount) || transferAmount <= 0) {
            return api.sendMessage("Số tiền phải là một số nguyên dương.", threadID, messageID);
        }

        const senderBalance = getBalance(senderID);

        const tax = Math.ceil(transferAmount * 0.01); 
        const totalAmount = transferAmount + tax; 
        if (totalAmount > senderBalance) {
            return api.sendMessage("Bạn không đủ số dư để thực hiện giao dịch này!", threadID, messageID);
        }

        updateBalance(senderID, -totalAmount); 
        updateBalance(recipientID, transferAmount); 

        const senderNewBalance = getBalance(senderID);

        const message = `✅ Chuyển thành công ${transferAmount} Gems\n(Thuế: ${tax} Gems).\n` +
        `💰 Đã trừ: ${totalAmount} Gems.\nSố dư: ${senderNewBalance} Gems.`;
saveData();


        return api.sendMessage(message, threadID, messageID);
    }
};

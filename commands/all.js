module.exports = {
    name: "all",
    dev: "Hoàng Ngọc Từ",
    info: "tag toàn bộ thành viên",
    onPrefix: true,
    usages: "Tag mọi người bằng cách gõ .all <văn bản>",
    cooldowns: 60, 

    onLaunch: async function({ api, event, target }) {
        try {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const botID = api.getCurrentUserID();
            const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
            
            const customMessages = [
                "🎉 Hey mọi người ơi! Có người cần gặp nè",
                "📢 Thông báo quan trọng mọi người ơi",
                "🌟 Tập trung tập trung! Có việc cần bàn",
                "💫 Xin mời mọi người vào xem thông báo",
                "🔥 Có ai online không? Vào tương tác nào",
                "🎯 Ping! Có ai ở đây không?",
                "🌈 Mọi người ơi, vào group tương tác đi"
            ];

            const body = target.length > 0 
                ? `${target.join(" ")}` 
                : customMessages[Math.floor(Math.random() * customMessages.length)];

            let mentions = []; 

            const timeNow = new Date().toLocaleTimeString();
            const fullMessage = `${body}\n\n━━━━━━━━━━━━━━━━━━\n⏰ Thời gian: ${timeNow}\n❗ Tin nhắn sẽ tự động gỡ sau 5 phút`;

            const message = await api.sendMessage(
                { body: fullMessage, mentions },  
                event.threadID, 
                event.messageID
            );
            
            setTimeout(async () => {
                try {
                    await api.unsendMessage(message.messageID);
                } catch {
                    console.log("Cannot unsend message - might be already deleted");
                }
            }, 300000);

        } catch (e) {
            console.error("Error in .all command:", e);
            return api.sendMessage("❌ Đã xảy ra lỗi: " + e.message, event.threadID);
        }
    }
};

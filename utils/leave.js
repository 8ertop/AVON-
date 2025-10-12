const fs = require('fs');

const handleLogUnsubscribe = async (api, event) => {
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

    try {
        let threadInfo;
        try {
            threadInfo = await api.getThreadInfo(event.threadID);
        } catch (error) {
            console.error("Error getting thread info:", error);
            threadInfo = { participantIDs: [], threadName: "Unnamed group" };
        }

        const { threadName, participantIDs, adminIDs } = threadInfo;
        const isSelfLeave = event.author == event.logMessageData.leftParticipantFbId;
        const leftUserId = event.logMessageData.leftParticipantFbId;
       
        const userName = event.logMessageData.leftParticipantFbId_name || "Thành viên";
        const adminName = event.logMessageData.author_name || "Quản trị viên";

        const actionType = isSelfLeave 
            ? "đã tự rời khỏi nhóm"
            : `đã bị đá bởi ${adminName}`;

        try {
            const threadsDBPath = './database/threads.json';
            let threadsDB = {};
            if (fs.existsSync(threadsDBPath)) {
                threadsDB = JSON.parse(fs.readFileSync(threadsDBPath, 'utf8') || '{}');
            }

            if (threadsDB[event.threadID]) {
                threadsDB[event.threadID].members = participantIDs;
                threadsDB[event.threadID].memberCount = participantIDs.length;
                threadsDB[event.threadID].admins = adminIDs || [];
                threadsDB[event.threadID].name = threadName;
                threadsDB[event.threadID].lastInfoUpdate = Date.now();
                fs.writeFileSync(threadsDBPath, JSON.stringify(threadsDB, null, 2));
            }
        } catch (error) {
            console.error("Error updating threads.json:", error);
        }

        await api.sendMessage(
            `🚪 ${userName} ${actionType}.\n👥 Thành viên còn lại: ${participantIDs.length}`,
            event.threadID
        );

        if (participantIDs.length < 5) {
            try {
                await api.sendMessage(
                    `⚠️ Cảnh báo: Nhóm hiện chỉ còn ${participantIDs.length} thành viên!`,
                    event.threadID
                );
            } catch (error) {
                console.error("Error sending warning message:", error);
            }
        }

    } catch (err) {
        console.error("ERROR trong handleLogUnsubscribe:", err);
        try {
            await api.sendMessage(
                "❌ Đã xảy ra lỗi khi xử lý sự kiện rời nhóm.",
                event.threadID
            );
        } catch (error) {
            console.error("Failed to send error message:", error);
        }
    }
};

module.exports = { handleLogUnsubscribe };

const fs = require('fs');

let threadDataStorage = {};

try {
    threadDataStorage = JSON.parse(fs.readFileSync('./database/threads.json'));
} catch (err) {
    console.error("Lỗi khi đọc tệp dữ liệu nhóm:", err);
}

const saveThreadData = () => {
    fs.writeFileSync('./database/threads.json', JSON.stringify(threadDataStorage, null, 2));
};

module.exports = {
    name: "anti",
    dev: "HNT",
    usedBy: 3,
    info: "Bật/tắt chế độ chống out chùa trong nhóm",
    onPrefix: true,
    usages: ".anti: Bật hoặc tắt chế độ chống out cho nhóm. Chỉ admin nhóm mới có quyền sử dụng lệnh này.",
    cooldowns: 0,

    onLaunch: async function({ api, event, actions }) {
        const { threadID, messageID, senderID } = event;

        const threadInfo = await api.getThreadInfo(threadID);
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

        if (!adminIDs.includes(senderID)) {
            return actions.reply("Bạn không có quyền sử dụng lệnh này. Chỉ admin nhóm mới có thể thực hiện lệnh này.");
        }

        let threadData = threadDataStorage[threadID] || {};

        if (typeof threadData.antiout === "undefined") {
            threadData.antiout = {
                status: true,
                storage: []
            };
            threadDataStorage[threadID] = threadData;
            saveThreadData();
        }

        const status = threadData.antiout.status ? false : true;
        threadData.antiout.status = status;

        threadDataStorage[threadID] = threadData;
        saveThreadData();

        const msg = `» Đã ${status ? "bật" : "tắt"} chế độ chống out nhóm.`;
        return actions.reply(msg);
    }
};

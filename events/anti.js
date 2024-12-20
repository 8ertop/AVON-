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
  eventType: ["log:thread-name", "log:user-nickname", "log:unsubscribe"],
  pro: "DC-Nam",
  envConfig: {
    antinamebot: {
      status: true
    }
  },

  onEvents: async function ({ event, api }) {
      const { threadID, logMessageType, logMessageData, logMessageBody, author } = event;
      const botID = api.getCurrentUserID();
      
      let getDataThread = threadDataStorage[threadID] || { data: {} };
      const { data } = getDataThread;
      
      switch (logMessageType) {
          case "log:unsubscribe": {
              const outID = logMessageData.leftParticipantFbId;
              const outName = logMessageBody.replace("đã rời khỏi nhóm.", "");
              const { antiout } = data || {};
              
              if (antiout && author === outID && outID !== botID && (antiout.status === true || antiout.status === undefined)) {
                  try {
                      await api.addUserToGroup(outID, threadID);
                      return api.sendMessage(`[𝐀𝐧𝐭𝐢𝐨𝐮𝐭] » Đã add ${outName} vừa out chùa lại nhóm`, threadID);
                  } catch (err) {
                      return api.sendMessage(`[𝐀𝐧𝐭𝐢𝐨𝐮𝐭] » Không thể add người dùng vừa out chùa lại nhóm :(`, threadID);
                  }
              }
              break;
          }
      }
  }
};

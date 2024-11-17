module.exports = {
    name: "mt",
    usedby: 2,
    info: "Bảo trì bot",
    onPrefix: true,
    hide: true,
    dev: "Jonell Magallanes",
    cooldowns: 5,
  
    onLaunch: async function({ api, event, target }) {
      var fs = require("fs");
      var request = require("request");
      const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));
      const content = target.join(" ");
  
      api.getThreadList(30, null, ["INBOX"], (err, list) => {
        if (err) { 
          console.error("ERR: "+ err);
          return;
        }
  
        list.forEach(thread => {
          if(thread.isGroup == true && thread.threadID != event.threadID) {
            var link = "https://i.postimg.cc/NFdDc0vV/RFq-BU56n-ES.gif";  
            var callback = () => api.sendMessage({ 
              body: `𝗕𝗼𝘁 𝗠𝗮𝗶𝗻𝘁𝗲𝗻𝗮𝗻𝗰𝗲 𝗠𝗼𝗱𝗲\n━━━━━━━━━━━━━━━━━━\n${adminConfig.botName} 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖶𝖮𝗋𝗄𝗂𝗇𝗀 𝗉𝖺𝗍𝗂𝗇𝗑𝗂𝗂𝗇𝖴`,
              attachment: fs.createReadStream(__dirname + "/cache/maintenance.gif")
            }, 
            thread.threadID, 
            () => { 
              fs.unlinkSync(__dirname + "/cache/maintenance.gif");
              console.log(`Tin nhắn bảo trì đã gửi đến ${thread.threadID}. Bot sẽ tắt.`);
              process.exit(0); 
            });
  
            return request(encodeURI(link))
              .pipe(fs.createWriteStream(__dirname + "/cache/maintenance.gif"))
              .on("close", callback);
          }
        });
      });
  
      console.log("Bot hiện đang ở chế độ bảo trì.");
    }
  };
  
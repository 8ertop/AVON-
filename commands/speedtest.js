const { exec } = require('child_process');

module.exports = {
    name: "speedtest",
    dev: "HNT",
    info: "Kiểm tra tốc độ mạng của hệ thống Bot",
    onPrefix: false, 
    usages: ".speedtest",
    cooldowns: 10,

    onLaunch: async function ({ event, actions }) {
        const { threadID, messageID } = event;

        const sentMessage = await actions.reply("🔄 Đang kiểm tra tốc độ mạng, vui lòng chờ...");

        exec('speedtest-cli --simple', (error, stdout, stderr) => {
            if (error) {
                console.error(`Lỗi khi chạy lệnh speedtest-cli: ${error.message}`);
                return actions.edit("❌ Đã xảy ra lỗi khi kiểm tra tốc độ mạng. Hãy đảm bảo rằng speedtest-cli đã được cài đặt.", sentMessage.messageID);
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return actions.edit("❌ Đã xảy ra lỗi khi kiểm tra tốc độ mạng.", sentMessage.messageID);
            }

            actions.edit(`📊 Kết quả kiểm tra tốc độ mạng:\n\n${stdout}`, sentMessage.messageID);
        });
    }
};

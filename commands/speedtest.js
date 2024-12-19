const { exec } = require('child_process');

module.exports = {
  name: 'speedtest',
  dev: 'HNT',
  info: 'Kiểm tra tốc độ mạng của hệ thống Bot',
  usages: 'speedtest',
  cooldowns: 10,
  onPrefix: false,

onLaunch : async function({ api, event }) {
  const { threadID, messageID } = event;

  const sentMessage = await api.sendMessage('🔄 Đang kiểm tra tốc độ mạng, vui lòng chờ...', threadID, messageID);

  exec('speedtest-cli --simple', (error, stdout, stderr) => {
    if (error) {
      console.error(`Lỗi khi chạy lệnh speedtest-cli: ${error.message}`);
      return api.editMessage('❌ Đã xảy ra lỗi khi kiểm tra tốc độ mạng. Hãy đảm bảo rằng speedtest-cli đã được cài đặt.', threadID, sentMessage.messageID);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return api.editMessage('❌ Đã xảy ra lỗi khi kiểm tra tốc độ mạng.', threadID, sentMessage.messageID);
    }

    api.editMessage(`📊 Kết quả kiểm tra tốc độ mạng:\n\n${stdout}`, threadID, sentMessage.messageID);
  });
}
};
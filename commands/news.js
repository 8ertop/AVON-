const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  name: "news",
  dev: "Hoàng Ngọc Từ",
  info: "Báo tin tức từ VnExpress!",
  onPrefix: true,
  usages: "news",
  cooldowns: 5,
  
  onLaunch: async function({ api, event, actions }) {
    try {
      const response = await axios.get('https://vnexpress.net/tin-tuc-24h');
      const $ = cheerio.load(response.data);
      
      const thoigian = $('.time-count');
      const tieude = $('.thumb-art');
      const noidung = $('.description');
      
      const time = thoigian.find('span').attr('datetime');
      const title = tieude.find('a').attr('title');
      const des = noidung.find('a').text();
      const link = noidung.find('a').attr('href');
      const description = des.split('.');

      const message = `===  [ 𝗧𝗜𝗡 𝗧𝗨̛́𝗖 ] ===\n━━━━━━━━━━━━━\n📺 Tin tức mới nhất\n⏰ Thời gian đăng: ${time}\n📰 Tiêu đề: ${title}\n\n📌 Nội dung: ${description[0]}\n🔗 Link: ${link}\n`;

      actions.reply(message);
    } catch (error) {
      console.error(error);
      actions.reply("Đã xảy ra lỗi khi lấy tin từ VnExpress.");
    }
  }
};

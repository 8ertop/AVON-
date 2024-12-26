const axios = require('axios');

module.exports = {
    name: "stock",
    dev: "HNT", 
    info: "Cung cấp thông tin về cổ phiếu.",
    onPrefix: true, 
    usages: `[stock] [period]`, 
    cooldowns: 5, 

    onLaunch: async function ({ event, actions, target }) {
        const { threadID, messageID } = event;

        if (target.length === 0) {
            const suggestions = `📊 Hướng dẫn sử dụng lệnh Stock:
            
1️⃣ Tra cứu cơ bản: .stock [mã CP]
Ví dụ: .stock AAPL

2️⃣ Tra cứu theo thời gian: .stock [mã CP] [khoảng thời gian]
Khoảng thời gian: 1D, 1W, 1M, 3M, 1Y
Ví dụ: .stock AAPL 1M

📈 Một số mã cổ phiếu phổ biến:
• AAPL - Apple Inc.
• MSFT - Microsoft
• GOOGL - Google
• AMZN - Amazon
• TSLA - Tesla
• META - Meta/Facebook
• NVDA - NVIDIA
• NFLX - Netflix`;
            return actions.reply(suggestions);
        }

        const symbol = target[0].toUpperCase();
        const period = target[1]?.toUpperCase() || '1D';
        const apiKey = 'cql2tu9r01qn7frrckn0cql2tu9r01qn7frrckng';

        try {
            const [quoteData, profileData] = await Promise.all([
                axios.get('https://finnhub.io/api/v1/quote', {
                    params: { symbol, token: apiKey }
                }),
                axios.get('https://finnhub.io/api/v1/stock/profile2', {
                    params: { symbol, token: apiKey }
                })
            ]);

            const quote = quoteData.data;
            const profile = profileData.data;

            if (!quote || !profile) {
                return actions.reply("❌ Không tìm thấy thông tin cổ phiếu. Vui lòng kiểm tra lại mã cổ phiếu.");
            }

            const priceChange = quote.c - quote.pc;
            const changePercent = (priceChange / quote.pc * 100).toFixed(2);
            const changeEmoji = priceChange >= 0 ? '📈' : '📉';
            const marketCap = (profile.marketCapitalization / 1000).toFixed(2);

            const message = `🏢 ${profile.name} (${symbol})

💰 Thông tin giá:
${changeEmoji} Giá hiện tại: $${quote.c.toFixed(2)}
↕️ Biến động: ${priceChange >= 0 ? '+' : ''}$${priceChange.toFixed(2)} (${changePercent}%)
⭐ Cao nhất: $${quote.h.toFixed(2)}
💫 Thấp nhất: $${quote.l.toFixed(2)}
🔄 Giá mở cửa: $${quote.o.toFixed(2)}

📊 Thông tin công ty:
🏭 Ngành: ${profile.finnhubIndustry}
🌐 Website: ${profile.weburl}
💎 Vốn hóa: $${marketCap}B
🏳️ Quốc gia: ${profile.country}

⏰ Cập nhật: ${new Date().toLocaleString()}`;

            actions.reply(message);
        } catch (error) {
            console.error(error);
            actions.reply("❌ Có lỗi xảy ra khi lấy thông tin cổ phiếu. Vui lòng thử lại sau hoặc kiểm tra mã cổ phiếu.");
        }
    }
};

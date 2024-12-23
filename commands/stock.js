const axios = require('axios');

module.exports = {
    name: "stock",
    dev: "HNT", 
    info: "Cung cấp thông tin về cổ phiếu.",
    onPrefix: true, 
    usages: `[stock]`,
    cooldowns: 5, 

    onLaunch: async function ({ event, actions, target }) {
        const { threadID, messageID } = event;

        if (target.length === 0) {
            const suggestions = `
            Để tra cứu thông tin cổ phiếu, bạn cần cung cấp ký hiệu cổ phiếu. Ví dụ: .stock AAPL để xem thông tin về Apple Inc.

            Gợi ý các ký hiệu cổ phiếu phổ biến:
            - Apple Inc. AAPL
            - Microsoft Corporation MSFT
            - Google (Alphabet Inc.) GOOGL
            - Amazon.com Inc. AMZN
            - Tesla Inc. TSLA
            - Meta Platforms Inc. (Facebook) META
            - NVIDIA Corporation NVDA
            - Netflix Inc. NFLX
            - IBM Corporation IBM
            - Intel Corporation INTC

            Chú ý: Ký hiệu cổ phiếu có thể thay đổi và các công ty có thể được niêm yết với nhiều ký hiệu khác nhau trên các sàn giao dịch khác nhau.
            `;
            return actions.reply(suggestions);
        }

        const symbol = target[0].toUpperCase();
        const apiKey = 'cql2tu9r01qn7frrckn0cql2tu9r01qn7frrckng';

        try {
            const response = await axios.get('https://finnhub.io/api/v1/quote', {
                params: {
                    symbol: symbol,
                    token: apiKey
                }
            });

            const data = response.data;

            if (!data) {
                return actions.reply("Không có dữ liệu cổ phiếu cho ký hiệu này. Vui lòng kiểm tra lại ký hiệu cổ phiếu.");
            }

            const { c: currentPrice, h: highPrice, l: lowPrice, o: openPrice, pc: previousClosePrice } = data;

            const message = `Thông tin cổ phiếu ${symbol}:\n` +
                            `📈 Giá mở cửa: ${openPrice} USD\n` +
                            `📈 Giá cao nhất: ${highPrice} USD\n` +
                            `📉 Giá thấp nhất: ${lowPrice} USD\n` +
                            `💵 Giá hiện tại: ${currentPrice} USD\n` +
                            `💵 Giá đóng cửa trước đó: ${previousClosePrice} USD`;

            actions.reply(message);
        } catch (error) {
            console.error(error);
            actions.reply("Không thể lấy thông tin cổ phiếu. Vui lòng thử lại sau.");
        }
    }
};

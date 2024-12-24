const axios = require('axios');
const { createCanvas } = require('canvas');
const fs = require('fs-extra');
const { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler } = require('chart.js');

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler);

module.exports = {
    name: 'crypto',
    info: 'Xem giá tiền điện tử',
    dev: 'Hoàng Ngọc Từ',
    onPrefix: false,
    dmUser: false,
    nickName: ['crypto', 'btc', 'bitcoin'],
    usages: 'crypto\n\nHướng dẫn sử dụng:\n' +
        '1. Gõ lệnh `crypto` để xem giá các đồng tiền điện tử phổ biến và biểu đồ.\n' +
        '2. Thông tin được cập nhật theo thời gian thực.',
    cooldowns: 10,

    CRYPTO_LIST: [
        { id: 'bitcoin', symbol: 'BTC', icon: '📌' },
        { id: 'ethereum', symbol: 'ETH', icon: '💎' },
        { id: 'binancecoin', symbol: 'BNB', icon: '🌟' },
        { id: 'solana', symbol: 'SOL', icon: '☀️' },
        { id: 'cardano', symbol: 'ADA', icon: '🔷' },
        { id: 'dogecoin', symbol: 'DOGE', icon: '🐶' },
        { id: 'polkadot', symbol: 'DOT', icon: '⭕' },
        { id: 'ripple', symbol: 'XRP', icon: '💫' }
    ],

    formatCurrency: (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    },

    formatPercentage: (value) => {
        if (value === undefined || value === null) {
            return 'N/A';  
        }
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    },

    calculateMA: function(data, period) {
        const result = [];
        for (let i = 0; i < period - 1; i++) {
            result.push(null);
        }

        for (let i = period - 1; i < data.length; i++) {
            const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            result.push(sum / period);
        }
        return result;
    },

    generateChart: async function (chartData, timeRange, cryptoSymbol) {

        const title = `${cryptoSymbol.toUpperCase()} - ${timeRange} Ngày`
        const width = 1200; 
        const height = 800; 
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#000428');
        bgGradient.addColorStop(0.5, '#004e92');
        bgGradient.addColorStop(1, '#000428');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i < height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        const priceStart = chartData[0][1];
        const priceEnd = chartData[chartData.length - 1][1];
        const priceChange = ((priceEnd - priceStart) / priceStart) * 100;

        const primaryColor = priceChange >= 0 ? 
            'rgba(0, 255, 127, 1)' : 'rgba(255, 69, 0, 1)';
        const secondaryColor = priceChange >= 0 ? 
            'rgba(0, 255, 127, 0.1)' : 'rgba(255, 69, 0, 0.1)';

        const gradientLine = ctx.createLinearGradient(0, 0, 0, height);
        gradientLine.addColorStop(0, primaryColor);
        gradientLine.addColorStop(1, secondaryColor);

        const labels = chartData.map(dataPoint => {
            const date = new Date(dataPoint[0]);
            if (timeRange === '1') {
                return date.toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                });
            } else {
                return date.toLocaleDateString('vi-VN', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit'
                });
            }
        });

        const data = chartData.map(dataPoint => dataPoint[1]);

        const ma20 = this.calculateMA(data, 20);
        const ma50 = this.calculateMA(data, 50);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Giá BTC',
                        data: data,
                        borderColor: primaryColor,
                        borderWidth: 3,
                        fill: true,
                        backgroundColor: gradientLine,
                        pointRadius: 0,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: primaryColor,
                        pointBorderColor: primaryColor,
                        pointHoverBorderColor: '#fff',
                        pointBorderWidth: 2,
                        tension: 0.4,
                        order: 1
                    },
                    {
                        label: 'MA20',
                        data: ma20,
                        borderColor: 'rgba(255, 215, 0, 1)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4,
                        order: 2
                    },
                    {
                        label: 'MA50',
                        data: ma50,
                        borderColor: 'rgba(147, 112, 219, 1)',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.4,
                        order: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 0 },
                layout: {
                    padding: {
                        top: 40,
                        right: 40,
                        bottom: 30,
                        left: 40
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 14,
                                family: "'Roboto', sans-serif",
                                weight: '500'
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    title: {
                        display: true,
                        text: [
                            `${title}`,
                            `Thay đổi: ${priceChange.toFixed(2)}%`
                        ],
                        color: '#ffffff',
                        font: {
                            size: 20,
                            family: "'Roboto', sans-serif",
                            weight: '600'
                        },
                        padding: {
                            top: 20,
                            bottom: 30
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: primaryColor,
                        borderWidth: 1,
                        padding: 15,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                if (context.dataset.label === `Giá ${cryptoName}`) {
                                    return `Giá: $${context.parsed.y.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}`;
                                }
                                return `${context.dataset.label}: $${context.parsed.y.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            tickLength: 8
                        },
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 11,
                                family: "'Roboto', sans-serif"
                            },
                            maxRotation: 45,
                            minRotation: 45,
                            padding: 8
                        }
                    },
                    y: {
                        position: 'right',
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            drawTicks: false
                        },
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 12,
                                family: "'Roboto', sans-serif"
                            },
                            padding: 8,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                hover: {
                    mode: 'index',
                    intersect: false
                }
            }
        });

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.font = '12px Roboto';
        ctx.textAlign = 'right';
        ctx.fillText('Created by ' + this.dev, width - 50, height - 20);

        const buffer = canvas.toBuffer('image/png');
        const path = './commands/cache/crypto_chart.png';
        await fs.writeFile(path, buffer);
        return path;
    },

    onLaunch: async function ({ api, event, target }) {
        try {
            const cryptoName = target[0]?.toLowerCase() || 'bitcoin';
            const crypto = this.CRYPTO_LIST.find(c => c.symbol.toLowerCase() === cryptoName || c.id === cryptoName);
    
            if (!crypto) {
                await api.sendMessage(`Không tìm thấy thông tin về loại "${cryptoName}". Vui lòng thử tên có trong danh sách.`, event.threadID);
                return;
            }
    
            const pricesResponse = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
                params: {
                    ids: this.CRYPTO_LIST.map(c => c.id).join(','),
                    vs_currencies: 'usd',
                    include_24h_change: true
                }
            });
    
            const exchangeRateResponse = await axios.get('https://openexchangerates.org/api/latest.json?app_id=61633cc8176742a4b1a470d0d93df6df');
            const exchangeRateVND = exchangeRateResponse.data.rates.VND || 0;
    
            if (exchangeRateVND === 0) {
                throw new Error('Không thể lấy tỉ giá VND');
            }
    
            let message = `SÀN GIAO DỊCH - ${crypto.symbol}\n━━━━━━━━━━━━━━━━━━\n\n`;
    
            const priceUSD = pricesResponse?.data[crypto.id]?.usd || 0;
            if (priceUSD === 0) {
                throw new Error(`Không thể lấy giá cho ${crypto.symbol}`);
            }
            const priceVND = priceUSD * exchangeRateVND;
    
            message += `${crypto.icon} ${crypto.symbol}\n`;
            message += `💵 ${priceUSD.toFixed(2)} USD\n`;
            message += `💰 ${this.formatCurrency(priceVND)}\n\n`;
    
            const chartResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${crypto.id}/market_chart`, {
                params: { vs_currency: 'usd', days: '3' }
            });
    
            const chartPath = await this.generateChart(chartResponse.data.prices, '3', crypto.symbol);
    
            await api.sendMessage({
                body: message + `Biểu đồ giá ${crypto.symbol.toUpperCase()} 3 ngày qua`,
                attachment: fs.createReadStream(chartPath)
            }, event.threadID);
    
        } catch (error) {
            console.error(error);
            await api.sendMessage('Đã xảy ra lỗi khi cập nhật thông tin tiền điện tử.', event.threadID);
        }
    }
};    
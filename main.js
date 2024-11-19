//this main.js system of bot don't steal the code okay
//kaguya teams and CC PROJECTS A.K.A JONELL MAGALLANES and Chatbot Community and Also You 
//What you looking for the codes? and steal it? bruh?
const fs = require("fs");
const gradient = require("gradient-string");
 const cron = require('node-cron');
const axios = require('axios');
 const moment = require('moment-timezone');
const chalk = require("chalk");
const { exec } = require("child_process");
const { handleListenEvents } = require("./utils/listen");
//*const cron = require("node-cron");
const config = JSON.parse(fs.readFileSync("./logins/hut-chat-api/config.json", "utf8"));
//cron 3AM AND 5AM auto process.exit 1 as full restart 
cron.schedule('0 3 * * *', () => {
    console.log('Exiting the process at 3:00 AM');
    process.exit(1);
}, {
    timezone: "Asia/Ho_Chi_Minh"
});

cron.schedule('0 5 * * *', () => {
    console.log('Exiting the process at 5:00 AM');
    process.exit(1);
}, {
    timezone: "Asia/Ho_Chi_Minh"
});
const proxyList = fs.readFileSync("./utils/prox.txt", "utf-8").split("\n").filter(Boolean);
const fonts = require('./utils/fonts');
function getRandomProxy() {
    const randomIndex = Math.floor(Math.random() * proxyList.length);
    return proxyList[randomIndex];
}
proxy = getRandomProxy();
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));
const login = require(`./logins/${adminConfig.FCA}/index.js`);
const prefix = adminConfig.prefix;
const threadsDB = JSON.parse(fs.readFileSync("./database/threads.json", "utf8") || "{}");
const usersDB = JSON.parse(fs.readFileSync("./database/users.json", "utf8") || "{}");
const boldText = (text) => chalk.bold(text);
global.fonts = fonts;
global.cc = {
    admin: "admin.json",
    adminBot: adminConfig.adminUIDs,
    modBot: adminConfig.moderatorUIDs,
    prefix: adminConfig.prefix,
    developer: adminConfig.ownerName,
    botName: adminConfig.botName,
    ownerLink: adminConfig.facebookLink,
    resend: adminConfig.resend,
    proxy: proxy,
    module: {
        commands: {}
    },
    cooldowns: {},
    getCurrentPrefix: () => global.cc.prefix,
    reload: {}
};

global.cc.reloadCommand = function (commandName) {
    try {
        delete require.cache[require.resolve(`./cmds/${commandName}.js`)];
        const reloadedCommand = require(`./cmds/${commandName}.js`);
        global.cc.module.commands[commandName] = reloadedCommand;
        console.log(boldText(gradient.cristal(`[ ${commandName} ] Command reloaded successfully.`)));
        return true;
    } catch (error) {
        console.error(boldText(gradient.cristal(`❌ Failed to reload command [ ${commandName} ]: ${error.message}`)));
        return false;
    }
};

global.cc.reload = new Proxy(global.cc.reload, {
    get: function (target, commandName) {
        return global.cc.reloadCommand(commandName);
    }
});

const loadCommands = () => {
    const commands = {};
    fs.readdirSync("./cmds").sort().forEach(file => {
        if (file.endsWith(".js")) {
            try {
                const command = require(`./cmds/${file}`);
                commands[command.name] = command;
                console.log(boldText(gradient.cristal(`[ ${command.name} ] Successfully Deployed Command`)));
            } catch (error) {
                if (error.code === "MODULE_NOT_FOUND") {
                    const missingModule = error.message.split("'")[1];
                    console.log(boldText(gradient.vice(`[ ${file} ] Missing module: ${missingModule}. Installing...`)));
                    exec(`npm install ${missingModule}`, (err) => {
                        if (!err) {
                            console.log(boldText(gradient.atlas(`Module ${missingModule} installed successfully.`)));
                            const command = require(`./cmds/${file}`);
                            commands[command.name] = command;
                            console.log(boldText(gradient.cristal(`[ ${command.name} ] Successfully Deployed Command`)));
                        }
                    });
                }
            }
        }
    });
    global.cc.module.commands = commands;
    return commands;
};

const loadEventCommands = () => {
    const eventCommands = {};
    fs.readdirSync("./events").sort().forEach(file => {
        if (file.endsWith(".js")) {
            try {
                const eventCommand = require(`./events/${file}`);
                eventCommands[eventCommand.name] = eventCommand;
                console.log(boldText(gradient.pastel(`[ ${eventCommand.name} ] Successfully Deployed Event Command`)));
            } catch (error) {
                if (error.code === "MODULE_NOT_FOUND") {
                    const missingModule = error.message.split("'")[1];
                    console.log(boldText(gradient.instagram(`[ ${file} ] Missing module: ${missingModule}. Installing...`)));
                    exec(`npm install ${missingModule}`, (err) => {
                        if (!err) {
                            console.log(boldText(gradient.atlas(`Module ${missingModule} installed successfully.`)));
                            const eventCommand = require(`./events/${file}`);
                            eventCommands[eventCommand.name] = eventCommand;
                            console.log(boldText(gradient.cristal(`[ ${eventCommand.name} ] Successfully Deployed Event Command`)));
                        }
                    });
                }
            }
        }
    });
    return eventCommands;
};

const reloadModules = () => {
    console.clear();
    console.log(boldText(gradient.retro("Reloading bot...")));
    const commands = loadCommands();
    const eventCommands = loadEventCommands();
    console.log(boldText(gradient.passion("[ BOT MODULES RELOADED ]")));
};
const startBot = () => {
  console.log(boldText(gradient.retro("Logging via AppState...")));

    login({ appState: JSON.parse(fs.readFileSync(config.APPSTATE_PATH, "utf8")) }, (err, api) => {
        if (err) return console.error(boldText(gradient.passion(`Login error: ${JSON.stringify(err)}`)));
        console.log(boldText(gradient.retro("SUCCESSFULLY LOGGED IN VIA APPSTATE")));
        console.log(boldText(gradient.retro("Picked Proxy IP: " + proxy)));
        console.log(boldText(gradient.vice("━━━━━━━[ COMMANDS DEPLOYMENT ]━━━━━━━━━━━")));
        const commands = loadCommands();
        console.log(boldText(gradient.morning("━━━━━━━[ EVENTS DEPLOYMENT ]━━━━━━━━━━━")));
        const eventCommands = loadEventCommands();
        
        const adminConfig = {
            botName: 'Aki Bot',
            prefix: '.',
            botUID: '100092325757607',
            ownerName: 'Akira',
            vice: 'Akira'
        };
        
        console.log(boldText(gradient.cristal('█▄▀ █▀ █▄ █ █ █    ▄▀█ █▄▀ █ █▀▄ ▄▀█\n█▀█ █▄ █ ▀█ █ █    █▀█ █▀█ █ █▀▄ █▀█')));
        
        console.log(boldText(gradient.cristal('BOT NAME: ' + adminConfig.botName)));
        console.log(boldText(gradient.cristal('PREFIX: ' + adminConfig.prefix)));
        console.log(boldText(gradient.cristal('ADMINBOT: ' + adminConfig.botUID)));
        console.log(boldText(gradient.cristal('OWNER: ' + adminConfig.ownerName + '\n╰───────────⟡')));
        
        if (fs.existsSync('./database/threadID.json')) {
            const data = JSON.parse(fs.readFileSync('./database/threadID.json', 'utf8'));
            if (data.threadID) {
                api.sendMessage('✅ Restarted Thành Công\n━━━━━━━━━━━━━━━━━━\nBot đã Restart Xong.', data.threadID, _0x3bb26a => {
                    if (_0x3bb26a) {
                        console.error(boldText('Failed to send message:', _0x3bb26a));
                    } else {
                        console.log(boldText('Restart message sent successfully.'));
                        fs.unlinkSync('./database/threadID.json');
                        console.log(boldText('threadID.json has been deleted.'));
                    }
                });
            }
        }
        
        if (fs.existsSync('./database/prefix/threadID.json')) {
      
            const data = JSON.parse(fs.readFileSync('./database/prefix/threadID.json', 'utf8'));
        
            if (data.threadID) {
           
                api.sendMessage(
                    `✅ Bot đã thay đổi tiền tố hệ thống thành ${adminConfig.prefix}`,
                    data.threadID,
                    (error) => {
                        if (error) {
                           
                            console.log("Lỗi gửi tin nhắn:", error);
                        } else {
                          
                            fs.unlinkSync('./database/prefix/threadID.json');
                            console.log("threadID.json đã bị xóa.");
                        }
                    }
                );
            }
        }
        console.log(boldText(gradient.passion("━━━━[ READY INITIALIZING DATABASE ]━━━━━━━")));
        console.log(boldText(gradient.cristal(`╔════════════════════`)));
        console.log(boldText(gradient.cristal(`║ DATABASE SYSTEM STATS`)));
        console.log(boldText(gradient.cristal(`║ Số Nhóm: ${Object.keys(threadsDB).length}`)));
        console.log(boldText(gradient.cristal(`║ Tổng Người Dùng: ${Object.keys(usersDB).length} `)));
        console.log(boldText(gradient.cristal(`╚════════════════════`)));
        console.log(boldText(gradient.cristal("BOT Made By CC PROJECTS And Kaguya And Kenji Akira")))

        
        function printBotInfo() {
            const messages = [
                '╔════════════════════',
                '║ => DEDICATED: CHATBOT COMMUNITY AND YOU',
                '║ • ARJHIL DUCAYANAN',
                '║ • JR BUSACO',
                '║ • JONELL MAGALLANES',
                '║ • JAY MAR',
                '║ • KENJI AKIRA',
                '╚════════════════════'
            ];
        
            messages.forEach(msg => console.log(boldText(gradient.cristal(msg))));
        
            console.error(boldText(gradient.summer('[ BOT IS LISTENING ]')));
        }
        printBotInfo();
const fetchWeather = async () => {
    try {
        const apiKey = '1230a8fdc6457603234c68ead5f3f967';  
        const cities = ["Hanoi","Hochiminh"]; 
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${randomCity}&appid=${apiKey}&units=metric&lang=vi`);
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const { weather, main, wind, dt } = response.data;
        const temperature = main.temp;
        const humidity = main.humidity;
        const description = weather[0].description;
        const windSpeed = wind.speed;
        const time = new Date(dt * 1000).toLocaleString(); 
        
        return `Cập nhật thời tiết:\n\nThành Phố ${randomCity}\nMô tả: ${description}\nNhiệt độ: ${temperature}°C\nĐộ ẩm: ${humidity}%\nTốc độ gió: ${windSpeed} m/s\nThời gian cập nhật: ${time}`;
    } catch (error) {
        return 'Hình như có lỗi gì rồi , nên không lấy được thông tin =)))';
    }
};

        function sendMessages(api, message) {
            let successCount = 0;
            let failureCount = 0;

            api.getThreadList(20, null, ['INBOX'])
                .then((list) => {
                    const promises = list.map((thread) => {
                        if (thread.isGroup) {
                            return new Promise((resolve) => {
                                api.sendMessage(message, thread.threadID, (err, info) => {
                                    if (err) {
                                        failureCount++;
                                        console.error(`Failed to send message to thread ${thread.threadID}:`, err);
                                        resolve();
                                    } else {
                                        successCount++;
                                        console.log(`Message sent to thread ${thread.threadID}:`, info);
                                        resolve();
                                    }
                                });
                            });
                        }
                    });

                    Promise.all(promises).then(() => {
                        console.log(`Successfully sent: ${successCount}, Failed: ${failureCount}`);
                    });
                })
                .catch((err) => {
                    console.error('Error fetching thread list:', err);
                });
        }
        const greetings = [
            {
                cronTime: '0 5 * * *', 
                messages: ['Chào buổi sáng! Cố lên nào, một ngày mới đang chờ bạn khám phá! 🌞']
            },
            {
                cronTime: '0 7 * * *', 
                messages: ['Sáng rồi! Đừng quên kiểm tra hôm nay có việc gì quan trọng nhé! 📝']
            },
            {
                cronTime: '0 8 * * *', 
                messages: ['8 giờ rồi! Đừng để cafe nguội, hãy bắt đầu ngày mới thật năng động nhé! ☕']
            },
            {
                cronTime: '0 10 * * *', 
                messages: ['Hello! Giờ làm việc hăng say, cuối ngày thêm trọn vẹn! 🚀']
            },
            {
                cronTime: '0 12 * * *', 
                messages: ['🍜 Trưa rồi! Nhớ ăn cơm đúng giờ, ăn xong làm một giấc trưa nhẹ nhàng nha! 😴']
            },
            {
                cronTime: '0 14 * * *', 
                messages: ['Buổi chiều làm việc chăm chỉ nhé! Mà nhớ uống đủ nước nữa nha! 💧']
            },
            {
                cronTime: '0 16 * * *', 
                messages: ['Đừng quên vận động một chút! Đứng dậy duỗi chân tay nào! 🧘‍♂️']
            },
            {
                cronTime: '0 18 * * *', 
                messages: ['Chào buổi tối! Giờ này mà có một bữa cơm nóng hổi thì hết ý nhỉ? 🍲']
            },
            {
                cronTime: '0 20 * * *', 
                messages: ['Thời gian thư giãn đã tới! Hãy thưởng cho mình một bộ phim hay hoặc cuốn sách yêu thích. 📚🎬']
            },
            {
                cronTime: '0 22 * * *', 
                messages: ['Ngủ ngon nha! Mọi chuyện sẽ ổn thôi, cứ yên tâm mà mơ đẹp. 🌙✨']
            },
            {
                cronTime: '0 14 * * *', 
                messages: async () => {
                    const weather = await fetchWeather();
                    return `Chào ngày mới! Năng lượng tích cực lên nào!\n\nThời tiết hôm nay: ${weather} ☀️🌧️`;
                },
            },
            {
                cronTime: '0 19 * * *', 
                messages: async () => {
                    const weather = await fetchWeather();
                    return `Buổi tối vui vẻ nha! Thời tiết hiện tại: ${weather} 🏡`;
                },
            }
        ];
        
        greetings.forEach((greet) => {
            cron.schedule(greet.cronTime, async () => {
                if (typeof greet.messages === 'function') {
                    const message = await greet.messages();
                    sendMessages(api, message);
                } else {
                    greet.messages.forEach((message) => {
                        sendMessages(api, message);
                    });
                }
            }, {
                timezone: "Asia/Ho_Chi_Minh"
            });
        });
        

        handleListenEvents(api, commands, eventCommands, threadsDB, usersDB, adminConfig, prefix);
    });
};

startBot();
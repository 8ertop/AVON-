const os = require('os');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const disk = require('diskusage');
const execPromise = util.promisify(exec);

const threadsDB = JSON.parse(fs.readFileSync("./database/threads.json", "utf8") || "{}");
const usersDB = JSON.parse(fs.readFileSync("./database/users.json", "utf8") || "{}");

const botStartTime = Date.now();

module.exports = {
    name: "uptime",
    info: "Xem thời gian bot đã online và thông tin hệ thống.",
    dev: "HNT",
    onPrefix: false,
    dmUser: false,
    nickName: ["uptime", "upt"],
    usages: "uptime",
    cooldowns: 10,

    onLaunch: async function ({ event, actions }) {
        const { threadID, messageID } = event;

        const userCount = Object.keys(usersDB).length;
        const threadCount = Object.keys(threadsDB).length;

        const replyMessage = await actions.reply("Đang tải dữ liệu.......");
        await sleep(3000);

        let currentTime = Date.now();
        let uptime = currentTime - botStartTime;
        let seconds = Math.floor((uptime / 1000) % 60);
        let minutes = Math.floor((uptime / (1000 * 60)) % 60);
        let hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
        let days = Math.floor(uptime / (1000 * 60 * 60 * 24));

        const ping = await getPing();
        const systemInfo = await getSystemInfo();
        const nodeVersion = await getNodeVersion();
        const systemUptime = await getSystemUptime();

        let uptimeMessage = `⏱️ BOT UPTIME\n`;
        uptimeMessage += `=======================\n`;
        uptimeMessage += `🕒 Thời gian online: ${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây\n`;
        uptimeMessage += `🖥️ Thời gian hệ điều hành đã hoạt động: ${systemUptime}\n`;
        uptimeMessage += `=======================\n`;
        uptimeMessage += `👤 Người dùng: ${userCount}\n`;
        uptimeMessage += `👥 Nhóm: ${threadCount}\n`;
        uptimeMessage += `=======================\n`;
        uptimeMessage += `🖥️ Hệ điều hành: ${systemInfo.platform} (${systemInfo.arch})\n`;
        uptimeMessage += `- Phiên bản: ${systemInfo.release}\n`;
        uptimeMessage += `- Tên máy: ${systemInfo.hostname}\n`;
        uptimeMessage += `- CPU Model: ${systemInfo.cpuModel} (${systemInfo.coreCount} core(s), ${systemInfo.cpuSpeed} MHz)\n`;
        uptimeMessage += `- Tổng bộ nhớ: ${systemInfo.totalMemory} GB\n`;
        uptimeMessage += `- Bộ nhớ còn lại: ${systemInfo.freeMemory} GB\n`;
        uptimeMessage += `- Bộ nhớ đã sử dụng: ${systemInfo.usedMemory} GB\n`;
        uptimeMessage += `- Mức sử dụng CPU: ${systemInfo.cpuUsage}%\n`;
        uptimeMessage += `=======================\n`;
        uptimeMessage += `🗄️ Ổ đĩa:\n`;
        uptimeMessage += `- Tổng dung lượng: ${systemInfo.totalDisk} GB\n`;
        uptimeMessage += `- Dung lượng trống: ${systemInfo.freeDisk} GB\n`;
        uptimeMessage += `- Dung lượng đã sử dụng: ${systemInfo.usedDisk} GB\n`;
        uptimeMessage += `=======================\n`;
        uptimeMessage += `🌐 Ping: ${ping}\n`;
        uptimeMessage += `🔢 Node.js Version: ${nodeVersion}\n`;

        await actions.edit(uptimeMessage, replyMessage.messageID);
    }
};

async function getPing() {
    try {
        const isWindows = os.platform() === 'win32';
        const pingCommand = isWindows ? 'ping -n 1 google.com' : 'ping -c 1 google.com';
        const { stdout } = await execPromise(pingCommand);
        const match = stdout.match(isWindows ? /time=(\d+)ms/ : /time=(\d+\.\d+) ms/);
        return match ? `${match[1]} ms` : 'N/A';
    } catch {
        return 'N/A';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCPUUsage() {
    return new Promise((resolve) => {
        const startMeasure = getCPUTimes();
        setTimeout(() => {
            const endMeasure = getCPUTimes();
            const idleDifference = endMeasure.idle - startMeasure.idle;
            const totalDifference = endMeasure.total - startMeasure.total;
            const cpuUsage = (1 - idleDifference / totalDifference) * 100;
            resolve(cpuUsage.toFixed(2));
        }, 1000);
    });
}

function getCPUTimes() {
    const cpus = os.cpus();
    let idle = 0, total = 0;

    for (const cpu of cpus) {
        for (const type in cpu.times) {
            total += cpu.times[type];
        }
        idle += cpu.times.idle;
    }

    return { idle, total };
}

async function getDiskInfo() {
    try {
        const { available, total } = await disk.check('/');
        return {
            totalDisk: (total / (1024 ** 3)).toFixed(2),
            freeDisk: (available / (1024 ** 3)).toFixed(2),
            usedDisk: ((total - available) / (1024 ** 3)).toFixed(2)
        };
    } catch {
        return { totalDisk: 'N/A', freeDisk: 'N/A', usedDisk: 'N/A' };
    }
}

async function getSystemInfo() {
    const platform = os.platform();
    const release = os.release();
    const arch = os.arch();
    const hostname = os.hostname();
    const cpuModel = os.cpus()[0].model;
    const coreCount = os.cpus().length;
    const cpuSpeed = os.cpus()[0].speed;
    const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
    const freeMemory = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
    const usedMemory = (totalMemory - freeMemory).toFixed(2);
    const cpuUsage = await getCPUUsage();
    const diskInfo = await getDiskInfo();

    return {
        platform, release, arch, hostname, cpuModel, coreCount, cpuSpeed,
        totalMemory, freeMemory, usedMemory, cpuUsage,
        ...diskInfo 
    };
}

async function getNodeVersion() {
    try {
        const { stdout } = await execPromise('node -v');
        return stdout.trim();
    } catch {
        return 'N/A';
    }
}

async function getSystemUptime() {
    const sysUptimeDays = Math.floor(os.uptime() / (60 * 60 * 24));
    const sysUptimeHours = Math.floor((os.uptime() % (60 * 60 * 24)) / (60 * 60));
    const sysUptimeMinutes = Math.floor((os.uptime() % (60 * 60)) / 60);
    const sysUptimeSeconds = Math.floor(os.uptime() % 60);
    return `${sysUptimeDays} ngày, ${sysUptimeHours} giờ, ${sysUptimeMinutes} phút, ${sysUptimeSeconds} giây`;
}

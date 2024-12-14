    const fs = require('fs');
    const path = require('path');

    global.balance = global.balance || {};
    const dataFile = path.join(__dirname, '..', 'database', 'currencies.json');
    const quyFilePath  = path.join(__dirname, '..', 'commands', 'json', 'quy.json');

    async function loadData() {
        try {
            if (fs.existsSync(dataFile)) {
                const data = JSON.parse(await fs.promises.readFile(dataFile, 'utf8'));
                global.balance = data.balance || {};
            } else {
                global.balance = {};
            }
        } catch (error) {
            console.error("Lỗi khi đọc tệp dữ liệu:", error);
        }
    }

    async function saveData() {
        try {
            const data = { balance: global.balance };
            await fs.promises.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.error("Lỗi khi ghi tệp dữ liệu:", error);
        }
    }

    function getBalance(userID) {
        return global.balance[userID] || 0;
    }

    function updateBalance(userID, amount) {
        global.balance[userID] = (global.balance[userID] || 0) + amount;
        saveData();
    }

    function setBalance(userID, amount) {
        global.balance[userID] = amount;
        saveData();
    }
        
    function changeBalance(userID, amount) {
        if (typeof global.balance[userID] === "undefined") {
            global.balance[userID] = 0; 
        }
        global.balance[userID] += amount;
    }

    function allBalances() {
        return global.balance;
    }

    function loadQuy() {
        if (!fs.existsSync(quyFilePath)) {
            fs.writeFileSync(quyFilePath, JSON.stringify({ quy: 0 }, null, 2), 'utf8');
        }

        try {
            const data = fs.readFileSync(quyFilePath, 'utf8');
            return JSON.parse(data).quy || 0;
        } catch (error) {
            console.error('Error loading Quỹ:', error);
            return 0;
        }
    }


    function saveQuy(quy) {
        try {
            const data = { quy };
            fs.writeFileSync(quyFilePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving Quỹ:', error);
        }
    }

    loadData(); 

    module.exports = { getBalance, setBalance, saveData, loadData, updateBalance, changeBalance, allBalances, saveQuy, loadQuy};

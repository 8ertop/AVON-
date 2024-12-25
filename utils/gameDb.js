const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../database/gameDb.json');
const DAILY_AMOUNT = 50000;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

let database = {
    users: {},
    leaderboard: []
};

// Load database
try {
    if (fs.existsSync(DB_FILE)) {
        database = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
} catch (error) {
    console.error('Error loading game database:', error);
}

// Save database
function saveDb() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
    } catch (error) {
        console.error(`Error saving game database: ${error.message}`);
    }
}

// Check if a user exists
function hasUser(userId) {
    return !!database.users[userId];
}

// Initialize a new user
function initUser(userId) {
    if (!database.users[userId]) {
        console.log(`Initializing user: ${userId}`);
        database.users[userId] = {
            balance: 1000, // Default balance
            lastDaily: 0,
            achievements: [
                { name: "Người mới", description: "Chơi game lần đầu", completed: true },
                { name: "Con bạc", description: "Chơi 50 ván", completed: false },
                { name: "Đại gia", description: "Thắng 1,000,000 xu", completed: false }
            ],
            history: [],
            stats: {
                gamesPlayed: 0,
                totalWon: 0,
                totalLost: 0
            }
        };
        saveDb();
    } else {
        console.log(`User already exists: ${userId}`);
    }
}

// Claim daily reward
function claimDaily(userId) {
    if (!hasUser(userId)) initUser(userId);

    const user = database.users[userId];
    const now = Date.now();

    if (!user.lastDaily || now - user.lastDaily >= DAILY_COOLDOWN) {
        user.lastDaily = now;
        saveDb();
        return {
            success: true,
            amount: DAILY_AMOUNT
        };
    }

    const timeLeft = Math.ceil((DAILY_COOLDOWN - (now - user.lastDaily)) / 1000 / 60);
    return {
        success: false,
        timeLeft: `${Math.floor(timeLeft / 60)} giờ ${timeLeft % 60} phút`
    };
}

// Get achievements
function getAchievements(userId) {
    if (!hasUser(userId)) initUser(userId);
    return database.users[userId].achievements || [];
}

// Get leaderboard
function getLeaderboard() {
    return database.leaderboard.slice(0, 10);
}

// Update leaderboard
function updateLeaderboard(userId, name, winnings) {
    const index = database.leaderboard.findIndex(p => p.id === userId);

    if (index !== -1) {
        database.leaderboard[index].winnings = winnings;
    } else {
        database.leaderboard.push({ id: userId, name, winnings });
    }

    database.leaderboard.sort((a, b) => b.winnings - a.winnings);
    saveDb();
}

// Get user history
function getHistory(userId) {
    if (!hasUser(userId)) initUser(userId);
    return database.users[userId]?.history || [];
}

// Add a game to user history
function addHistory(userId, game) {
    if (!hasUser(userId)) initUser(userId);

    if (!game || typeof game !== 'object') {
        console.error('Invalid game data provided:', game);
        return;
    }

    const user = database.users[userId];
    user.history.push(game);
    if (user.history.length > 20) {
        user.history.shift();
    }
    saveDb();
}

// Update user stats
function updateStats(userId, stats) {
    if (!hasUser(userId)) initUser(userId);

    const user = database.users[userId];
    Object.assign(user.stats, stats);
    saveDb();
}

// Get user balance
function getBalance(userId) {
    if (!hasUser(userId)) initUser(userId);
    return database.users[userId]?.balance || 0;
}

// Update user balance
function updateBalance(userId, amount) {
    if (!hasUser(userId)) initUser(userId);

    const user = database.users[userId];
    user.balance += amount;
    saveDb();
}

module.exports = {
    hasUser,
    initUser,
    claimDaily,
    getAchievements,
    getLeaderboard,
    updateLeaderboard,
    getHistory,
    addHistory,
    updateStats,
    getBalance,
    updateBalance
};

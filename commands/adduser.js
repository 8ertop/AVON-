module.exports = {
    name: "adduser",
    credits: "HNT",
    info: "add người dùng vào nhóm theo ID FB hoặc link profile",
    onPrefix: true,
    usages: "[ID1 ID2...] hoặc [link1 link2...] hoặc mix\nVD: .adduser 123456 fb.com/user2 789012",
    cooldowns: 5,
    adminRequired: true, // new option

    onLaunch: async function({ api, event, target }) {
        const { threadID, messageID, senderID } = event;
        const botID = api.getCurrentUserID();
        const out = msg => api.sendMessage(msg, threadID, messageID);

        // Check if user is admin
        const threadInfo = await api.getThreadInfo(threadID);
        const isAdmin = threadInfo.adminIDs.some(admin => admin.id === senderID);
        if (this.adminRequired && !isAdmin) return out("⚠️ Chỉ admin mới có thể sử dụng lệnh này!");

        if (!target[0]) return out("⚠️ Vui lòng nhập ID hoặc link profile người dùng!");

        let success = 0, failed = 0;
        const results = [];

        // Process multiple targets
        for (const user of target) {
            try {
                if (!isNaN(user)) {
                    const result = await adduser(user, undefined);
                    results.push(result);
                } else {
                    const [id, name, fail] = await getUID(user, api);
                    if (!fail) {
                        const result = await adduser(id, name || "Người dùng Facebook");
                        results.push(result);
                    } else {
                        failed++;
                        results.push(`❌ Không thể xử lý: ${user}`);
                    }
                }
            } catch (e) {
                failed++;
                results.push(`❌ Lỗi xử lý ${user}: ${e.message}`);
            }
        }

        // Send summary
        const summary = `📊 Kết quả thêm người dùng:\n` +
            `✅ Thành công: ${success}\n` +
            `❌ Thất bại: ${failed}\n\n` +
            results.join('\n');
        
        return out(summary);

        async function adduser(id, name) {
            id = parseInt(id);
            if (participantIDs.includes(id)) {
                failed++;
                return `⚠️ ${name ? name : "Người dùng"} đã có trong nhóm.`;
            }
            
            try {
                await api.addUserToGroup(id, threadID);
                success++;
                return `✅ Đã thêm ${name ? name : "người dùng"} ${approvalMode ? "vào danh sách phê duyệt" : "vào nhóm"}!`;
            } catch (error) {
                failed++;
                return `❌ Không thể thêm ${name ? name : "người dùng"} vào nhóm: ${error.message}`;
            }
        }
    }
};

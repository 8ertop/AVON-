module.exports = {
    name: "study",
    info: "Tìm kiếm tài liệu học tập miễn phí, khóa học hoặc tài liệu chuyên môn.",
    dev: "HNT",
    onPrefix: true,
    usages: "study <chủ đề>",
    cooldowns: 10,

    onLaunch: async function ({ api, event, target }) {
        const { threadID, messageID } = event;

        const topic = target.join(" ").toLowerCase();
        
        if (!topic) {
            return api.sendMessage(
                "Danh sách các khóa học và hướng dẫn sử dụng lệnh:\n" +
                "1. `python` - Học lập trình Python\n" +
                "2. `javascript` - Học lập trình JavaScript\n" +
                "3. `java` - Học lập trình Java\n" +
                "4. `machine learning` - Học Machine Learning\n" +
                "5. `data science` - Học Data Science\n" +
                "6. `design` - Học thiết kế đồ họa\n" +
                "7. `english` - Học tiếng Anh\n" +
                "8. `web development` - Học phát triển web\n" +
                
                "Ví dụ: Bạn có thể gõ `study python` để nhận danh sách tài liệu học Python.",
                threadID,
                messageID
            );
        }

        const resources = {
            python: [
                "1. [Học Python miễn phí tại Codecademy](https://www.codecademy.com/learn/learn-python-3)",
                "2. [Học Python tại W3Schools](https://www.w3schools.com/python/)",
                "3. [Khóa học Python miễn phí tại Coursera](https://www.coursera.org/courses?query=python)",
                "4. [Học Python với FreeCodeCamp](https://www.freecodecamp.org/learn/scientific-computing-with-python/)",
                "5. [Học Python qua YouTube](https://www.youtube.com/results?search_query=python+tutorial)"
            ],
            javascript: [   
                "1. [Học JavaScript tại W3Schools](https://www.w3schools.com/js/)",
                "2. [JavaScript for Beginners tại freeCodeCamp](https://www.freecodecamp.org/news/javascript-for-beginners/)",
                "3. [Học JavaScript tại MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)",
                "4. [Học JavaScript qua YouTube](https://www.youtube.com/results?search_query=learn+javascript+for+beginners)",
                "5. [Khóa học JavaScript miễn phí tại Coursera](https://www.coursera.org/courses?query=javascript)"
            ],
            java: [
                "1. [Học Java tại W3Schools](https://www.w3schools.com/java/)",
                "2. [Khóa học Java miễn phí tại Coursera](https://www.coursera.org/courses?query=java)",
                "3. [Học Java tại Udemy](https://www.udemy.com/topic/java/)",
                "4. [Java Programming với FreeCodeCamp](https://www.freecodecamp.org/news/learn-java-for-beginners/)"
            ],
            "machine learning": [
                "1. [Học Machine Learning tại Coursera](https://www.coursera.org/learn/machine-learning)",
                "2. [Machine Learning miễn phí với Google](https://developers.google.com/machine-learning/crash-course)",
                "3. [Học Machine Learning tại edX](https://www.edx.org/learn/machine-learning)",
                "4. [Khóa học Machine Learning miễn phí tại Udemy](https://www.udemy.com/topic/machine-learning/)"
            ],
            "data science": [
                "1. [Học Data Science tại Coursera](https://www.coursera.org/browse/data-science)",
                "2. [Học Data Science tại freeCodeCamp](https://www.freecodecamp.org/learn/data-analysis-with-python/)",
                "3. [Data Science with Python tại edX](https://www.edx.org/learn/data-science)",
                "4. [Tài liệu học Data Science với Kaggle](https://www.kaggle.com/learn/overview)"
            ],
            design: [
                "1. [Học thiết kế đồ họa tại Udemy](https://www.udemy.com/topic/graphic-design/)",
                "2. [Khóa học thiết kế đồ họa miễn phí tại Coursera](https://www.coursera.org/courses?query=graphic%20design)",
                "3. [Tài liệu học thiết kế với Canva Design School](https://www.canva.com/learn/design-school/)",
                "4. [Học thiết kế tại Skillshare](https://www.skillshare.com/browse/graphic-design)"
            ],
            english: [
                "1. [Học tiếng Anh với BBC Learning English](https://www.bbc.co.uk/learningenglish)",
                "2. [Học tiếng Anh miễn phí tại Duolingo](https://www.duolingo.com/)",
                "3. [Học tiếng Anh qua podcast với EnglishClass101](https://www.englishclass101.com/)",
                "4. [Học tiếng Anh tại Memrise](https://www.memrise.com/)",
                "5. [Học tiếng Anh qua YouTube](https://www.youtube.com/results?search_query=learn+english)"
            ],
            "web development": [
                "1. [Học Web Development tại freeCodeCamp](https://www.freecodecamp.org/learn/)",
                "2. [Học Web Development tại MDN](https://developer.mozilla.org/en-US/docs/Learn)",
                "3. [Khóa học Web Development miễn phí tại Coursera](https://www.coursera.org/courses?query=web%20development)",
                "4. [Học Web Development tại Udemy](https://www.udemy.com/topic/web-development/)"
            ]
        };

        if (resources[topic]) {
            const response = `Tài liệu học về ${topic}:\n${resources[topic].join("\n")}`;
            return api.sendMessage(response, threadID, messageID);
        } else {
            return api.sendMessage(
                `Xin lỗi, không tìm thấy tài liệu học cho chủ đề "${topic}". Bạn có thể thử với "python", "javascript", "java", "machine learning", "data science", "design", "english", "web development",...`,
                threadID,
                messageID
            );
        }
    }
};

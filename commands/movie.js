const axios = require("axios");
const fs = require("fs-extra");
const translate = require("translate-google");

module.exports = {
  name: "movie",
  dev: "August Quinn",
  info: "Xem thông tin về phim",
  onPrefix: true,
  usages: ".movie [tên phim]\nVí dụ: .movie Avengers Endgame",
  cooldowns: 5,
  
  onLaunch: async function ({ actions, target }) {
    const apiKey = "db4f9cfb";
    const youtubeApiKey = "AIzaSyBkeljYcuoBOHfx523FH2AEENlciKnm3jM";
    const title = target.join(" ");

    if (!title) {
      return actions.reply("Vui lòng cung cấp tên phim.");
    }

    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const movieData = response.data;

      if (movieData.Response === "False") {
        return actions.reply("Không tìm thấy bộ phim hoặc đã xảy ra lỗi.");
      }

      const movieTitle = movieData.Title;
      const year = movieData.Year;
      const cast = movieData.Actors;
      const ratings = movieData.Ratings.map(rating => `${rating.Source}: ${rating.Value}`).join("\n");
      const posterUrl = movieData.Poster;

      let path = __dirname + "/cache/movie_poster.jpg";
      let hasError = false;

      try {
        let imageResponse = await axios.get(posterUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(path, Buffer.from(imageResponse.data, "binary"));
      } catch (error) {
        console.log(error);
        hasError = true;
      }

      const trailerUrl = await getMovieTrailer(movieTitle, youtubeApiKey);
      const translatedPlot = await translateToVietnamese(movieData.Plot);

      const movieInfo = `
🎬 Thông tin về bộ phim "${movieTitle}" (${year}):

🎭 Diễn viên: ${cast}
📖 Nội dung: ${translatedPlot}
📊 Đánh giá:\n${ratings}
🎥 Trailer: ${trailerUrl}
🖼️ Đường dẫn ảnh bìa: ${posterUrl}
`;

      if (!hasError) {
        actions.reply({
          body: movieInfo,
          attachment: fs.createReadStream(path)
        }, async () => {
          fs.unlinkSync(path);
          try {
            const trailerVideoBuffer = await getTrailerVideo(trailerUrl);
            actions.reply({
              body: "Trailer Video:",
              attachment: fs.createReadStream(trailerVideoBuffer.path)
            }, () => {
              fs.unlinkSync(trailerVideoBuffer.path);
            });
          } catch (error) {
            console.error(error);
            actions.reply("Không thể tải video trailer.");
          }
        });
      } else {
        actions.reply(movieInfo);
      }
    } catch (error) {
      console.error(error);
      actions.reply("Đã xảy ra lỗi khi lấy thông tin về phim.");
    }
  }
};

async function getMovieTrailer(movieTitle, apiKey) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
    `${movieTitle} official trailer`
  )}&key=${apiKey}&maxResults=1&type=video`;

  try {
    const response = await axios.get(searchUrl);
    const videoId = response.data.items[0].id.videoId;
    const trailerUrl = `https://www.youtube.com/watch?v=${videoId}`;
    return trailerUrl;
  } catch (error) {
    console.error(error);
    return "Không tìm thấy video trailer.";
  }
}

async function translateToVietnamese(text) {
  try {
    const translatedText = await translate(text, { to: "vi" });
    return translatedText;
  } catch (error) {
    console.error("Lỗi khi dịch sang tiếng Việt:", error);
    return text; 
  }
}

async function getTrailerVideo(trailerUrl) {
  const path = __dirname + "/cache/trailer_video.mp4";
  const response = await axios.get(trailerUrl, { responseType: "arraybuffer" });
  fs.writeFileSync(path, Buffer.from(response.data, "binary"));
  return { path };
}

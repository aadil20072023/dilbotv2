const { cmd } = require("../command");
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "yt2",
  alias: ["play2", "music"],
  react: "🎵",
  desc: "Download audio from YouTube",
  category: "download",
  use: ".song <query or url>",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide a song name or YouTube URL!");

    let video;

    // If URL
    if (q.match(/(youtube\.com|youtu\.be)/)) {
      const id = q.split(/[=/]/).pop();
      video = (await yts({ videoId: id }));
    } else {
      const search = await yts(q);
      if (!search.videos.length) return reply("❌ No results found!");
      video = search.videos[0];
    }

    await reply(`⏳ Downloading: *${video.title}*`);

    const filePath = path.join(__dirname, `${Date.now()}.mp3`);

    await new Promise((resolve, reject) => {
      ytdl(video.url, { filter: "audioonly", quality: "highestaudio" })
        .pipe(fs.createWriteStream(filePath))
        .on("finish", resolve)
        .on("error", reject);
    });

    await conn.sendMessage(from, {
      audio: fs.readFileSync(filePath),
      mimetype: "audio/mpeg",
      ptt: false
    }, { quoted: mek });

    fs.unlinkSync(filePath);

    await reply(`✅ *${video.title}* downloaded successfully!`);

  } catch (e) {
    console.error(e);
    reply("❌ Failed to download audio. Try again later.");
  }
});

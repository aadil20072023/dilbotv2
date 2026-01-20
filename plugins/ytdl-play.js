const { cmd } = require("../command");
const yts = require("yt-search");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "yt",
  alias: ["play", "song"],
  react: "🎵",
  desc: "Download audio using yt-dlp",
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide a song name or YouTube URL");

    let url;

    if (q.includes("youtube.com") || q.includes("youtu.be")) {
      url = q;
    } else {
      const search = await yts(q);
      if (!search.videos.length) return reply("❌ No results found");
      url = search.videos[0].url;
    }

    await reply("⏳ Downloading audio, please wait...");

    const outFile = path.join(__dirname, `${Date.now()}.mp3`);

    const command = `./yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${outFile}" "${url}"`;


    exec(command, async (err) => {
      if (err) {
        console.error(err);
        return reply("❌ Download failed");
      }

      await conn.sendMessage(from, {
        audio: fs.readFileSync(outFile),
        mimetype: "audio/mpeg"
      }, { quoted: mek });

      fs.unlinkSync(outFile);
    });

  } catch (e) {
    console.error(e);
    reply("❌ Error occurred");
  }
});

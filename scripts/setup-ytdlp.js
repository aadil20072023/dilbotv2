const { execSync } = require("child_process");
const fs = require("fs");

if (!fs.existsSync("./yt-dlp")) {
  console.log("Downloading yt-dlp...");
  execSync(
    "curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp && chmod +x yt-dlp"
  );
}

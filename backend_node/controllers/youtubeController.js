import fs from "fs";
import path from "path";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

const DOWNLOAD_DIR = "downloads";

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

export const downloadAudio = async (req, res) => {
  try {
    // const { url } = req.body;
    console.log(req.body);

const { url } = req.body || {};

    if (!url) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({
        message: "Invalid YouTube URL",
      });
    }

    const fileName = `${Date.now()}.wav`;

    const outputPath = path.join(DOWNLOAD_DIR, fileName);

    ffmpeg(ytdl(url, { quality: "highestaudio" }))
      .audioCodec("pcm_s16le")
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .save(outputPath)
      .on("end", () => {
        return res.download(outputPath, fileName, () => {
          fs.unlink(outputPath, () => {});
        });
      })
      .on("error", (err) => {
        console.log(err);
        return res.status(500).json({
          message: err.message,
        });
      });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};
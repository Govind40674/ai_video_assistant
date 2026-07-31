import os
import uuid
import yt_dlp
from pydub import AudioSegment
from yt_dlp.utils import DownloadError

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def download_youtube_audio(url: str) -> str:
    output_path = os.path.join(DOWNLOAD_DIR, f"{uuid.uuid4()}.%(ext)s")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": output_path,

        "noplaylist": True,
        "overwrites": True,
        "quiet": False,
        "no_warnings": False,

        # Pretend to be Chrome
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/137.0.0.0 Safari/537.36"
            )
        },

        # Use Android client
        "extractor_args": {
            "youtube": {
                "player_client": ["android"]
            }
        },

        # Uncomment after adding cookies.txt
        # "cookiefile": "cookies.txt",

        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "wav",
                "preferredquality": "192",
            }
        ],
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)

            filename = (
                os.path.splitext(ydl.prepare_filename(info))[0]
                + ".wav"
            )

            return filename

    except DownloadError as e:
        raise Exception(f"Unable to download YouTube video: {e}")


def convert_to_wav(input_path: str) -> str:
    output_path = os.path.splitext(input_path)[0] + "_converted.wav"

    audio = AudioSegment.from_file(input_path)
    audio = audio.set_channels(1)
    audio = audio.set_frame_rate(16000)

    audio.export(output_path, format="wav")

    return output_path


def chunk_audio(wav_path: str, chunk_minutes: int = 10):
    audio = AudioSegment.from_wav(wav_path)

    chunk_ms = chunk_minutes * 60 * 1000

    chunks = []

    for i, start in enumerate(range(0, len(audio), chunk_ms)):
        chunk = audio[start:start + chunk_ms]

        chunk_path = (
            f"{os.path.splitext(wav_path)[0]}_chunk_{i}.wav"
        )

        chunk.export(chunk_path, format="wav")

        chunks.append(chunk_path)

    return chunks


def process_input(source: str):
    if source.startswith(("http://", "https://")):
        print("Detected YouTube URL")
        wav_path = download_youtube_audio(source)
    else:
        print("Detected local file")
        wav_path = convert_to_wav(source)

    print("Chunking audio...")

    try:
        chunks = chunk_audio(wav_path)
        print(f"Created {len(chunks)} chunks.")
        return chunks

    finally:
        if os.path.exists(wav_path):
            try:
                os.remove(wav_path)
            except Exception as e:
                print(e)
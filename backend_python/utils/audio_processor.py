import os
import uuid
import yt_dlp
from pydub import AudioSegment
from yt_dlp.utils import DownloadError

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def create_cookie_file():
    """
    Creates cookies.txt from Render Environment Variable
    """

    cookies = os.getenv("YOUTUBE_COOKIES")

    print("=" * 60)
    print("Checking YouTube Cookies...")

    if cookies:
        print("YOUTUBE_COOKIES found.")
        print("Cookie Length:", len(cookies))
        print("Cookie Preview:")
        print(cookies[:100])
    else:
        print("YOUTUBE_COOKIES NOT FOUND")
        return None

    cookie_path = os.path.join(DOWNLOAD_DIR, "cookies.txt")

    with open(cookie_path, "w", encoding="utf-8") as f:
        f.write(cookies)

    print("Cookie file created:", cookie_path)
    print("Cookie file exists:", os.path.exists(cookie_path))
    print("=" * 60)

    return cookie_path


def download_youtube_audio(url: str):

    output_path = os.path.join(
        DOWNLOAD_DIR,
        f"{uuid.uuid4()}.%(ext)s"
    )

    cookie_file = create_cookie_file()

    ydl_opts = {
        "format": "bestaudio/best",

        "outtmpl": output_path,

        "cookiefile": cookie_file,

        "noplaylist": True,
        "overwrites": True,

        "quiet": False,
        "no_warnings": False,

        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/137.0.0.0 Safari/537.36"
            )
        },

        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "wav",
                "preferredquality": "192",
            }
        ],
    }

    print("=" * 60)
    print("Downloading:", url)
    print("Using Cookie File:", cookie_file)
    print(
        "Cookie Exists:",
        os.path.exists(cookie_file) if cookie_file else False
    )
    print("=" * 60)

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:

            info = ydl.extract_info(
                url,
                download=True
            )

            filename = (
                os.path.splitext(
                    ydl.prepare_filename(info)
                )[0]
                + ".wav"
            )

            print("Download Successful")
            print("Saved as:", filename)

            return filename

    except DownloadError as e:
        print("yt-dlp ERROR:")
        print(e)
        raise Exception(f"Unable to download YouTube video: {e}")

    finally:
        if cookie_file and os.path.exists(cookie_file):
            os.remove(cookie_file)
            print("Cookie file deleted")


def convert_to_wav(input_path: str):

    output_path = (
        os.path.splitext(input_path)[0]
        + "_converted.wav"
    )

    audio = AudioSegment.from_file(input_path)

    audio = audio.set_channels(1)
    audio = audio.set_frame_rate(16000)

    audio.export(
        output_path,
        format="wav"
    )

    return output_path


def chunk_audio(
    wav_path: str,
    chunk_minutes: int = 10,
):

    audio = AudioSegment.from_wav(wav_path)

    chunk_ms = chunk_minutes * 60 * 1000

    chunks = []

    for i, start in enumerate(
        range(0, len(audio), chunk_ms)
    ):

        chunk = audio[start:start + chunk_ms]

        chunk_path = (
            f"{os.path.splitext(wav_path)[0]}_chunk_{i}.wav"
        )

        chunk.export(
            chunk_path,
            format="wav"
        )

        chunks.append(chunk_path)

    return chunks


def process_input(source: str):

    if source.startswith(("http://", "https://")):
        print("Detected YouTube URL")
        wav_path = download_youtube_audio(source)
    else:
        print("Detected Local File")
        wav_path = convert_to_wav(source)

    print("Chunking Audio...")

    try:
        chunks = chunk_audio(wav_path)

        print(f"Created {len(chunks)} chunk(s).")

        return chunks

    finally:
        if os.path.exists(wav_path):
            try:
                os.remove(wav_path)
                print("Original audio deleted.")
            except Exception as e:
                print(e)
import re
from youtube_transcript_api import YouTubeTranscriptApi


def extract_video_id(url: str):
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11})"

    match = re.search(pattern, url)

    if not match:
        raise Exception("Invalid YouTube URL")

    return match.group(1)


def get_transcript(url: str):
    video_id = extract_video_id(url)

    ytt_api = YouTubeTranscriptApi()

    transcript = ytt_api.fetch(video_id)

    text = " ".join(
        chunk.text
        for chunk in transcript
    )

    return text
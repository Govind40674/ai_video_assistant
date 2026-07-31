import os
from pydub import AudioSegment

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def convert_to_wav(input_path: str):
    """
    Converts uploaded video/audio to
    16kHz mono wav.
    """

    output_path = (
        os.path.splitext(input_path)[0]
        + "_converted.wav"
    )

    print("=" * 60)
    print("Converting to WAV")
    print("Input :", input_path)
    print("Output:", output_path)
    print("=" * 60)

    audio = AudioSegment.from_file(input_path)

    audio = audio.set_channels(1)

    audio = audio.set_frame_rate(16000)

    audio.export(
        output_path,
        format="wav",
    )

    print("Conversion Complete")

    return output_path


def chunk_audio(
    wav_path: str,
    chunk_minutes: int = 10,
):
    """
    Splits wav into 10 minute chunks.
    """

    audio = AudioSegment.from_wav(wav_path)

    chunk_ms = chunk_minutes * 60 * 1000

    chunks = []

    for i, start in enumerate(
        range(0, len(audio), chunk_ms)
    ):

        chunk = audio[
            start:start + chunk_ms
        ]

        chunk_path = (
            f"{os.path.splitext(wav_path)[0]}_chunk_{i}.wav"
        )

        chunk.export(
            chunk_path,
            format="wav",
        )

        chunks.append(chunk_path)

    print(f"Created {len(chunks)} chunks")

    return chunks


def process_input(source: str):
    """
    source = uploaded local file
    """

    print("=" * 60)
    print("Processing Uploaded File")
    print(source)
    print("=" * 60)

    wav_path = convert_to_wav(source)

    try:

        chunks = chunk_audio(wav_path)

        return chunks

    finally:

        if os.path.exists(wav_path):
            try:
                os.remove(wav_path)
                print("Temporary wav deleted")
            except Exception as e:
                print(e)